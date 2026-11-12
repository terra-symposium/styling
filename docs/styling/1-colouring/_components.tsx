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
const TEXT_SM_TEXT_PRIMARY_11_CLASS = "text-sm text-primary-11";
const GRID_W_FULL_MAX_W_SM_GAP_2_CLASS = "grid w-full max-w-sm gap-2";

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
  textarea: { name: "note", placeholder: "Write a short note…", rows: 2 },
  toggle: { pressed: true },
  "toggle-group": { type: "single", defaultValue: "center" },
};
/** Each custom renderer composes exported UI parts into a small complete example. */
const COMPONENT_DEMOS: Partial<Record<ComponentSlug, () => React.ReactNode>> = {
  button: ButtonDemo,
  input: EmailInputDemo,
  "password-input": PasswordInputDemo,
  label: LabelInputDemo,
  badge: BadgeDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  switch: SwitchDemo,
  spinner: SpinnerDemo,
  skeleton: SkeletonDemo,
  separator: SeparatorDemo,
  progress: ProgressDemo,
  hint: HintDemo,
  accordion: AccordionDemo,
  tabs: TabsDemo,
  "input-otp": OtpDemo,
  "message-scroller": MessageScrollerDemo,
  form: FormDemo,
  select: SelectDemo,
  "data-table": DataTableDemo,
};

/** Shows the shared accordion with two independently expandable sections.
 *
 * @return The two-section accordion example used by the component catalog.
 */
function AccordionDemo(): React.JSX.Element {
  return (
    <UI.Accordion
      type="single"
      collapsible
      defaultValue="overview"
      className="w-full"
    >
      <UI.AccordionItem value="overview">
        <UI.AccordionTrigger>Project overview</UI.AccordionTrigger>
        <UI.AccordionContent>
          Review the project status, owner, and next milestone.
        </UI.AccordionContent>
      </UI.AccordionItem>
      <UI.AccordionItem value="activity">
        <UI.AccordionTrigger>Recent activity</UI.AccordionTrigger>
        <UI.AccordionContent>
          The team updated the project plan this morning.
        </UI.AccordionContent>
      </UI.AccordionItem>
    </UI.Accordion>
  );
}

/** Shows the shared tabs with an overview and activity panel.
 *
 * @return The two-panel tab example used by the component catalog.
 */
function TabsDemo(): React.JSX.Element {
  return (
    <UI.Tabs defaultValue="overview" className="w-full">
      <UI.TabsList aria-label="Project details">
        <UI.TabsTrigger value="overview">Overview</UI.TabsTrigger>
        <UI.TabsTrigger value="activity">Activity</UI.TabsTrigger>
      </UI.TabsList>
      <UI.TabsContent value="overview">
        <p>Review the project status, owner, and next milestone.</p>
      </UI.TabsContent>
      <UI.TabsContent value="activity">
        <p>The team updated the project plan this morning.</p>
      </UI.TabsContent>
    </UI.Tabs>
  );
}

/** Shows the primary and secondary button variants together.
 * @return The two-button example used by the component catalog.
 */
function ButtonDemo(): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <UI.Button variant="primary-default" size="sm">
        Continue
      </UI.Button>
      <UI.Button variant="secondary-outline" size="sm">
        Cancel
      </UI.Button>
    </div>
  );
}

/** Shows the shared input configured for email entry.
 * @return An email field preview.
 */
function EmailInputDemo(): React.JSX.Element {
  return <InputDemo kind="email" />;
}

/** Shows the shared input configured for password entry.
 * @return A password field preview.
 */
function PasswordInputDemo(): React.JSX.Element {
  return <InputDemo kind="password" />;
}

/** Shows the shared label connected to a text input.
 * @return A labelled project-name field preview.
 */
function LabelInputDemo(): React.JSX.Element {
  return <InputDemo kind="label" />;
}

/** Shows primary and success badge treatments side by side.
 * @return Two badge variants in a wrapping row.
 */
function BadgeDemo(): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <UI.Badge variant="primary-tonal">In progress</UI.Badge>
      <UI.Badge variant="success-tonal">Complete</UI.Badge>
    </div>
  );
}

/** Shows the checkbox control used by the notification setting example.
 * @return A notification checkbox preview.
 */
function CheckboxDemo(): React.JSX.Element {
  return <CheckControlDemo kind="checkbox" />;
}

/** Shows the switch control used by the notification setting example.
 * @return A notification switch preview.
 */
function SwitchDemo(): React.JSX.Element {
  return <CheckControlDemo kind="switch" />;
}

/** Shows a labelled spinner in its loading state.
 * @return The loading spinner preview.
 */
