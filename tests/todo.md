# Complete repository test plan: styling

This checklist inventories repository-owned functions, documents, and configuration as of the current working tree. It is a plan, not a claim that every item is already tested. Update it when an owned source or document changes.

## Scope and method

- Function entries identify the source path and line. Exercise the stated normal, edge, and failure scenarios; link or add assertions as each entry is completed.
- Document entries require rendering, link checking, and content review. Execute documented commands against the current repository.
- Generated output, dependencies, vendored trees, bundled course viewers, and Portfolio pinned `projects/` snapshots are covered through build, package, and integration checks rather than individual upstream functions. Keep those boundaries under review when their inputs change.
- Put produced reports, screenshots, traces, and coverage under `tests/results/`.

## Function and executable source inventory

### `config/eslint.config.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/prettier.config.cjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/styling-docs-astro.mjs`

- [ ] `isDocsPackageFolder` (line 14): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `toStylingAliasEntry` (line 24): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `config/tailwind.global.config.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/tailwind.postcss.config.cjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `docs/styling/1-colouring/_components.tsx`

- [ ] `AccordionDemo` (line 95): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `TabsDemo` (line 114): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `ButtonDemo` (line 134): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `EmailInputDemo` (line 150): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `PasswordInputDemo` (line 157): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `LabelInputDemo` (line 164): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `BadgeDemo` (line 171): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CheckboxDemo` (line 183): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SwitchDemo` (line 190): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SpinnerDemo` (line 197): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `createCatalogCols` (line 213): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `renderComponentCell` (line 225): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderExampleCell` (line 241): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ComponentCatalog` (line 265): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `isInGroup` (line 296): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `matchesGroup` (line 303): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `ComponentDemo` (line 316): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `InputDemo` (line 336): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CardDemo` (line 363): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CheckControlDemo` (line 384): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SkeletonDemo` (line 398): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SeparatorDemo` (line 412): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `ProgressDemo` (line 427): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `HintDemo` (line 441): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `OtpDemo` (line 456): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MessageScrollerDemo` (line 465): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `FormDemo` (line 486): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SelectDemo` (line 501): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `DataTableDemo` (line 519): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `createApiCols` (line 538): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `renderMemberName` (line 547): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderMemberSignature` (line 564): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ComponentReference` (line 590): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `docs/styling/1-colouring/_matrix.tsx`

- [ ] `VariantExample` (line 49): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `createButtonCols` (line 63): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `createButtonCol` (line 75): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderButtonExample` (line 82): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `createCardCols` (line 109): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `createCardCol` (line 121): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `renderCardExample` (line 128): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ButtonTreatmentMatrix` (line 151): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardTreatmentMatrix` (line 170): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `scripts/clean-build.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `scripts/compile-effects.cjs`

- [ ] `main` (line 9): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleFailure` (line 19): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `scripts/create-document-templates.mjs`

- [ ] `createPowerPointTemplate` (line 98): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.

### `scripts/generate-component-tsdocs.mjs`

- [ ] `addGroup` (line 45): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `compEntries` (line 95): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `displayParts` (line 111): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `titleFromSlug` (line 125): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `capitalizeWord` (line 132): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `describeExport` (line 147): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `fmtSignature` (line 158): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `serializeTag` (line 167): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `isComponentExport` (line 203): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `trimLine` (line 212): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `isSummaryLine` (line 221): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `scripts/quality-runner.mjs`

- [ ] `callback@18` (line 18): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `callback@45` (line 45): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `isBuildOrTest` (line 50): Run on clean input; verify deterministic output and a useful failure on invalid input. No direct test file is linked yet.
- [ ] `callback@53` (line 53): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `callback@55` (line 55): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `scripts/run-docs-site.mjs`

- [ ] `isDocsFolder` (line 31): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `run` (line 63): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleSpawnErr` (line 84): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleChildExit` (line 93): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `registerSignalForwarder` (line 101): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `forwardSignal` (line 103): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `scripts/serve-docs-preview.mjs`

- [ ] `handleRequest` (line 49): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `logServerStarted` (line 83): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `resolveFile` (line 98): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `scripts/terra-quality.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `site/src/pages/404.astro`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `site/src/pages/[...slug].astro`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `site/src/pages/styling/1-colouring/2-components/[component].astro`

