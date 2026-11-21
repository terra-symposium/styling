/**
 * docs/styling/1-colouring/components.tsx
 * Catalog, interactive workbenches, and TypeScript reference for Styling components.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import * as React from 'react';

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
const S_REGEX = /\/\s*$/;

const GRID_GAP_3_CLASS = 'grid gap-3';

/**
 * Component slugs generated from the public Styling API reference.
 */
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
const GRID_GAP_4_CLASS = 'grid gap-4';
const ROUNDED_BORDER_P_4_CLASS = 'rounded border p-4';
const CONTROL_GRID_STYLE: React.CSSProperties = { gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))' };
/**
 * Authored previews and copyable snippets, keyed by their file slug.
 */
const DEMO_REGISTRY = Object.fromEntries(
	Object.entries(
		import.meta.glob<{ default: React.ComponentType<{ variant?: string; triggerVariant?: string; selection?: 'none' | 'surface' | 'line' }>; exampleCode: string }>('./demos/*.tsx', { eager: true }),
	).map(([path, module]) => [path.slice(path.lastIndexOf('/') + 1, -4), { Preview: module.default, code: module.exampleCode }]),
) as Record<CompSlug, { Preview: React.ComponentType<{ variant?: string; triggerVariant?: string; selection?: 'none' | 'surface' | 'line' }>; code: string }>;

/**
 * A compact index; interactive examples and API details live on each component page.
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
					<section key={group} className={GRID_GAP_3_CLASS}>
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

/*//////////////////////////////////////////////////
DEMO RENDERING
//////////////////////////////////////////////////*/

/**
 * Renders the authored preview for a documented component.
 *
 * @param comp - Slug of the component whose preview should be shown.
 * @param variant - Selected appearance variant.
 * @param triggerVariant - Selected tab trigger variant.
 * @param selection - Selected tab treatment.
 * @return The component's interactive preview.
 */
export function ComponentDemo({
	component: comp,
	variant,
	triggerVariant,
	selection,
}: {
	component: CompSlug;
	variant?: string;
	triggerVariant?: string;
	selection?: 'none' | 'surface' | 'line';
}): React.JSX.Element {
	// hygiene-ignore single-use -- Keep Preview as a named intermediate to preserve the current evaluation order in this generated output path.
	const Preview = DEMO_REGISTRY[comp].Preview;
	return <Preview variant={variant} triggerVariant={triggerVariant} selection={selection} />;
}

// hygiene-ignore single-use -- Keep this exported workbench boundary because generated Docs pages import it directly.
/**
 * Selects the interactive workbench available for a component.
 *
 * @param comp - Slug of the component to demonstrate.
 * @return A controlled workbench or the component's authored example.
 */
export function ComponentWorkbench({ component: comp }: { component: CompSlug }): React.JSX.Element {
	if (comp === 'button') return <ButtonWorkbench />;
	if (comp === 'card') return <CardWorkbench />;
	if (comp === 'tabs') return <TabsWorkbench />;
	if (SIMPLE_CONTROLS[comp]) return <SimpleWorkbench component={comp} />;
	if (VARIANT_TARGETS[comp]) return <VariantWorkbench component={comp} />;
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
		<UI.Tabs defaultValue='rendered' className='min-w-0 max-w-full'>
			<UI.TabsList aria-label='Example view'>
				<UI.TabsTrigger value='rendered'>Rendered</UI.TabsTrigger>
				<UI.TabsTrigger value='code'>Code</UI.TabsTrigger>
			</UI.TabsList>
			<UI.TabsContent value='rendered'>{preview}</UI.TabsContent>
			<UI.TabsContent value='code' className='min-w-0 max-w-full overflow-x-auto'>
				<CopyableCode code={code} />
			</UI.TabsContent>
		</UI.Tabs>
	);
}

/*//////////////////////////////////////////////////
WORKBENCH CONTROLS
//////////////////////////////////////////////////*/

/**
 * Colour families and visual treatments available in component variants.
 */
