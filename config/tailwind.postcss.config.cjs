// terra-quality-ignore single-use -- Load postcss-import before constructing the plugin list so require side effects keep their original order.
const postcssImport = require('postcss-import');
const tailwindNesting = require('tailwindcss/nesting');
// terra-quality-ignore single-use -- Load tailwindcss before invoking plugins so require side effects keep their original order.
const tailwindcss = require('tailwindcss');

module.exports = { plugins: [postcssImport(), tailwindNesting(), tailwindcss()] };
