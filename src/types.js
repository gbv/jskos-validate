// See also object-types.js in jskos-tools

const expectedTypes = {
  concept: "http://www.w3.org/2004/02/skos/core#Concept",
  scheme: "http://www.w3.org/2004/02/skos/core#ConceptScheme",
  registry: "http://www.w3.org/ns/dcat#Catalog",
  distribution: "http://www.w3.org/ns/dcat#Distribution",
  service: "http://www.w3.org/ns/dcat#DataService",
  concordance: "http://rdf-vocabulary.ddialliance.org/xkos#Correspondence",
  mapping: [
    "http://www.w3.org/2004/02/skos/core#mappingRelation",
    "http://www.w3.org/2004/02/skos/core#closeMatch",
    "http://www.w3.org/2004/02/skos/core#exactMatch",
    "http://www.w3.org/2004/02/skos/core#broadMatch",
    "http://www.w3.org/2004/02/skos/core#narrowMatch",
    "http://www.w3.org/2004/02/skos/core#relatedMatch",
  ],
}

export default (obj, type) => {
  const expect = expectedTypes[type]

  if (!expect || !obj || !obj.type) {
    return
  }

  if (obj.type?.length) {
    if (type === "mapping") {
      if (!expect.find(t => obj.type[0] === t)) {
        return {
          message: "mapping type must be a SKOS mapping property",
          position: { jsonpointer: "/type" },
        }
      }
    } else if (obj.type[0] !== expect) {
      if (type === "concordance" && obj.type[0] === "http://rdfs.org/ns/void#Linkset") {
        return // allow for backwards compatibility
      }
      return {
        message: `${type} type must be "${expect}"`,
        position: { jsonpointer: "/type/0" },
      }
    }
  }
}
