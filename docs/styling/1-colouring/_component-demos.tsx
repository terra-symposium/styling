import * as React from 'react';
import * as UI from '../../../src/components/ui/index.js';
import buttonDemo, { exampleCode as buttonCode } from './demos/button.js';
import inputDemo, { exampleCode as inputCode } from './demos/input.js';
import passwordInputDemo, { exampleCode as passwordInputCode } from './demos/password-input.js';
import labelDemo, { exampleCode as labelCode } from './demos/label.js';
import badgeDemo, { exampleCode as badgeCode } from './demos/badge.js';
import cardDemo, { exampleCode as cardCode } from './demos/card.js';
import checkboxDemo, { exampleCode as checkboxCode } from './demos/checkbox.js';
import switchDemo, { exampleCode as switchCode } from './demos/switch.js';
import spinnerDemo, { exampleCode as spinnerCode } from './demos/spinner.js';
import skeletonDemo, { exampleCode as skeletonCode } from './demos/skeleton.js';
import separatorDemo, { exampleCode as separatorCode } from './demos/separator.js';
import progressDemo, { exampleCode as progressCode } from './demos/progress.js';
import hintDemo, { exampleCode as hintCode } from './demos/hint.js';
import accordionDemo, { exampleCode as accordionCode } from './demos/accordion.js';
import tabsDemo, { exampleCode as tabsCode } from './demos/tabs.js';
import inputOtpDemo, { exampleCode as inputOtpCode } from './demos/input-otp.js';
import messageScrollerDemo, { exampleCode as messageScrollerCode } from './demos/message-scroller.js';
import formDemo, { exampleCode as formCode } from './demos/form.js';
import selectDemo, { exampleCode as selectCode } from './demos/select.js';
import dataTableDemo, { exampleCode as dataTableCode } from './demos/data-table.js';
import alertDialogDemo, { exampleCode as alertDialogCode } from './demos/alert-dialog.js';
import alertDemo, { exampleCode as alertCode } from './demos/alert.js';
import avatarDemo, { exampleCode as avatarCode } from './demos/avatar.js';
import bubbleDemo, { exampleCode as bubbleCode } from './demos/bubble.js';
import buttonGroupDemo, { exampleCode as buttonGroupCode } from './demos/button-group.js';
import calendarDemo, { exampleCode as calendarCode } from './demos/calendar.js';
import carouselDemo, { exampleCode as carouselCode } from './demos/carousel.js';
import collapsibleDemo, { exampleCode as collapsibleCode } from './demos/collapsible.js';
import comboboxDemo, { exampleCode as comboboxCode } from './demos/combobox.js';
import commandDemo, { exampleCode as commandCode } from './demos/command.js';
import contextMenuDemo, { exampleCode as contextMenuCode } from './demos/context-menu.js';
import dialogDemo, { exampleCode as dialogCode } from './demos/dialog.js';
import docsToolbarFrameDemo, { exampleCode as docsToolbarFrameCode } from './demos/docs-toolbar-frame.js';
import drawerDemo, { exampleCode as drawerCode } from './demos/drawer.js';
import dropdownMenuDemo, { exampleCode as dropdownMenuCode } from './demos/dropdown-menu.js';
import emptyDemo, { exampleCode as emptyCode } from './demos/empty.js';
import fieldDemo, { exampleCode as fieldCode } from './demos/field.js';
import formSelectDemo, { exampleCode as formSelectCode } from './demos/form-select.js';
import marqueeDemo, { exampleCode as marqueeCode } from './demos/marquee.js';
import messageDemo, { exampleCode as messageCode } from './demos/message.js';
import mappedFormFieldsDemo, { exampleCode as mappedFormFieldsCode } from './demos/mapped-form-fields.js';
import paginationDemo, { exampleCode as paginationCode } from './demos/pagination.js';
import popoverDemo, { exampleCode as popoverCode } from './demos/popover.js';
import portalContainerDemo, { exampleCode as portalContainerCode } from './demos/portal-container.js';
import radioGroupDemo, { exampleCode as radioGroupCode } from './demos/radio-group.js';
import resizableDemo, { exampleCode as resizableCode } from './demos/resizable.js';
import scrollAreaDemo, { exampleCode as scrollAreaCode } from './demos/scroll-area.js';
import sheetDemo, { exampleCode as sheetCode } from './demos/sheet.js';
import sidebarDemo, { exampleCode as sidebarCode } from './demos/sidebar.js';
import sliderDemo, { exampleCode as sliderCode } from './demos/slider.js';
import tableDemo, { exampleCode as tableCode } from './demos/table.js';
import textareaDemo, { exampleCode as textareaCode } from './demos/textarea.js';
import toasterDemo, { exampleCode as toasterCode } from './demos/toaster.js';
import toggleDemo, { exampleCode as toggleCode } from './demos/toggle.js';
import toggleGroupDemo, { exampleCode as toggleGroupCode } from './demos/toggle-group.js';
import tooltipDemo, { exampleCode as tooltipCode } from './demos/tooltip.js';
import { componentTsDocs } from '../../../dist/cache/component-tsdocs.js';
import { Star } from 'lucide-react';

