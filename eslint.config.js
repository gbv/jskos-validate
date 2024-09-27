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
      "lib/lax.js",
      "lib/strict.js",
      "jskos",
    ],
  },
]
