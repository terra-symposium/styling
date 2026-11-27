/**
 * docs/styling/1-colouring/2-components/_components.tsx
 * Catalog, interactive workbenches, and TypeScript reference for Styling components.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import * as React from 'react';

// COMPONENTS
import { componentTsDocs } from '../../../../dist/cache/component-tsdocs.js';
import * as UI from '../../../../src/components/ui/index.js';
import { componentNotes } from './_demos/notes.js';
import { renderCode } from '@terra-symposium/docs';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/
const NUMBER_REGEX = /number/;

const BORDER_P_1_CLASS = 'border p-1';
const GRID_GAP_3_CLASS = 'grid gap-3';

/**
 * Component slugs generated from the public Styling API reference.
 */
type CompSlug = keyof typeof componentTsDocs;

const GROUP_ORDER = ['Actions and forms', 'Content and feedback', 'Menus and overlays', 'Navigation and layout', 'Data and composition'] as const;
const COMP_GROUPS = new Map(
	GROUP_ORDER.map(
		g =>
			[
				g,
				Object.entries(componentTsDocs)
					.filter(([, docs]) => docs.group === g)
					.map(([slug, docs]) => ({ slug, title: docs.title })),
			] as const,
	),
);
const NON_DISPLAY_PROPS = new Set(['children', 'className', 'style', 'key', 'ref']);
const APPEARANCE_PROPS = new Set([
	'variant',
	'size',
	'rounded',
	'shape',
	'orientation',
	'direction',
	'layout',
	'side',
	'align',
	'placement',
	'density',
	'disabled',
	'loading',
	'scrollable',
	'showClose',
	'showCloseButton',
	'showIcon',
	'compact',
	'inset',
	'fullWidth',
	'selected',
	'width',
	'height',
	'rows',
	'cols',
	'columns',
	'gap',
	'maxRows',
]);
const CONTROL_GRID_CLASS = 'grid gap-4 sm:grid-cols-2';
/**
 * Authored previews and copyable snippets, keyed by their file slug.
 */
