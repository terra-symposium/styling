/**
 * docs/styling/1-colouring/_components.tsx
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { componentTsDocs } from "../../../dist/cache/component-tsdocs.js";

// COMPONENTS
import * as React from "react";

// DATA
import * as UI from "../../../src/components/ui/index.js";

// TYPES
import type { DataTableColumn } from "../../../src/components/data-table.js";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

/** Component names are generated from the public Styling TypeScript exports. */
type ComponentSlug = keyof typeof componentTsDocs;
const UI_COMPONENTS = UI as unknown as Record<string, React.ElementType>;
/** Keep the rendered section order stable even when the generated API cache changes. */
const GROUP_ORDER = [
  "Actions and forms",
  "Content and feedback",
  "Menus and overlays",
  "Navigation and layout",
  "Data and composition",
] as const;
// prettier-ignore
/**
 * Give generic previews useful, deterministic values. Components needing child
 * composition use a dedicated renderer below instead of these root props.
 */
const DEMO_PROPS: Partial<Record<ComponentSlug, Record<string, unknown>>> = {
  accordion: { type: "single", collapsible: true, defaultValue: "example" },
  alert: { title: "Saved", variant: "success" },
  avatar: { "aria-label": "Kai" },
  badge: { variant: "success-tonal" },
  button: { variant: "primary-default", size: "sm" },
  "button-group": { orientation: "horizontal" },
  calendar: { mode: "single", defaultMonth: new Date(2025, 0, 1), name: "date" },
  checkbox: { checked: true, "aria-label": "Enable notifications" },
  combobox: { opts: [{ value: "design", label: "Design" }], value: "design", placeholder: "Choose a team" },
  command: { open: true },
  dialog: { open: true },
  "form-select": { options: [{ value: "design", label: "Design team" }], name: "team", value: "design" },
  input: { autoComplete: "email", name: "email", placeholder: "you@example.com", type: "email" },
  "input-otp": { maxLength: 4, value: "2048" },
  label: { htmlFor: "component-preview-field" },
  "mapped-form-fields": { fields: [] },
  pagination: { currentPage: 2, totalPages: 5 },
  popover: { open: true },
  progress: { value: 64 },
  "radio-group": { defaultValue: "comfortable" },
  resizable: { direction: "horizontal" },
  select: { value: "design" },
  sheet: { open: true },
  sidebar: { defaultOpen: true },
  slider: { defaultValue: [55], max: 100, name: "volume", step: 1 },
  switch: { checked: true, "aria-label": "Enable notifications" },
  tabs: { defaultValue: "overview" },
  textarea: { name: "note", placeholder: "Write a short note…", rows: 2 },
  toggle: { pressed: true },
  "toggle-group": { type: "single", defaultValue: "center" },
};
/** Each custom renderer composes exported UI parts into a small complete example. */
const COMPONENT_DEMOS: Partial<Record<ComponentSlug, () => React.ReactNode>> = {
  // prettier-ignore
  button: () => (
    <div className="flex flex-wrap items-center gap-2">
      <UI.Button variant="primary-default" size="sm">Continue</UI.Button>
      <UI.Button variant="secondary-outline" size="sm">Cancel</UI.Button>
    </div>
  ),
  input: () => <InputDemo kind="email" />,
  "password-input": () => <InputDemo kind="password" />,
  label: () => <InputDemo kind="label" />,
  badge: () => (
    <div className="flex flex-wrap items-center gap-2">
      <UI.Badge variant="primary-tonal">In progress</UI.Badge>
      <UI.Badge variant="success-tonal">Complete</UI.Badge>
    </div>
  ),
  card: () => <CardDemo />,
  checkbox: () => <CheckControlDemo kind="checkbox" />,
  switch: () => <CheckControlDemo kind="switch" />,
  spinner: () => <UI.Spinner aria-label="Loading" />,
  skeleton: () => <SkeletonDemo />,
  separator: () => <SeparatorDemo />,
  progress: () => <ProgressDemo />,
  hint: () => <HintDemo />,
  "input-otp": () => <OtpDemo />,
  "message-scroller": () => <MessageScrollerDemo />,
  form: () => <FormDemo />,
  select: () => <SelectDemo />,
  "data-table": () => <DataTableDemo />,
};

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Build the shared table columns once per catalog render. Component links stay
 * beneath the Components leaf so Docs keeps that leaf selected on detail pages.
 *
 * @param base - Base URL used to build links that respect the docs site's deployment prefix.
 *
 * @return The component-name and example columns shared by each catalog group.
 */