- [ ] `getStaticPaths` (line 10): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `callback@11` (line 11): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/data-table.tsx`

- [ ] `cellContentClass` (line 88): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `DataTableRow` (line 107): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderCell` (line 125): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DataTableContent` (line 172): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderColHeader` (line 208): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTableRow` (line 223): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DataTable` (line 310): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/docs/toolbar-frame.tsx`

- [ ] `DocsToolbarFrame` (line 26): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/field.tsx`

- [ ] `Field` (line 64): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `FieldLabel` (line 85): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `FieldDescription` (line 107): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `FieldError` (line 133): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/forms.tsx`

- [ ] `formLayoutClassName` (line 186): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `FormFieldLayout` (line 212): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `FormErrText` (line 317): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `MappedFormFieldError` (line 345): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `MappedFormControl` (line 359): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `handleInputChange` (line 377): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `handleTextareaChange` (line 440): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `handleCheckedChange` (line 467): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `renderRadioOption` (line 491): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `MappedFormFields` (line 522): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `renderField` (line 546): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `ConfirmationActions` (line 588): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).

### `src/components/ui/accordion.tsx`

- [ ] `useAccordionVariant` (line 53): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `AccordionItemRender` (line 63): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AccordionTriggerRender` (line 91): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AccordionContentRender` (line 134): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `Accordion` (line 180): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/alert-dialog.tsx`

- [ ] `AlertDialog` (line 36): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogPortal` (line 47): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogOverlay` (line 59): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogContent` (line 81): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogHeader` (line 123): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogFooter` (line 144): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogTitle` (line 165): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogDescription` (line 183): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogAction` (line 206): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AlertDialogCancel` (line 238): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/alert.tsx`

- [ ] `renderAlert` (line 34): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderAlertTitle` (line 70): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderAlertDescription` (line 88): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `statusAlert` (line 121): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `AlertError` (line 141): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `AlertSuccess` (line 152): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `AlertWarning` (line 163): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `AlertInfo` (line 174): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/avatar.tsx`

- [ ] `renderAvatarRoot` (line 37): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderAvatarImage` (line 52): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderAvatarFallback` (line 62): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/badge.tsx`

- [ ] `Badge` (line 56): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/bubble.tsx`

- [ ] `Bubble` (line 55): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `BubbleContent` (line 75): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/button-group.tsx`

- [ ] `ButtonGroup` (line 56): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/button.tsx`

- [ ] `ButtonRender` (line 38): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ButtonLinkRender` (line 95): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/calendar.tsx`

- [ ] `formatMonthDropdown` (line 34): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CalendarRoot` (line 46): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CalendarChevron` (line 58): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CalendarWeekNumber` (line 71): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `getNavButtonClassName` (line 98): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `Calendar` (line 135): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CalendarDayButton` (line 312): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `focusDayButton` (line 317): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/card.tsx`

- [ ] `CardRender` (line 91): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardSummary` (line 250): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CardHeaderRender` (line 260): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardTitleRender` (line 302): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardHeadingRender` (line 335): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardDescriptionRender` (line 376): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardActionRender` (line 421): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardTextRender` (line 432): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardQuoteRender` (line 461): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardMetaRender` (line 491): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardContentRender` (line 527): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CardFooterRender` (line 541): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/carousel.tsx`

- [ ] `CarouselRender` (line 33): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `updateCarouselSelection` (line 42): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `moveToPreviousSlide` (line 49): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `moveToNextSlide` (line 54): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `publishCarouselApi` (line 59): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `subscribeToCarouselSelection` (line 67): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `removeCarouselSelectionListener` (line 75): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `handleCarouselKeyDown` (line 83): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderCarouselContent` (line 119): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCarouselItem` (line 140): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCarouselPrevious` (line 157): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCarouselNext` (line 191): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `useCarousel` (line 232): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/checkbox.tsx`

- [ ] `updateCheckboxValue` (line 46): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `renderCheckbox` (line 66): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `initializeFormValue` (line 71): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `handleCheckedChange` (line 81): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderCheckboxIndicator` (line 118): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/collapsible.tsx`

- [ ] `Collapsible` (line 28): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CollapsibleTrigger` (line 39): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `CollapsibleContent` (line 50): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/combobox.tsx`

- [ ] `ignoreValueChange` (line 24): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `findOption` (line 33): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `Combobox` (line 62): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `reportClearedSelection` (line 99): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleSearchClear` (line 105): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `handleOptionSelect` (line 113): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderOptionItem` (line 125): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/command.tsx`

