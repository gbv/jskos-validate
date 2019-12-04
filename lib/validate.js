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

const Ajv = new require("ajv")
const ajv = new Ajv({ extendRefs: true })

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

const schemaDefinition = {}
const compiledStrict = {}

for (let type of types) {
  const schema = require(`../jskos/schemas/${type}.schema.json`)
  schemaDefinition[type] = schema

  for (let parentType of (isa[type] || [])) {
    schema.definitions = schema.definitions || {}
    Object.assign(schema.definitions, schemaDefinition[parentType].definitions)
    Object.assign(schema.properties, schemaDefinition[parentType].properties)    
  }
  delete schema.allOf
  delete schema.anyOf

  schema.patternProperties = { "^_": {}, "^[A-Z0-9]+$": {} }
  schema.additionalProperties = false

  if (type == "mapping") {
    console.log(schema)
  }

  ajv.addSchema(schema)
}

const validate = {}
for (let type of types) {
  compiledStrict[type] = ajv.compile(schemaDefinition[type])
  validate[type] = (data) => {
    const result = compiledStrict[type](data)
    validate[type].errors = compiledStrict[type].errors
    return result
  }
}

module.exports = validate
