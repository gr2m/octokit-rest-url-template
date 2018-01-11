# @octokit/rest-url-template

---
⚠️ `@octokit/rest-url-template` is not yet published to npm, we are still
exploring it as part of [the implementation of `@octokit/rest`](https://github.com/octokit/node-github/pull/680).
---

A GitHub-specific url parse method that implements only the parts of the
[RFC 6570 URI Template specification](https://tools.ietf.org/html/rfc6570)
that is relevant for GitHub’s v3 REST API. If you look for a fully
spec-compliant implementation we recommend [url-template](https://www.npmjs.com/package/url-template).

The implemented operators are
`+`, `/` and `?` as well as the `,` separator.

It also replaces placeholders in the format of `:varname`, which is not part of
the specification.

If any placeholders of type `:varname` or `{varname}` (without operator)
have not been passed the placeholders will be left in the returned URL and
`'varname'` is added to the returned `variables.missing` array.

Placeholders of type `{/varname}`, `{?varname}` or `{+varname}` are removed
from the URL if `varname` was not passed.

Any variable that is passed and used is added to the returned `variables.missing` array.

## Usage

```js
const urlTemplate = require('@octokit/rest-url-template')

const {result, variables} = urlTemplate('/repos/:owner/:repo/issues', {
  owner: 'octokit',
  foo: 'bar'
})

// result is "/repos/octokit/:repo/issues"
// variables is {used: ['owner'], missing: ['repo']}
```

## Why

1. Single library to replace both, `{name}` and `:path` variables in paths
2. Minimal bundle size for [`@octokit/rest`](https://github.com/octokit/rest)
   client for usage in browser
3. Returning used & missing variables which is required by the implementation
   of `@octokit/rest`.

## List of GitHub’s URL template variables

This is a complete list of all variables which are used across all `*_url`
properties returned by all of GitHub’s v3 REST API.

- `{+path}`
- `{/branch}`
- `{/collaborator}`
- `{/gist_id}`
- `{/id}`
- `{/key_id}`
- `{/member}`
- `{/name}`
- `{/number}`
- `{/other_user}`
- `{/owner}`
- `{/privacy}`
- `{/ref}`
- `{/repo}`
- `{/sha}`
- `{/user}`
- `{?name,label}`
- `{?name}`
- `{?since, all, participating}`
- `{?since,all,participating}`
- `{archive_format}`
- `{base}`
- `{head}`
- `{number}`
- `{sha}`
- `{user}`

## License

[MIT]('LICENSE')