- [ ] `renderCommandRoot` (line 36): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CommandDialog` (line 52): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCommandInput` (line 85): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCommandList` (line 125): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCommandEmpty` (line 141): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCommandGroup` (line 156): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCommandSeparator` (line 182): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCommandItem` (line 201): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CommandShortcut` (line 230): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SearchEmpty` (line 246): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `SearchDialog` (line 281): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/context-menu.tsx`

- [ ] `ContextMenuSubTriggerRender` (line 58): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ContextMenuSubContentRender` (line 90): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ContextMenuContentRender` (line 115): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ContextMenuItemRender` (line 146): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ContextMenuCheckboxItemRender` (line 173): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ContextMenuRadioItemRender` (line 205): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ContextMenuLabelRender` (line 234): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ContextMenuSeparatorRender` (line 260): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `ContextMenuShortcutRender` (line 277): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/dialog.tsx`

- [ ] `renderDialogTrigger` (line 44): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderDialogOverlay` (line 73): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderDialogContent` (line 101): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DialogHeader` (line 199): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DialogFooter` (line 222): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderDialogTitle` (line 260): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderDialogDescription` (line 276): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/drawer.tsx`

- [ ] `DrawerOverlayRender` (line 34): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DrawerContentRender` (line 49): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DrawerTitleRender` (line 79): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DrawerDescriptionRender` (line 93): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `Drawer` (line 116): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `DrawerHeader` (line 128): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `DrawerFooter` (line 140): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/dropdown-menu.tsx`

- [ ] `DropdownMenuSubTriggerRender` (line 56): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DropdownMenuSubContentRender` (line 84): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DropdownMenuContentRender` (line 110): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DropdownMenuItemRender` (line 143): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DropdownMenuCheckboxItemRender` (line 186): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DropdownMenuRadioItemRender` (line 215): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DropdownMenuLabelRender` (line 244): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DropdownMenuSeparatorRender` (line 267): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DropdownMenuShortcutRender` (line 284): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/empty.tsx`

- [ ] `Empty` (line 45): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleDragOver` (line 100): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleDragLeave` (line 109): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleDrop` (line 117): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleFileChange` (line 128): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `EmptyState` (line 169): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/form-select.tsx`

- [ ] `toPrimitiveValue` (line 54): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `FormSelect` (line 92): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `getInitialValue` (line 140): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `initializeFormField` (line 145): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `handleValueChange` (line 157): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderOption` (line 174): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `FormSelectOption` (line 215): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `FormSelectOpts` (line 230): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderOption` (line 237): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/form.tsx`

- [ ] `useOptionalFormContext` (line 54): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `useFormField` (line 69): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `FormField` (line 90): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `FormItemRender` (line 105): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `FormLabelRender` (line 120): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `FormControlRender` (line 132): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `FormDescriptionRender` (line 143): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).
- [ ] `FormMessageRender` (line 155): Render each state; check interactions, accessibility, loading, and error behavior. Candidate coverage: [`tests/components/ui/forms.test.ts`](../tests/components/ui/forms.test.ts).

### `src/components/ui/hint.tsx`

- [ ] `Hint` (line 30): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/index.ts`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/components/ui/input-otp.tsx`

- [ ] `renderInputOTP` (line 32): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderInputOTPGroup` (line 54): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderInputOTPSlot` (line 69): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderInputOTPSeparator` (line 102): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/input.tsx`

- [ ] `renderInput` (line 34): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `normalizeRegisteredValue` (line 41): Test valid, malformed, empty, and boundary input; assert exact output or error. No direct test file is linked yet.
- [ ] `attachInputRef` (line 53): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleInputChange` (line 62): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleInputBlur` (line 70): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `clearInput` (line 77): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/label.tsx`

- [ ] `renderLabel` (line 34): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/marquee.tsx`

