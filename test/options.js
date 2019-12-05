const assert = require("assert")
const validate = require("../lib/validate")

describe("version", () => {
  it("exports a JSKOS spec version", () => {
    assert.ok(/^\d+\.\d+\.\d+$/.test(validate.version))
  })
})

describe("options", () => {
  it("allows custom fields by default", () => {
    assert.ok(validate.concept({FOO:1}))
  })
  it("allows unknown fields if enabled", () => {      
    assert.ok(validate.concept({x:1}, {unknownFields: true}))
  }) 
}) 
