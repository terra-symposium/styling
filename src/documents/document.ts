/**
 * src/documents/document.ts
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import fs from "node:fs/promises";
import path from "node:path";
import { createDocumentBrand } from "./theme.js";
import { readFileSync } from "node:fs";

// COMPONENTS
import JSZip from "jszip";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlignTable,
  WidthType,
} from "docx";

// TYPES
import type { TerraDocumentBrandOptions } from "./theme.js";

/*//////////////////////////////////////////////////
REGEX
//////////////////////////////////////////////////*/

const SHARED_REGEX = /^#/;

/*//////////////////////////////////////////////////
WORD TEMPLATE
//////////////////////////////////////////////////*/

export type WordTemplateOptions = {
  title?: string;
  subtitle?: string;
  brand?: TerraDocumentBrandOptions;
  /** Adds the second-page style guide used to review all reusable Word styles. */
  showcase?: boolean;
};

/**
 * Creates an editable, Pages-friendly invoice starter based on Terra's invoice layout.
 *
 * @param options - Optional title, subtitle, style showcase, and Terra brand settings.
 *
 * @return A Word invoice with reusable headings, customer details, line items, and payment fields.
 */
export function createWordTemplate(
  options: WordTemplateOptions = {},
): Document {
  const brand = createDocumentBrand(options.brand);
  const c = brand.colors;
  const font = brand.fonts.body;
  const bodyInk =
    "#" +
    brand.scales.gray.light[11]!.split(" ")
      .map((c) => Math.round(Number(c)).toString(16).padStart(2, "0"))
      .join("");
  const bodyLine = 276;
  const tableWidth = 9706;
  const noBorder = { style: BorderStyle.NIL, size: 0 };
  const thinRule = {
    style: BorderStyle.SINGLE,
    size: 5,
    color: c.line.replace(SHARED_REGEX, ""),
  };
  const sectionRule = {
    style: BorderStyle.SINGLE,
    size: 10,
    color: c.primaryStrong.replace(SHARED_REGEX, ""),
  };
  const emptyTableBorders = {
    top: noBorder,
    bottom: noBorder,
    left: noBorder,
    right: noBorder,
    insideHorizontal: noBorder,
    insideVertical: noBorder,
  };
  const cellMargins = { top: 100, bottom: 100, left: 140, right: 140 };
  const colorFill = (color: string) => ({
    type: ShadingType.CLEAR,
    fill: color.replace(SHARED_REGEX, ""),
  });
  const runText = (value: string, run: Record<string, unknown> = {}) =>
    new TextRun({ text: value, font, ...run });
  const paragraph = (
    value: string,
    style = "Normal",
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType],
  ) => new Paragraph({ style, alignment, children: [runText(value)] });
  const heading = (headingText: string, level: 1 | 2 | 3) => {
    const levelMap = {
      1: { heading: HeadingLevel.HEADING_1, style: "Heading1" },
      2: { heading: HeadingLevel.HEADING_2, style: "Heading2" },
      3: { heading: HeadingLevel.HEADING_3, style: "Heading3" },
    } as const;
    return new Paragraph({
      heading: levelMap[level].heading,
      keepNext: true,
      style: levelMap[level].style,
      children: [runText(headingText)],
    });
  };
  const cell = (
    paragraphs: Paragraph[],
    width: number,
    opts: {
      fill?: string;
      borders?: Record<string, unknown>;
      columnSpan?: number;
      alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    } = {},
  ) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      columnSpan: opts.columnSpan,
      verticalAlign: VerticalAlignTable.CENTER,
      margins: cellMargins,
      shading: opts.fill ? colorFill(opts.fill) : undefined,
      borders: opts.borders as never,
      children: paragraphs,
    });
  const makeTable = (rows: TableRow[], widths: number[]) =>
    new Table({
      rows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: widths,
      layout: "fixed",
      borders: emptyTableBorders,
    });
  const tableText = (
    value: string,
    align?: "right" | "center",
    style = "TableBody",
  ) =>
    new Paragraph({
      style,
      alignment:
        align === "right"
          ? AlignmentType.RIGHT
          : align === "center"
            ? AlignmentType.CENTER
            : AlignmentType.LEFT,
      children: [runText(value)],
    });
  const tableTotal = (value: string, align?: "right") =>
    new Paragraph({
      style: "TableTotal",
      alignment: align === "right" ? AlignmentType.RIGHT : AlignmentType.LEFT,
      children: [runText(value, { bold: true })],
    });
  const children: (Paragraph | Table)[] = [];
  if (brand.logo === "terra-wordmark")
    children.push(
      new Paragraph({
        style: "BrandMark",
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: "terra symposium",
            font: "Avara",
            size: 22,
            italics: true,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
          }),
        ],
      }),
      paragraph("ABN  [Business number]", "SupplierInfo", AlignmentType.RIGHT),
      paragraph("[Email address]", "SupplierInfo", AlignmentType.RIGHT),
    );
  else if (brand.logo) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 130 },
        children: [
          new ImageRun({
            data: readFileSync(brand.logo),
            type: "png",
            transformation: { width: 160, height: 26 },
          }),
        ],
      }),
      paragraph("ABN  [Business number]", "SupplierInfo", AlignmentType.RIGHT),
      paragraph("[Email address]", "SupplierInfo", AlignmentType.RIGHT),
    );
  } else {
    children.push(
      paragraph("[Business name]", "SupplierInfo", AlignmentType.RIGHT),
      paragraph("ABN  [Business number]", "SupplierInfo", AlignmentType.RIGHT),
      paragraph("[Email address]", "SupplierInfo", AlignmentType.RIGHT),
    );
  }
  children.push(
    new Paragraph({
      style: "Title",
      keepNext: true,
      children: [
        runText(options.title ?? "Invoice", { font: "Avara", italics: true }),
      ],
    }),
    new Paragraph({
      style: "Subtitle",
      keepNext: true,
      children: [
        runText(options.subtitle ?? "Invoice number  [Invoice number]"),
      ],
    }),
    new Paragraph({
      style: "InvoiceMeta",
      children: [
        runText(
          "Services rendered  [Service date]   ·   Invoice issued  [Issue date]",
        ),
      ],
    }),
    makeTable(
      [
        new TableRow({
          children: [
            cell(
              [
                paragraph("Bill to", "CardLabel"),
                paragraph("[Recipient name and role]", "CardBody"),
                paragraph("[Organisation and postal address]", "CardBody"),
              ],
              5600,
              { fill: c.primarySoft },
            ),
            cell(
              [
                paragraph("Service description", "CardLabel"),
                paragraph("[Workshop, service or project]", "CardBody"),
                paragraph("Due date  [Due date]", "CardBody"),
              ],
              4106,
              { fill: c.primarySoft },
            ),
          ],
        }),
      ],
      [5600, 4106],
    ),
    heading("Cost", 1),
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            cell([tableText("Description", undefined, "TableHeader")], 5100, {
              fill: c.primarySoft,
              borders: { bottom: sectionRule },
            }),
            cell([tableText("Rate", "right", "TableHeader")], 1800, {
              fill: c.primarySoft,
              borders: { bottom: sectionRule },
            }),
            cell([tableText("Qty", "right", "TableHeader")], 900, {
              fill: c.primarySoft,
              borders: { bottom: sectionRule },
            }),
            cell([tableText("Subtotal", "right", "TableHeader")], 1906, {
              fill: c.primarySoft,
              borders: { bottom: sectionRule },
            }),
          ],
        }),
        ...[
          {
            group: "Professional services",
            item: "[Workshop delivery]",
            qty: "[1]",
          },
          {
            group: "Preparation",
            item: "[Planning and materials]",
            qty: "[1]",
          },
          {
            group: "Additional costs",
            item: "[Travel or approved expenses]",
            qty: "[1]",
          },
        ].flatMap((e) => [
          new TableRow({
            cantSplit: true,
            children: [
              cell([paragraph(e.group, "TableGroup")], tableWidth, {
                fill: c.primarySoft,
                columnSpan: 4,
                borders: { top: sectionRule, bottom: sectionRule },
              }),
            ],
          }),
          new TableRow({
            cantSplit: true,
            children: [
              cell([tableText(e.item)], 5100, {
                borders: { bottom: { ...thinRule, size: 2 } },
              }),
              cell([tableText("[Rate]", "right")], 1800, {
                borders: { bottom: { ...thinRule, size: 2 } },
              }),
              cell([tableText(e.qty, "right")], 900, {
                borders: { bottom: { ...thinRule, size: 2 } },
              }),
              cell([tableText("[Subtotal]", "right")], 1906, {
                borders: { bottom: { ...thinRule, size: 2 } },
              }),
            ],
          }),
        ]),
      ],
      [5100, 1800, 900, 1906],
    ),
    makeTable(
      [
        new TableRow({
          children: [
            cell([tableTotal("Total due")], 7700, {
              borders: { top: sectionRule },
            }),
            cell([tableTotal("[Total]", "right")], 2006, {
              borders: { top: sectionRule },
            }),
          ],
        }),
      ],
      [7700, 2006],
    ),
    heading("Payment details", 2),
    heading("Bank transfer", 3),
    paragraph(
      "Account name  [Account name]     BSB  [BSB]     Account number  [Account number]",
      "Payment",
    ),
    paragraph("Please include the invoice number with your payment.", "Small"),
  );
  if (options.showcase)
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        style: "Title",
        children: [runText("Document style guide")],
      }),
      paragraph(
        "A compact review of the reusable Terra Word styles.",
        "Subtitle",
      ),
      heading("Reading hierarchy", 1),
      paragraph(
        "Body text keeps the page easy to read. The heading levels below are Word styles, so a recipient can update the document without restyling each heading.",
        "Normal",
      ),
      heading("Section heading", 2),
      paragraph(
        "Use this level to divide a longer section into named topics.",
        "Normal",
      ),
      heading("Detail heading", 3),
      paragraph(
        "This smaller heading keeps related details together without competing with the document title.",
        "Normal",
      ),
      heading("Lists and emphasis", 1),
      paragraph(
        "Use bold for a short emphasis only; keep longer explanations in regular AUTHENTIC Sans.",
        "Normal",
      ),
      new Paragraph({
        bullet: { level: 0 },
        style: "ListParagraph",
        children: [runText("A short scannable item with one clear point.")],
      }),
      new Paragraph({
        bullet: { level: 0 },
        style: "ListParagraph",
        children: [runText("A second item that continues the same list.")],
      }),
      new Paragraph({
        numbering: { reference: "demo-steps", level: 0 },
        style: "ListParagraph",
        children: [runText("First action with an owner and outcome.")],
      }),
      new Paragraph({
        numbering: { reference: "demo-steps", level: 0 },
        style: "ListParagraph",
        children: [runText("Next action with a clear follow-up.")],
      }),
      heading("Comparison table", 1),
      paragraph(
        "A compact table for values that readers need to compare.",
        "Small",
      ),
      makeTable(
        [
          new TableRow({
            tableHeader: true,
            children: [
              cell([tableText("Work item", undefined, "TableHeader")], 4100, {
                fill: c.primarySoft,
                borders: { bottom: sectionRule },
              }),
              cell([tableText("Owner", undefined, "TableHeader")], 2400, {
                fill: c.primarySoft,
                borders: { bottom: sectionRule },
              }),
              cell([tableText("Status", "center", "TableHeader")], 1400, {
                fill: c.primarySoft,
                borders: { bottom: sectionRule },
              }),
              cell([tableText("Due", "right", "TableHeader")], 1906, {
                fill: c.primarySoft,
                borders: { bottom: sectionRule },
              }),
            ],
          }),
          ...[
            ["Prepare materials", "Project lead", "Ready", "[Date]"],
            ["Confirm attendees", "Coordinator", "Open", "[Date]"],
            ["Share follow-up", "Facilitator", "Planned", "[Date]"],
          ].map(
            (r) =>
              new TableRow({
                cantSplit: true,
                children: r.map((v, i) =>
                  cell(
                    [
                      tableText(
                        v,
                        i === 2 ? "center" : i === 3 ? "right" : undefined,
                      ),
                    ],
                    [4100, 2400, 1400, 1906][i]!,
                    { borders: { bottom: { ...thinRule, size: 2 } } },
                  ),
                ),
              }),
          ),
        ],
        [4100, 2400, 1400, 1906],
      ),
      heading("Detail table", 2),
      makeTable(
        [
          new TableRow({
            children: [
              cell(
                [
                  paragraph("Reference", "CardLabel"),
                  paragraph("[Project code]", "CardBody"),
                ],
                4853,
                { fill: c.primarySoft },
              ),
              cell(
                [
                  paragraph("Contact", "CardLabel"),
                  paragraph("[Name and email]", "CardBody"),
                ],
                4853,
                { fill: c.primarySoft },
              ),
            ],
          }),
        ],
        [4853, 4853],
      ),
      paragraph(
        "Tables in this template use generated primary-scale fills and rules; the source palette is created at build time.",
        "Small",
      ),
    );
  return new Document({
    creator: "Terra Symposium",
    description: "Editable Terra invoice and document style template",
    title: options.title ?? "Terra invoice template",
    numbering: {
      config: [
        {
          reference: "demo-steps",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 540, hanging: 260 } } },
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: { font, size: 21, color: bodyInk.replace(SHARED_REGEX, "") },
          paragraph: { spacing: { after: 75, line: bodyLine } },
        },
      },
      paragraphStyles: [
        {
          id: "Title",
          name: "Title",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Avara",
            size: 44,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
            italics: true,
          },
          paragraph: { spacing: { before: 80, after: 50 }, keepNext: true },
        },
        {
          id: "Subtitle",
          name: "Subtitle",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font,
            size: 22,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
          },
          paragraph: {
            spacing: { before: 0, after: 35, line: bodyLine },
            keepNext: true,
          },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font,
            size: 28,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
          },
          paragraph: {
            spacing: { before: 200, after: 70, line: bodyLine },
            keepNext: true,
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: { font, size: 23, color: bodyInk.replace(SHARED_REGEX, "") },
          paragraph: {
            spacing: { before: 140, after: 45, line: bodyLine },
            keepNext: true,
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          run: { font, size: 21, color: bodyInk.replace(SHARED_REGEX, "") },
          paragraph: {
            spacing: { before: 90, after: 35, line: bodyLine },
            keepNext: true,
          },
        },
        {
          id: "InvoiceMeta",
          name: "Invoice metadata",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font,
            size: 20,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
          },
          paragraph: { spacing: { before: 0, after: 30, line: bodyLine } },
        },
        {
          id: "SupplierInfo",
          name: "Supplier information",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font,
            size: 18,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
          },
          paragraph: { spacing: { before: 0, after: 0, line: bodyLine } },
        },
        {
          id: "BrandMark",
          name: "Brand mark",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Avara",
            size: 22,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
            italics: true,
          },
          paragraph: { spacing: { after: 0, line: bodyLine } },
        },
        {
          id: "CardLabel",
          name: "Card label",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font,
            size: 20,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
          },
          paragraph: { spacing: { after: 35, line: bodyLine } },
        },
        {
          id: "CardBody",
          name: "Card body",
          basedOn: "Normal",
          next: "Normal",
          run: { font, size: 20, color: bodyInk.replace(SHARED_REGEX, "") },
          paragraph: { spacing: { after: 30, line: bodyLine } },
        },
        {
          id: "TableHeader",
          name: "Table header",
          basedOn: "Normal",
          next: "Normal",
          run: { font, size: 20, color: bodyInk.replace(SHARED_REGEX, "") },
          paragraph: { spacing: { before: 0, after: 0, line: bodyLine } },
        },
        {
          id: "TableBody",
          name: "Table body",
          basedOn: "Normal",
          next: "Normal",
          run: { font, size: 20, color: bodyInk.replace(SHARED_REGEX, "") },
          paragraph: { spacing: { before: 0, after: 0, line: bodyLine } },
        },
        {
          id: "TableGroup",
          name: "Table group",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font,
            size: 20,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
            bold: true,
          },
          paragraph: { spacing: { before: 0, after: 0, line: bodyLine } },
        },
        {
          id: "TableTotal",
          name: "Table total",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font,
            size: 22,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
          },
          paragraph: { spacing: { before: 0, after: 0, line: bodyLine } },
        },
        {
          id: "Payment",
          name: "Payment details",
          basedOn: "Normal",
          next: "Normal",
          run: { font, size: 20, color: bodyInk.replace(SHARED_REGEX, "") },
          paragraph: { spacing: { before: 0, after: 45, line: bodyLine } },
        },
        {
          id: "Small",
          name: "Small supporting text",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font,
            size: 18,
            color: c.primaryStrong.replace(SHARED_REGEX, ""),
          },
          paragraph: { spacing: { before: 30, after: 65, line: bodyLine } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 800, bottom: 900, left: 1100, right: 1100 },
          },
        },
        children,
      },
    ],
  });
}

