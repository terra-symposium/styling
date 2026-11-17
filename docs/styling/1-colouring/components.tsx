/**
 * docs/styling/1-colouring/components.tsx
 * Catalog, interactive workbenches, and TypeScript reference for Styling components.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import * as React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript.js';

// COMPONENTS
import { componentTsDocs } from '../../../dist/cache/component-tsdocs.js';
import * as UI from '../../../src/components/ui/index.js';
import { componentNotes } from './demos/notes.js';
import { renderCode } from '@terra-symposium/docs';
import { Star } from '@carbon/icons-react';

// TYPES
import type { DataTableColumn } from '../../../src/components/data-table.js';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

/** Component slugs generated from the public Styling API reference. */
type CompSlug = keyof typeof componentTsDocs;

const GROUP_ORDER = ['Actions and forms', 'Content and feedback', 'Menus and overlays', 'Navigation and layout', 'Data and composition'] as const;
const COMP_GROUPS = new Map(
	GROUP_ORDER.map(
		group =>
			[
				group,
				Object.entries(componentTsDocs)
					.filter(([, docs]) => docs.group === group)
					.map(([slug, docs]) => ({ slug, title: docs.title })),
			] as const,
	),
);
const NON_DISPLAY_PROPS = new Set(['children', 'className', 'style', 'key', 'ref']);

/** A compact index; interactive examples and API details live on each component page.
 *
 * @return Searchable links grouped by component purpose.
 */
export function ComponentCatalog(): React.JSX.Element {
	const [query, setQuery] = React.useState('');
	const normQuery = query.trim().toLowerCase();
	const base = import.meta.env.BASE_URL;
	const groups = GROUP_ORDER.map(group => ({ group, matches: COMP_GROUPS.get(group)?.filter(component => component.title.toLowerCase().includes(normQuery)) ?? [] }));

	return (
		<div className='grid gap-8'>
			<div className='grid max-w-md gap-2'>
				<UI.Label htmlFor='component-search'>Search components</UI.Label>
				<UI.Input id='component-search' type='search' value={query} onChange={event => setQuery(event.target.value)} placeholder='Search by name' />
			</div>
			{groups.map(({ group, matches }) => {
				if (matches.length === 0) return null;
				return (
					<section key={group} className='grid gap-3'>
						<h2>{group}</h2>
						<ul className='grid gap-2 p-0 sm:grid-cols-2' style={{ listStyle: 'none' }}>
							{matches.map(component => (
								<li key={component.slug} className='min-w-0' style={{ listStyle: 'none' }}>
									<UI.Card size='sm' href={`${base}styling/1-colouring/2-components/${component.slug}/`} style={{ textDecoration: 'none' }}>
										<UI.CardHeader>
											<UI.CardTitle className='!my-0'>{component.title}</UI.CardTitle>
										</UI.CardHeader>
									</UI.Card>
								</li>
							))}
						</ul>
					</section>
				);
			})}
			{groups.every(({ matches }) => matches.length === 0) && <p>No components match your search.</p>}
		</div>
	);
}

const GRID_GAP_4_CLASS = 'grid gap-4';
const ROUNDED_BORDER_P_4_CLASS = 'rounded border p-4';

/** Authored previews and copyable snippets, keyed by their file slug. */
const DEMO_REGISTRY = Object.fromEntries(
	Object.entries(import.meta.glob<{ default: React.ComponentType; exampleCode: string }>('./demos/*.tsx', { eager: true })).map(([path, module]) => [
		path.slice(path.lastIndexOf('/') + 1, -4),
		{ Preview: module.default, code: module.exampleCode },
	]),
) as Record<CompSlug, { Preview: React.ComponentType; code: string }>;

/*//////////////////////////////////////////////////
DEMO RENDERING
//////////////////////////////////////////////////*/

/**
 * Renders the authored preview for a documented component.
 *
 * @param comp - Slug of the component whose preview should be shown.
 * @return The component's interactive preview.
 */
