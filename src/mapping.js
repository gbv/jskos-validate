import { mappingTypeByUri } from "jskos-tools"

export default (data) => { //, { knownSchemes, schemeList } = {}) => {
  const errors = []

  // mapping type
  if ("type" in data) {
    const negativity = data.type[0] === false
    const types = negativity ? data.type.slice(1) : data.type
    if (!mappingTypeByUri(types[0])) {
      errors.push(`First type of a mapping must be SKOS mapping property, got: ${types[0]}`)
    } else {      
      const duplicated = types.slice(1).filter(uri => mappingTypeByUri(uri))
      errors.push(...duplicated.map(uri => `Found additional SKOS mapping property: ${uri}`))
    }
  }

  // TODO: check schemes

  // TODO: check identifier

  return errors
}
