// See also object-types.js in jskos-tools

const expectedTypes = {
  concept: "http://www.w3.org/2004/02/skos/core#Concept",
  scheme: "http://www.w3.org/2004/02/skos/core#ConceptScheme",
  registry: "http://purl.org/cld/cdtype/CatalogueOrIndex",
  distribution: "http://www.w3.org/ns/dcat#Distribution",
  concordance: "http://rdfs.org/ns/void#Linkset",
  mapping: [
    "http://www.w3.org/2004/02/skos/core#mappingRelation",
    "http://www.w3.org/2004/02/skos/core#closeMatch",
    "http://www.w3.org/2004/02/skos/core#exactMatch",
    "http://www.w3.org/2004/02/skos/core#broadMatch",
    "http://www.w3.org/2004/02/skos/core#narrowMatch",
    "http://www.w3.org/2004/02/skos/core#relatedMatch"
  ]
}

module.exports = (obj, type) => {
  const expect = expectedTypes[type]

  if (!expect || !obj || !obj.type) return


  if (type === "annotation" && obj.type !== "Annotation") {
    return { message: "annotation type must be \"Annotation\"" }
  } 

  if (!Array.isArray(obj.type)) {
    return { message: `${type} type must be an array` }
  } else if (obj.type.length) {

    if (type === "mapping") {
      if (!expect.find(t => obj.type[0] === t)) {
        return { message: "mapping type must be a SKOS mapping property" }
      }
    } else if (obj.type[0] !== expect) {
      return { message: `${type} type must be "${expect}"` }
    }
  }
}
