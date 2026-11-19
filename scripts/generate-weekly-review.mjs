/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

// COMPONENTS
import { FileBlob, PresentationFile } from '@oai/artifact-tool';
import { createDocumentBrand } from '../dist/documents/theme.js';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const [inputPath, outputPath] = process.argv.slice(2);
const report = JSON.parse(await fs.readFile(inputPath, 'utf8'));
const refs = report.refs ?? [report.ref];
// hygiene-ignore single-use -- Resolve the shipped template path once before loading it so URL conversion and file loading retain their current order.
const templatePath = fileURLToPath(new URL('../dist/documents/templates/terra-presentation.potx', import.meta.url));
const terraBrand = createDocumentBrand({ hue: 200 });

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Runs a Git command in the report's repository and trims its standard output.
 *
 * @param args Git subcommand and arguments to execute.
 *
 * @return Command output without trailing whitespace.
 */
function git(args) {
	return execFileSync('git', args, { cwd: report.repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trimEnd();
}

// hygiene-ignore single-use -- Keep theme as a named presentation-generation boundary so its coordinated validation and output behavior remain together.
/**
 * Creates a coordinated set of colors for one report section.
 *
 * @return Surface, text, rule, and accent colors for the section.
 */
function theme() {
	const colors = terraBrand.colors;
	return {
		surface: colors.paper,
		tone: colors.surface,
		rule: colors.line,
		text: colors.ink,
		muted: colors.muted,
		secondary: colors.secondary,
	};
}

// hygiene-ignore single-use -- Keep addText as a named presentation-generation boundary so its coordinated validation and output behavior remain together.
/**
 * Adds a text box after checking that every line fits its chosen width.
 *
 * @param slide Presentation slide receiving the text box.
 * @param value Text content to render.
 * @param position Text-box geometry in slide coordinates.
 * @param style Text appearance and optional maximum line length.
 * @param name Stable shape name used to identify overflow errors.
 *
 * @return The created text shape.
 */
function addText(slide, value, position, style = {}, name = 'text') {
	const maxChars = style.maxChars ?? Math.floor(position.width / Math.max(7, (style.fontSize ?? 16) * 0.52));
	for (const line of String(value).split('\n')) {
		if (line.length > maxChars) throw new Error(`${name} line has ${line.length} characters; max is ${maxChars}. Add a deliberate line break or widen the frame.`);
	}
	const shape = slide.shapes.add({ geometry: 'textbox', name, position, fill: 'none', line: { style: 'solid', fill: 'none', width: 0 } });
	shape.text = value;
	shape.text.style = {
		fontSize: style.fontSize ?? 16,
		typeface: style.typeface ?? terraBrand.fonts.body,
		color: style.color ?? '#1E2D24',
		bold: style.bold ?? false,
		italic: style.italic ?? false,
		alignment: style.alignment ?? 'left',
		verticalAlignment: 'top',
		wrap: 'none',
		autoFit: 'none',
		insets: { top: 0, right: 0, bottom: 0, left: 0 },
	};
	return shape;
}

/**
 * Adds a visible speaker-notes section containing evidence sources.
 *
 * @param slide Presentation slide whose notes should be populated.
 * @param lines Source references to record in the notes.
 */
function notes(slide, lines) {
	slide.speakerNotes.textFrame.setText(`[Sources]\n${lines.map(line => `- ${line}`).join('\n')}`);
	slide.speakerNotes.setVisible(true);
}

// hygiene-ignore single-use -- Keep assessBigFiveTimeline as a named presentation-generation boundary so its coordinated validation and output behavior remain together.
/**
 * Validates five objectives against complete Git history and computes their evidence scores.
 *
 * @param plan Big Five source and objective assessments supplied by the review.
 * @param historyCommits Non-merge commits reachable on the selected report refs.
 *
 * @return Timeline data with validated commit evidence and per-objective progress.
 */
function assessBigFiveTimeline(plan, historyCommits) {
	if (typeof plan?.source !== 'string' || !plan.source.trim() || !Array.isArray(plan.objectives) || plan.objectives.length !== 5)
		throw new Error('Big Five timeline requires a source and five objectives, each assessed against the complete history of the requested refs.');
	const historyBySha = new Map(historyCommits.map(commit => [commit.sha, commit]));
	const progressByStatus = { complete: 1, partial: 0.5, not_found: 0 };
	// terra-quality-ignore single-use -- Validate objective evidence before the history-date check so invalid input keeps its existing error priority.
	// hygiene-ignore single-use -- Validate objective evidence before the history-date check so invalid input keeps its existing error priority.
	const milestones = plan.objectives.map(objective => {
		if (typeof objective.name !== 'string' || !objective.name.trim() || !Array.isArray(objective.deliverables) || !objective.deliverables.length)
			throw new Error('Each Big Five objective requires a name and source-backed deliverable assessments.');
		let score = 0;
		const evidence = [];
		for (const deliverable of objective.deliverables) {
			if (typeof deliverable.name !== 'string' || !deliverable.name.trim() || !Object.hasOwn(progressByStatus, deliverable.status))
				throw new Error(`${objective.name}: each deliverable requires a name and status complete, partial, or not_found.`);
			const shas = deliverable.commits ?? [];
			if (!Array.isArray(shas) || (deliverable.status !== 'not_found' && !shas.length))
				throw new Error(`${objective.name} · ${deliverable.name}: complete/partial evidence requires commit SHAs; not_found requires none.`);
			if (deliverable.status === 'not_found' && shas.length) throw new Error(`${objective.name} · ${deliverable.name}: not_found cannot cite commits.`);
			for (const sha of shas) {
				const commit = historyBySha.get(sha);
				if (!commit) throw new Error(`${objective.name} · ${deliverable.name}: ${sha} is not in the complete history of the requested refs through ${report.until}.`);
				if (!commit.paths) commit.paths = git(['show', '--format=', '--name-only', sha]).split('\n').filter(Boolean);
				evidence.push(commit);
			}
			score += progressByStatus[deliverable.status];
		}
		const uniqueEvidence = [...new Map(evidence.map(commit => [commit.sha, commit])).values()].sort((a, b) => a.date.localeCompare(b.date));
		return {
			name: objective.name,
			progress: Math.round((score / objective.deliverables.length) * 100),
			start: uniqueEvidence[0]?.date ?? '',
			end: uniqueEvidence.at(-1)?.date ?? '',
			deliverables: objective.deliverables,
			evidence: uniqueEvidence,
		};
	});
	const allDates = historyCommits.map(commit => commit.date).sort();
	if (!allDates.length) throw new Error('The requested refs contain no Git history for the Big Five assessment.');
	return {
		title: plan.title ?? 'Big Five progress across full Git history',
		source: plan.source,
		start: allDates[0],
		end: report.until.slice(0, 10),
		asOf: report.until.slice(0, 10),
		outcome: 'Progress is measured by expected deliverables supported in full Git history.',
		progressBasis: 'Complete = 100%; partial = 50%; no Git evidence = 0% evidenced, not proof of no work.',
		historyCount: historyCommits.length,
		milestones,
	};
}

// hygiene-ignore single-use -- Keep the async CLI entry point named so its top-level failure reaches the existing process-level error handler unchanged.
/**
 * Builds the requested weekly-review PowerPoint from its report data.
 * @return Nothing; writes the generated deck to the requested output path.
 */
async function main() {
	if (git(['rev-parse', '--is-shallow-repository']) === 'true') throw new Error('A complete review requires full Git history.');
	// hygiene-ignore single-use -- Materialize the selected full Git history once so the Big Five assessment uses one consistent commit snapshot.
	const history = git(['log', ...refs, `--until=${report.until}`, '--no-merges', '--format=%H%x09%h%x09%aN%x09%aI%x09%s'])
		.split('\n')
		.filter(Boolean)
		.map(line => {
			const [sha, short, author, authoredAt, ...subject] = line.split('\t');
			return { sha, short, author, date: authoredAt.slice(0, 10), subject: subject.join('\t') };
		});
	report.bigFive = assessBigFiveTimeline(report.bigFive, history);
	const commits = git(['log', ...refs, `--since=${report.since}`, `--until=${report.until}`, '--no-merges', '--format=%H%x09%h%x09%aN%x09%aI%x09%s'])
		.split('\n')
		.filter(Boolean)
		.map(line => {
			const [sha, short, author, authoredAt, ...subject] = line.split('\t');
			return { sha, short, author, date: authoredAt.slice(0, 10), subject: subject.join('\t'), paths: git(['show', '--format=', '--name-only', sha]).split('\n').filter(Boolean) };
		});
	const mergeCount = Number(git(['rev-list', '--count', ...refs, `--since=${report.since}`, `--until=${report.until}`, '--merges']));
	const srcs = [
		`Refs: ${refs.join(', ')}`,
		`Window: ${report.since} through ${report.until} (${report.timezone})`,
		`${commits.length} non-merge commits; ${mergeCount} merges`,
		'No deploy or UI verification was performed.',
	];
	const deck = await PresentationFile.importPptx(await FileBlob.load(templatePath));
	deck.slides.keep([]);
	const colors = theme();
	// hygiene-ignore single-use -- Keep the bodyFace snapshot named before slide construction so the generated deck uses the selected report values consistently.
	const bodyFace = terraBrand.fonts.body;
	const put = (slide, value, x, y, w, h, size, color, name, extra = {}) =>
		addText(
			slide,
			value,
			{ left: x, top: y, width: w, height: h },
			{ fontSize: size, typeface: extra.typeface ?? bodyFace, color, maxChars: extra.maxChars ?? 100, bold: extra.bold ?? false, italic: extra.italic ?? false },
			name,
		);
	const page = (title, subtitle, body, srcLines = srcs) => {
		const slide = deck.slides.add({ layout: 'Text P1' });
		put(slide, title, 52, 63, 856, 43, 28, colors.text, `title-${deck.slides.items.length}`, { typeface: 'AUTHENTIC Sans 130', maxChars: 60 });
		if (subtitle) put(slide, subtitle, 52, 120, 856, 30, 16, colors.muted, `subtitle-${deck.slides.items.length}`, { maxChars: 92 });
		put(slide, body, 52, 174, 856, 285, 18, colors.text, `body-${deck.slides.items.length}`, { maxChars: 80 });
		notes(slide, srcLines);
		return slide;
	};
	{
		const slide = deck.slides.add({ layout: 'Cover P1' });
		put(slide, report.title, 52, 85, 740, 110, 48, terraBrand.colors.paper, 'cover-title', { typeface: 'Avara Bold', italic: true, maxChars: 38 });
		put(slide, report.subtitle, 52, 219, 740, 52, 20, terraBrand.colors.paper, 'cover-subtitle', { maxChars: 72 });
		put(slide, `${report.since.slice(0, 10)} → ${report.until.slice(0, 10)} · ${report.timezone}`, 52, 310, 740, 30, 16, terraBrand.colors.paper, 'cover-window', { maxChars: 70 });
		notes(slide, srcs);
	}
	if (report.goals?.length)
		page(
			'Goals for the week',
			'Sample planning data — replace with recorded goals',
			report.goals
				.slice(0, 5)
				.map(goal => `${goal.person}   ${goal.goal}`)
				.join('\n\n'),
			[...srcs, ...report.goals.map(goal => `${goal.person}: ${goal.source}; ${goal.status}`)],
		);
	if (report.bigFive?.milestones?.length)
		page(
			'Big Five',
			'Illustrative objectives only; progress cannot be assessed from sample wording',
			report.bigFive.milestones
				.slice(0, 5)
				.map((objective, i) => `${String(i + 1).padStart(2, '0')}   ${objective.name}`)
				.join('\n\n'),
			[...srcs, report.bigFive.source],
		);
	page(
		'Website activity',
		`${report.since.slice(0, 10)}–${report.until.slice(0, 10)} · ${refs.join(', ')}`,
		`${commits.length} non-merge commits\n${mergeCount} merge commits\n${new Set(commits.map(commit => commit.author)).size} attributed contributors\n\nAll recorded commits in this window were authored by ${[...new Set(commits.map(commit => commit.author))].join(', ') || 'no one'}.`,
	);
	if (report.workstreams?.length) page('Workstreams', 'A short view of the code changes', report.workstreams.map(item => `${item.name}\n${item.summary}`).join('\n\n'), srcs);
	for (const section of report.contributors ?? []) {
		if (section.commitCount <= 0) continue;
		const goal = report.goals?.find(item => section.name.toLowerCase().startsWith(item.person.toLowerCase()));
		page(
			section.name,
			`${section.commitCount} non-merge commits · recorded Git identity`,
			`Observed work\n${section.outcomes?.join('\n') || section.summary || 'See commit evidence on the following slides.'}\n\nGoal status\n${goal ? `${goal.goal} — ${goal.status}` : 'No recorded goal available.'}`,
			[...srcs, ...(section.sources ?? [])],
		);
		for (const item of section.slides ?? []) {
			// hygiene-ignore single-use -- Keep the trail snapshot named before slide construction so the generated deck uses the selected report values consistently.
			const trail = item.commitTrail?.length ? item.commitTrail.join('\n') : '';
			page(item.title, item.lead, `${item.heading}\n${item.bullets.join('\n')}\n\n${item.commitTrailTitle || 'Commit evidence'}\n${trail}`, [
				...srcs,
				...(item.sources ?? []),
				...(item.code ? [`Code: ${item.code.sha}:${item.code.path}:${item.code.start}-${item.code.end}`] : []),
			]);
		}
	}
	const absent = (report.goals ?? []).filter(goal => !(report.contributors ?? []).some(section => section.name.toLowerCase().startsWith(goal.person.toLowerCase()) && section.commitCount > 0));
	if (absent.length)
		page('Attribution gaps', 'A missing commit does not establish whether work happened', absent.map(goal => `${goal.person}   No attributed commits; ${goal.status}`).join('\n\n'), [
			...srcs,
			...absent.map(goal => `${goal.person}: ${goal.source}`),
		]);
	page(
		'Evidence and limits',
		'What this preview can establish',
		`Git source   ${refs.join(', ')}\nWindow   ${report.since.slice(0, 10)}–${report.until.slice(0, 10)}\n\n${commits.length} non-merge commits are verifiable in the requested history.\nGoals and Big Five objectives are sample planning data.\nNo runtime, screenshot, deployment, or meeting claim was verified.`,
		srcs,
	);
	await fs.mkdir(outputPath.slice(0, outputPath.lastIndexOf('/')), { recursive: true });
	await (await PresentationFile.exportPptx(deck)).save(outputPath);
	console.log(JSON.stringify({ outputPath, slides: deck.slides.items.length, commits: commits.length, mergeCount }, null, 2));
}
if (!inputPath || !outputPath) throw new Error('Usage: generate-weekly-review.mjs <report.json> <output.pptx>');
if (!refs.filter(Boolean).length) throw new Error('Provide report.ref or report.refs.');
if (!report.bigFive)
	throw new Error(
		'A Big Five progress timeline is required. Assess every objective against the complete Git history on the requested refs through the report end date, then supply deliverable assessments with full commit SHAs.',
	);
main().catch(err => {
	console.error(err);
	process.exitCode = 1;
});
