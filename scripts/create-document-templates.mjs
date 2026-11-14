/**
 * scripts/create-document-templates.mjs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import fs from 'node:fs/promises';
import path from 'node:path';
import { createPresentationTemplate, createSpreadsheetTemplate, randomDocumentHue, writeWordTemplate } from '../dist/documents/index.js';
import { fileURLToPath } from 'node:url';

// COMPONENTS
import JSZip from 'jszip';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageTemplates = path.join(root, 'dist/documents/templates');
const reviewOutput = process.argv[2] === '--package' ? undefined : process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'outputs/terra-brand-templates');
await fs.mkdir(packageTemplates, { recursive: true });
if (reviewOutput) await fs.mkdir(reviewOutput, { recursive: true });
// Share a fresh hue across all formats and saturation variants in this build.
const templateHue = randomDocumentHue();

/*//////////////////////////////////////////////////
GENERATE TEMPLATES
//////////////////////////////////////////////////*/

for (const saturation of ['low', 'medium', 'high']) {
	const pptxName = 'terra-presentation-' + saturation + '.pptx';
	const potxName = 'terra-presentation-' + saturation + '.potx';
	const pptxPath = path.join(packageTemplates, pptxName);
	await createPresentationTemplate({ title: 'The Styling system', subtitle: 'A clear starting point for ideas, decisions and work in progress.', brand: { hue: templateHue, saturation } }).writeFile({
		fileName: pptxPath,
	});
	await createPowerPointTemplate(pptxPath, path.join(packageTemplates, potxName));
	if (reviewOutput) {
		await fs.copyFile(pptxPath, path.join(reviewOutput, pptxName));
		await fs.copyFile(path.join(packageTemplates, potxName), path.join(reviewOutput, potxName));
	}
}
const xlsx = path.join(packageTemplates, 'terra-spreadsheet.xlsx');
await createSpreadsheetTemplate({ title: 'Terra project plan', brand: { hue: templateHue } }).xlsx.writeFile(xlsx);
const docx = path.join(packageTemplates, 'terra-document.docx');
await writeWordTemplate(docx, { title: 'Invoice', brand: { hue: templateHue } });
const docxDemo = path.join(packageTemplates, 'terra-document-demo.docx');
await writeWordTemplate(docxDemo, { title: 'Invoice', brand: { hue: templateHue }, showcase: true });
if (reviewOutput) {
	await fs.copyFile(xlsx, path.join(reviewOutput, path.basename(xlsx)));
	await fs.copyFile(docx, path.join(reviewOutput, path.basename(docx)));
	await fs.copyFile(docxDemo, path.join(reviewOutput, path.basename(docxDemo)));
}
console.log(JSON.stringify({ packageTemplates, reviewOutput: reviewOutput ?? null, files: await fs.readdir(packageTemplates) }, null, 2));

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Converts a generated PowerPoint deck into a PowerPoint template package.
 *
 * @param sourcePath - Path to the generated `.pptx` deck.
 * @param destinationPath - Path where the `.potx` package is written.
 *
 * @return Resolves after the converted template has been written.
 *
 * @throws If the source package has no valid PowerPoint content-type entries.
 */
async function createPowerPointTemplate(sourcePath, destinationPath) {
	const zip = await JSZip.loadAsync(await fs.readFile(sourcePath));
	const contentTypes = zip.file('[Content_Types].xml');
	if (!contentTypes) throw new Error('Missing package content types in ' + path.basename(sourcePath) + '.');
	let xml = await contentTypes.async('string');
	const presentationOverride = /<Override\b(?=[^>]*\bPartName="\/ppt\/presentation\.xml")(?=[^>]*\bContentType="[^"]+")[^>]*\/>/;
	if (!presentationOverride.test(xml)) throw new Error('Missing presentation content type in ' + path.basename(sourcePath) + '.');
	xml = xml.replace(presentationOverride, '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.template.main+xml"/>');
	zip.file('[Content_Types].xml', xml);
	await fs.writeFile(destinationPath, await zip.generateAsync({ type: 'nodebuffer' }));
}
