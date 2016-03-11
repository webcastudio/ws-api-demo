'use strict';

var request = require('superagent');
var expect = require('expect.js');

describe('Index controller', function() {
  it('should respond 200 Hello world', function(done) {
    request
      .get('http://localhost:9000/')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Hello World!!!!');
        done();
      });
  });
});