export function ComponentDemo({ component: comp }: { component: CompSlug }): React.JSX.Element {
	const Preview = DEMO_REGISTRY[comp].Preview;
	return <Preview />;
}

/**
 * Selects the interactive workbench available for a component.
 *
 * @param comp - Slug of the component to demonstrate.
 * @return A controlled workbench or the component's authored example.
 */
export function ComponentWorkbench({ component: comp }: { component: CompSlug }): React.JSX.Element {
	if (comp === 'button') return <ButtonWorkbench />;
	if (comp === 'card') return <CardWorkbench />;
	if (SIMPLE_CONTROLS[comp]) return <SimpleWorkbench component={comp} />;
	return <ExampleTabs preview={<ComponentDemo component={comp} />} code={DEMO_REGISTRY[comp].code} />;
}

/**
 * Keeps a rendered example and its copyable source in one tab set.
 *
 * @param preview - Live example shown in the rendered tab.
 * @param code - Source shown in the code tab.
 * @return Tabs for comparing the live example with its source.
 */
function ExampleTabs({ preview, code }: { preview: React.ReactNode; code: string }): React.JSX.Element {
	return (
		<UI.Tabs defaultValue='rendered'>
			<UI.TabsList aria-label='Example view'>
				<UI.TabsTrigger value='rendered'>Rendered</UI.TabsTrigger>
				<UI.TabsTrigger value='code'>Code</UI.TabsTrigger>
			</UI.TabsList>
			<UI.TabsContent value='rendered'>{preview}</UI.TabsContent>
			<UI.TabsContent value='code'>
				<CopyableCode code={code} />
			</UI.TabsContent>
		</UI.Tabs>
	);
}

/*//////////////////////////////////////////////////
WORKBENCH CONTROLS
//////////////////////////////////////////////////*/

/** Colour families exposed by the Button and Card workbenches. */
type Color = 'primary' | 'secondary' | 'gray' | 'destructive' | 'success' | 'caution';
/** Visual treatments selectable in the component workbenches. */
type Treatment = 'saturated' | 'outline' | 'ghost' | 'tonal' | 'glass' | 'underline';
const COLORS: Color[] = ['primary', 'secondary', 'gray', 'destructive', 'success', 'caution'];
const TREATMENTS: Treatment[] = ['saturated', 'outline', 'ghost', 'tonal', 'glass', 'underline'];
const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const;
/**
 * Reads finite prop choices from generated API docs when they are practical to display.
 *
 * @param comp - Component whose prop is being controlled.
 * @param prop - Prop name to inspect in the generated reference.
 * @param fallback - Authored choices used when the reference has no small finite set.
 * @return Generated choices when available, otherwise the fallback choices.
 */
function finiteChoices(comp: CompSlug, prop: string, fallback: readonly string[]): readonly string[] {
	const docs = componentTsDocs[comp];
	const member = docs.members.find(item => item.name === docs.demoExport);
	const choices = member?.props.find(item => item.name === prop)?.choices;
	return choices && choices.length > 0 && choices.length <= 20 ? choices : fallback;
}

/**
 * Renders a labelled selector for a finite workbench state.
 *
 * @param label - Text identifying the controlled state.
 * @param value - Currently selected option.
 * @param choices - Options available in the selector.
 * @param onChange - Receives a newly selected value.
 * @return A labelled component selector.
 */
function DemoSelect({ label, value, choices, onChange }: { label: string; value: string; choices: readonly string[]; onChange: (value: string) => void }): React.JSX.Element {
	const id = React.useId();
	return (
		<div className='grid gap-2'>
			<UI.Label htmlFor={id}>{label}</UI.Label>
			<UI.Select value={value} onValueChange={onChange}>
				<UI.SelectTrigger id={id} className='w-full'>
					<UI.SelectValue />
				</UI.SelectTrigger>
				<UI.SelectContent>
					{choices.map(choice => (
						<UI.SelectItem key={choice} value={choice}>
							{choice}
						</UI.SelectItem>
					))}
				</UI.SelectContent>
			</UI.Select>
		</div>
	);
}

