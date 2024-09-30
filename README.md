# JSKOS Validation

[![Test and build](https://github.com/gbv/jskos-validate/actions/workflows/test-and-build.yml/badge.svg)](https://github.com/gbv/jskos-validate/actions/workflows/test-and-build.yml)
[![GitHub package version](https://img.shields.io/github/package-json/v/gbv/jskos-validate.svg?label=version)](https://github.com/gbv/jskos-validate)
[![NPM package name](https://img.shields.io/badge/npm-jskos--validate-blue.svg)](https://www.npmjs.com/package/jskos-validate)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

> Validation for JSKOS data.

This repository contains tools for validating [JSKOS data](http://gbv.github.io/jskos/).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [unknownFields](#unknownfields)
  - [schemes](#schemes)
  - [knownSchemes](#knownschemes)
  - [rememberSchemes](#rememberschemes)
  - [errors and errorMessages](#errors-and-errormessages)
  - [version](#version)
- [Maintainers](#maintainers)
- [Publish](#publish)
  - [Updating JSKOS Submodule](#updating-jskos-submodule)
- [Contribute](#contribute)
- [License](#license)

## Install

For CLI usage, better use a client such as [jskos-cli](https://www.npmjs.com/package/jskos-cli).

Install as dependency to your Node project (requires Node.js 18 or later):

```
npm i jskos-validate
```

We are also providing a browser bundle: https://cdn.jsdelivr.net/npm/jskos-validate@1/dist/jskos-validate.js It will be available under the global name `JSKOS_VALIDATE` which is an object with the member `validate` (see below).

Or clone the current version for development:

```bash
git clone --recursive https://github.com/gbv/jskos-validate.git
cd jskos-validate
npm ci
npm run build
```

**Note:** As of v1, the package includes *precompiled JSON Schemas*. This means that the schemas won't have to be compiled on first import, but the package size is larger.

## Usage

As of v1, import the package as follows:

```js
// ESM
import { validate } from "jskos-validate"
// CJS
const { validate } = require("jskos-validate")
// Browser
const { validate } = JSKOS_VALIDATE
```

This module provides validation methods for each [JSKOS object type](http://gbv.github.io/jskos/jskos.html#object-types) based on JSON Schemas and additional constraints.

```js
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
validate.version // 0.5.4
```

## Maintainers

- [@stefandesu](https://github.com/stefandesu)
- [@nichtich](https://github.com/nichtich)

## Publish

Please work on the `dev` branch during development (or better yet, develop in a feature branch and merge into `dev` when ready).

When a new release is ready (i.e. the features are finished, merged into `dev`, and all tests succeed), run the included release script (replace "patch" with "minor" or "major" if necessary):

```bash
npm run release:patch # or minor, or major
```

This will:
- Check that we are on `dev`
- Run tests and build to make sure everything works
- Make sure `dev` is up-to-date
- Run `npm version patch` (or "minor"/"major")
- Push changes to `dev`
- Switch to `main`
- Merge changes from `dev`
- Push `main` with tags
- Switch back to `dev`

After running this, GitHub Actions will **automatically publish the new version to npm**. It will also create a new GitHub Release draft. Please **edit and publish the release draft manually**.

### Updating JSKOS Submodule

Run this command to update the JSKOS submodule in Git to the latest commit: `git submodule update --remote --merge`

## Contribute

Please use [GitHub issues](https://github.com/gbv/jskos-validate/issues) for bug reports, feature requests or questions.

PRs accepted **against the `dev` branch**.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2019 Verbundzentrale des GBV (VZG)
