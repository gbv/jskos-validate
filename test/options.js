const assert = require("assert")
const validate = require("../lib/validate")

describe("version", () => {
  it("exports a JSKOS spec version", () => {
    assert.ok(/^\d+\.\d+\.\d+$/.test(validate.version))
  })
})

describe("unknownFields", () => {
  it("allows custom fields by default", () => {
    assert.ok(validate({FOO:1}))
  })
  it("allows unknown fields if enabled", () => {      
    assert.ok(validate({x:1}, {unknownFields: true}))
  }) 
}) 

describe("schemes", () => {
  const schemes = [{ uri: "a:scheme", notationPattern: "[a-z]" }]
  const inScheme = [{ uri: "a:scheme" }]
  const c1 = { uri: "c:1", notation: ["a"], inScheme }
  const c2 = { uri: "c:2", notation: ["1"], inScheme }
  const c3 = { ...c2, inScheme: [{ uri: "a:scheme", notationPattern: "[0-9]" }]}

  it("used option schemes for lookup", () => {
    assert.ok(validate.concept(c1, { schemes }))
    assert.ok(!validate.concept(c2, { schemes }))
  })

  it("inScheme overrides schemes", () => {
    assert.ok(validate.concept(c3, { schemes }))
  })

//    let object = JSON.parse(fs.readFileSync(file))
})

describe("rememberSchemes", () => {
  const rememberSchemes = []
  const aScheme = { uri: "a:scheme", notationPattern: "[a-z]" }
  const aScheme2 = { uri: "a:scheme", notationPattern: "[0-9]" }
  const bScheme = { uri: "b:scheme", notationPattern: "[0-9]" }

  validate.scheme(aScheme, { rememberSchemes })
  assert.deepEqual(rememberSchemes, [aScheme])

  validate.scheme(aScheme2, { rememberSchemes })
  validate.scheme(bScheme, { rememberSchemes })

  assert.deepEqual(rememberSchemes, [aScheme2, bScheme])
})

describe("knownSchemes", () => {
  const knownSchemes = [{ uri: "a:scheme", notationPattern: "[a-z]" }]
  const concept = { uri: "c:1", notation: ["a"], inScheme: [{ uri: "a:scheme" }] }
  
  assert.ok(validate.concept(concept, { knownSchemes }))
  concept.inScheme[0].notationPattern = "[0-9]" // must be ignored
  assert.ok(validate.concept(concept, { knownSchemes }))
  concept.inScheme = [{uri: "another:scheme"}]
  assert.ok(!validate.concept(concept, { knownSchemes }))
  delete concept.inScheme
  assert.ok(!validate.concept(concept, { knownSchemes }))
})