/**
 * Renders a labelled boolean control for an interactive example.
 *
 * @param label - Text identifying the controlled state.
 * @param checked - Current boolean value.
 * @param onChange - Receives a new checked state.
 * @return A labelled checkbox.
 */
function DemoCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }): React.JSX.Element {
	const id = React.useId();
	return (
		<div className='flex items-center gap-2'>
			<UI.Checkbox id={id} checked={checked} onCheckedChange={value => onChange(value === true)} />
			<UI.Label htmlFor={id}>{label}</UI.Label>
		</div>
	);
}

/**
 * Lets readers explore Button colour, treatment, size, and interaction states.
 *
 * @return Button controls with a live preview and matching source.
 */
function ButtonWorkbench(): React.JSX.Element {
	const [color, setColor] = React.useState<Color>('primary');
	const [treatment, setTreatment] = React.useState<Treatment>('saturated');
	const [size, setSize] = React.useState<(typeof BUTTON_SIZES)[number]>('md');
	const [disabled, setDisabled] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [loadingText, setLoadingText] = React.useState('Saving…');
	const [icon, setIcon] = React.useState(false);
	const variant = `${color}-${treatment}` as React.ComponentProps<typeof UI.Button>['variant'];
	const iconOnly = size.startsWith('icon');
	const snippet = `import { Button } from '@terra-symposium/styling/ui';${icon ? "\nimport { Star } from '@carbon/icons-react';" : ''}\n\n<Button variant='${variant}' size='${size}'${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}${loading && loadingText ? ` loadingText='${loadingText}'` : ''}${iconOnly ? " aria-label='Save'" : ''}>${icon ? "<Star aria-hidden className='size-4' />" : ''}${iconOnly ? '' : 'Save'}</Button>`;
	return (
		<div className={GRID_GAP_4_CLASS}>
			<div className='grid gap-3 sm:grid-cols-3'>
				<DemoSelect label='Color' value={color} choices={COLORS} onChange={value => setColor(value as Color)} />
				<DemoSelect label='Treatment' value={treatment} choices={TREATMENTS} onChange={value => setTreatment(value as Treatment)} />
				<DemoSelect label='Size' value={size} choices={BUTTON_SIZES} onChange={value => setSize(value as (typeof BUTTON_SIZES)[number])} />
			</div>
			<div className='flex flex-wrap gap-4'>
				<DemoCheckbox label='Disabled' checked={disabled} onChange={setDisabled} />
				<DemoCheckbox label='Loading' checked={loading} onChange={setLoading} />
				<DemoCheckbox label='Icon' checked={icon} onChange={setIcon} />
			</div>
			<div className='grid max-w-sm gap-2'>
				<UI.Label htmlFor='button-demo-loading-text'>Loading text</UI.Label>
				<UI.Input id='button-demo-loading-text' value={loadingText} onChange={event => setLoadingText(event.target.value)} />
			</div>
			<ExampleTabs
				preview={
					<div className={ROUNDED_BORDER_P_4_CLASS}>
						<UI.Button variant={variant} size={size} disabled={disabled} loading={loading} loadingText={loadingText} aria-label={iconOnly ? 'Save' : undefined}>
							{icon ? <Star aria-hidden className='size-4' /> : null}
							{iconOnly ? null : 'Save'}
						</UI.Button>
					</div>
				}
				code={snippet}
			/>
			<p className='text-xs text-primary-11'>Loading sets aria-busy and disables activation. Icon-only buttons need an accessible label.</p>
		</div>
	);
}

/**
 * Lets readers compare Card variants, sizes, and navigation behaviour.
 *
 * @return Card controls with a live preview and matching source.
 */
