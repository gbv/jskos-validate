import gbv from "eslint-config-gbv"

export default [
  ...gbv,
  {
    rules: {
      "no-cond-assign": "off",
    },
  },
  {
    ignores: [
      "src/lax.js",
      "src/strict.js",
      "jskos",
    ],
  },
]
