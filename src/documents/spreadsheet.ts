/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/
import fs from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import {
  createDocumentBrand,
  type TerraDocumentBrandOptions,
} from "./theme.js";

export type SpreadsheetTemplateOptions = {
  title?: string;
  brand?: TerraDocumentBrandOptions;
};

export type SpreadsheetCellEdits = Record<
  string,
  Record<string, string | number | boolean | Date | null>
>;

/*//////////////////////////////////////////////////
SPREADSHEET TEMPLATE
//////////////////////////////////////////////////*/

/**
 * Converts a CSS hex color to the eight-digit ARGB format used by ExcelJS.
 *
 * @param value - CSS hex color with or without a leading hash.
 * @returns The uppercase ARGB color prefixed with full opacity.
 */
const argb = (value: string): string =>
  `FF${value.replace(/^#/, "").toUpperCase()}`;

/**
 * Creates a two-sheet workbook template with editable planning inputs and linked summary formulas.
 *
 * @param options - Optional workbook title and Terra brand settings.
 * @returns A workbook containing an overview and editable input sheet.
 */
export function createSpreadsheetTemplate(
  options: SpreadsheetTemplateOptions = {},
): ExcelJS.Workbook {
  const brand = createDocumentBrand(options.brand);
  const c = brand.colors;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Terra Symposium";
  workbook.lastModifiedBy = "Terra Symposium";
  workbook.title = options.title ?? "Terra workbook template";
  workbook.subject = "Editable Terra spreadsheet template";
  workbook.properties.date1904 = false;
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 18000,
      height: 10000,
      firstSheet: 0,
      activeTab: 0,
      visibility: "visible",
    },
  ];

  const summary = workbook.addWorksheet("Overview", {
    properties: { tabColor: { argb: argb(c.primary) } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 4 }],
  });
  summary.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    paperSize: 9,
  };
  summary.columns = [
    { width: 30 },
    { width: 22 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 18 },
  ];
  fillRegion(summary, 1, 9, 1, 6, c.paper);
  summary.mergeCells("A1:D1");
  summary.getCell("A1").value = options.title ?? "Terra workbook template";
  summary.getCell("A1").font = {
    name: brand.fonts.display,
    size: 24,
    color: { argb: argb(c.ink) },
  };
  summary.getRow(1).height = 40;
  if (brand.logo === "terra-wordmark") {
    summary.getCell("E1").value = "terra symposium";
    summary.getCell("E1").font = {
      name: "Avara",
      size: 12,
      bold: true,
      italic: true,
      color: { argb: argb(c.ink) },
    };
  } else if (brand.logo)
    summary.addImage(
      workbook.addImage({ filename: brand.logo, extension: "png" }),
      { tl: { col: 4.1, row: 0.25 }, ext: { width: 130, height: 21 } },
    );
  summary.mergeCells("A2:F2");
  summary.getCell("A2").value =
    "An editable starting point. Replace the sample rows on Inputs with your own information.";
  summary.getCell("A2").font = {
    name: brand.fonts.body,
    size: 11,
    color: { argb: argb(c.muted) },
  };
  summary.getRow(2).height = 24;
  summary.getCell("A4").value = "WORK SUMMARY";
  summary.getCell("A4").font = {
    name: brand.fonts.body,
    size: 10,
    color: { argb: argb(c.primaryStrong) },
  };
  summary.getRow(4).height = 24;
  summary.getRow(5).values = [
    "Measure",
    "Current value",
    "How it is calculated",
  ];
  styleHeader(summary.getRow(5), c.surface, c.primaryStrong, brand.fonts.body);
  summary.getRow(6).values = [
    "Items",
    { formula: "COUNTA(Inputs!A6:A25)", result: 3 },
    "Count of populated item names",
  ];
  summary.getRow(7).values = [
    "Complete",
    { formula: 'COUNTIF(Inputs!D6:D25,"Complete")', result: 1 },
    "Rows marked Complete",
  ];
  summary.getRow(8).values = [
    "Open",
    {
      formula: 'COUNTIFS(Inputs!A6:A25,"<>",Inputs!D6:D25,"<>Complete")',
      result: 2,
    },
    "Rows not yet marked Complete",
  ];
  for (const row of summary.getRows(6, 3) ?? []) {
    row.height = 28;
    row.alignment = { vertical: "middle", wrapText: true };
    row.getCell(2).font = {
      name: brand.fonts.body,
      size: 13,
      color: { argb: argb(c.primaryStrong) },
    };
    row.getCell(3).font = {
      name: brand.fonts.body,
      size: 10,
      color: { argb: argb(c.muted) },
    };
    row.getCell(1).font = {
      name: brand.fonts.body,
      size: 11,
      color: { argb: argb(c.ink) },
    };
  }
  styleTableBorders(summary, 5, 8, 1, 3, c.line);

  const inputs = workbook.addWorksheet("Inputs", {
    properties: { tabColor: { argb: argb(c.secondary) } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 5 }],
  });
  inputs.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    paperSize: 9,
  };
  inputs.columns = [
    { width: 34 },
    { width: 24 },
    { width: 18 },
    { width: 18 },
    { width: 46 },
  ];
  fillRegion(inputs, 1, 25, 1, 5, c.paper);
  inputs.mergeCells("A1:C1");
  inputs.getCell("A1").value = "EDITABLE INPUTS";
  inputs.getCell("A1").font = {
    name: brand.fonts.display,
    size: 22,
    color: { argb: argb(c.ink) },
  };
  inputs.getRow(1).height = 38;
  if (brand.logo === "terra-wordmark") {
    inputs.getCell("D1").value = "terra symposium";
    inputs.getCell("D1").font = {
      name: "Avara",
      size: 12,
      bold: true,
      italic: true,
      color: { argb: argb(c.ink) },
    };
  } else if (brand.logo)
    inputs.addImage(
      workbook.addImage({ filename: brand.logo, extension: "png" }),
      { tl: { col: 3.55, row: 0.25 }, ext: { width: 120, height: 19 } },
    );
  inputs.mergeCells("A2:E2");
  inputs.getCell("A2").value =
    "Change the sample fields below. The Overview formulas update in Excel or LibreOffice.";
  inputs.getCell("A2").font = {
    name: brand.fonts.body,
    size: 11,
    color: { argb: argb(c.muted) },
  };
  inputs.getRow(2).height = 24;
  inputs.getRow(5).values = [
    "Work item",
    "Owner",
    "Due date",
    "Status",
    "Notes",
  ];
  styleHeader(inputs.getRow(5), c.surface, c.primaryStrong, brand.fonts.body);
  inputs.getRow(6).values = [
    "Set the purpose",
    "Project lead",
    new Date("2026-11-06T12:00:00Z"),
    "Complete",
    "State the audience and the decision this file supports.",
  ];
  inputs.getRow(7).values = [
    "Add source material",
    "Contributor",
    new Date("2026-11-10T12:00:00Z"),
    "In progress",
    "Keep source files and assumptions traceable.",
  ];
  inputs.getRow(8).values = [
    "Review the result",
    "Reviewer",
    new Date("2026-11-13T12:00:00Z"),
    "Not started",
    "Check the finished document before sharing.",
  ];
  inputs.getColumn(3).numFmt = "dd mmm yyyy";
  for (let rowIndex = 6; rowIndex <= 25; rowIndex += 1)
    inputs.getCell(rowIndex, 4).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"Not started,In progress,Complete"'],
    };
  for (let rowIndex = 6; rowIndex <= 8; rowIndex += 1) {
    const row = inputs.getRow(rowIndex);
    row.height = 34;
    row.alignment = { vertical: "middle", wrapText: true };
    row.eachCell((cell) => {
      cell.font = {
        name: brand.fonts.body,
        size: 10,
        color: { argb: argb(c.ink) },
      };
      cell.border = {
        bottom: { style: "thin", color: { argb: argb(c.line) } },
      };
      if (rowIndex % 2 === 0)
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: argb(c.surface) },
        };
    });
  }
  inputs.autoFilter = { from: "A5", to: "E25" };
  return workbook;
}