const COLORS = ['primary', 'secondary', 'gray', 'destructive', 'success', 'caution'] as const;
const TREATMENTS = ['saturated', 'outline', 'ghost', 'tonal', 'glass', 'underline'] as const;
const CARD_TREATMENTS = ['saturated', 'outline', 'ghost', 'tonal', 'glass'] as const;
const ACTION_TYPES = ['default', ...TREATMENTS] as const;
const BUTTON_TYPES = [...ACTION_TYPES, 'dashboard-nav', 'plain', 'authority', 'connection', 'drawer'] as const;
const CARD_SURFACES = ['default', ...CARD_TREATMENTS, 'transparent', 'dark', 'error', 'correct', 'info', 'warning', 'control'] as const;
const BUTTON_VARIANTS = [
	...COLORS.flatMap(color => [color, ...TREATMENTS.map(treatment => `${color}-${treatment}`)]),
	'default',
	'outline',
	'ghost',
	'tonal',
	'underline',
	'ghost-destructive',
	'dashboard-nav',
	'plain',
	'authority',
	'connection',
	'drawer',
];
const SURFACE_VARIANTS = [
	...COLORS,
	...COLORS.flatMap(color => TREATMENTS.filter(treatment => treatment !== 'underline').map(treatment => `${color}-${treatment}`)),
	...COLORS.map(color => `${color}-default`),
	'transparent',
	'dark',
	'error',
	'correct',
	'info',
	'warning',
	'control',
];
const BUTTON_SIZES = ['default', 'xs', 'sm', 'md', 'lg', 'xl', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const;
/**
 * Combines generated finite prop choices with authored variants missing from the reference.
 *
 * @param comp - Component whose prop is being controlled.
 * @param prop - Prop name to inspect in the generated reference.
 * @param fallback - Authored choices to include alongside the generated reference.
 * @param memberName - API member that owns the controlled prop.
 * @return Every distinct generated and authored choice.
 */
function finiteChoices(comp: CompSlug, prop: string, fallback: readonly string[], memberName = componentTsDocs[comp].demoExport): readonly string[] {
	return [...new Set([...(componentTsDocs[comp].members.find(item => item.name === memberName)?.props.find(item => item.name === prop)?.choices ?? []), ...fallback])];
}

/**
 * The element carrying the appearance variant in each authored component example.
 */
const VARIANT_TARGETS: Partial<Record<CompSlug, { member: string; initial: string; fallback?: readonly string[]; omitDefault?: boolean }>> = {
	accordion: { member: 'Accordion', initial: 'default' },
	'alert-dialog': { member: 'AlertDialogAction', initial: 'default', fallback: BUTTON_VARIANTS },
	bubble: { member: 'Bubble', initial: 'default' },
	carousel: { member: 'CarouselPrevious', initial: 'default', fallback: BUTTON_VARIANTS },
	combobox: { member: 'Combobox', initial: 'default', fallback: BUTTON_VARIANTS },
	'data-table': { member: 'DataTable', initial: 'default' },
	dialog: { member: 'DialogContent', initial: 'primary-tonal', fallback: SURFACE_VARIANTS },
	'dropdown-menu': { member: 'DropdownMenuItem', initial: 'default', fallback: ['default', 'destructive'], omitDefault: true },
	'form-select': { member: 'FormSelect', initial: 'default' },
	'password-input': { member: 'PasswordInput', initial: 'primary' },
	pagination: { member: 'PaginationItem', initial: 'default', fallback: BUTTON_VARIANTS },
	'radio-group': { member: 'RadioGroupItem', initial: 'primary' },
	select: { member: 'SelectTrigger', initial: 'default' },
	sheet: { member: 'SheetContent', initial: 'primary-tonal', fallback: SURFACE_VARIANTS },
	sidebar: { member: 'Sidebar', initial: 'sidebar' },
	'toggle-group': { member: 'ToggleGroup', initial: 'default' },
};

/**
 * Updates the demonstrated JSX tag so the copyable source matches the selected variant.
 *
 * @param code - Authored JSX snippet.
 * @param member - JSX element whose variant changes.
 * @param variant - Selected appearance variant.
 * @param omitDefault - Whether to omit the implicit default prop from source.
 * @return JSX with the selected variant on the specified element.
 */
function codeWithVariant(code: string, member: string, variant: string, omitDefault = false): string {
	return code.replace(new RegExp(`<${member}(?=[\\s/>])([^>]*?)>`, 'g'), (_match, attrs: string) => {
		const clean = attrs.replace(/\s+variant=(?:'[^']*'|"[^"]*")/, '');
		return `<${member}${clean.replace(S_REGEX, '')}${omitDefault && variant === 'default' ? '' : ` variant='${variant}'`}${S_REGEX.test(clean) ? ' /' : ''}>`;
	});
}

// hygiene-ignore single-use -- Retain a stable React component boundary for independent variant state and hook order.
/**
 * Shows a selected variant of a component's authored example.
 *
 * @param comp - Component whose example is shown.
 * @return A variant selector with live preview and source.
 */
function VariantWorkbench({ component: comp }: { component: CompSlug }): React.JSX.Element {
	const target = VARIANT_TARGETS[comp]!;
	const [variant, setVariant] = React.useState(target.initial);
	return (
		<div className={GRID_GAP_4_CLASS}>
			<DemoSelect label={`${target.member} variant`} value={variant} choices={finiteChoices(comp, 'variant', target.fallback ?? [], target.member)} onChange={setVariant} />
			<ExampleTabs preview={<ComponentDemo component={comp} variant={variant} />} code={codeWithVariant(DEMO_REGISTRY[comp].code, target.member, variant, target.omitDefault)} />
		</div>
	);
}

// hygiene-ignore single-use -- Retain a stable React component boundary for Tabs state and hook order.
/**
 * Selects trigger type, colour, and a combined surface and layout treatment.
 *
 * @return Tabs controls with live preview and source.
 */
function TabsWorkbench(): React.JSX.Element {
	const [type, setType] = React.useState<(typeof ACTION_TYPES)[number]>('tonal');
	const [color, setColor] = React.useState<(typeof COLORS)[number]>('gray');
	const [surface, setSurface] = React.useState<'none' | 'surface' | 'line' | 'dashboard-nav'>('surface');
	const layout = surface === 'line' ? 'line' : surface === 'dashboard-nav' ? 'dashboard-nav' : 'default';
	const selection = surface === 'dashboard-nav' ? 'none' : surface;
	const triggerVariant = layout === 'dashboard-nav' ? 'dashboard-nav' : type === 'default' ? color : `${color}-${type}`;
	return (
		<div className={GRID_GAP_4_CLASS}>
			<div className={GRID_GAP_3_CLASS} style={CONTROL_GRID_STYLE}>
				<DemoSelect
					label='Type'
					value={type}
					choices={ACTION_TYPES}
					onChange={choice => {
						setType(choice as typeof type);
						if (surface === 'dashboard-nav') setSurface('surface');
					}}
				/>
				<DemoSelect
					label='Colour'
					value={color}
					choices={COLORS}
					onChange={value => {
						setColor(value as typeof color);
						if (surface === 'dashboard-nav') setSurface('surface');
					}}
				/>
				<DemoSelect label='Surface' value={surface} choices={['none', 'surface', 'line', 'dashboard-nav']} onChange={value => setSurface(value as typeof surface)} />
			</div>
			<ExampleTabs
				preview={<ComponentDemo component='tabs' variant={layout} triggerVariant={triggerVariant} selection={selection} />}
				code={codeWithVariant(DEMO_REGISTRY.tabs.code, 'TabsList', layout)
					.replace("aria-label='Project details'", `aria-label='Project details'${layout === 'dashboard-nav' ? " className='rounded bg-primary-12 px-3'" : ''}`)
					.replaceAll('<TabsTrigger ', `<TabsTrigger variant='${triggerVariant}' selection='${selection}' `)}
			/>
		</div>
	);
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
	const [container, setContainer] = React.useState<HTMLElement | null>(null);
	return (
		<div ref={setContainer} className='grid gap-2'>
			<UI.PortalContainerProvider container={container}>
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
			</UI.PortalContainerProvider>
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

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Lets readers explore Button colour, treatment, size, and interaction states.
 *
 * @return Button controls with a live preview and matching source.
 */
function ButtonWorkbench(): React.JSX.Element {
	const [color, setColor] = React.useState<(typeof COLORS)[number]>('primary');
	const [type, setType] = React.useState<(typeof BUTTON_TYPES)[number]>('saturated');
	const [size, setSize] = React.useState<(typeof BUTTON_SIZES)[number]>('md');
	const [disabled, setDisabled] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [loadingText, setLoadingText] = React.useState('Saving…');
	const [icon, setIcon] = React.useState(false);
	const iconOnly = size.startsWith('icon');
	const variant = (type === 'default' ? color : TREATMENTS.some(treatment => treatment === type) ? `${color}-${type}` : type) as React.ComponentProps<typeof UI.Button>['variant'];
	// hygiene-ignore single-use -- Keep snippet as a named render value so the generated preview and copyable source use the same controlled component selection.
	const snippet = `import { Button } from '@terra-symposium/styling/ui';${icon ? "\nimport { Star } from '@carbon/icons-react';" : ''}\n\n<Button variant='${variant}' size='${size}'${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}${loading && loadingText ? ` loadingText='${loadingText}'` : ''}${iconOnly ? " aria-label='Save'" : ''}>${icon ? "<Star aria-hidden className='size-4' />" : ''}${iconOnly ? '' : 'Save'}</Button>`;
	return (
		<div className={GRID_GAP_4_CLASS}>
			<div className={GRID_GAP_3_CLASS} style={CONTROL_GRID_STYLE}>
				<DemoSelect
					label='Colour'
					value={color}
					choices={COLORS}
					onChange={value => {
						setColor(value as typeof color);
						if (!ACTION_TYPES.some(choice => choice === type)) setType('saturated');
					}}
				/>
				<DemoSelect label='Type' value={type} choices={BUTTON_TYPES} onChange={value => setType(value as typeof type)} />
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

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Lets readers compare Card variants, sizes, and navigation behaviour.
 *
 * @return Card controls with a live preview and matching source.
 */
function CardWorkbench(): React.JSX.Element {
	const [color, setColor] = React.useState<(typeof COLORS)[number]>('primary');
	const [surface, setSurface] = React.useState<(typeof CARD_SURFACES)[number]>('tonal');
	const [size, setSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
	const [interactive, setInteractive] = React.useState(false);
	const variant = (surface === 'default' ? color : CARD_TREATMENTS.some(treatment => treatment === surface) ? `${color}-${surface}` : surface) as React.ComponentProps<typeof UI.Card>['variant'];
	// hygiene-ignore single-use -- Keep snippet as a named render value so the generated preview and copyable source use the same controlled component selection.
	const snippet = `import { Card } from '@terra-symposium/styling/ui';\n\n<Card variant='${variant}' size='${size}'${interactive ? " href='#component-example-heading'" : ''}>Project update</Card>`;
	return (
		<div className={GRID_GAP_4_CLASS}>
			<div className={GRID_GAP_3_CLASS} style={CONTROL_GRID_STYLE}>
				<DemoSelect
					label='Colour'
					value={color}
					choices={COLORS}
					onChange={value => {
						setColor(value as typeof color);
						if (!CARD_TREATMENTS.some(treatment => treatment === surface) && surface !== 'default') setSurface('tonal');
					}}
				/>
				<DemoSelect label='Surface' value={surface} choices={CARD_SURFACES} onChange={value => setSurface(value as typeof surface)} />
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
 * @param code - Source to display and copy.
 * @param lang - Syntax language for the Docs code block.
 * @return The formatted, copyable code example.
 */
function CopyableCode({ code, lang = 'tsx' }: { code: string; lang?: string }): React.JSX.Element {
	return renderCode({
		attributes: {},
		children: <></>,
		node: { _type: 'code', _key: 'component-example', value: code, language: lang },
		path: [],
		readOnly: true,
	});
}

/**
 * Short, safe choices for public states that benefit from side-by-side inspection.
 */
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

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Builds a live example from one finite component prop.
 *
 * @param comp - Component with a configured simple control.
 * @return A selector, live preview, and matching source example.
 */
function SimpleWorkbench({ component: comp }: { component: CompSlug }): React.JSX.Element {
	const control = SIMPLE_CONTROLS[comp]!;
	const [value, setValue] = React.useState(control.initial);
	const variantChoices = ['alert', 'badge', 'empty', 'input', 'textarea', 'toggle'].includes(comp)
		? finiteChoices(comp, 'variant', comp === 'alert' ? ['default', ...SURFACE_VARIANTS] : control.prop === 'variant' ? control.values : [])
		: [];
	const [variant, setVariant] = React.useState(comp === 'alert' ? 'default' : 'primary');
	// hygiene-ignore single-use -- Keep importName as a named render value so the generated preview and copyable source use the same controlled component selection.
	const importName = comp === 'alert' ? `Alert${value[0]!.toUpperCase() + value.slice(1)}` : componentTsDocs[comp].demoExport;
	let preview: React.ReactNode;
	let code: string;
	switch (comp) {
		case 'alert': {
			preview = (
				<UI.Alert variant={variant as React.ComponentProps<typeof UI.Alert>['variant']}>
					<UI.AlertTitle>{value} notice</UI.AlertTitle>
					<UI.AlertDescription>This is a {value} message.</UI.AlertDescription>
				</UI.Alert>
			);
			code = `<Alert variant='${variant}'><AlertTitle>${value} notice</AlertTitle><AlertDescription>This is a ${value} message.</AlertDescription></Alert>`;
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
			preview = <UI.Input variant={variant as React.ComponentProps<typeof UI.Input>['variant']} type={value} placeholder='Enter a value' aria-label='Example value' />;
			code = `<Input variant='${variant}' type='${value}' placeholder='Enter a value' aria-label='Example value' />`;
			break;
		case 'textarea':
			preview = <UI.Textarea variant={variant as React.ComponentProps<typeof UI.Textarea>['variant']} rows={Number(value)} placeholder='Write a note' />;
			code = `<Textarea variant='${variant}' rows={${value}} placeholder='Write a note' />`;
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
				<UI.Toggle key={value} variant={variant as React.ComponentProps<typeof UI.Toggle>['variant']} defaultPressed={value === 'true'} aria-label='Bold'>
					Bold
				</UI.Toggle>
			);
			code = `<Toggle variant='${variant}' defaultPressed={${value}} aria-label='Bold'>Bold</Toggle>`;
			break;
		default:
			throw new Error(`Missing simple demo for ${comp}`);
	}
	return (
		<div className={GRID_GAP_4_CLASS}>
			<div className={GRID_GAP_3_CLASS} style={CONTROL_GRID_STYLE}>
				<DemoSelect label={control.label} value={value} choices={finiteChoices(comp, control.prop, control.values)} onChange={setValue} />
				{variantChoices.length > 0 && control.prop !== 'variant' ? <DemoSelect label='Variant' value={variant} choices={variantChoices} onChange={setVariant} /> : null}
			</div>
			<ExampleTabs
				preview={<div className={ROUNDED_BORDER_P_4_CLASS}>{preview}</div>}
				code={`import { ${comp === 'alert' ? 'Alert, AlertTitle, AlertDescription' : importName} } from '@terra-symposium/styling/ui';\n\n${code}`}
			/>
		</div>
	);
}

// hygiene-ignore single-use -- Keep generated API column construction behind one boundary so authored member metadata remains grouped with its table schema.
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
				<div className='min-w-0 max-w-xl overflow-x-auto [&_.docs-code-block]:mb-0'>
					<CopyableCode code={member.signature} lang='typescript' />
				</div>
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
			<section className='docs-block-flow' aria-labelledby='component-usage-heading'>
				<h2 id='component-usage-heading'>Usage</h2>
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
