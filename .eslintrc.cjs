module.exports = {
  extends: ['alloy', 'alloy/typescript'],
  env: {},
  globals: {},
  rules: {
    'no-undef': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
}
