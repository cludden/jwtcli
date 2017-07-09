# jwtcli
a `node.js` based CLI wrapper around [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)



## Installing
via npm:
```shell
$ npm install -g jwtcli
$ jwt --version
```



## Getting Started
### sign
###### Help
```shell
$ jwt sign --help
jwt sign [claims]

Options:
  --version         Show version number                                [boolean]
  -h                Show help                                          [boolean]
  -a, --algorithm   signing algorithm
        [string] [choices: "RS256", "RS384", "RS512", "ES256", "ES384", "ES512",
                           "HS256", "HS384", "HS512", "none"] [default: "HS256"]
  --audience        value of "aud" claim                                [string]
  -e, --expires-in  timestring used to calculate token ttl              [string]
  --header          custom header JSON                                  [string]
  -i, --issuer      value of "iss" claim                                [string]
  --jwtid           value of "jwtid" claim                              [string]
  --keyid           value of "keyid" claim                              [string]
  -n, --not-before  timestring used to calculate "nbf" claim            [string]
  --timestamp       include "iat" header, can be disabled with --no-timestamp
                                                       [boolean] [default: true]
  -s, --secret      JWT signing secret                       [string] [required]
  --subject         value of "sub" claim                                [string]
```
###### Example
```shell
$ jwt sign -s SECRET -e 30m -i abc '{"foo":"bar"}'
```



## Todo
- [x] sign
- [ ] decode
- [ ] verify



## Testing
run the test suite

```bash
npm test
```

run coverage

```bash
npm run coverage
```



## Contributing
1. [Fork it](https://github.com/cludden/jwtcli/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request



## License
Copyright (c) 2017 Chris Ludden.  
Licensed under the [MIT license](LICENSE.md).
