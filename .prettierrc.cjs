module.exports = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  singleQuote: true,
  plugins: ['@prettier/plugin-xml'],
  overrides: [
    {
      files: ['*.csproj.user'],
      options: {
        parser: 'xml',
      },
    },
  ],
  xmlWhitespaceSensitivity: 'ignore',
};