/**
 * Writes a new Word template to disk, creating its parent directory when needed.
 *
 * @param destinationPath - Destination path for the generated `.docx` file.
 * @param options - Optional title, subtitle, and Terra brand settings.
 *
 * @return Resolves after the document has been written.
 */
export async function writeWordTemplate(
  destinationPath: string,
  options: WordTemplateOptions = {},
): Promise<void> {
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.writeFile(
    destinationPath,
    await Packer.toBuffer(createWordTemplate(options)),
  );
}

/**
 * Replaces exact text in a generated DOCX while preserving the rest of its OOXML package.
 *
 * @param sourcePath - Existing package-generated document to edit.
 * @param destinationPath - Path where the edited document is written.
 * @param replacements - Map of exact source text to replacement text.
 *
 * @return Resolves after all matching text runs have been replaced.
 *
 * @throws If none of the requested source text occurs in editable document parts.
 */
export async function editWordTemplate(
  sourcePath: string,
  destinationPath: string,
  replacements: Record<string, string>,
): Promise<void> {
  await replaceWordText(sourcePath, destinationPath, replacements);
}

/**
 * Replaces exact text in editable Word XML parts while preserving other package content.
 *
 * @param sourcePath - Existing DOCX package to edit.
 * @param destinationPath - Path where the updated DOCX package is written.
 * @param replacements - Map of exact source text to replacement text.
 *
 * @return Resolves after the edited package has been written.
 *
 * @throws If none of the requested text occurs in editable document parts.
 */
async function replaceWordText(
  sourcePath: string,
  destinationPath: string,
  replacements: Record<string, string>,
): Promise<void> {
  const zip = await JSZip.loadAsync(await fs.readFile(sourcePath));
  let replacementsMade = 0;
  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir || !/^word\/(document|header\d+|footer\d+)\.xml$/.test(name))
      continue;
    let xml = await entry.async("string");
    for (const [from, to] of Object.entries(replacements)) {
      const occurrences = xml.split(escapeXml(from)).length - 1;
      if (!occurrences) continue;
      xml = xml.replaceAll(escapeXml(from), escapeXml(to));
      replacementsMade += occurrences;
    }
    zip.file(name, xml);
  }
  if (!replacementsMade)
    throw new Error(
      "No editable text matched the requested replacements in " +
        path.basename(sourcePath) +
        ".",
    );
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.writeFile(
    destinationPath,
    await zip.generateAsync({ type: "nodebuffer" }),
  );
}

/**
 * Escapes XML-sensitive characters in text content.
 *
 * @param value - Text to escape.
 *
 * @return The value with XML entities substituted for reserved characters.
 */
const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
