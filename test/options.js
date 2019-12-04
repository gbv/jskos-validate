const assert = require("assert")
const validate = require("../lib/validate")

describe("Options", () => {
  it("allows custom properties by default", () => {
    assert.ok(validate.concept({FOO:1}))
  }) 
}) 
