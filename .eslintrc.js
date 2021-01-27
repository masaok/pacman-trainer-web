// https://medium.com/@RossWhitehouse/setting-up-eslint-in-react-c20015ef35f7
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', 'react-with-styles'],
  rules: {
    'no-constant-condition': 0, // allow while (true)
    'no-undef': 0,

    // Prop Types warnings (this works instantly if you change it to 1)
    // https://stackoverflow.com/questions/30948970/how-to-disable-eslint-react-prop-types-rule-in-a-file
    'react/prop-types': 0,

    // This does not work with MUI for some reason (but I leave it just in case)
    // https://github.com/airbnb/eslint-plugin-react-with-styles
    'react-with-styles/no-unused-styles': 1,

    'no-empty': 1,

    'no-unused-vars': 1,
  },
}
