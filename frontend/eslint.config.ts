import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    'vue/no-multiple-template-root': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-self-closing': 'off',

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
})
