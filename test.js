const test = require('tap').test
const urlTemplate = require('./')

const scenarios = [
  {
    input: {
      url: ''
    },
    expected: {
      url: '',
      variables: {
        used: [],
        missing: []
      }
    }
  },
  {
    input: {
      url: '/repos/:owner/:repo',
      variables: {
        owner: 'foo',
        repo: 'bar',
        unused: 'baz'
      }
    },
    expected: {
      url: '/repos/foo/bar',
      variables: {
        used: ['owner', 'repo'],
        missing: []
      }
    }
  },
  {
    input: {
      url: '/repos/:owner/:repo/issues',
      variables: {
        owner: 'octokit',
        foo: 'bar'
      }
    },
    expected: {
      url: '/repos/octokit/:repo/issues',
      variables: {
        used: ['owner'],
        missing: ['repo']
      }
    }
  },
  {
    input: {
      url: 'http://api.github.com/repos/octocat/Hello-World/contents/{+path}',
      variables: {
        path: 'foo/bar/baz'
      }
    },
    expected: {
      url: 'http://api.github.com/repos/octocat/Hello-World/contents/foo/bar/baz',
      variables: {
        used: ['path'],
        missing: []
      }
    }
  },
  {
    input: {
      url: 'http://api.github.com/repos/octocat/Hello-World/branches{/branch}'
    },
    expected: {
      url: 'http://api.github.com/repos/octocat/Hello-World/branches',
      variables: {
        used: [],
        missing: []
      }
    }
  },
  {
    input: {
      url: 'http://api.github.com/repos/octocat/Hello-World/branches{/branch}',
      variables: {
        branch: 'foo/bar/baz'
      }
    },
    expected: {
      url: 'http://api.github.com/repos/octocat/Hello-World/branches/foo%2Fbar%2Fbaz',
      variables: {
        used: ['branch'],
        missing: []
      }
    }
  },
  {
    input: {
      url: 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}'
    },
    expected: {
      url: 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets',
      variables: {
        used: [],
        missing: []
      }
    }
  },
  {
    input: {
      url: 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}',
      variables: {
        name: 'foo/bar.txt'
      }
    },
    expected: {
      url: 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets?name=foo%2Fbar.txt',
      variables: {
        used: [
          'name'
        ],
        missing: []
      }
    }
  },
  {
    input: {
      url: 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}',
      variables: {
        name: 'foo/bar.txt',
        label: 'baz/daz'
      }
    },
    expected: {
      url: 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets?name=foo%2Fbar.txt&label=baz%2Fdaz',
      variables: {
        used: [
          'name',
          'label'
        ],
        missing: []
      }
    }
  },
  {
    input: {
      url: 'http://api.github.com/repos/octocat/Hello-World/notifications{?since, all, participating}',
      variables: {
        all: true
      }
    },
    expected: {
      url: 'http://api.github.com/repos/octocat/Hello-World/notifications?all=true',
      variables: {
        used: ['all'],
        missing: []
      }
    }
  },
  {
    input: {
      url: 'http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}'
    },
    expected: {
      url: 'http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}',
      variables: {
        used: [],
        missing: [
          'base',
          'head'
        ]
      }
    }
  },
  {
    input: {
      url: 'http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}',
      variables: {
        base: 'foo/bar/baz'
      }
    },
    expected: {
      url: 'http://api.github.com/repos/octocat/Hello-World/compare/foo%2Fbar%2Fbaz...{head}',
      variables: {
        used: [
          'base'
        ],
        missing: [
          'head'
        ]
      }
    }
  },
  {
    input: {
      url: 'http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}',
      variables: {
        base: 'foo/bar/baz',
        head: 'other:foo/bar/baz'
      }
    },
    expected: {
      url: 'http://api.github.com/repos/octocat/Hello-World/compare/foo%2Fbar%2Fbaz...other%3Afoo%2Fbar%2Fbaz',
      variables: {
        used: [
          'base',
          'head'
        ],
        missing: []
      }
    }
  }
]

scenarios.forEach((scenario) => {
  const argumentsString = 'variables' in scenario.input
     ? `${JSON.stringify(scenario.input.url)}, ${JSON.stringify(scenario.input.variables)}`
     : JSON.stringify(scenario.input.url)

  test(`urlTemplate(${argumentsString})`, t => {
    t.deepEqual(urlTemplate(scenario.input.url, scenario.input.variables), scenario.expected)
    t.end()
  })
})