/**
 * Reopens a generated XLSX, applies cell edits, and writes a new XLSX.
 *
 * @param sourcePath - Existing generated workbook to edit.
 * @param destinationPath - Path where the edited workbook is written.
 * @param edits - Worksheet names mapped to cell addresses and replacement values.
 * @returns Resolves after the edited workbook has been written.
 * @throws If a named worksheet does not exist or no cell edits were provided.
 */
export async function editSpreadsheetTemplate(
  sourcePath: string,
  destinationPath: string,
  edits: SpreadsheetCellEdits,
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(sourcePath);
  let edited = 0;
  for (const [sheetName, cells] of Object.entries(edits)) {
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet)
      throw new Error(
        `No worksheet named "${sheetName}" in ${path.basename(sourcePath)}.`,
      );
    for (const [address, value] of Object.entries(cells)) {
      sheet.getCell(address).value = value;
      edited += 1;
    }
  }
  if (!edited) throw new Error("Provide at least one workbook cell edit.");
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await workbook.xlsx.writeFile(destinationPath);
}

/*//////////////////////////////////////////////////
STYLE HELPERS
//////////////////////////////////////////////////*/
/**
 * Applies header height, fill, font color, and vertical alignment to each row cell.
 *
 * @param row - Worksheet row to style.
 * @param fill - CSS hex fill color.
 * @param textColor - CSS hex font color.
 * @param font - Font family applied to the row.
 * @returns Nothing; the row styles are updated in place.
 */
const styleHeader = (
  row: ExcelJS.Row,
  fill: string,
  textColor: string,
  font: string,
): void => {
  row.height = 30;
  for (let col = 1; col <= row.cellCount; col += 1) {
    const cell = row.getCell(col);
    cell.font = { name: font, size: 10, color: { argb: argb(textColor) } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: argb(fill) },
    };
    cell.alignment = { vertical: "middle", wrapText: true };
  }
};

/**
 * Applies a solid fill to every cell in a rectangular worksheet region.
 *
 * @param sheet - Worksheet whose cells are updated.
 * @param firstRow - First row in the inclusive range.
 * @param lastRow - Last row in the inclusive range.
 * @param firstCol - First column in the inclusive range.
 * @param lastCol - Last column in the inclusive range.
 * @param fill - CSS hex color used for the fill.
 * @returns Nothing; worksheet cell fills are updated in place.
 */
const fillRegion = (
  sheet: ExcelJS.Worksheet,
  firstRow: number,
  lastRow: number,
  firstCol: number,
  lastCol: number,
  fill: string,
): void => {
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let col = firstCol; col <= lastCol; col += 1) {
      sheet.getCell(row, col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: argb(fill) },
      };
    }
  }
};

/**
 * Applies a bottom border to every cell in a rectangular worksheet region.
 *
 * @param sheet - Worksheet whose cells are updated.
 * @param startRow - First row in the inclusive range.
 * @param endRow - Last row in the inclusive range.
 * @param startCol - First column in the inclusive range.
 * @param endCol - Last column in the inclusive range.
 * @param line - CSS hex color used for the border.
 * @returns Nothing; worksheet cell borders are updated in place.
 */
const styleTableBorders = (
  sheet: ExcelJS.Worksheet,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  line: string,
): void => {
  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      sheet.getCell(row, col).border = {
        bottom: { style: "thin", color: { argb: argb(line) } },
      };
    }
  }
};
