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

suite("Test Login - false positive check", function() {

    setup(function() {
        this.app = server.app;
    });

    test("Test login code", async function() {
        let response = await chai.request(this.app).post("/api/users/login").send({
            "email":"q12@gmail.com",
            "password":"234"
        });
        chai.assert.equal(response.status, 201, "Wrong response code");
    });
    test("Test login email field", async function() {
        let response = await chai.request(this.app).post("/api/users/login").send({
            "email":"q12@gmail.com",
            "password":"234"
        });
        expect(response.body).to.have.property('email_f');
    });
    test("Test login username field", async function() {
        let response = await chai.request(this.app).post("/api/users/login").send({
            "email":"q12@gmail.com",
            "password":"234"
        });
        expect(response.body).to.have.property('username_f');
    });
    test("Test login id field", async function() {
        let response = await chai.request(this.app).post("/api/users/login").send({
            "email":"q12@gmail.com",
            "password":"234"
        });
        expect(response.body).to.have.property('id_f');
    });

});
