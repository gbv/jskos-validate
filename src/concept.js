import * as jskos from "jskos-tools"

export default (data, { knownSchemes, schemeList } = {}) => {
  const { uri, notation, inScheme } = data
  const errors = []
  
  if (knownSchemes && !inScheme?.length) {
    errors.push({ message: "concept must have inScheme" })
  }

  for (let scheme of (inScheme || [])) {
    const storedScheme = schemeList?.find(s => jskos.compare(s, scheme))

    if (knownSchemes) {
      if (storedScheme) {
        scheme = storedScheme
      } else {
        errors.push({ message: "concept must be inScheme a known vocabulary" })
      }
    } else if (storedScheme) {
      scheme = { ...storedScheme, ...scheme }
    }

    if (scheme) {
      const { namespace, notationPattern, uriPattern } = scheme

      if (uri && namespace && !uri.startsWith(namespace)) {
        errors.push({
          message: `concept URI ${uri} does not match namespace ${namespace}`,
          position: { jsonpointer: "/uri" },
        })
      }
      if (uri && uriPattern && !uri.match(uriPattern)) {
        errors.push({
          message: `concept URI ${uri} does not match ${uriPattern}`,
          position: { jsonpointer: "/uri" },
        })
      }
      if (notation && notation.length && notationPattern && !notation[0].match(notationPattern)) {
        errors.push({
          message: `concept notation ${notation[0]} does not match ${notationPattern}`,
          position: { jsonpointer: "/notation/0" },
        })
      }
    }
  }

  return errors
}
