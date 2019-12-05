function errorMessage(error) {
  const { keyword, params, dataPath } = error

  const message = error.message.toLowerCase()
  const path = dataPath.slice(1).replace(/\//g, ".").trim()

  switch (keyword) {

  case "additionalProperties": 
    return `${message} '${params.additionalProperty}'` + (path ? ` in ${path}` : "")

  case "not":
    return path ? `${path} not valid` : "invalid"

  case "oneOf":
  case "anyOf": 
    return message.slice(0, -9)
    
  default:
    return path ? `${path} ${message}` : message
  }
}

module.exports = errors => errors.map(errorMessage)
