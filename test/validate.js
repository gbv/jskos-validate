import * as glob from "glob"
import fs from "node:fs"
import assert from "node:assert"
import { validate } from "../src/validate.js"

let types = ["resource", "item", "concept", "scheme", "mapping", "concordance", "registry", "distribution", "occurrence", "bundle", "annotation"]
let examples = {}

// Import local examples
for (let type of types) {
  examples[type] = []
  for (let expected of [true, false]) {
    let files = glob.sync(`examples/${type}/${expected ? "pass" : "fail"}/*.json`)
    for (let file of files) {
      try {
        let object = JSON.parse(fs.readFileSync(file))
        examples[type].push({
          object,
          expected,
          file,
        })
      } catch(error) {
        console.log("Unable to parse file", file)
      }
    }
  }
}

// Import examples included in the JSKOS specification
let files = glob.sync("jskos/examples/*.json")
for (let file of files) {
  let type = null
  for (let possibleType of types) {
    if (file.indexOf(possibleType) != -1) {
      type = possibleType
      break
    }
  }
  if (!type) {
    continue
  }
  try {
    let object = JSON.parse(fs.readFileSync(file))
    examples[type].push({
      object,
      expected: true,
      file,
    })
  } catch(error) {
    console.log("Unable to parse file", file)
  }
}

describe("JSKOS JSON Schemas", () => {

  // Check if all validators exist
  describe("validators", () => {
    for (let type of types) {
      it(`should exist for ${type}`, () => {
        assert.equal(validate[type] != null, true, `validator for ${type} does not exist`)
      })
    }
  })

  // Validate difference object types
  for (let type of types) {
    let typePlural = type + "s"
    const validator = validate[type]
    describe(typePlural, () => {
      for (let { object, expected, file } of examples[type]) {
        it(`should validate ${typePlural} (${file})`, () => {
          // Support for arrays of objects
          let objects = [object]
          if (Array.isArray(object)) {
            objects = object
          }
          for (let object of objects) {
            const result = validator(object)

            assert.equal(result, expected)

            if (expected) {
              assert.equal(validator.errors.length, 0)
              assert.equal(validator.errorMessages.length, 0)
            } else {
              assert.ok(validator.errors.length)
              assert.ok(validator.errorMessages.length)
            }
          }
        })
      }
      // Additional test for "unknownFields = true" (=lax schema) for annotations
      if (type === "annotation") {
        it("should validate annotation with lax schema (unknownFields = true) (1)", () => {
          const result = validator({ target: { id: "abc:def" } }, { unknownFields: true })
          assert.equal(result, true, validator.errorMessages.join(", "))
          assert.equal(validator.errors.length, 0)
          assert.equal(validator.errorMessages.length, 0)
        })
        it("should validate annotation with lax schema (unknownFields = true) (2)", () => {
          const result = validator({ body: [] }, { unknownFields: true })
          assert.equal(result, true)
          assert.equal(validator.errors.length, 0)
          assert.equal(validator.errorMessages.length, 0)
        })
      }
    })
  }
})
