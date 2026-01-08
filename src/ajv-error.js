/* Map ajv validation error to Data Validation Error Format */

const errorDetails = {
  required: "missing field '${missingProperty}'",
  unevaluatedProperties: "disallowed field '${unevaluatedProperty}'",
  const: "expected value '${allowedValue}'",
  type: "expected value of type ${type}",
  format: "value must have format ${format}",
  pattern: "value must match pattern '${pattern}'",
}

export default ({ message, instancePath, keyword, params, schemaPath }) => {
  const error = { message }

  if (instancePath !== undefined) {
    error.position = { jsonpointer: instancePath }
  }

  if (keyword) {
    if (errorDetails[keyword]) {
      error.message = errorDetails[keyword].replace(/\$\{([^}]+)\}/, (_,p) => params[p])
    } else if (keyword === "anyOf" || keyword === "oneOf") {
      error.message = `violation of schema rule '${schemaPath}'`
    }
  }

  return error
}
