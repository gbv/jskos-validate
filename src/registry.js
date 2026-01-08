import jskos from "jskos-tools"

export default (data) => {
  const { objectTypes } = data
  const errors = []

  if (objectTypes?.length && objectTypes.indexOf(null) === -1) {
    const set = new Set(objectTypes)
    for (let uri of jskos.usedObjectTypes(data)) {
      if (!set.has(uri)) {
        errors.push({
          message: `missing object type URI ${uri}`,
          position: { jsonpointer: "/objectTypes" },
        })
      }
    }
  }

  return errors
}