function createCatalogCols(base: string): DataTableColumn<{
  slug: ComponentSlug;
  title: string;
  description: string;
  group: string;
}>[] {
  return [
    {
      key: "component",
      label: "Component",
      width: "wide-wrapped",
      render: (c) => (
        <div className="grid gap-2">
          <UI.ButtonLink
            href={`${base}styling/1-colouring/2-components/${c.slug}/`}
            size="sm"
            variant="underline"
          >
            {c.title}
          </UI.ButtonLink>
          <p className="text-sm text-primary-11">{c.description}</p>
        </div>
      ),
    },
    {
      key: "example",
      label: "Example",
      width: "wider-wrapped",
      render: (c) => <ComponentDemo component={c.slug} />,
    },
  ];
}

/**
 * Lists generated component metadata and live examples in the shared DataTable.
 *
 * @return A grouped catalog of exported components and their live previews.
 */
export function ComponentCatalog(): React.JSX.Element {
  const components = Object.entries(componentTsDocs).map(([s, d]) => ({
    slug: s as ComponentSlug,
    title: d.title,
    description: d.description.split("\n")[0],
    group: d.group,
  }));
  const cols = createCatalogCols(import.meta.env.BASE_URL);
  return (
    <div className="grid gap-6">
      {GROUP_ORDER.map((g) => {
        const rows = components.filter((c) => c.group === g);
        if (rows.length === 0) return null;
        return (
          <UI.DataTable
            key={g}
            title={g}
            description={`${rows.length} exported components`}
            rows={rows}
            columns={cols}
            rowKey="slug"
          />
        );
      })}
    </div>
  );
}

/**
 * Renders a live preview, falling back to the generated component export.
 *
 * @param props - Component slug used to choose a custom preview or generated fallback.
 *
 * @return The selected component preview, or a neutral label when no demo exists.
 */
export function ComponentDemo({
  component,
}: {
  component: ComponentSlug;
}): React.JSX.Element {
  const customDemo = COMPONENT_DEMOS[component];
  if (customDemo) return <>{customDemo()}</>;
  const docs = componentTsDocs[component];
  const DemoComponent = docs.demoExport
    ? UI_COMPONENTS[docs.demoExport]
    : undefined;

  // A neutral badge keeps newly exported components visible until a demo is added.
  if (!DemoComponent) {
    return <UI.Badge variant="gray-tonal">{docs.title}</UI.Badge>;
  }
  return (
    <DemoComponent {...(DEMO_PROPS[component] ?? {})}>
      {docs.title}
    </DemoComponent>
  );
}

/**
 * Shared labelled control preview for text, email, and password examples.
 *
 * @param props - Control kind to render as an email, password, or label example.
 *
 * @return A labelled control preview matching the selected kind.
 */
function InputDemo({
  kind,
}: {
  kind: "email" | "password" | "label";
}): React.JSX.Element {
  const id = `component-preview-${kind}`;
  const LABELS = {
    email: "Email",
    password: "Password",
    label: "Project name",
  } as const;
  return (
    <div className="grid w-full max-w-sm gap-2">
      <UI.Label htmlFor={id}>{LABELS[kind]}</UI.Label>
      <UI.Input
        autoComplete={kind === "email" ? "email" : undefined}
        id={id}
        name={kind}
        placeholder={kind === "email" ? "you@example.com" : undefined}
        type={
          kind === "email" ? "email" : kind === "password" ? "password" : "text"
        }
        defaultValue={kind === "label" ? "Styling docs" : undefined}
      />
    </div>
  );
}

