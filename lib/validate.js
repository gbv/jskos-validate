/**
 * Validate JSKOS objects.
 *
 * This module provides validation methods for each
 * [JSKOS object type](http://gbv.github.io/jskos/jskos.html#object-types)
 * based on JSON Schemas.
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
 * ...
 * </pre>
 *
 * @module validate
 * @memberof module:jskos-validate
  */

// Version of JSKOS specification that this module is based on
const jskosVersion = "0.5.3"

import typeError from "./types.js"
import * as jskos from "jskos-tools"

const types = [
  "resource", "item", "bundle",
  "concept", "scheme", "mapping", "concordance", "registry", "distribution",
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
    const errors = compiled.errors || []

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

    if (type === "concept") {
      const { uri, notation, inScheme } = data

      if (knownSchemes && !(inScheme && inScheme.length)) {
        errors.push({ message: `concept ${uri} must have inScheme` })
        return
      }

      (inScheme||[]).forEach(scheme => {
        const storedScheme = schemeList.find(s => jskos.compare(s, scheme))

        if (knownSchemes) {
          if (!storedScheme) {
            errors.push({ message: `concept ${uri} must be inScheme a known vocabulary` })
            return
          }
          scheme = storedScheme
        } else if(storedScheme) {
          scheme = { ...storedScheme, ...scheme }
        }

        const { namespace, notationPattern, uriPattern } = scheme

        if (uri && namespace && !uri.startsWith(namespace)) {
          errors.push({ message: `concept URI ${uri} does not match namespace ${namespace}` })
        }
        if (uri && uriPattern && !uri.match(uriPattern)) {
          errors.push({ message: `concept URI ${uri} does not match ${uriPattern}` })
        }
        if (notation && notation.length && notationPattern && !notation[0].match(notationPattern)) {
          errors.push({ message: `concept notation ${notation[0]} does not match ${notationPattern}` })
        }
      })
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
