import * as jskos from "jskos-tools"

export default (data, { knownSchemes, schemeList } = {}) => {
  const { uri, notation, inScheme } = data

  if (knownSchemes && !inScheme?.length) {
    return [{ message: `concept ${uri} must have inScheme` }]
  }

  for (let scheme of (inScheme || [])) {
    const storedScheme = schemeList?.find(s => jskos.compare(s, scheme))

    if (knownSchemes) {
      if (!storedScheme) {
        return [{ message: `concept ${uri} must be inScheme a known vocabulary` }]
      }
      scheme = storedScheme
    } else if(storedScheme) {
      scheme = { ...storedScheme, ...scheme }
    }

    const { namespace, notationPattern, uriPattern } = scheme

    if (uri && namespace && !uri.startsWith(namespace)) {
      return [{ message: `concept URI ${uri} does not match namespace ${namespace}` }]
    }
    if (uri && uriPattern && !uri.match(uriPattern)) {
      return [{ message: `concept URI ${uri} does not match ${uriPattern}` }]
    }
    if (notation && notation.length && notationPattern && !notation[0].match(notationPattern)) {
      return [{ message: `concept notation ${notation[0]} does not match ${notationPattern}` }]
    }
  }
}
