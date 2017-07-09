import jwt from 'jsonwebtoken';

export const command = 'sign [claims]';
export const describe = 'create a new JWT';

/**
 * Configure yargs parser for "sign" command
 * @param  {Yargs} yargs
 */
export function builder(yargs) {
  yargs.string('claims')
  .options({
    a: {
      alias: 'algorithm',
      type: 'string',
      desc: 'signing algorithm',
      choices: [
        'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'HS256', 'HS384', 'HS512', 'none',
      ],
      default: 'HS256',
    },
    audience: {
      type: 'string',
      desc: 'value of "aud" claim',
    },
    e: {
      alias: 'expires-in',
      type: 'string',
      desc: 'timestring used to calculate token ttl',
    },
    header: {
      type: 'string',
      desc: 'custom header JSON',
    },
    i: {
      alias: 'issuer',
      type: 'string',
      desc: 'value of "iss" claim',
    },
    jwtid: {
      type: 'string',
      desc: 'value of "jwtid" claim',
    },
    keyid: {
      type: 'string',
      desc: 'value of "keyid" claim',
    },
    n: {
      alias: 'not-before',
      type: 'string',
      desc: 'timestring used to calculate "nbf" claim',
    },
    timestamp: {
      type: 'boolean',
      desc: 'include "iat" header, can be disabled with --no-timestamp',
      default: true,
    },
    s: {
      alias: 'secret',
      type: 'string',
      desc: 'JWT signing secret',
      required: true,
    },
    subject: {
      type: 'string',
      desc: 'value of "sub" claim',
    },
  });
}

/**
 * Create JWT
 * @param  {Object}  args
 * @param  {String}  [args.claims="{}"]       - additional claims
 * @param  {String}  args.secret              - signing secret
 * @param  {String}  [args.algorithm="HS256"] - signing algorithm
 * @param  {String}  [args.expiresIn="30m"]   - ttl timestring
 * @param  {String}  [args.header]            - custom header JSON
 * @param  {String}  [args.issuer]            - "iss" claim
 * @param  {String}  [args.jwtid]             - "jwtid" claim
 * @param  {String}  [args.keyid]             - "keyid" claim
 * @param  {String}  [args.notBefore]         - not before timestring
 * @param  {Boolean} [args.noTimestamp=false] - exclude "iat" claim
 * @return {String}
 */
export function handler({ claims, secret, ...rest }) {
  const parsed = parse(claims);
  const keys = [
    'algorithm',
    'audience',
    'expiresIn',
    'issuer',
    'jwtid',
    'keyid',
    'notBefore',
    'subject',
  ];
  const options = keys.reduce((memo, key) => {
    if (Object.hasOwnProperty.call(rest, key)) {
      memo[key] = rest[key]; // eslint-disable-line
    }
    return memo;
  }, {});
  options.noTimestamp = rest.timestamp !== true;
  if (typeof rest.header === 'string') {
    options.header = parse(rest.header);
  }
  const token = jwt.sign(parsed, secret, options);
  console.log();
  console.log(token);
  console.log();
  return token;
}

/**
 * Parse claims, exit on failure
 * @param  {String} [claims='{}']
 * @return {Object}
 */
export function parse(claims = '{}') { // eslint-disable-line
  try {
    return JSON.parse(claims);
  } catch (err) {
    console.error('Unable to parse claims, invalid JSON.');
    process.exit(1);
  }
}
