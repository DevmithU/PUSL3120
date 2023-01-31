let path = require("../server_path")
let Mocha = require("mocha")
// require("ts-node").register({ files: true });
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require(path.path);
// let server = require("../../server/src/server");
// let server = require("../../server/dist/server.js");

chai.use(chaiHttp);
let app;
var expect = chai.expect;

suite("Test API start", function() {

    setup(function() {
        this.app = server.app;
    });
    test("start", async function() {
        let response = await chai.request(this.app).get("/");
        // expect(response).to.have.property('status',200).and.to.have.property('text','API is UP3');

    });
    if(false){

        test("Test is API code", async function() {
            let response = await chai.request(this.app).get("/");
            expect(response.status).to.equal(200);
            // expect(response).to.have.property('status',200).and.to.have.property('text','API is UP3');
        });
        test("Test is API Text", async function() {
            let response = await chai.request(this.app).get("/");
            expect(response.text).to.equal("API is UP");
            // expect(response).to.have.property('status',200).and.to.have.property('text','API is UP3');
        });
        test("Test GET /hello2new", async function() {
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
        test("Test boards44edited", async function() {
            let response = await chai.request(this.app).get("/api/dashBoard").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");
            // chai2.assert.equal(response.status, 200, "Wrong response code");
            // console.log(response.body);

            // chai.assert.equal(response.status, 200, "Wrong response code");
            expect(response.body).to.be.an("array");

            // expect(response.body).to.have.property('email');
            // expect(response.body).to.have.property('username');
            // expect(response.body).to.have.property('id');
        });
    }

});
