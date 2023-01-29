let chai2 = require("chai");
let chaiHttp = require("chai-http");
// let server = require("../server");

chai2.use(chaiHttp);

suite("Test sayHello server", function() {

    // setup(function() {
    //     this.app = server.app;
    // });

    test("Test GET /hello", function() {
        chai2.request("http://localhost:4001/").get("/hello").end(function(error, response) {
            // chai2.assert.equal(response.status, 200, "Wrong response code");
            chai2.assert.equal(response.text, "Hello World", "Wrong response msg");
        });
    });

});
