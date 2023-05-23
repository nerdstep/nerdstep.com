/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: true,
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  pluginSearchDirs: false,
  plugins: [
    // prettier-plugin-tailwindcss must be loaded last
    require('prettier-plugin-tailwindcss'),
  ],
}
