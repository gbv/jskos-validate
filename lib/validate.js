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
const jskosVersion = "0.4.8"

const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const errorMessages = require("./errors")
const typeError = require("./types")

const types = [
  "resource", "item", "bundle",
  "concept", "scheme", "mapping", "concordance", "registry", "distribution",
  "occurrence", "annotation"
]

const isa = {
  item: ["resource"],
  concept: ["item", "bundle"],
  scheme: ["item"],
  mapping: ["item"],
  concordance: ["item"],
  registry: ["item"],
  distribution: ["item"],
  occurrence: ["resource", "bundle"]
}

const strictSchemas = {}
const laxSchema = {}
const strictCompiled = {}
const laxCompiled = {}

for (let type of types) {
  const schema = require(`../jskos/schemas/${type}.schema.json`)

  // add lax schema
  const json = JSON.stringify(schema,null,4).replace(/\.schema\.json/g,".schema.lax.json")
  laxSchema[type] = JSON.parse(json)
  ajv.addSchema(laxSchema[type])

  // construct and add strict schema
  strictSchemas[type] = schema

  for (let parentType of (isa[type] || [])) {
    schema.definitions = schema.definitions || {}
    Object.assign(schema.definitions, strictSchemas[parentType].definitions)
    Object.assign(schema.properties, strictSchemas[parentType].properties)
  }
  delete schema.allOf
  delete schema.anyOf

  schema.patternProperties = { "^_": {}, "^[A-Z0-9]+$": {} }
  schema.additionalProperties = false

  ajv.addSchema(schema)
}

const validate = { version: jskosVersion }

for (let type of types) {
  strictCompiled[type] = ajv.compile(strictSchemas[type])
  laxCompiled[type] = ajv.compile(laxSchema[type])

  validate[type] = (data, options={}) => {
    const { unknownFields } = options
    const compiled = unknownFields ? laxCompiled[type] : strictCompiled[type]
    const result = compiled(data)
    const errors = compiled.errors || []

    const typeFail = typeError(data, type)
    if (typeFail) {
      errors.push(typeFail)
    }
    validate[type].errors = errors.length ? errors : null
    validate[type].errorMessages = errorMessages(errors)

    return result && !errors.length
  }
}

module.exports = validate
