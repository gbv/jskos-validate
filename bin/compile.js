import fs from "fs"
import Ajv from "ajv/dist/2020.js"
import standaloneCode from "ajv/dist/standalone/index.js"
import addFormats from "ajv-formats"
import addFormatsDraft2019 from "ajv-formats-draft2019"
import * as glob from "glob"

const schemas = Object.fromEntries(
  glob.sync("jskos/schemas/*.json").map(f => [
    f.split(/[/.]/)[2],              // JSKOS Object type
    JSON.parse(fs.readFileSync(f)),    // JSON Schema
  ]))

for (let mode of ["lax","strict"]) {
  const ajv = new Ajv({ code: { source: true, esm: true }, allErrors: true })
  addFormats(ajv)
  addFormatsDraft2019(ajv)

  if (mode === "strict") {
    // disallow unknown fields
    for (let type of "occurrence mapping concept scheme registry concordance service distribution".split(" ")) {
      schemas[type].unevaluatedProperties = false
    }
  }

  Object.values(schemas).forEach(schema => ajv.addSchema(schema))
    
  const refs = Object.fromEntries(Object.keys(schemas).map(
    type => [type,`https://gbv.github.io/jskos/${type}.schema.json`]))
  let code = standaloneCode(ajv, refs)

  // Rewrite "require" statements. See <https://github.com/ajv-validator/ajv/issues/2209>
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
  fs.writeFileSync(`src/${mode}.js`, code)
}

/*

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
  fs.writeFileSync(path.join(__dirname, `../src/${mode}.js`), code)
}
*/

// Write JSKOS version number to module
const { version } = JSON.parse(fs.readFileSync("jskos/package.json"))
fs.writeFileSync("src/jskos-version.js", `export default "${version}"`)