function SpinnerDemo(): React.JSX.Element {
  return <UI.Spinner aria-label="Loading" />;
}

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
  /** Renders a linked component name and its short description. */
  function renderComponentCell(c: {
    slug: ComponentSlug;
    title: string;
    description: string;
    group: string;
  }): React.JSX.Element {
    return (
      <div className="grid gap-2">
        <UI.ButtonLink
          href={`${base}styling/1-colouring/2-components/${c.slug}/`}
          size="sm"
          variant="underline"
        >
          {c.title}
        </UI.ButtonLink>
        <p className={TEXT_SM_TEXT_PRIMARY_11_CLASS}>{c.description}</p>
      </div>
    );
  }
  /** Renders the live component example in the catalog's example column. */
  function renderExampleCell(c: {
    slug: ComponentSlug;
    title: string;
    description: string;
    group: string;
  }): React.JSX.Element {
    return <ComponentDemo component={c.slug} />;
  }
  return [
    {
      key: "component",
      label: "Component",
      width: "wide-wrapped",
      render: renderComponentCell,
    },
    {
      key: "example",
      label: "Example",
      width: "wider-wrapped",
      render: renderExampleCell,
    },
  ];
}

/**
 * Lists generated component metadata and live examples in the shared DataTable.
 *
 * @return A grouped catalog of exported components and their live previews.
 */
export function ComponentCatalog(): React.JSX.Element {
  const components: {
    slug: ComponentSlug;
    title: string;
    description: string;
    group: string;
  }[] = [];
  for (const [slug, docs] of Object.entries(componentTsDocs)) {
    components.push({
      slug: slug as ComponentSlug,
      title: docs.title,
      description: docs.description.split("\n")[0],
      group: docs.group,
    });
  }
  const cols = createCatalogCols(import.meta.env.BASE_URL);
  const groups: React.ReactNode[] = [];
  for (const group of GROUP_ORDER) {
    const rows = components.filter(isInGroup(group));
    if (rows.length === 0) continue;
    groups.push(
      <UI.DataTable
        key={group}
        title={group}
        description={`${rows.length} exported components`}
        rows={rows}
        columns={cols}
        rowKey="slug"
      />,
    );
  }
  return <div className="grid gap-6">{groups}</div>;
}

/** Creates a predicate selecting catalog components in one documentation group.
 *
 * @param group - Documentation group to match.
 *
 * @return A predicate that matches component records in the selected group.
 */
function isInGroup(group: string): (component: { group: string }) => boolean {
  /** Checks whether a component belongs to the captured group. */
  function matchesGroup(component: { group: string }): boolean {
    return component.group === group;
  }
  return matchesGroup;
}

/**
 * Renders a live preview, falling back to the generated component export.
 *
 * @param component - Component slug used to choose a custom preview or generated fallback.
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
 * @param kind - Control kind to render as an email, password, or label example.
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
    <div className={GRID_W_FULL_MAX_W_SM_GAP_2_CLASS}>
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
 * @param kind - Control kind to render as a checkbox or switch.
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
    <div className={GRID_W_FULL_MAX_W_SM_GAP_2_CLASS}>
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
    <div className={GRID_W_FULL_MAX_W_SM_GAP_2_CLASS}>
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
    <div className={GRID_W_FULL_MAX_W_SM_GAP_2_CLASS}>
      <UI.Label htmlFor="component-preview-name">Name</UI.Label>
      <UI.Input
        id="component-preview-name"
        name="display-name"
        defaultValue="Kai"
      />
      <p className={TEXT_SM_TEXT_PRIMARY_11_CLASS}>Enter your display name.</p>
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
  /** Describes one generated API member in the component-reference table. */
  type ApiMember = (typeof componentTsDocs)[ComponentSlug]["members"][number];
  /** Renders the member name, summary, and documented TSDoc tags. */
  function renderMemberName(member: ApiMember): React.JSX.Element {
    const tags: string[] = [];
    for (const tag of member.tags) tags.push(`@${tag.name} ${tag.text}`);
    return (
      <div className="grid gap-1">
        <strong>{member.name}</strong>
        {member.summary ? <span>{member.summary}</span> : null}
        {tags.length > 0 ? (
          <span className={TEXT_SM_TEXT_PRIMARY_11_CLASS}>
            {tags.join(" · ")}
          </span>
        ) : null}
      </div>
    );
  }
  /** Renders the member's TypeScript declaration as formatted code. */
  function renderMemberSignature(member: ApiMember): React.JSX.Element {
    return (
      <code className="whitespace-pre-wrap break-words">
        {member.signature}
      </code>
    );
  }
  return [
    {
      key: "name",
      label: "API member",
      width: "wide-wrapped",
      render: renderMemberName,
    },
    {
      key: "signature",
      label: "TypeScript signature",
      width: "wider-wrapped",
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
