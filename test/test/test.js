let chai2 = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server/dist/server.js");
// let server = require("../../server/src/server");

chai2.use(chaiHttp);

suite("Test sayHello server", function() {

    setup(function() {
        this.app = server.app;
    });

    test("Test GET /hello", async function() {
        let response = await chai2.request("http://localhost:4001/").get("/");
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        chai2.assert.equal(response, "API is UP", "Wrong response msg");
        chai2.assert.equal(response.status, 200, "Wrong response code");
    });
    test("Test GET /hello2", async function() {
        let response = await chai2.request("http://localhost:4001/").get("/");
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        chai2.assert.equal(response.text, "Hello World", "Wrong response msg");
        chai2.assert.equal(response.status, 200, "Wrong response code");
    });
    test("Test GET /hello3", async function() {
        let response = await chai2.request("http://localhost:4001/").get("/");
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        chai2.assert.equal(response.text, "Hello World", "Wrong response msg");
        chai2.assert.equal(response.status, 200, "Wrong response code");
    });
    test("Test GET /hello4", async function() {
        let response = await chai2.request("http://localhost:4001/").get("/");
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        chai2.assert.equal(response.text, "Hello World", "Wrong response msg");
        chai2.assert.equal(response.status, 200, "Wrong response code");
    });


});
