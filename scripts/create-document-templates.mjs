/**
 * scripts/create-document-templates.mjs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import fs from 'node:fs/promises';
import path from 'node:path';
import { createPresentationTemplate, createSpreadsheetTemplate, writeWordTemplate } from '../dist/documents/index.js';
import { fileURLToPath } from 'node:url';

// COMPONENTS
import JSZip from 'jszip';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageTemplates = path.join(root, 'dist/documents/templates');
const reviewOutput = process.argv[2] === '--package' ? undefined : process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'outputs/terra-brand-templates');
await fs.mkdir(packageTemplates, { recursive: true });
if (reviewOutput) await fs.mkdir(reviewOutput, { recursive: true });
// Keep packaged examples and their Docs screenshots reproducible; the public API still defaults to a fresh hue.
const templateHue = 200;

/*//////////////////////////////////////////////////
GENERATE TEMPLATES
//////////////////////////////////////////////////*/

const pptxName = 'terra-presentation.pptx';
const potxName = 'terra-presentation.potx';
const pptxPath = path.join(packageTemplates, pptxName);
await createPresentationTemplate({ title: 'Community workshop pilot', subtitle: 'An illustrative story from need to decision.', showcase: true, brand: { hue: templateHue } }).writeFile({
	fileName: pptxPath,
});
const templateSource = path.join(packageTemplates, 'terra-presentation-template-source.pptx');
await createPresentationTemplate({ showcase: false, brand: { hue: templateHue } }).writeFile({ fileName: templateSource });
await createPowerPointTemplate(templateSource, path.join(packageTemplates, potxName));
await fs.unlink(templateSource);
const officeFonts = ['AUTHENTICSans-90.ttf', 'AUTHENTICSans-130.ttf', 'AUTHENTICSans-150.ttf', 'Avara-Bold.ttf', 'Avara-BoldItalic.ttf'];
const packageFonts = path.join(packageTemplates, 'fonts');
await fs.mkdir(packageFonts, { recursive: true });
for (const font of officeFonts) await fs.copyFile(path.join(root, 'src/assets/fonts', font), path.join(packageFonts, font));
await fs.copyFile(path.join(root, 'src/assets/fonts/README.md'), path.join(packageFonts, 'README.md'));
if (reviewOutput) {
	await fs.copyFile(pptxPath, path.join(reviewOutput, pptxName));
	await fs.copyFile(path.join(packageTemplates, potxName), path.join(reviewOutput, potxName));
	const reviewFonts = path.join(reviewOutput, 'fonts');
	await fs.mkdir(reviewFonts, { recursive: true });
	for (const font of officeFonts) await fs.copyFile(path.join(packageFonts, font), path.join(reviewFonts, font));
	await fs.copyFile(path.join(packageFonts, 'README.md'), path.join(reviewFonts, 'README.md'));
}
const xlsx = path.join(packageTemplates, 'terra-spreadsheet.xlsx');
await createSpreadsheetTemplate({ title: 'Terra project plan', brand: { hue: templateHue } }).xlsx.writeFile(xlsx);
const docx = path.join(packageTemplates, 'terra-document.docx');
await writeWordTemplate(docx, { title: 'Invoice', brand: { hue: templateHue } });
const docxDemo = path.join(packageTemplates, 'terra-document-demo.docx');
await writeWordTemplate(docxDemo, { title: 'Invoice', brand: { hue: templateHue }, showcase: true });
if (reviewOutput) {
	await fs.copyFile(xlsx, path.join(reviewOutput, path.basename(xlsx)));
	await fs.copyFile(docx, path.join(reviewOutput, path.basename(docx)));
	await fs.copyFile(docxDemo, path.join(reviewOutput, path.basename(docxDemo)));
}
console.log(JSON.stringify({ packageTemplates, reviewOutput: reviewOutput ?? null, files: await fs.readdir(packageTemplates) }, null, 2));

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Converts a generated PowerPoint deck into a PowerPoint template package.
 *
 * @param srcPath - Path to the generated `.pptx` deck.
 * @param destPath - Path where the `.potx` package is written.
 *
 * @return Resolves after the converted template has been written.
 *
 * @throws If the source package has no valid PowerPoint content-type entries.
 */
async function createPowerPointTemplate(srcPath, destPath) {
	const zip = await JSZip.loadAsync(await fs.readFile(srcPath));
	const contentTypes = zip.file('[Content_Types].xml');
	if (!contentTypes) throw new Error('Missing package content types in ' + path.basename(srcPath) + '.');
	let xml = await contentTypes.async('string');
	const presentationOverride = /<Override\b(?=[^>]*\bPartName="\/ppt\/presentation\.xml")(?=[^>]*\bContentType="[^"]+")[^>]*\/>/;
	if (!presentationOverride.test(xml)) throw new Error('Missing presentation content type in ' + path.basename(srcPath) + '.');
	xml = xml.replace(presentationOverride, '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.template.main+xml"/>');
	zip.file('[Content_Types].xml', xml);
	await fs.writeFile(destPath, await zip.generateAsync({ type: 'nodebuffer' }));
}