/**
 * A complete tonal card preview with its exported subcomponents.
 *
 * @return A tonal project card composed from the exported card parts.
 */
function CardDemo(): React.JSX.Element {
  return (
    <UI.Card variant="primary-tonal" className="w-full max-w-sm">
      <UI.CardHeader>
        <UI.CardTitle>Project update</UI.CardTitle>
        <UI.CardDescription>Everything is ready to review.</UI.CardDescription>
      </UI.CardHeader>
      <UI.CardContent>
        <UI.Button size="sm">Open project</UI.Button>
      </UI.CardContent>
    </UI.Card>
  );
}

/**
 * Shared checkbox and switch preview for the same setting.
 *
 * @param props - Control kind to render as a checkbox or switch.
 *
 * @return A labelled checkbox or switch example with a short description.
 */
function CheckControlDemo({
  kind,
}: {
  kind: "checkbox" | "switch";
}): React.JSX.Element {
  return (
    <label className="flex items-center gap-2">
      {kind === "checkbox" ? (
        <UI.Checkbox checked aria-label="Enable notifications" />
      ) : (
        <UI.Switch checked aria-label="Enable notifications" />
      )}
      <span>Enable notifications</span>
    </label>
  );
}

/**
 * Shows the shared Skeleton component in its intended placeholder role.
 *
 * @return The shared Skeleton component with a title and supporting text.
 */
function SkeletonDemo(): React.JSX.Element {
  return (
    <div className="grid gap-2">
      <UI.Skeleton className="h-3 w-32" />
      <UI.Skeleton className="h-3 w-20" />
    </div>
  );
}

/**
 * Adds labels around the separator so its placement is clear in the preview.
 *
 * @return Two labelled sections separated by the exported Separator component.
 */
function SeparatorDemo(): React.JSX.Element {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <span>Account</span>
      <UI.Separator />
      <span>Preferences</span>
    </div>
  );
}

/**
 * Adds a short caption to the progress bar example.
 *
 * @return A labelled Progress component showing a fixed completion value.
 */
function ProgressDemo(): React.JSX.Element {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <span>Upload progress</span>
      <UI.Progress value={64} />
    </div>
  );
}

/**
 * Shows how Hint augments an existing interactive control.
 *
 * @return A shared Input paired with the exported Hint component.
 */
function HintDemo(): React.JSX.Element {
  return (
    <UI.Hint content="Add a short explanation for this setting.">
      <UI.Button variant="secondary-outline" size="sm">
        What is this?
      </UI.Button>
    </UI.Hint>
  );
}

/**
 * Uses an input for the OTP value to avoid adding a custom segmented-input style.
 *
 * @return An OTP input preview with the expected number of digits.
 */
function OtpDemo(): React.JSX.Element {
  return (
    <UI.Input
      aria-label="Verification code"
      className="w-40 text-center tracking-[0.5em]"
      name="verification-code"
      readOnly
      value="2048"
    />
  );
}

/**
 * Shows incoming and outgoing messages in the shared message-scroller group.
 *
 * @return A message scroller with example incoming and outgoing messages.
 */
function MessageScrollerDemo(): React.JSX.Element {
  return (
    <UI.MessageGroup className="w-full max-w-72">
      <UI.Message align="start">
        <UI.MessageContent>
          <UI.MessageHeader>Today · 10:42</UI.MessageHeader>
          Design review is ready.
        </UI.MessageContent>
      </UI.Message>
      <UI.Message align="end">
        <UI.MessageContent>Thanks, I’ll take a look.</UI.MessageContent>
      </UI.Message>
    </UI.MessageGroup>
  );
}

