/**
 * JSKOS Validation.
 * @module jskos-validate
 */

/**
 * Version of the [JSKOS specification](http://gbv.github.io/jskos/)
 * that this module is based on.
 */
const version = "0.4.4"

let validate = require("./lib/validate")
validate.version = version

module.exports = validate
