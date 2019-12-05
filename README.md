# JSKOS Validation

[![Build Status](https://travis-ci.com/gbv/jskos-validate.svg?branch=master)](https://travis-ci.com/gbv/jskos-validate)
[![GitHub package version](https://img.shields.io/github/package-json/v/gbv/jskos-validate.svg?label=version)](https://github.com/gbv/jskos-validate)
[![NPM package name](https://img.shields.io/badge/npm-jskos--validate-blue.svg)](https://www.npmjs.com/package/jskos-validate)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

> Validation for JSKOS data.

This repository contains tools for validating [JSKOS data](http://gbv.github.io/jskos/).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Publish](#publish)
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

let mapping = { ... }
validate.mapping(mapping) // returns true or false

// ...
```

See npm module [jskos-cli](https://www.npmjs.com/package/jskos-cli) for a command line interface to JSKOS validation.

### unknownFields

Setting the option `unknownFields` to a truthy value will not complain about additional fields. This is useful for instance to validate JSKOS data with newly introduced fields with an old schema.

```js
const validate = require("jskos-validate")

validate.concept(data, { unknownFields: true })
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

*Maintainers only:* To publish a new version on npm via Travis:

```bash
npm version patch # or minor, or major
git push --tags origin master
```

## License

MIT © 2019 Verbundzentrale des GBV (VZG)
