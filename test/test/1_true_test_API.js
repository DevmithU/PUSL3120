let path = require("../server_path")
// require("ts-node").register({ files: true });
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require(path.path);
// let server = require("../../server/src/server");
// let server = require("../../server/dist/server.js");

chai.use(chaiHttp);
let app;
var expect = chai.expect;

suite("Test API", function() {

    setup(function() {
        this.app = server.app;
    });

    test("Test is API code", async function() {
        let response = await chai.request(this.app).get("/");
        expect(response.status).to.equal(200);

    });
    test("Test is API Text", async function() {
        let response = await chai.request(this.app).get("/");
        expect(response.text).to.equal("API is UP");

    });

});
