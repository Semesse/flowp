module.exports = {
  extends: ['alloy', 'alloy/typescript'],
  env: {},
  globals: {},
  rules: {
    'no-undef': 'off',
  },
  plugins: ['eslint-plugin-tsdoc'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
}
