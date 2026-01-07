/**
 * Validate JSKOS objects.
 *
 * This module provides validation methods for each
 * [JSKOS object type](http://gbv.github.io/jskos/#object-types)
 * based on JSON Schemas and additional constraints.
 *
 * <pre>
 * const validate = require("jskos-validate")
 *
 * let concept = { ... }
 * validate.concept(concept) // returns true or false
 *
 * let mapping = { ... }
 * validate.mapping(mapping) // returns true or false
 *
 * // errors can be inspected as side-effect
 * if (validate.mapping.errors.length) {
 *   validate.mapping.errorMessages.forEach(console.error)
 * }
 * </pre>
 *
 * Validation options can be passed with a config object as second argument.
 * The following configuration fields are supported:
 *
 * - unknownFields
 * - schemes
 * - rememberSchemes
 * - knownSchemes
 *
 * @module validate
 * @memberof module:jskos-validate
 */

import jskosVersion from "./jskos-version.js"

import typeError from "./types.js"
import * as jskos from "jskos-tools"
import checkConcept from "./concept.js"
// import checkRegistry from "./registry.js"

const constraints = {
  concept: checkConcept,
}

const types = [
  "resource", "item", "bundle",
  "concept", "scheme", "mapping", "concordance", "registry", "distribution",
  "service", "dataset",
  "occurrence", "annotation",
]

// Use precompiled schemas
import * as laxCompiled from "./lax.js"
import * as strictCompiled from "./strict.js"

export const validate = (data, options={}) => {
  const type = (jskos.guessObjectType(data, true) || "").toLowerCase() || "resource"
  const result = validate[type](data, options)

  validate.errors = validate[type].errors
  validate.errorMessages = validate[type].errorMessages
  return result
}

validate.version = jskosVersion

for (let type of types) {

  validate[type] = (data, options={}) => {
    const { unknownFields, schemes, rememberSchemes, knownSchemes } = options
    const schemeList = knownSchemes || schemes || rememberSchemes || []

    const compiled = unknownFields ? laxCompiled[type] : strictCompiled[type]
    const result = compiled(data)
    const errors = compiled.errors || [] // TODO: map to Data Validation Error Format

    const typeFail = typeError(data, type)
    if (typeFail) {
      errors.push(typeFail)
    }

    if (type === "scheme" && rememberSchemes && !errors.length && data.uri) {
      const found = schemeList.findIndex(s => jskos.compare(s, data))
      if (found >= 0) {
        schemeList[found] = data
      } else {
        schemeList.push(data)
      }
    }

    const check = constraints[type]
    if (check) {
      const errs = check(data, { ...options, schemeList })
      errors.push(...(errs || []))
    }

    validate[type].errors = errors
    validate[type].errorMessages = errors.map(goodErrorMessage)

    return result && !errors.length
  }
}

const goodErrorMessage = e => {
  let { message } = e
  if (e.instancePath) {
    message = `${e.instancePath} ${message}`
  }
  if (e.keyword == "additionalProperties") {
    message += ` '${e.params.additionalProperty}'`
  }
  return message
}
