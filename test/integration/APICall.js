// To test API call returns expected data
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Twitter = require('twitter');
const config  = require('../../config.js');

const twitter = new Twitter(config);

chai.use(chaiAsPromised);
chai.should();

const requestBuilder = require('../../lib/requestBuilder.js');
const getTweetsReq   = requestBuilder.getTweetsReq;

describe('Makes successfuly request to Twitter Api', function() {
  it('returns the correct tweet data', function(done) {
    let params = { q: '#competition' };
    let request = getTweetsReq(twitter, params);
    request.then().should.eventually.have.property('statuses').notify(done);
  });
});