type ComponentSlug = keyof typeof componentTsDocs;
const TEXT_SM_TEXT_PRIMARY_11_CLASS = 'text-sm text-primary-11';
const GRID_W_FULL_MAX_W_SM_GAP_2_CLASS = 'grid w-full max-w-sm gap-2';
const DEMO_REGISTRY = {
	button: { Preview: buttonDemo, code: buttonCode },
	input: { Preview: inputDemo, code: inputCode },
	'password-input': { Preview: passwordInputDemo, code: passwordInputCode },
	label: { Preview: labelDemo, code: labelCode },
	badge: { Preview: badgeDemo, code: badgeCode },
	card: { Preview: cardDemo, code: cardCode },
	checkbox: { Preview: checkboxDemo, code: checkboxCode },
	switch: { Preview: switchDemo, code: switchCode },
	spinner: { Preview: spinnerDemo, code: spinnerCode },
	skeleton: { Preview: skeletonDemo, code: skeletonCode },
	separator: { Preview: separatorDemo, code: separatorCode },
	progress: { Preview: progressDemo, code: progressCode },
	hint: { Preview: hintDemo, code: hintCode },
	accordion: { Preview: accordionDemo, code: accordionCode },
	tabs: { Preview: tabsDemo, code: tabsCode },
	'input-otp': { Preview: inputOtpDemo, code: inputOtpCode },
	'message-scroller': { Preview: messageScrollerDemo, code: messageScrollerCode },
	form: { Preview: formDemo, code: formCode },
	select: { Preview: selectDemo, code: selectCode },
	'data-table': { Preview: dataTableDemo, code: dataTableCode },
	'alert-dialog': { Preview: alertDialogDemo, code: alertDialogCode },
	alert: { Preview: alertDemo, code: alertCode },
	avatar: { Preview: avatarDemo, code: avatarCode },
	bubble: { Preview: bubbleDemo, code: bubbleCode },
	'button-group': { Preview: buttonGroupDemo, code: buttonGroupCode },
	calendar: { Preview: calendarDemo, code: calendarCode },
	carousel: { Preview: carouselDemo, code: carouselCode },
	collapsible: { Preview: collapsibleDemo, code: collapsibleCode },
	combobox: { Preview: comboboxDemo, code: comboboxCode },
	command: { Preview: commandDemo, code: commandCode },
	'context-menu': { Preview: contextMenuDemo, code: contextMenuCode },
	dialog: { Preview: dialogDemo, code: dialogCode },
	'docs-toolbar-frame': { Preview: docsToolbarFrameDemo, code: docsToolbarFrameCode },
	drawer: { Preview: drawerDemo, code: drawerCode },
	'dropdown-menu': { Preview: dropdownMenuDemo, code: dropdownMenuCode },
	empty: { Preview: emptyDemo, code: emptyCode },
	field: { Preview: fieldDemo, code: fieldCode },
	'form-select': { Preview: formSelectDemo, code: formSelectCode },
	marquee: { Preview: marqueeDemo, code: marqueeCode },
	message: { Preview: messageDemo, code: messageCode },
	'mapped-form-fields': { Preview: mappedFormFieldsDemo, code: mappedFormFieldsCode },
	pagination: { Preview: paginationDemo, code: paginationCode },
	popover: { Preview: popoverDemo, code: popoverCode },
	'portal-container': { Preview: portalContainerDemo, code: portalContainerCode },
	'radio-group': { Preview: radioGroupDemo, code: radioGroupCode },
	resizable: { Preview: resizableDemo, code: resizableCode },
	'scroll-area': { Preview: scrollAreaDemo, code: scrollAreaCode },
	sheet: { Preview: sheetDemo, code: sheetCode },
	sidebar: { Preview: sidebarDemo, code: sidebarCode },
	slider: { Preview: sliderDemo, code: sliderCode },
	table: { Preview: tableDemo, code: tableCode },
	textarea: { Preview: textareaDemo, code: textareaCode },
	toaster: { Preview: toasterDemo, code: toasterCode },
	toggle: { Preview: toggleDemo, code: toggleCode },
	'toggle-group': { Preview: toggleGroupDemo, code: toggleGroupCode },
	tooltip: { Preview: tooltipDemo, code: tooltipCode },
} satisfies Record<ComponentSlug, { Preview: React.ComponentType; code: string }>;