function CardWorkbench(): React.JSX.Element {
	const [color, setColor] = React.useState<Color>('primary');
	const [treatment, setTreatment] = React.useState<Exclude<Treatment, 'underline'>>('tonal');
	const [size, setSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
	const [interactive, setInteractive] = React.useState(false);
	const variant = `${color}-${treatment}` as React.ComponentProps<typeof UI.Card>['variant'];
	const snippet = `import { Card } from '@terra-symposium/styling/ui';\n\n<Card variant='${variant}' size='${size}'${interactive ? " href='#component-example-heading'" : ''}>Project update</Card>`;
	return (
		<div className={GRID_GAP_4_CLASS}>
			<div className='grid gap-3 sm:grid-cols-3'>
				<DemoSelect label='Color' value={color} choices={COLORS} onChange={value => setColor(value as Color)} />
				<DemoSelect label='Treatment' value={treatment} choices={TREATMENTS.filter(value => value !== 'underline')} onChange={value => setTreatment(value as Exclude<Treatment, 'underline'>)} />
				<DemoSelect label='Size' value={size} choices={finiteChoices('card', 'size', ['xs', 'sm', 'md', 'lg', 'xl'])} onChange={value => setSize(value as typeof size)} />
			</div>
			<DemoCheckbox label='Interactive' checked={interactive} onChange={setInteractive} />
			<ExampleTabs
				preview={
					<div className={ROUNDED_BORDER_P_4_CLASS}>
						{interactive ? (
							<UI.Card variant={variant} size={size} href='#component-example-heading' className='p-4'>
								Project update
							</UI.Card>
						) : (
							<UI.Card variant={variant} size={size} className='p-4'>
								Project update
							</UI.Card>
						)}
					</div>
				}
				code={snippet}
			/>
		</div>
	);
}

/**
 * Renders an example snippet with the shared Docs code renderer.
 *
 * @param code - TSX snippet to display and copy.
 * @return The formatted, copyable code example.
 */
function CopyableCode({ code }: { code: string }): React.JSX.Element {
	return renderCode({
		attributes: {},
		children: <></>,
		node: { _type: 'code', _key: 'component-example', value: code, language: 'tsx' },
		path: [],
		readOnly: true,
	});
}

/** Short, safe choices for public states that benefit from side-by-side inspection. */
const SIMPLE_CONTROLS: Partial<
	Record<
		CompSlug,
		{
			prop: string;
			label: string;
			values: readonly string[];
			initial: string;
		}
	>
> = {
	alert: { prop: 'kind', label: 'Status', values: ['info', 'success', 'warning', 'error'], initial: 'info' },
	avatar: { prop: 'name', label: 'Name', values: ['Kai', 'Alex', 'Morgan'], initial: 'Kai' },
	badge: { prop: 'variant', label: 'Variant', values: ['primary-tonal', 'secondary-outline', 'success-tonal', 'destructive-saturated'], initial: 'primary-tonal' },
	empty: { prop: 'variant', label: 'Layout', values: ['panel', 'compact', 'preview', 'padded'], initial: 'panel' },
	input: { prop: 'type', label: 'Type', values: ['text', 'email', 'number'], initial: 'text' },
	textarea: { prop: 'rows', label: 'Rows', values: ['2', '4', '6'], initial: '2' },
	progress: { prop: 'value', label: 'Progress', values: ['0', '25', '50', '75', '100'], initial: '50' },
	separator: { prop: 'orientation', label: 'Orientation', values: ['horizontal', 'vertical'], initial: 'horizontal' },
	slider: { prop: 'defaultValue', label: 'Initial value', values: ['0', '25', '50', '75', '100'], initial: '50' },
	spinner: { prop: 'size', label: 'Size', values: ['small', 'medium', 'large'], initial: 'medium' },
	skeleton: { prop: 'width', label: 'Width', values: ['short', 'medium', 'long'], initial: 'medium' },
	switch: { prop: 'checked', label: 'Enabled', values: ['true', 'false'], initial: 'true' },
	checkbox: { prop: 'checked', label: 'Checked', values: ['true', 'false'], initial: 'true' },
	toggle: { prop: 'pressed', label: 'Pressed', values: ['true', 'false'], initial: 'true' },
};

/**
 * Builds a live example from one finite component prop.
 *
 * @param comp - Component with a configured simple control.
 * @return A selector, live preview, and matching source example.
 */
function SimpleWorkbench({ component: comp }: { component: CompSlug }): React.JSX.Element {
	const control = SIMPLE_CONTROLS[comp]!;
	const [value, setValue] = React.useState(control.initial);
	const importName = comp === 'alert' ? `Alert${value[0]!.toUpperCase() + value.slice(1)}` : componentTsDocs[comp].demoExport;
	let preview: React.ReactNode;
	let code: string;
	switch (comp) {
		case 'alert': {
			const Alert = { info: UI.AlertInfo, success: UI.AlertSuccess, warning: UI.AlertWarning, error: UI.AlertError }[value] ?? UI.AlertInfo;
			preview = <Alert title={`${value} notice`}>This is a {value} message.</Alert>;
			code = `<Alert${value[0]!.toUpperCase() + value.slice(1)} title='${value} notice'>This is a ${value} message.</Alert${value[0]!.toUpperCase() + value.slice(1)}>`;
			break;
		}
		case 'avatar':
			preview = <UI.UserAvatar user={{ id: value.toLowerCase(), name: value }} />;
			code = `<UserAvatar user={{ id: '${value.toLowerCase()}', name: '${value}' }} />`;
			break;
		case 'badge':
			preview = <UI.Badge variant={value as React.ComponentProps<typeof UI.Badge>['variant']}>Status</UI.Badge>;
			code = `<Badge variant='${value}'>Status</Badge>`;
			break;
		case 'empty':
			preview = <UI.Empty title='No items yet' description='Create one to get started.' variant={value as React.ComponentProps<typeof UI.Empty>['variant']} />;
			code = `<Empty title='No items yet' description='Create one to get started.' variant='${value}' />`;
			break;
		case 'input':
			preview = <UI.Input type={value} placeholder='Enter a value' aria-label='Example value' />;
			code = `<Input type='${value}' placeholder='Enter a value' aria-label='Example value' />`;
			break;
		case 'textarea':
			preview = <UI.Textarea rows={Number(value)} placeholder='Write a note' />;
			code = `<Textarea rows={${value}} placeholder='Write a note' />`;
			break;
		case 'progress':
			preview = <UI.Progress value={Number(value)} aria-label='Progress' />;
			code = `<Progress value={${value}} aria-label='Progress' />`;
			break;
		case 'separator':
			preview = (
				<div className='flex h-16 gap-3'>
					<span>Before</span>
					<UI.Separator orientation={value as 'horizontal' | 'vertical'} />
					<span>After</span>
				</div>
			);
			code = `<Separator orientation='${value}' />`;
			break;
		case 'slider':
			preview = <UI.Slider key={value} defaultValue={[Number(value)]} max={100} aria-label='Volume' className='w-48' />;
			code = `<Slider defaultValue={[${value}]} max={100} aria-label='Volume' />`;
			break;
		case 'spinner':
			preview = <UI.Spinner className={{ small: 'size-3', medium: 'size-5', large: 'size-8' }[value]} aria-label='Loading' />;
			code = `<Spinner className='${{ small: 'size-3', medium: 'size-5', large: 'size-8' }[value]}' aria-label='Loading' />`;
			break;
		case 'skeleton':
			preview = <UI.Skeleton className={`h-4 ${{ short: 'w-16', medium: 'w-32', long: 'w-64' }[value]}`} />;
			code = `<Skeleton className='h-4 ${{ short: 'w-16', medium: 'w-32', long: 'w-64' }[value]}' />`;
			break;
		case 'switch':
			preview = <UI.Switch key={value} defaultChecked={value === 'true'} aria-label='Enable notifications' />;
			code = `<Switch defaultChecked={${value}} aria-label='Enable notifications' />`;
			break;
		case 'checkbox':
			preview = <UI.Checkbox key={value} defaultChecked={value === 'true'} aria-label='Enable notifications' />;
			code = `<Checkbox defaultChecked={${value}} aria-label='Enable notifications' />`;
			break;
		case 'toggle':
			preview = (
				<UI.Toggle key={value} defaultPressed={value === 'true'} aria-label='Bold'>
					Bold
				</UI.Toggle>
			);
			code = `<Toggle defaultPressed={${value}} aria-label='Bold'>Bold</Toggle>`;
			break;
		default:
			throw new Error(`Missing simple demo for ${comp}`);
	}
	return (
		<div className={GRID_GAP_4_CLASS}>
			<DemoSelect label={control.label} value={value} choices={finiteChoices(comp, control.prop, control.values)} onChange={setValue} />
			<ExampleTabs preview={<div className={ROUNDED_BORDER_P_4_CLASS}>{preview}</div>} code={`import { ${importName} } from '@terra-symposium/styling/ui';\n\n${code}`} />
		</div>
	);
}

/**
 * Builds columns for the generated TypeScript API table.
 *
 * @return Column definitions for API member names and signatures.
 */
function createApiCols(): DataTableColumn<(typeof componentTsDocs)[CompSlug]['members'][number]>[] {
	return [
		{
			key: 'name',
			label: 'API member',
			width: 'wide-wrapped',
			render: member => (
				<div className='grid gap-1'>
					<strong>{member.name}</strong>
					{member.summary ? <span>{member.summary}</span> : null}
					{member.tags.length > 0 ? <span className='text-sm text-primary-11'>{member.tags.map(tag => `@${tag.name} ${tag.text}`).join(' · ')}</span> : null}
				</div>
			),
		},
		{
			key: 'signature',
			label: 'TypeScript signature',
			width: 'wider-wrapped',
			render: member => (
				<pre className='max-w-xl overflow-x-auto whitespace-pre-wrap break-words text-xs [&_.keyword]:text-blue-400 [&_.number]:text-amber-400 [&_.operator]:text-primary-10 [&_.punctuation]:text-primary-9 [&_.string]:text-green-400'>
					<code className='language-typescript' dangerouslySetInnerHTML={{ __html: Prism.highlight(member.signature, Prism.languages.typescript, 'typescript') }} />
				</pre>
			),
		},
	];
}

/**
 * Renders the source metadata, live example, and generated TypeScript API table.
 *
 * @param comp - Component slug whose source, example, and generated API are displayed.
 *
 * @return The full component reference content for the selected component.
 */
export function ComponentReference({ component: comp }: { component: CompSlug }): React.JSX.Element {
	const docs = componentTsDocs[comp];
	const memberProps = docs.members
		.map(member => ({ name: member.name, props: member.props.filter(prop => !prop.name.startsWith('on') && !NON_DISPLAY_PROPS.has(prop.name)) }))
		.filter(member => member.props.length > 0);
	return (
		<div className='docs-block-flow'>
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
			<section className='docs-block-flow' aria-labelledby='component-usage-heading'>
				<h2 id='component-usage-heading'>Usage</h2>
				<p>{componentNotes[comp]}</p>
				<h3 id='component-example-heading'>Rendered Example</h3>
				<aside className='docs-block my-0 flow-root' data-docs-aside='example'>
					<h4 className='title'>Interactive example</h4>
					<ComponentWorkbench component={comp} />
				</aside>
				<h3 id='component-api-heading'>TypeScript API</h3>
				<div className='overflow-x-auto'>
					<UI.DataTable rows={docs.members} columns={createApiCols()} rowKey='name' />
				</div>
			</section>
			{memberProps.length > 0 && (
				<section className='docs-block-flow' aria-labelledby='component-props-heading'>
					<h2 id='component-props-heading'>Props</h2>
					<UI.Accordion type='single' collapsible>
						{memberProps.map(m => (
							<UI.AccordionItem key={m.name} value={m.name}>
								<UI.AccordionTrigger variant='xs' className='py-0! my-0!'>
									{m.name}
								</UI.AccordionTrigger>
								<UI.AccordionContent>
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
											{m.props.map(prop => (
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
								</UI.AccordionContent>
							</UI.AccordionItem>
						))}
					</UI.Accordion>
				</section>
			)}
		</div>
	);
}
