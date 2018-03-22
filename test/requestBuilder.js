var chai = require('chai');
var expect = require('chai').expect;
var chaiAsPromised = require('chai-as-promised');
var spies = require('chai-spies');

chai.use(chaiAsPromised);
chai.use(spies);
chai.should();

const requestBuilder    = require("../lib/requestBuilder.js")
const tParser           = require("../lib/tweetParser.js")
const tweetParser       = tParser.tweetParser;
const singleTweetParser = tParser.singleTweetParser;
const getTweetsReq      = requestBuilder.getTweetsReq;
const defineParams      = requestBuilder.defineParams;
const likeReq           = requestBuilder.likeReq;
const likeAllTweets     = requestBuilder.likeAllTweets;
const retweetAllTweets  = requestBuilder.retweetAllTweets;
const followAllUsers    = requestBuilder.followAllUsers;
const retweetReq        = requestBuilder.retweetReq;
const followReq        = requestBuilder.followReq;

describe('defineParams', function() {
  it('defines the search parameters', function() {
    expect(defineParams('chocolate')).to.be.a('object').with.property('count');
  });
});

describe('API methods', function(){
  var twitter, params, id, idObj, tweet1, tweet2;

  before(function() {
    twitter = {};
    var stubbedResponse = function(a, b) { return true; };
    twitter.get = stubbedResponse;
    twitter.post = stubbedResponse;
  });

  afterEach(function() {
    chai.spy.restore();
  });

  describe('request methods', function() {
    before(function() {
      params = { key: 'value' };
      id = 12345;
      idObj = { id: id };
    });

    describe('getTweetsReq', function() {

      it('calls #get on the twitter parameter', function() {
        let twitterSpy = chai.spy.on(twitter, 'get');
        getTweetsReq(twitter, params);
        expect(twitterSpy).to.have.been.called.with.exactly('search/tweets', params);
      });
    });

    describe('likeReq', function() {
      it('calls post on the twitter parameter', function() {
        let twitterSpy = chai.spy.on(twitter, 'post');
        likeReq(twitter, id);
        expect(twitterSpy).to.have.been.called.with.exactly('favourites/create', idObj);
      });
    });

    describe('retweetReq', function() {
      it('calls post on the twitter parameter', function() {
        let twitterSpy = chai.spy.on(twitter, 'post');
        retweetReq(twitter, id);
        expect(twitterSpy).to.have.been.called.with.exactly('statuses/retweet', idObj);
      });
    });

    describe('followReq', function() {
      it('calls post on the twitter parameter', function() {
        let twitterSpy = chai.spy.on(twitter, 'post');
        followReq(twitter, id);
        expect(twitterSpy).to.have.been.called.with.exactly('friendships/create', idObj);
      });
    });
  });

  describe('do X to all methods', function() {
    before(function() {
      tweet1 = {id: 1234};
      tweet2 = {id: 5678};
    });

    describe('likeAllTweets', function() {
      it('likes all returned tweets', function() {
        let spy1 = chai.spy.on(tweet1, 'likeReq');
        let spy2 = chai.spy.on(tweet2, 'likeReq');
        likeAllTweets(twitter, [tweet1, tweet2]);
        expect(spy1).to.have.been.called;
        expect(spy2).to.have.been.called;
      });
    });

    describe('retweetAllTweets', function() {
      it('retweets all returned tweets', function() {
        let spy1 = chai.spy.on(tweet1, 'retweetReq');
        let spy2 = chai.spy.on(tweet2, 'retweetReq');
        retweetAllTweets(twitter, [tweet1, tweet2]);
        expect(spy1).to.have.been.called;
        expect(spy2).to.have.been.called;
      });
    });

    describe('followAllUsers', function() {
      it('follows all returned users', function() {
        let spy1 = chai.spy.on(tweet1, 'followReq');
        let spy2 = chai.spy.on(tweet2, 'followReq');
        followAllUsers(twitter, [tweet1, tweet2]);
        expect(spy1).to.have.been.called;
        expect(spy2).to.have.been.called;
      });
    });
  });
});
