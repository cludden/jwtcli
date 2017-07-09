import chai, { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { afterEach, before, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonchai from 'sinon-chai';

import cli from '../lib/';
import * as sign from '../lib/commands/sign';

chai.use(sinonchai);

describe('sign', function () {
  before(function () {
    this.sandbox = sinon.sandbox.create();
  });

  beforeEach(function () {
    this.sandbox.spy(sign, 'handler');
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('should fail if "secret" not provided', function () {
    this.sandbox.stub(process, 'exit').throws(new Error());
    expect(cli.bind(null, ['sign', '{"foo":"bar"}'])).to.throw(Error);
    expect(process.exit).to.have.callCount(1);
    expect(process.exit).to.have.been.calledWith(1);
  });

  it('should fail with invalid claims', function () {
    this.sandbox.stub(process, 'exit').throws(new Error());
    expect(cli.bind(null, ['sign', '-s', 'SECRET', 'foo:bar'])).to.throw(Error);
    expect(process.exit).to.have.callCount(1);
    expect(process.exit).to.have.been.calledWith(1);
  });

  it('should create a valid JWT', function () {
    cli('sign -s SECRET {"foo":"bar"}'.split(' '));
    const token = sign.handler.lastCall.returnValue;
    expect(token).to.be.a('string');
    const decoded = jwt.verify(token, 'SECRET');
    expect(decoded).to.have.property('foo', 'bar');
  });

  it('should handle "-a --algorithm"', function () {
    const options = ['-a', '--algorithm'];
    options.forEach((flag) => {
      cli(`sign -s SECRET ${flag} HS512`.split(' '));
      const token = sign.handler.lastCall.returnValue;
      const decoded = jwt.decode(token, { complete: true });
      expect(decoded).to.have.deep.property('header.alg', 'HS512');
    });
  });

  it('should handle "-e --expires-in"', function () {
    const flags = ['-e', '--expires-in'];
    flags.forEach((flag) => {
      console.log(`sign -s SECRET ${flag} 30m`.split(' '));
      cli(`sign -s SECRET ${flag} 30m`.split(' '));
      const token = sign.handler.lastCall.returnValue;
      const decoded = jwt.decode(token);
      expect(decoded).to.have.property('exp').that.is.a('number');
      expect((decoded.exp * 1000) - Date.now()).to.be.lte(1000 * 60 * 30);
    });
  });

  it('should handle "--header"', function () {
    cli('sign -s SECRET --header {"alg":"HS256","typ":"JWT","kid":"abc"}'.split(' '));
    const token = sign.handler.lastCall.returnValue;
    const decoded = jwt.decode(token, { complete: true });
    expect(decoded).to.have.deep.property('header.kid', 'abc');
  });

  it('should handle "-i --issuer"', function () {
    const options = ['-i', '--issuer'];
    options.forEach((flag) => {
      cli(`sign -s SECRET ${flag} test`.split(' '));
      const token = sign.handler.lastCall.returnValue;
      const decoded = jwt.verify(token, 'SECRET');
      expect(decoded).to.have.property('iss', 'test');
    });
  });

  it('should handle "-n --not-before"', function () {
    const flags = ['-n', '--not-before'];
    flags.forEach((flag) => {
      console.log(`sign -s SECRET ${flag} 30m`.split(' '));
      cli(`sign -s SECRET ${flag} 30m`.split(' '));
      const token = sign.handler.lastCall.returnValue;
      const decoded = jwt.decode(token);
      expect(decoded).to.have.property('nbf').that.is.a('number');
      expect((decoded.nbf * 1000) - Date.now()).to.be.lte(1000 * 60 * 30);
    });
  });

  it('should handle "--no-timestamp"', function () {
    cli('sign -s SECRET --no-timestamp'.split(' '));
    const token = sign.handler.lastCall.returnValue;
    const decoded = jwt.decode(token);
    expect(decoded).to.not.have.property('iat');
  });

  const options = [
    ['--audience', 'payload.aud'],
    ['--jwtid', 'payload.jti'],
    ['--keyid', 'header.kid'],
    ['--subject', 'payload.sub'],
  ];

  options.forEach(([flag, path]) => {
    it(`should handle "${flag}"`, function () {
      cli(`sign -s SECRET ${flag} test`.split(' '));
      const token = sign.handler.lastCall.returnValue;
      const decoded = jwt.decode(token, { complete: true });
      expect(decoded).to.have.deep.property(path, 'test');
    });
  });
});
