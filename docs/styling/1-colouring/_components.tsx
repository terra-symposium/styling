/**
 * docs/styling/1-colouring/_components.tsx
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { componentTsDocs } from '../../../dist/cache/component-tsdocs.js';

// COMPONENTS
import * as React from 'react';

// DATA
import * as UI from '../../../src/components/ui/index.js';
import { ComponentWorkbench } from './_component-demos.js';
import { componentNotes } from './demos/notes.js';

// TYPES
import type { DataTableColumn } from '../../../src/components/data-table.js';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/
const GRID_GAP_3_CLASS = 'grid gap-3';

/** Component names are generated from the public Styling TypeScript exports. */
type CompSlug = keyof typeof componentTsDocs;
/** Keep the rendered section order stable even when the generated API cache changes. */

// terra-quality-ignore single-use -- Keep createApiCols as a named declaration so its authored TSDoc stays attached. TSDoc: Builds the generated API columns for a component reference page.
/**
 * Builds the generated API columns for a component reference page.
 *
 * @return Name, signature, description, and tags for the selected component API.
 */
function createApiCols(): DataTableColumn<(typeof componentTsDocs)[CompSlug]['members'][number]>[] {
	/** Describes one generated API member in the component-reference table. */
	type ApiMember = (typeof componentTsDocs)[CompSlug]['members'][number];
	// terra-quality-ignore single-use -- Keep renderMemberName as a named declaration so its authored TSDoc stays attached. TSDoc: Renders an API member's name, summary, and documented TSDoc tags.
	/**
	 * Renders an API member's name, summary, and documented TSDoc tags.
	 *
	 * @param member - Generated API metadata for one public component member.
	 * @return A content block containing the member name and available documentation.
	 */
	function renderMemberName(member: ApiMember): React.JSX.Element {
		const tags: string[] = [];
		for (const tag of member.tags) tags.push(`@${tag.name} ${tag.text}`);
		return (
			<div className='grid gap-1'>
				<strong>{member.name}</strong>
				{member.summary ? <span>{member.summary}</span> : null}
				{tags.length > 0 ? <span className={'text-sm text-primary-11'}>{tags.join(' · ')}</span> : null}
			</div>
		);
	}
	// terra-quality-ignore single-use -- Keep renderMemberSignature as a named declaration so its authored TSDoc stays attached. TSDoc: Renders an API member's TypeScript declaration as formatted code.
	/**
	 * Renders an API member's TypeScript declaration as formatted code.
	 *
	 * @param member - Generated API metadata containing the member signature.
	 * @return A code element displaying the TypeScript signature.
	 */
	function renderMemberSignature(member: ApiMember): React.JSX.Element {
		return (
			<details>
				<summary>View signature</summary>
				<code className='block max-w-xl whitespace-pre-wrap break-all text-xs'>{member.signature}</code>
			</details>
		);
	}
	return [
		{
			key: 'name',
			label: 'API member',
			width: 'wide-wrapped',
			render: renderMemberName,
		},
		{
			key: 'signature',
			label: 'TypeScript signature',
			width: 'wider-wrapped',
			render: renderMemberSignature,
		},
	];
}

/**
 * Renders the source metadata, live example, and generated TypeScript API table.
 *
 * @param component - Component slug whose source, example, and generated API are displayed.
 *
 * @return The full component reference content for the selected component.
 */
export function ComponentReference({ component: comp }: { component: CompSlug }): React.JSX.Element {
	const docs = componentTsDocs[comp];
	const entry = docs.members.find(member => member.name === docs.demoExport);
	const props = entry?.props.filter(prop => !prop.name.startsWith('on') && !['children', 'className', 'style', 'key', 'ref'].includes(prop.name)) ?? [];
	return (
		<div className='grid gap-6'>
			<p>{docs.description}</p>
			<p>
				Source:{' '}
				<a href={`https://github.com/Terra-Symposium/styling/blob/development/${docs.source}`}>
					<code>{docs.source}</code>
				</a>{' '}
				{'shadcnUrl' in docs && docs.shadcnUrl && (
					<a href={docs.shadcnUrl} target='_blank' rel='noreferrer'>
						shadcn/ui reference
					</a>
				)}
			</p>
			<section className={GRID_GAP_3_CLASS} aria-labelledby='component-example-heading'>
				<h2 id='component-example-heading'>Example</h2>
				<UI.Card variant='gray-outline' size='sm'>
					<UI.CardContent className='grid gap-4'>
						<ComponentWorkbench component={comp} />
					</UI.CardContent>
				</UI.Card>
			</section>
			<section className='grid gap-2' aria-labelledby='component-notes-heading'>
				<h2 id='component-notes-heading'>Usage and accessibility</h2>
				<p>{componentNotes[comp]}</p>
			</section>
			{props.length > 0 && (
				<section className={GRID_GAP_3_CLASS} aria-labelledby='component-props-heading'>
					<h2 id='component-props-heading'>Props</h2>
					<div className='overflow-x-auto'>
						<UI.Table className='min-w-[680px] text-sm'>
							<UI.TableHeader>
								<UI.TableRow>
									<UI.TableHead>Prop</UI.TableHead>
									<UI.TableHead>Type</UI.TableHead>
									<UI.TableHead>Default</UI.TableHead>
									<UI.TableHead>Description</UI.TableHead>
								</UI.TableRow>
							</UI.TableHeader>
							<UI.TableBody>
								{props.map(prop => (
									<UI.TableRow key={prop.name}>
										<UI.TableCell>
											<code>{prop.name}</code>
											{prop.optional ? '?' : ''}
										</UI.TableCell>
										<UI.TableCell>
											<code className='break-all'>{prop.type}</code>
											{prop.choices.length > 0 && <small className='block'>Choices: {prop.choices.join(', ')}</small>}
										</UI.TableCell>
										<UI.TableCell>
											<code>{'defaultValue' in prop ? String(prop.defaultValue) : 'Not declared'}</code>
										</UI.TableCell>
										<UI.TableCell>{prop.description || 'None'}</UI.TableCell>
									</UI.TableRow>
								))}
							</UI.TableBody>
						</UI.Table>
					</div>
				</section>
			)}
			<section className={GRID_GAP_3_CLASS} aria-labelledby='component-api-heading'>
				<h2 id='component-api-heading'>TypeScript API</h2>
				<UI.DataTable title={`${docs.title} API`} description='Generated from the exported TypeScript API' rows={docs.members} columns={createApiCols()} rowKey='name' />
			</section>
		</div>
	);
}
