import Ajv from "ajv"
import standaloneCode from "ajv/dist/standalone/index.js"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = path.dirname(fileURLToPath((import.meta.url)))
import addFormats from "ajv-formats"
import addFormatsDraft2019 from "ajv-formats-draft2019"

const types = [
  "resource", "item", "bundle",
  "concept", "scheme", "mapping", "concordance", "registry", "distribution",
  "occurrence", "annotation",
]
const isa = {
  item: ["resource"],
  concept: ["item", "bundle"],
  scheme: ["item"],
  mapping: ["item"],
  concordance: ["item"],
  registry: ["item"],
  distribution: ["item"],
  occurrence: ["resource", "bundle"],
}
const laxSchemas = {}
const strictSchemas = {}
  
const options = {
  code: {
    source: true,
    esm: true,
  },
  allErrors: true,
}
const ajv = {
  lax: new Ajv(options),
  strict: new Ajv(options),
}
  
addFormats(ajv.lax)
addFormats(ajv.strict)
addFormatsDraft2019(ajv.lax)
addFormatsDraft2019(ajv.strict)
  
for (const type of types) {
  const schemaFile = path.join(__dirname, `../jskos/schemas/${type}.schema.json`)
  const json = await fs.readFile(schemaFile, "utf8")
  
  // Lax schema without any additions
  const laxSchema = JSON.parse(json)
  for (const parentType of (isa[type] || [])) {
    laxSchema.definitions = laxSchema.definitions || {}
    Object.assign(laxSchema.definitions, laxSchemas[parentType].definitions)
    Object.assign(laxSchema.properties, laxSchemas[parentType].properties)
  }
  laxSchemas[type] = laxSchema
  ajv.lax.addSchema(laxSchemas[type])
  
  // Strict schema needs some additions
  const strictSchema = JSON.parse(json)
  for (const parentType of (isa[type] || [])) {
    strictSchema.definitions = strictSchema.definitions || {}
    Object.assign(strictSchema.definitions, strictSchemas[parentType].definitions)
    Object.assign(strictSchema.properties, strictSchemas[parentType].properties)
  }
  delete strictSchema.allOf
  delete strictSchema.anyOf
  strictSchema.patternProperties = { "^_": {}, "^[A-Z0-9]+$": {} }
  strictSchema.additionalProperties = false
  strictSchemas[type] = strictSchema
  ajv.strict.addSchema(strictSchema)
}
  
const idMapping = {}
for (const type of types) {
  idMapping[type] = `https://gbv.github.io/jskos/${type}.schema.json`
}
  
for (const mode of Object.keys(ajv)) {
  let code = standaloneCode(ajv[mode], idMapping)
  // Rewrite "require" statements
  // See https://github.com/ajv-validator/ajv/issues/2209
  let match
  while (match = code.match(/const (\S+) = require\("(\S+)"\)(\S+);/)) {
    if (match[3].endsWith(".iri") || match[3].endsWith("[\"iri-reference\"]")) {
      // Somehow, these format references are compiled in the wrong way, and we have to fix them manually
      let format = "[\"iri-reference\"]"
      if (match[3].endsWith(".iri")) {
        format = ".iri"
      }
      code = code.replace(match[0], `import ${match[1]}_IMPORT from "ajv-formats-draft2019/formats/index.js"; const ${match[1]} = ${match[1]}_IMPORT${format};`)
    } else {
      code = code.replace(match[0], `import ${match[1]}_IMPORT from "${match[2]}.js"; const ${match[1]} = ${match[1]}_IMPORT${match[3]};`)
    }
  } 
  await fs.writeFile(path.join(__dirname, `../src/${mode}.js`), code)
}

// Read JSKOS version from dependency
const jskosPackage = JSON.parse(await fs.readFile(path.join(__dirname, "../jskos/package.json"), "utf8"))
await fs.writeFile(path.join(__dirname, "../src/jskos-version.js"), `export default "${jskosPackage.version}"`)