- [ ] `invertPauseState` (line 40): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `Marquee` (line 67): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `setupLayoutEffect` (line 99): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `updateLayout` (line 103): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `updateOnNextFrame` (line 135): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `cleanupLayoutEffect` (line 139): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `createRowTerms` (line 160): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `togglePaused` (line 177): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleKeyDown` (line 186): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderRow` (line 199): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/message-scroller.tsx`

- [ ] `MessageScrollerProvider` (line 28): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MessageScroller` (line 40): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MessageScrollerViewport` (line 52): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MessageScrollerContent` (line 64): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MessageScrollerItem` (line 77): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/message.tsx`

- [ ] `MessageGroup` (line 28): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `Message` (line 41): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MessageContent` (line 59): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MessageHeader` (line 71): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/pagination.tsx`

- [ ] `Pagination` (line 30): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `PaginationContentRender` (line 39): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `PaginationItemRender` (line 51): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `PaginationLink` (line 70): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `preventDisabledPaginationNavigation` (line 87): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `PaginationPrevious` (line 112): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `PaginationNext` (line 129): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/password-input.tsx`

- [ ] `renderPasswordInput` (line 35): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `invertVisibility` (line 45): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `toggleVisibility` (line 51): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/popover.tsx`

- [ ] `stopContentScrollPropagation` (line 36): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderPopoverContent` (line 45): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/portal-container.tsx`

- [ ] `usePortalContainer` (line 29): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `PortalContainerProvider` (line 45): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/progress.tsx`

- [ ] `Progress` (line 34): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/radio-group.tsx`

- [ ] `renderRadioGroup` (line 63): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `initializeRadioValue` (line 73): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleRadioValueChange` (line 83): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderRadioGroupItem` (line 123): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderRadioGroupCard` (line 170): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderRadioGroupIndicator` (line 216): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/resizable.tsx`

- [ ] `ResizableGrip` (line 30): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/scroll-area.tsx`

- [ ] `renderScrollArea` (line 35): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderScrollBar` (line 83): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/select.tsx`

- [ ] `Select` (line 43): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SelectTriggerRender` (line 82): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SelectScrollUpButtonRender` (line 142): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SelectScrollDownButtonRender` (line 170): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SelectContentRender` (line 199): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SelectLabelRender` (line 250): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SelectItemRender` (line 270): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SelectSeparatorRender` (line 325): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/separator.tsx`

- [ ] `renderSeparator` (line 28): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/sheet.tsx`

- [ ] `SheetOverlayRender` (line 37): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SheetContentRender` (line 54): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SheetHeader` (line 108): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SheetFooter` (line 119): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SheetTitleRender` (line 134): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SheetDescriptionRender` (line 152): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/sidebar.tsx`

- [ ] `useSidebar` (line 49): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SidebarProviderRender` (line 64): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `subscribeToMobileBreakpoint` (line 79): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `updateMobileState` (line 84): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `removeMobileBreakpointListener` (line 88): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `applySidebarOpenState` (line 106): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `invertSidebarOpenState` (line 121): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `toggleSidebarState` (line 125): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleSidebarShortcut` (line 137): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `subscribeToSidebarShortcut` (line 148): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `removeSidebarShortcut` (line 150): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `createSidebarContextValue` (line 161): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `SidebarRender` (line 220): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarTriggerClick` (line 315): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SidebarTriggerRender` (line 325): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `handleClick` (line 333): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SidebarRailRender` (line 359): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarInsetRender` (line 392): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarInputRender` (line 415): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarHeaderRender` (line 428): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarFooterRender` (line 442): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarSeparatorRender` (line 456): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarContentRender` (line 469): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `updateSidebarScrollState` (line 478): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `initializeSidebarScroll` (line 492): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `attachSidebarScrollElement` (line 502): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SidebarGroupRender` (line 549): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarGroupLabelRender` (line 571): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarGroupActionRender` (line 597): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarGroupContentRender` (line 615): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarMenuRender` (line 629): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarMenuItemRender` (line 643): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarMenuButtonRender` (line 686): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarMenuActionRender` (line 718): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarMenuBadgeRender` (line 741): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarMenuSkeletonRender` (line 769): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `createSkeletonWidth` (line 776): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `SidebarMenuSubRender` (line 796): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarMenuSubItemRender` (line 810): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `SidebarMenuSubButtonRender` (line 823): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/skeleton.tsx`

- [ ] `Skeleton` (line 28): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/slider.tsx`

