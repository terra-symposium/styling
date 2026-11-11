/**
 * src/documents/index.ts
 */

export { createDocumentBrand, randomDocumentHue } from "./theme.js";
export type {
  DocumentColors,
  DocumentColorScales,
  DocumentSaturation,
  TerraDocumentBrand,
  TerraDocumentBrandOptions,
} from "./theme.js";
export {
  applyPresentationBrand,
  createPresentationTemplate,
  editPresentationTemplate,
  replaceOfficeText,
} from "./presentation.js";
export type { PresentationTemplateOptions } from "./presentation.js";
export {
  createSpreadsheetTemplate,
  editSpreadsheetTemplate,
} from "./spreadsheet.js";
export type {
  SpreadsheetCellEdits,
  SpreadsheetTemplateOptions,
} from "./spreadsheet.js";
export {
  createWordTemplate,
  writeWordTemplate,
  editWordTemplate,
} from "./document.js";
export type { WordTemplateOptions } from "./document.js";

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { fileURLToPath } from "node:url";

/*//////////////////////////////////////////////////
TEMPLATE FILES
//////////////////////////////////////////////////*/

/** Names of the editable starter files shipped with the package. */
export const DOCUMENT_TEMPLATE_FILES = {
  presentationLow: "terra-presentation-low.pptx",
  presentationMedium: "terra-presentation-medium.pptx",
  presentationHigh: "terra-presentation-high.pptx",
  presentationLowPotx: "terra-presentation-low.potx",
  presentationMediumPotx: "terra-presentation-medium.potx",
  presentationHighPotx: "terra-presentation-high.potx",
  spreadsheet: "terra-spreadsheet.xlsx",
  document: "terra-document.docx",
  documentDemo: "terra-document-demo.docx",
} as const;

/**
 * Resolves the on-disk path to a shipped native Office template.
 *
 * @param name - One of the file names listed in `DOCUMENT_TEMPLATE_FILES`.
 *
 * @return The absolute path to the packaged template.
 */
export function resolveDocumentTemplate(
  name: (typeof DOCUMENT_TEMPLATE_FILES)[keyof typeof DOCUMENT_TEMPLATE_FILES],
): string {
  return fileURLToPath(new URL(`./templates/${name}`, import.meta.url));
}