export function ComponentDemo({ component }: { component: ComponentSlug }): React.JSX.Element {
	const Preview = DEMO_REGISTRY[component].Preview;
	return <Preview />;
}

export function ComponentWorkbench({ component }: { component: ComponentSlug }): React.JSX.Element {
	if (component === 'button') return <ButtonWorkbench />;
	if (component === 'card') return <CardWorkbench />;
	if (SIMPLE_CONTROLS[component]) return <SimpleWorkbench component={component} />;
	return (
		<div className='grid gap-4'>
			<ComponentDemo component={component} />
			<CopyableCode code={DEMO_REGISTRY[component].code} />
		</div>
	);
}

type Color = 'primary' | 'secondary' | 'gray' | 'destructive' | 'success' | 'caution';
type Treatment = 'saturated' | 'outline' | 'ghost' | 'tonal' | 'glass' | 'underline';
const COLORS: Color[] = ['primary', 'secondary', 'gray', 'destructive', 'success', 'caution'];
const TREATMENTS: Treatment[] = ['saturated', 'outline', 'ghost', 'tonal', 'glass', 'underline'];
const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const;
function finiteChoices(component: ComponentSlug, prop: string, fallback: readonly string[]): readonly string[] {
	const docs = componentTsDocs[component];
	const member = docs.members.find(item => item.name === docs.demoExport);
	const choices = member?.props.find(item => item.name === prop)?.choices;
	return choices && choices.length > 0 && choices.length <= 20 ? choices : fallback;
}

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

function DemoCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }): React.JSX.Element {
	const id = React.useId();
	return (
		<div className='flex items-center gap-2'>
			<UI.Checkbox id={id} checked={checked} onCheckedChange={value => onChange(value === true)} />
			<UI.Label htmlFor={id}>{label}</UI.Label>
		</div>
	);
}

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
	const snippet = `import { Button } from '@terra-symposium/styling/ui';${icon ? "\nimport { Star } from 'lucide-react';" : ''}\n\n<Button variant='${variant}' size='${size}'${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}${loading && loadingText ? ` loadingText='${loadingText}'` : ''}${iconOnly ? " aria-label='Save'" : ''}>${icon ? "<Star aria-hidden className='size-4' />" : ''}${iconOnly ? '' : 'Save'}</Button>`;
	return (
		<div className='grid gap-4'>
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
			<div className='rounded border p-4'>
				<UI.Button variant={variant} size={size} disabled={disabled} loading={loading} loadingText={loadingText} aria-label={iconOnly ? 'Save' : undefined}>
					{icon ? <Star aria-hidden className='size-4' /> : null}
					{iconOnly ? null : 'Save'}
				</UI.Button>
			</div>
			<CopyableCode code={snippet} />
			<p className='text-xs text-primary-11'>Loading sets aria-busy and disables activation. Icon-only buttons need an accessible label.</p>
		</div>
	);
}

function CardWorkbench(): React.JSX.Element {
	const [color, setColor] = React.useState<Color>('primary');
	const [treatment, setTreatment] = React.useState<Exclude<Treatment, 'underline'>>('tonal');
	const [size, setSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
	const [interactive, setInteractive] = React.useState(false);
	const variant = `${color}-${treatment}` as React.ComponentProps<typeof UI.Card>['variant'];
	const snippet = `import { Card } from '@terra-symposium/styling/ui';\n\n<Card variant='${variant}' size='${size}'${interactive ? " href='#component-example-heading'" : ''}>Project update</Card>`;
	return (
		<div className='grid gap-4'>
			<div className='grid gap-3 sm:grid-cols-3'>
				<DemoSelect label='Color' value={color} choices={COLORS} onChange={value => setColor(value as Color)} />
				<DemoSelect label='Treatment' value={treatment} choices={TREATMENTS.filter(value => value !== 'underline')} onChange={value => setTreatment(value as Exclude<Treatment, 'underline'>)} />
				<DemoSelect label='Size' value={size} choices={finiteChoices('card', 'size', ['xs', 'sm', 'md', 'lg', 'xl'])} onChange={value => setSize(value as typeof size)} />
			</div>
			<DemoCheckbox label='Interactive' checked={interactive} onChange={setInteractive} />
			<div className='rounded border p-4'>
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
			<CopyableCode code={snippet} />
		</div>
	);
}

function CopyableCode({ code }: { code: string }): React.JSX.Element {
	const [copied, setCopied] = React.useState(false);
	return (
		<div className='grid gap-2'>
			<UI.Button
				type='button'
				variant='gray-outline'
				size='xs'
				className='w-fit'
				onClick={() => {
					void navigator.clipboard.writeText(code).then(() => setCopied(true));
				}}
			>
				{copied ? 'Copied' : 'Copy code'}
			</UI.Button>
			<pre className='overflow-x-auto rounded border p-3 text-xs'>
				<code>{code}</code>
			</pre>
		</div>
	);
}

type SimpleControl = { prop: string; label: string; values: readonly string[]; initial: string };
/** Short, safe choices for public states that benefit from side-by-side inspection. */
const SIMPLE_CONTROLS: Partial<Record<ComponentSlug, SimpleControl>> = {
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

function SimpleWorkbench({ component }: { component: ComponentSlug }): React.JSX.Element {
	const control = SIMPLE_CONTROLS[component]!;
	const [value, setValue] = React.useState(control.initial);
	const importName = component === 'alert' ? `Alert${value[0]!.toUpperCase() + value.slice(1)}` : componentTsDocs[component].demoExport;
	let preview: React.ReactNode;
	let code: string;
	switch (component) {
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
			throw new Error(`Missing simple demo for ${component}`);
	}
	return (
		<div className='grid gap-4'>
			<DemoSelect label={control.label} value={value} choices={finiteChoices(component, control.prop, control.values)} onChange={setValue} />
			<div className='rounded border p-4'>{preview}</div>
			<CopyableCode code={`import { ${importName} } from '@terra-symposium/styling/ui';\n\n${code}`} />
		</div>
	);
}