- [ ] `Slider` (line 44): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `getSliderValues` (line 59): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `renderThumb` (line 70): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderSliderTrack` (line 123): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderSliderRange` (line 142): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderSliderThumb` (line 161): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/sonner.tsx`

- [ ] `Toaster` (line 30): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/spinner.tsx`

- [ ] `Spinner` (line 28): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/switch.tsx`

- [ ] `renderSwitch` (line 30): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderSwitchThumb` (line 71): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/table.tsx`

- [ ] `renderTable` (line 25): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTableHeader` (line 39): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTableBody` (line 49): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTableFooter` (line 59): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTableRow` (line 69): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTableHead` (line 79): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTableCell` (line 89): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTableCaption` (line 99): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/tabs.tsx`

- [ ] `renderTabsList` (line 42): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTabsTrigger` (line 78): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTabsContent` (line 108): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/textarea.tsx`

- [ ] `renderTextarea` (line 40): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `attachTextareaRef` (line 48): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleTextareaChange` (line 57): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleTextareaBlur` (line 65): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/toggle-group.tsx`

- [ ] `renderToggleGroup` (line 38): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderToggleGroupItem` (line 75): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/toggle.tsx`

- [ ] `renderToggle` (line 32): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/tooltip.tsx`

- [ ] `renderTooltipContent` (line 64): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `TextTooltip` (line 101): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `Arrow` (line 147): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/types.ts`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/components/ui/variants.ts`

- [ ] `flattenColorTypeGrid` (line 31): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/components/ui/variants.test.ts`](../tests/components/ui/variants.test.ts).

### `src/documents/document.ts`

- [ ] `createWordTemplate` (line 48): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `colorFill` (line 79): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `runText` (line 87): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `paragraph` (line 96): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `heading` (line 104): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `cell` (line 123): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `makeTable` (line 148): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `tableText` (line 163): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `tableTotal` (line 175): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `writeWordTemplate` (line 672): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `editWordTemplate` (line 688): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `replaceWordText` (line 703): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `escapeXml` (line 729): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/documents/index.ts`

- [ ] `resolveDocumentTemplate` (line 45): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/documents/presentation.ts`

- [ ] `officeColor` (line 63): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `scaleToken` (line 74): Test valid, malformed, empty, and boundary input; assert exact output or error. No direct test file is linked yet.
- [ ] `colorChannelToHex` (line 87): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `textOptions` (line 100): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `addText` (line 119): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `logoMasterObjects` (line 131): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `createPresentationTemplate` (line 179): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `writeBrandedPresentation` (line 204): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `registerMaster` (line 220): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `registerEditableMaster` (line 260): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `cell` (line 439): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `applyPresentationBrand` (line 533): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `editPresentationTemplate` (line 549): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `isSlidePart` (line 556): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `replaceOfficeText` (line 574): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `finalizePresentation` (line 607): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `removeMissingOverride` (line 619): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `escapeXml` (line 667): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/documents/spreadsheet.ts`

- [ ] `argb` (line 38): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `createSpreadsheetTemplate` (line 49): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `editSpreadsheetTemplate` (line 236): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `styleHeader` (line 267): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `fillRegion` (line 293): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `styleTableBorders` (line 317): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/documents/theme.ts`

- [ ] `hex` (line 73): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `token` (line 88): Test valid, malformed, empty, and boundary input; assert exact output or error. No direct test file is linked yet.
- [ ] `createDocumentBrand` (line 101): Test successful mutation, duplicate/conflict, validation, and failed-write behavior. No direct test file is linked yet.
- [ ] `randomDocumentHue` (line 162): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/lib/cn.ts`

- [ ] `appendChildText` (line 26): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `cn` (line 40): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `transformChildrenToString` (line 50): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `childToString` (line 61): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/lib/hue.ts`

