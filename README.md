# JSKOS Validation

[![Test](https://github.com/gbv/jskos-validate/actions/workflows/test.yml/badge.svg)](https://github.com/gbv/jskos-validate/actions/workflows/test.yml)
[![GitHub package version](https://img.shields.io/github/package-json/v/gbv/jskos-validate.svg?label=version)](https://github.com/gbv/jskos-validate)
[![NPM package name](https://img.shields.io/badge/npm-jskos--validate-blue.svg)](https://www.npmjs.com/package/jskos-validate)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

> Validation for JSKOS data.

This repository contains tools for validating [JSKOS data](http://gbv.github.io/jskos/).

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Install](#install)
- [Usage](#usage)
  - [unknownFields](#unknownfields)
  - [schemes](#schemes)
  - [knownSchemes](#knownschemes)
  - [rememberSchemes](#rememberschemes)
  - [errors and errorMessages](#errors-and-errormessages)
  - [version](#version)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

You will unlikely need to directly install jskos-validate. Better use a client such as [jskos-cli](https://www.npmjs.com/package/jskos-cli) instead!

Install as dependency to your node project (requires at least NodeJS 8):

```
npm install --save jskos-validate
```

Or clone the current version for development:

```bash
git clone --recursive https://github.com/gbv/jskos-validate.git
cd jskos-validate
npm install
```

## Usage

This module provides validation methods for each [JSKOS object type](http://gbv.github.io/jskos/jskos.html#object-types) based on JSON Schemas and additional constraints.

```js
const validate = require("jskos-validate")

let concept = { ... }
validate.concept(concept) // returns true or false
validate(concept)         // same if concept contains type field

let mapping = { ... }
validate.mapping(mapping) // returns true or false
validate(mapping)         // same if mapping contains type field

// ...
```

See npm module [jskos-cli](https://www.npmjs.com/package/jskos-cli) for a command line interface to JSKOS validation.

### unknownFields

Setting the option `unknownFields` to a truthy value will not complain about additional fields. This is useful for instance to validate JSKOS data with newly introduced fields with an old schema.

```js
const validate = require("jskos-validate")

validate(data, { unknownFields: true })
```

### schemes

Option `schemes` can be set to an array of JSKOS Concept Schemes to be looked up by their URI in field `inScheme` of a concept. Scheme fields `namespace`, `uriPattern` and `notationPattern` are used for validation (unless these fields included in the `inScheme`).

### knownSchemes

Works like option `schemes` but enforces concepts to be `inScheme` of one of the given vocabularies.

### rememberSchemes

Works like option `schemes` but successfully validated vocabularies are added to the list array of Concept Schemes (overriding vocabularies with same URI).

```js
const schemes = []
validate.scheme(aScheme, { rememberSchemes: schemes })
validate.concept(aConcept, { schemes }) // includes aScheme for validation
```

This option is ignored if `knownSchemes` is set because in this case the set of vocabularies is fixed.

### errors and errorMessages

Property `errors` and `errorMessages` of the validation function contain errors in detailled format and as array of error message strings, respectively.

```js
const validate = require("jskos-validate")

if (!validate.concept(data)) {
  validate.concept.errorMessages.forEach(console.error)
}

if (!validate(data)) {
  validate.errorMessages.forEach(console.error)
}
```

### version

Returns the version of JSKOS specification that is used for validation.

```js
validate.version // 0.5.0
```

## Maintainers

- [@stefandesu](https://github.com/stefandesu)
- [@nichtich](https://github.com/nichtich)

## Contributing

Please use [GitHub issues](https://github.com/gbv/jskos-validate/issues) for bug reports, feature requests or questions.

*Maintainers only:* To publish a new version on npm via GitHub Actions:

```bash
npm run release:patch # or minor, or major
```

## License

MIT © 2019 Verbundzentrale des GBV (VZG)