/**
 * Composes the shared form primitives for a basic name field.
 *
 * @return A name field composed from the exported form primitives.
 */
function FormDemo(): React.JSX.Element {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <UI.Label htmlFor="component-preview-name">Name</UI.Label>
      <UI.Input
        id="component-preview-name"
        name="display-name"
        defaultValue="Kai"
      />
      <p className="text-sm text-primary-11">Enter your display name.</p>
    </div>
  );
}

/**
 * Shows Select with one selected option and its shared trigger parts.
 *
 * @return A Select preview with one selected option and its shared trigger parts.
 */
function SelectDemo(): React.JSX.Element {
  return (
    <UI.Select value="design">
      <UI.SelectTrigger aria-label="Team">
        <UI.SelectValue placeholder="Choose a team" />
      </UI.SelectTrigger>
      <UI.SelectContent>
        <UI.SelectItem value="design">Design team</UI.SelectItem>
      </UI.SelectContent>
    </UI.Select>
  );
}

/**
 * A compact DataTable example for the DataTable catalog entry itself.
 *
 * @return A compact DataTable showing the catalog's shared table component.
 */
function DataTableDemo(): React.JSX.Element {
  return (
    <UI.DataTable
      title="Team members"
      description="Two people in the design team"
      rows={[{ name: "Kai", role: "Designer" }]}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
      ]}
    />
  );
}

/**
 * Builds the generated API columns for a component reference page.
 *
 * @return Name, signature, description, and tags for the selected component API.
 */
function createApiCols(): DataTableColumn<
  (typeof componentTsDocs)[ComponentSlug]["members"][number]
>[] {
  return [
    {
      key: "name",
      label: "API member",
      width: "wide-wrapped",
      render: (m) => (
        <div className="grid gap-1">
          <strong>{m.name}</strong>
          {m.summary ? <span>{m.summary}</span> : null}
          {m.tags.length > 0 ? (
            <span className="text-sm text-primary-11">
              {m.tags.map((t) => `@${t.name} ${t.text}`).join(" · ")}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "signature",
      label: "TypeScript signature",
      width: "wider-wrapped",
      render: (m) => (
        <code className="whitespace-pre-wrap break-words">{m.signature}</code>
      ),
    },
  ];
}

/**
 * Renders the source metadata, live example, and generated TypeScript API table.
 *
 * @param props - Component slug whose source, example, and generated API are displayed.
 *
 * @return The full component reference content for the selected component.
 */
export function ComponentReference({
  component,
}: {
  component: ComponentSlug;
}): React.JSX.Element {
  const docs = componentTsDocs[component];
  const importName =
    docs.demoExport ?? docs.members[0]?.name ?? docs.title.replaceAll(" ", "");
  const importLine = `import { ${importName} } from "@terra-symposium/styling/ui";`;
  return (
    <div className="grid gap-6">
      <p>{docs.description}</p>
      <p>
        Source: <code>{docs.source}</code>
        {docs.shadcnUrl && (
          <a href={docs.shadcnUrl} target="_blank" rel="noreferrer">
            shadcn/ui reference
          </a>
        )}
      </p>
      <section
        className="grid gap-3"
        aria-labelledby="component-example-heading"
      >
        <h2 id="component-example-heading">Example</h2>
        <UI.Card variant="gray-outline" size="sm">
          <UI.CardContent className="grid gap-4">
            <ComponentDemo component={component} />
            <pre className="max-w-full overflow-x-auto">
              <code>{importLine}</code>
            </pre>
          </UI.CardContent>
        </UI.Card>
      </section>
      <section className="grid gap-3" aria-labelledby="component-api-heading">
        <h2 id="component-api-heading">TypeScript API</h2>
        <UI.DataTable
          title={`${docs.title} API`}
          description="Generated from the exported TypeScript API"
          rows={docs.members}
          columns={createApiCols()}
          rowKey="name"
        />
      </section>
    </div>
  );
}