- [ ] `getHue` (line 26): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `colors` (line 77): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `toRgbTriplet` (line 101): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `invert` (line 155): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `isDarkMode` (line 168): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `applyHue` (line 186): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `flattenColors` (line 224): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `reduce` (line 235): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getScales` (line 251): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getOklab` (line 301): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `deltaEOKFast` (line 320): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getAlphaSrgbColors` (line 337): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getAlphaP3Colors` (line 350): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `genRadixColors` (line 367): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `toRgbTriplet` (line 432): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `asAlpha` (line 452): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `asWideGamut` (line 460): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `asAlphaWideGamut` (line 468): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `accentContrast` (line 476): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `accentSurface` (line 484): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `accentSurfaceWideGamut` (line 492): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `gsAlpha` (line 501): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `gsWideGamut` (line 509): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `gsAlphaWideGamut` (line 517): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `graySurface` (line 525): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `graySurfaceWideGamut` (line 533): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getScaleFromColor` (line 548): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getTextColor` (line 678): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getAlphaColor` (line 701): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `clampRgb` (line 736): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `blendAlpha` (line 780): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getAlphaColorSrgb` (line 794): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `getAlphaColorP3` (line 823): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `transposeProgressionStart` (line 847): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).
- [ ] `toOklchString` (line 869): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/lib/hue.test.ts`](../tests/lib/hue.test.ts).

### `src/lib/index.ts`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/lib/tailwind-preset.ts`

- [ ] `applyOpacityValue` (line 31): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `applyOpacity` (line 38): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `makeOpacityColors` (line 53): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `minWidthFromTheme` (line 69): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `typographyFromTheme` (line 79): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `registerTailwindVariants` (line 131): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `childSelector` (line 150): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/lib/types.ts`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/ui/index.ts`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `tests/components/ui/entry.test.ts`

- [ ] `publicUiEntryContract` (line 18): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `publicUiEntryKeepsHueAndComponentExports` (line 23): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

### `tests/components/ui/forms.test.ts`

- [ ] `mappedCheckboxAccessibility` (line 23): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `renderCheckbox` (line 39): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `defaultCheckboxKeepsLabelBeforeControl` (line 61): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `horizontalCheckboxKeepsFeedbackAssociations` (line 78): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `genCheckboxIdConnectsLabelAndFeedback` (line 95): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `customControlWithoutIdentityHasNoDanglingLabel` (line 126): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

### `tests/components/ui/global-css.test.ts`

- [ ] `stylesheetContracts` (line 27): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `source` (line 41): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `sourceStylesheetProvidesSharedTokensAndExports` (line 46): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `findNestedSelectors` (line 75): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `publishedStylesheetsAreBrowserReady` (line 91): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

### `tests/components/ui/interactive-controls.test.ts`

- [ ] `callback@18` (line 18): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `callback@19` (line 19): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `callback@35` (line 35): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

### `tests/components/ui/variants.test.ts`

- [ ] `matrixKey` (line 55): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `source` (line 65): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `hasClasses` (line 74): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `hasDistinctClasses` (line 84): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `sharedUiVariantContracts` (line 96): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `validVariantMatricesGenClasses` (line 114): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `legacyAliasesAndSemanticFeedbackRemainAvailable` (line 183): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `sharedClassContractsGenClasses` (line 200): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `sharedExportsRetainConsumersAndLocalContracts` (line 220): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

### `tests/lib/hue.test.ts`

