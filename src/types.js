import jskos from "jskos-tools"

const { objectTypes } = jskos

const expectedTypes = Object.fromEntries(
  Object.entries(objectTypes)
    .filter(t => t[1].type)
    .map(([type, def]) => [ type.toLowerCase().replace(/^concept(.+)/, "$1"), def.type[0] ]))

const deprecated = {
  concordance: "http://rdfs.org/ns/void#Linkset",
  registry: "http://purl.org/cld/cdtype/CatalogueOrIndex",
}

export default (obj, type) => {
  const expect = expectedTypes[type]

  if (type === "annotation" || !expect || !obj || !obj.type) {
    return
  }

  if (obj.type?.length) {
    if (type === "mapping") {
      if (!objectTypes.ConceptMapping.type.find(t => obj.type[0] === t)) {
        return {
          message: "mapping type must be a SKOS mapping property",
          position: { jsonpointer: "/type" },
        }
      }
    } else if (obj.type[0] !== expect) {
      if (deprecated[type] && obj.type[0] === deprecated[type]) {
        return // allow for backwards compatibility. TODO: emit warning or disallow in strict mode
      }
      return {
        message: `${type} type must be "${expect}", got ${obj.type}`,
        position: { jsonpointer: "/type/0" },
      }
    }
  }
}
