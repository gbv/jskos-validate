const assert = require("assert")
const validate = require("../lib/validate")

describe("Options", () => {
  it("allows custom fields by default", () => {
    assert.ok(validate.concept({FOO:1}))
  })
  it("allows unknown fields if enabled", () => {      
    assert.ok(validate.concept({x:1}, {unknownFields: true}))
  }) 
}) 
