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
  - [version](#version)
- [Test](#test)
- [Maintainers](#maintainers)
- [Publish](#publish)
- [Contribute](#contribute)
- [License](#license)

## Install

```bash
git clone --recursive https://github.com/gbv/jskos-validate.git
cd jskos-validate
npm i jskos-validate
```

## Usage
This module provides validation methods for each [JSKOS object type](http://gbv.github.io/jskos/jskos.html#object-types) based on JSON Schemas.

```js
const validate = require("jskos-validate")

let concept = { ... }
validate.concept(concept) // returns true or false

let mapping = { ... }
validate.mapping(mapping) // returns true or false

// ...
```

### version
Returns the version of the JSKOS specification that's used for validation.

```js
jskos.version // 0.4.4
```

## Test

```bash
npm test
```

## Maintainers

- [@stefandesu](https://github.com/stefandesu)
- [@nichtich](https://github.com/nichtich)

## Publish

To publish a new version on npm after committing your changes, follow these steps:

```bash
npm version patch # or minor, or major
git push --tags origin master
```

Travis will automatically deploy the new version based on the tag to npm.

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2019 Verbundzentrale des GBV (VZG)
