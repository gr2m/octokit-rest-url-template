module.exports = urlTemplate

// only these are used by GitHub’s REST API
// see https://github.com/gr2m/octokit-rest-url-template#list-of-githubs-url-template-variables
const OPERATORS = [
  '+',
  '/',
  '?'
]

function urlTemplate (url, variables) {
  const usedVariables = []
  const missingVariables = []

  if (!variables) {
    variables = {}
  }

  // find path placeholders in the format of ":name".
  // these are GitHub-specific and not RFC 6570 compliant
  url = url.replace(/:\w+/g, (expression) => {
    const variableName = expression.substr(1)

    if (variableName in variables) {
      usedVariables.push(variableName)
      return variables[variableName]
    }

    missingVariables.push(variableName)
    return expression
  })

  // replace placeholders in the format {name} with optional operators /, ? and +
  url = url.replace(/{([^}]+)}/g, (placeholder, expression) => {
    const hasOperator = OPERATORS.indexOf(expression.charAt(0)) !== -1
    const operator = hasOperator ? expression[0] : ''
    const variableName = hasOperator ? expression.substr(1) : expression

    // replace query variables, e.g. {?name,label}
    // There can be multiple, separated by ,
    if (operator === '?') {
      const query = variableName.split(/,\s*/).map(variableName => {
        if (!variables.hasOwnProperty(variableName)) {
          return ''
        }

        usedVariables.push(variableName)
        return `${variableName}=${encodeURIComponent(variables[variableName])}`
      }).filter(Boolean).join('&')

      return query
        ? `?${query}`
        : ''
    }

    // if variable could not be found for current placeholder ...
    if (!variables.hasOwnProperty(variableName)) {
      // return the placeholder and add variable to variables.missing array
      if (!operator) {
        missingVariables.push(variableName)
        return placeholder
      }

      // unless an operator is set, in which case just remove the placeholder from url
      return ''
    }

    usedVariables.push(variableName)

    // don’t encode variable if operator is +
    if (operator === '+') {
      return variables[variableName]
    }

    return operator + encodeURIComponent(variables[variableName])
  })

  return {
    url,
    variables: {
      used: usedVariables,
      missing: missingVariables
    }
  }
}
