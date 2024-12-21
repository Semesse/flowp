import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  files: ['src/**/*.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
})
// module.exports = {
//   extends: ['alloy', 'alloy/typescript'],
//   env: {},
//   globals: {},
//   rules: {
//     'no-undef': 'off',
//   },
//   plugins: ['eslint-plugin-tsdoc'],
//   overrides: [
//     {
//       files: ['*.ts'],
//       parserOptions: {
//         project: ['./tsconfig.json'],
//       },
//     },
//   ],
// }
