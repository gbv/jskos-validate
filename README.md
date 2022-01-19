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
validate.version // 0.4.6
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