- [ ] `contains` (line 14): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `closest` (line 30): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `querySelectorAll` (line 40): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `constructor` (line 54): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `querySelectorAll` (line 65): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `dispatchEvent` (line 75): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `constructor` (line 89): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `detail` (line 99): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `resetApplyHueGlobals` (line 105): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `describeColorUtilities` (line 112): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `describeGetHue` (line 122): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `preservesExplicitSectionHues` (line 128): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `normDocumentLabelsBeforeDerivingHue` (line 133): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `describeInvert` (line 140): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `preservesNullHueDuringInversion` (line 147): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `rotatesHueByOneHalfTurn` (line 152): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `wrapsHueAtScaleBoundary` (line 158): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `describeFlattenColors` (line 163): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `flattensColorScales` (line 168): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `describeIsDarkMode` (line 197): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `returnsLightModeWithoutDocument` (line 202): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `describeColors` (line 207): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `useInvalidHue` (line 215): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `rejectsInvalidHueType` (line 220): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `returnsGrayscaleScalesForNullHue` (line 225): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `gensTwelveStepColorScales` (line 233): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `appliesHueAvoidanceShift` (line 243): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `describeApplyHue` (line 250): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `leavesServerCallsUntouched` (line 259): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `appliesNumericHueToDocument` (line 264): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `appliesHueOnlyToScopedWorkspace` (line 284): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `appliesGrayscaleHueToDocument` (line 302): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `applyHueWithoutDocument` (line 318): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

## Document inventory

- [ ] [`.changeset/bright-documents-ship.md`](../.changeset/bright-documents-ship.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`.changeset/repository-structure.md`](../.changeset/repository-structure.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`.changeset/smooth-css-layers.md`](../.changeset/smooth-css-layers.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`CHANGELOG.md`](../CHANGELOG.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`README.md`](../README.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/README.md`](../docs/README.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/agents/skills/ui/SKILL.md`](../docs/agents/skills/ui/SKILL.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/agents/skills/ui/responsiveness/SKILL.md`](../docs/agents/skills/ui/responsiveness/SKILL.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/agents/skills/ui/styling/SKILL.md`](../docs/agents/skills/ui/styling/SKILL.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/agents/skills/ui/ui-variants/SKILL.md`](../docs/agents/skills/ui/ui-variants/SKILL.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/styling/0-repository-guide/installation.mdx`](../docs/styling/0-repository-guide/installation.mdx): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/styling/0-repository-guide/repository-guide.mdx`](../docs/styling/0-repository-guide/repository-guide.mdx): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/styling/1-colouring/0-hue.mdx`](../docs/styling/1-colouring/0-hue.mdx): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/styling/1-colouring/1-variants.mdx`](../docs/styling/1-colouring/1-variants.mdx): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/styling/1-colouring/2-components.mdx`](../docs/styling/1-colouring/2-components.mdx): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/styling/2-documents/document-creation.mdx`](../docs/styling/2-documents/document-creation.mdx): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`src/assets/fonts/README.md`](../src/assets/fonts/README.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`src/assets/fonts/licenses/Inter-OFL-1.1.txt`](../src/assets/fonts/licenses/Inter-OFL-1.1.txt): Check encoding, content integrity, links, and the owning reader or renderer.
- [ ] [`src/assets/fonts/licenses/OFL-1.1.txt`](../src/assets/fonts/licenses/OFL-1.1.txt): Check encoding, content integrity, links, and the owning reader or renderer.
- [ ] [`src/documents/README.md`](../src/documents/README.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.

## Configuration and other owned files

- [ ] `.changeset/config.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `.github/workflows/check.yml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `.gitignore`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `LICENSE`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/husky/pre-commit`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/knip.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/package-lock.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/package.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/patches/@terra-symposium__docs@0.4.3.patch`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/quality.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/terra-tests.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/tsconfig.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `docs/agents/skills/ui/agents/openai.yaml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `docs/agents/skills/ui/ui-variants/agents/openai.yaml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `docs/styling/assets/reference-content.css`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `package.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `patches/@terra-symposium__docs@0.4.3.patch`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `patches/@terra-symposium__standards-quality@2.2.0.patch`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `pnpm-lock.yaml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `pnpm-workspace.yaml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `src/assets/fonts/AUTHENTICSans-130.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/AUTHENTICSans-130.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/AUTHENTICSans-150.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/AUTHENTICSans-150.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/AUTHENTICSans-90.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/AUTHENTICSans-90.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/Avara-Bold.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/Avara-Bold.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/Avara-BoldItalic.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/Avara-BoldItalic.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/InterVariable-Italic-latin-20260728.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/assets/fonts/InterVariable-latin-20260728.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/styles/effects.css`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `src/styles/global.css`: validate syntax or schema, exercise its owning tool, and check references to this file.

Inventory: 533 function-like declarations, 20 documents, 34 other owned files, and 94 executable source files.
