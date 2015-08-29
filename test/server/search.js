/**
 * Load Environment Variables
 */
var Dotenv = require('dotenv');
var env = process.env.NODE_ENV || 'development';
Dotenv.config({ path: './env/' + env + '/.env' });

/**
* Dependencies.
*/
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');

// Test shortcuts
var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.experiment;
var it = lab.test;
var before = lab.before;
var server;

describe('Search API', function(){

    before('Sets up plugins', function(done){

        server = new Hapi.Server();
        server.connection();

        server.register([
            {
                register: require('../../server/search/index.js')
            }
        ], function (err) {

            expect(err).to.not.exist();
            done();

        });

    });

    it('url is working', function(done) {

        var request = {
            method: 'GET',
            url: '/api/1/search'
        };

        server.inject(request, function(response){

            console.log(response.statusCode);
            expect(response.statusCode).to.equal(200);
            done();

        });

    });

    it('text search finds a framework', function(done) {

        var request = {
            method: 'GET',
            url: '/api/1/search?q=hapi'
        };

        server.inject(request, function(response){
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(200);
            expect(payload.results.length).to.be.above(0);
            expect(payload.results[0].name).to.include('hapi');

            done();

        });

    });

    it('filters by author', function(done) {

        var request = {
            method: 'GET',
            url: '/api/1/search?author=hueniverse'
        };

        server.inject(request, function(response){
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(200);
            expect(payload.results.length).to.be.above(0);
            expect(payload.results[0].author).to.include('hueniverse');

            done();

        });

    });

    it('filters by multiple authors', function(done) {

        var request = {
            method: 'GET',
            url: '/api/1/search?author=hueniverse&author=jdalton'
        };

        server.inject(request, function(response){
            var payload = JSON.parse(response.payload);

            var authors = [];
            payload.results.forEach(function(item){
                authors.push(item.author);
            });

            expect(response.statusCode).to.equal(200);
            expect(payload.results.length).to.be.above(0);
            expect(authors).to.part.include(['hueniverse', 'jdalton']);

            done();

        });

    });

    it('filters by keyword', function(done) {

        var request = {
            method: 'GET',
            url: '/api/1/search?keyword=view'
        };

        server.inject(request, function(response){
            var payload = JSON.parse(response.payload);

            var keywords = [];
            payload.results.forEach(function(item){
                keywords = keywords.concat(item.keywords);
            });

            expect(response.statusCode).to.equal(200);
            expect(payload.results.length).to.be.above(0);
            expect(keywords).to.include('view');

            done();

        });

    });

    it('filters by multiple keywords', function(done) {

        var request = {
            method: 'GET',
            url: '/api/1/search?keyword=view&keyword=http'
        };

        server.inject(request, function(response){
            var payload = JSON.parse(response.payload);

            var keywords = [];
            payload.results.forEach(function(item){
                keywords = keywords.concat(item.keywords);
            });

            expect(response.statusCode).to.equal(200);
            expect(payload.results.length).to.be.above(0);
            expect(keywords).to.part.include(['view', 'http']);

            done();

        });

    });

    it('filters by license', function(done) {

        var request = {
            method: 'GET',
            url: '/api/1/search?license=MIT'
        };

        server.inject(request, function(response){
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(200);
            expect(payload.results.length).to.be.above(0);
            expect(payload.results[0].license).to.include('MIT');

            done();

        });

    });

    it('filters by multiple licenses', function(done) {

        var request = {
            method: 'GET',
            url: '/api/1/search?license=MIT&license=Apache'
        };

        server.inject(request, function(response){
            var payload = JSON.parse(response.payload);

            var licenses = [];
            payload.results.forEach(function(item){
                licenses = licenses.concat(item.license);
            });

            expect(response.statusCode).to.equal(200);
            expect(payload.results.length).to.be.above(0);
            expect(licenses).to.part.include(['MIT', 'BSD']);

            done();

        });

    });

});