const DEMO_REGISTRY = Object.fromEntries(
	Object.entries(
		import.meta.glob<{ default: React.ComponentType<{ variant?: string; triggerVariant?: string; selection?: 'none' | 'surface' | 'line' }>; exampleCode: string }>('./_demos/*.tsx', { eager: true }),
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
WORKBENCH CONTROLS
//////////////////////////////////////////////////*/

/**
 * Colour families and visual treatments available in component variants.
 */
const COLORS = ['primary', 'secondary', 'gray', 'destructive', 'success', 'caution'] as const;
/**
 * Finds finite and boolean API props that change a component's visual treatment.
 *
 * @param comp - Component slug whose generated API metadata is inspected.
 * @param memberName - Public export displayed by the demo.
 * @param excluded - Props already controlled by a component-specific selector.
 *
 * @return Supported appearance controls with defaults inferred from the API.
 */
function appearanceOptions(comp: CompSlug, memberName: string, excluded: readonly string[] = []): { name: string; choices: readonly string[]; initial: string; boolean: boolean; numeric: boolean }[] {
	return (componentTsDocs[comp].members.find(item => item.name === memberName)?.props ?? [])
		.filter(
			prop =>
				!excluded.includes(prop.name) &&
				(prop.choices.length > 0 || (APPEARANCE_PROPS.has(prop.name) && prop.type.includes('boolean')) || (APPEARANCE_PROPS.has(prop.name) && NUMBER_REGEX.test(prop.type))),
		)
		.map(prop => {
			const boolean = prop.type.includes('boolean');
			const numeric = !boolean && prop.choices.length === 0 && NUMBER_REGEX.test(prop.type);
			const choices = boolean ? ['false', 'true'] : numeric ? numericAppearanceChoices(prop.name) : prop.choices;
			const declaredDefault = prop.defaultValue?.replace(/^['"]|['"]$/g, '');
			const preferred = ({ size: 'md', rounded: 'full', orientation: 'horizontal', direction: 'ltr', layout: 'default' } as Record<string, string>)[prop.name];
			return {
				name: prop.name,
				choices,
				initial: declaredDefault && choices.includes(declaredDefault) ? declaredDefault : preferred && choices.includes(preferred) ? preferred : choices[0]!,
				boolean,
				numeric,
			};
		});
}

/**
 * Supplies safe representative values for numeric size and layout props.
 *
 * @param name - Numeric prop name.
 *
 * @return Useful small, medium, and large values for the prop.
 */
function numericAppearanceChoices(name: string): readonly string[] {
	if (name === 'rows' || name === 'maxRows') return ['2', '4', '6'];
	if (name === 'columns' || name === 'cols') return ['1', '2', '3'];
	if (name === 'gap') return ['0', '2', '4', '6'];
	return ['160', '320', '480'];
}

/**
 * Applies selected props to every rendered instance of the authored demo target.
 *
 * @param node - Rendered authored demo tree.
 * @param memberName - Public UI export whose props are controlled.
 * @param props - Selected appearance props.
 *
 * @return A cloned tree with appearance props applied to matching target elements.
 */
function applyAppearanceProps(node: React.ReactNode, memberName: string, props: Record<string, unknown>): React.ReactNode {
	if (Array.isArray(node)) return node.map(child => applyAppearanceProps(child, memberName, props));
	if (!React.isValidElement(node)) return node;
	const originalChildren = (node as React.ReactElement<{ children?: React.ReactNode }>).props.children;
	const children = Array.isArray(originalChildren)
		? originalChildren.map(child => applyAppearanceProps(child, memberName, props))
		: React.isValidElement(originalChildren)
			? applyAppearanceProps(originalChildren, memberName, props)
			: originalChildren;
	const updated = node.type === (UI as unknown as Record<string, React.ElementType>)[memberName] ? props : {};
	const elementToClone = node as React.ReactElement<Record<string, unknown>>;
	// Passing a children array as one argument changes Radix Slot's single-child contract and triggers React's missing-key warning.
	return Array.isArray(children) ? React.cloneElement(elementToClone, updated, ...children) : React.cloneElement(elementToClone, updated, children);
}

// hygiene-ignore single-use -- Keep the paired colour/type transitions together so both controls use the same matrix and fallback order.
/**
 * Replaces a long variant menu with coordinated colour and type controls.
 *
 * @param choices - Supported values for the component variant.
 * @param value - Currently selected variant.
 * @param onChange - Applies the selected variant.
 * @param label - Accessible name for the generated control group.
 *
 * @return Coordinated controls when choices form a colour matrix, otherwise null.
 */
function appearanceControls({ choices, value, onChange, label }: { choices: readonly string[]; value: string; onChange: (value: string) => void; label: string }): React.ReactNode {
	const matrix = choices.flatMap(choice => {
		const color = COLORS.find(candidate => choice.startsWith(`${candidate}-`));
		return color ? [{ choice, color, type: choice.slice(color.length + 1) }] : [];
	});
	const colors = [...new Set(matrix.map(option => option.color))];
	const types = [...new Set(matrix.map(option => option.type))];
	if (matrix.length < 8 || colors.length < 3 || types.length < 2) return null;
	const specials = choices.filter(choice => !matrix.some(option => option.choice === choice) && !COLORS.includes(choice as (typeof COLORS)[number]));
	const selected = matrix.find(option => option.choice === value);
	const color = selected?.color ?? colors[0]!;
	const type = selected?.type ?? (specials.includes(value) ? value : types[0]!);
	return (
		<div role='group' aria-label={label} className={CONTROL_GRID_CLASS}>
			<DemoSelect
				label='Colour'
				value={color}
				choices={colors}
				onChange={nextColor => {
					if (specials.includes(type)) onChange(matrix.find(option => option.color === nextColor)?.choice ?? value);
					else onChange(matrix.find(option => option.color === nextColor && option.type === type)?.choice ?? matrix.find(option => option.color === nextColor)?.choice ?? value);
				}}
			/>
			<DemoSelect
				label='Type'
				value={type}
				choices={[...types, ...specials]}
				onChange={nextType => {
					if (specials.includes(nextType)) onChange(nextType);
					else onChange(matrix.find(option => option.color === color && option.type === nextType)?.choice ?? matrix.find(option => option.color === color)?.choice ?? value);
				}}
			/>
		</div>
	);
}

// hygiene-ignore single-use -- Keep the static target table module-scoped so each component reference does not rebuild its mapping.
/** Preferred API member for selecting appearance controls in each authored example. */
const VARIANT_TGTS: Partial<Record<CompSlug, string>> = {
	accordion: 'Accordion',
	'alert-dialog': 'AlertDialogAction',
	badge: 'Badge',
	bubble: 'Bubble',
	carousel: 'CarouselPrevious',
	combobox: 'Combobox',
	'data-table': 'DataTable',
	dialog: 'DialogContent',
	'dropdown-menu': 'DropdownMenuItem',
	'form-select': 'FormSelect',
	'password-input': 'PasswordInput',
	pagination: 'PaginationItem',
	'radio-group': 'RadioGroupItem',
	select: 'SelectTrigger',
	sheet: 'SheetContent',
	sidebar: 'Sidebar',
	'toggle-group': 'ToggleGroup',
};

/**
 * Renders a labelled selector for a finite workbench state.
 *
 * @param label - Text identifying the controlled state.
 * @param value - Currently selected option.
 * @param choices - Options available in the selector.
 * @param onChange - Receives a newly selected value.
 *
 * @return A labelled component selector.
 */
function DemoSelect({ label, value, choices, onChange }: { label: string; value: string; choices: readonly string[]; onChange: (value: string) => void }): React.JSX.Element {
	const id = React.useId();
	const [container, setContainer] = React.useState<HTMLElement | null>(null);
	return (
		<div ref={setContainer} className='grid min-w-0 gap-2'>
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
 *
 * @return A labelled checkbox.
 */
function DemoCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }): React.JSX.Element {
	const id = React.useId();
	return (
		<div className='flex min-h-10 items-center gap-2 rounded-md border border-primary-5 bg-primary-1 px-3'>
			<UI.Checkbox id={id} checked={checked} onCheckedChange={value => onChange(value === true)} />
			<UI.Label htmlFor={id}>{label}</UI.Label>
		</div>
	);
}

/**
 * Renders an example snippet with the shared Docs code renderer.
 *
 * @param code - Source to display and copy.
 * @param lang - Syntax language for the Docs code block.
 *
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
 * Renders the source metadata, live example, and generated TypeScript API table.
 *
 * @param comp - Component slug whose source, example, and generated API are displayed.
 *
 * @return The full component reference content for the selected component.
 */
export function ComponentReference({ component: comp }: { component: CompSlug }): React.JSX.Element {
	const docs = componentTsDocs[comp];
	const targetNames = componentTsDocs[comp].members.filter(member => new RegExp(`<${member.name}(?=[\\s/>])`).test(DEMO_REGISTRY[comp].code)).map(member => member.name);
	const preferredTarget = VARIANT_TGTS[comp] ?? docs.demoExport;
	const targetChoices = targetNames.includes(preferredTarget) ? [preferredTarget, ...targetNames.filter(name => name !== preferredTarget)] : targetNames.length > 0 ? targetNames : [docs.demoExport];
	const [targetMember, setTargetMember] = React.useState(targetChoices[0]!);
	const options = appearanceOptions(comp, targetMember);
	const [values, setValues] = React.useState<Record<string, string>>(() => Object.fromEntries(options.map(option => [option.name, option.initial])));
	const appearanceProps = Object.fromEntries(
		options.map(option => [option.name, option.boolean ? values[option.name] === 'true' : option.numeric ? Number(values[option.name]) : values[option.name]]),
	);
	const variant = options.find(option => option.name === 'variant');
	const variantChoices = variant?.choices ?? [];
	const onTargetMemberChange = (member: string): void => {
		setTargetMember(member);
		setValues(Object.fromEntries(appearanceOptions(comp, member).map(option => [option.name, option.initial])));
	};
	return (
		<div className='flow'>
			<section className='flow' aria-labelledby='component-usage-heading'>
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
				<aside className='block my-0 flow-root' data-docs-aside='example'>
					<h4 className='title'>Interactive example</h4>
					<div className='grid gap-4'>
						<div className={CONTROL_GRID_CLASS}>
							<DemoSelect label='Component part' value={targetMember} choices={targetChoices} onChange={onTargetMemberChange} />
							{variant && variantChoices.length > 0
								? (appearanceControls({ choices: variantChoices, value: values.variant!, onChange: value => setValues(current => ({ ...current, variant: value })), label: 'Variant' }) ?? (
										<DemoSelect label='Variant' value={values.variant!} choices={variantChoices} onChange={value => setValues(current => ({ ...current, variant: value }))} />
									))
								: null}
							{options
								.filter(option => option.name !== 'variant')
								.map(option => {
									const label = option.name.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`).replace(/^./, letter => letter.toUpperCase());
									return option.boolean ? (
										<DemoCheckbox
											key={option.name}
											label={label}
											checked={values[option.name] === 'true'}
											onChange={checked => setValues(current => ({ ...current, [option.name]: String(checked) }))}
										/>
									) : (
										<DemoSelect
											key={option.name}
											label={label}
											value={values[option.name]!}
											choices={option.choices}
											onChange={value => setValues(current => ({ ...current, [option.name]: value }))}
										/>
									);
								})}
						</div>
						<UI.Tabs defaultValue='rendered' className='min-w-0 max-w-full'>
							<UI.TabsList aria-label='Example view'>
								<UI.TabsTrigger value='rendered'>Rendered</UI.TabsTrigger>
								<UI.TabsTrigger value='code'>Code</UI.TabsTrigger>
							</UI.TabsList>
							<UI.TabsContent value='rendered'>
								{applyAppearanceProps(
									(DEMO_REGISTRY[comp].Preview as (props: { variant?: string; triggerVariant?: string; selection?: 'none' | 'surface' | 'line' }) => React.ReactNode)({
										variant: undefined,
										triggerVariant: undefined,
										selection: undefined,
									}),
									targetMember,
									appearanceProps,
								)}
							</UI.TabsContent>
							<UI.TabsContent value='code' className='min-w-0 max-w-full overflow-x-auto'>
								<CopyableCode
									code={DEMO_REGISTRY[comp].code.replace(new RegExp(`<${targetMember}(?=[\\s/>])([^>]*?)(\\s*/?)>`, 'g'), (_match, attrs: string, close: string) => {
										let nextAttrs = attrs;
										for (const [name, value] of Object.entries(appearanceProps)) {
											nextAttrs = nextAttrs.replace(new RegExp(`\\s+${name}=(?:'[^']*'|"[^"]*"|\\{[^}]*\\})`, 'g'), '');
											nextAttrs += ` ${name}=${typeof value === 'boolean' || typeof value === 'number' ? `{${value}}` : `'${String(value).replaceAll("'", "\\'")}'`}`;
										}
										return `<${targetMember}${nextAttrs}${close}>`;
									})}
								/>
							</UI.TabsContent>
						</UI.Tabs>
					</div>
				</aside>
				<h3 id='component-api-heading'>TypeScript API</h3>
				<div className='overflow-x-auto'>
					<table className='w-full min-w-[760px] border-collapse text-left text-sm'>
						<thead>
							<tr>
								<th className='border p-2'>API member and props</th>
								<th className='border p-2'>TypeScript signature</th>
							</tr>
						</thead>
						<tbody>
							{docs.members.map(member => {
								const props = member.props.filter(prop => !prop.name.startsWith('on') && !NON_DISPLAY_PROPS.has(prop.name));
								return (
									<tr key={member.name}>
										<td className='border p-2 align-top'>
											<div className='grid gap-1'>
												<strong>{member.name}</strong>
												{member.summary ? <span>{member.summary}</span> : null}
												{member.tags.length > 0 ? <span className='text-sm text-primary-11'>{member.tags.map(tag => `@${tag.name} ${tag.text}`).join(' · ')}</span> : null}
												{targetChoices.includes(member.name) ? (
													<button
														type='button'
														className='w-fit text-sm text-primary-11 underline'
														onClick={() => {
															onTargetMemberChange(member.name);
															document.getElementById('component-example-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
														}}
													>
														Preview this export
													</button>
												) : null}
												{props.length > 0 ? (
													<details className='mt-2'>
														<summary className='cursor-pointer font-medium'>Props ({props.length})</summary>
														<div className='mt-2 overflow-x-auto'>
															<table className='w-full min-w-[600px] border-collapse text-xs'>
																<thead>
																	<tr>
																		<th className={BORDER_P_1_CLASS}>Prop</th>
																		<th className={BORDER_P_1_CLASS}>Type</th>
																		<th className={BORDER_P_1_CLASS}>Default</th>
																		<th className={BORDER_P_1_CLASS}>Description</th>
																	</tr>
																</thead>
																<tbody>
																	{props.map(prop => (
																		<tr key={prop.name}>
																			<td className={BORDER_P_1_CLASS}>
																				<code>{prop.name}</code>
																				{prop.optional ? '?' : ''}
																			</td>
																			<td className={BORDER_P_1_CLASS}>
																				<code className='break-all'>{prop.type}</code>
																				{prop.choices.length > 0 && <small className='block'>Choices: {prop.choices.join(', ')}</small>}
																			</td>
																			<td className={BORDER_P_1_CLASS}>
																				<code>{'defaultValue' in prop ? String(prop.defaultValue) : 'Not declared'}</code>
																			</td>
																			<td className={BORDER_P_1_CLASS}>{prop.description || 'None'}</td>
																		</tr>
																	))}
																</tbody>
															</table>
														</div>
													</details>
												) : null}
											</div>
										</td>
										<td className='border p-2 align-top'>
											<div className='min-w-0 max-w-xl overflow-x-auto [&_.code-block]:mb-0'>
												<CopyableCode code={member.signature} lang='typescript' />
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
