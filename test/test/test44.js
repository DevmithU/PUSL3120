require("ts-node").register({ files: true });

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server/src/server");
// let server = require("../../server/src/server");

chai.use(chaiHttp);
let app;
var expect = chai.expect;

suite("Test sayHello server 33333", function() {

    setup(function() {
        this.app = server.app;
    });

    test("Test is working33", async function() {
        let response = await chai.request(this.app).get("/");
        expect(response.text).to.equal("API is UP");
        expect(response.status).to.equal(200);
        // expect(response).to.have.property('status',200).and.to.have.property('text','API is UP3');
    });
    test("Test GET /hello2", async function() {
        let response = await chai.request(this.app).get("/api/dashBoard").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        // console.log(response.body);

        // chai.assert.equal(response.status, 200, "Wrong response code");
        expect(response.body).to.be.an("array");

        // expect(response.body).to.have.property('email');
        // expect(response.body).to.have.property('username');
        // expect(response.body).to.have.property('id');
    });
    test("Test GET / text", async function() {
        let response = await chai.request(this.app).get("/");
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        chai.assert.equal(response.text, "API is UPhh", "Wrong response msg");
    });
    test("Test GET / status", async function() {
        let response = await chai.request(this.app).get("/");
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        chai.assert.equal(response.status, 200, "Wrong response code");
    });

    test("Test login", async function() {
        let response = await chai.request(this.app).post("/api/users/login").send({
            "email":"q12@gmail.com",
            "password":"234"
        });;
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        // console.log(response.body);

        chai.assert.equal(response.status, 200, "Wrong response code");
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('username');
        expect(response.body).to.have.property('id');
    });
    test("Test boards44ttt", async function() {
        let response = await chai.request(this.app).get("/api/dashBoard").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");
        // chai2.assert.equal(response.status, 200, "Wrong response code");
        // console.log(response.body);

        // chai.assert.equal(response.status, 200, "Wrong response code");
        expect(response.body).to.be.an("array");

        // expect(response.body).to.have.property('email');
        // expect(response.body).to.have.property('username');
        // expect(response.body).to.have.property('id');
    });
});
