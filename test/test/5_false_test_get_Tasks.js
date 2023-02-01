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

suite("Test Get Tasks - false positive check", function() {

    setup(function() {
        this.app = server.app;
    });

    test("Test status code", async function() {
        let response = await chai.request(this.app).get("/api/boards/63ac211847fb6bd3976d5247/tasks").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");

        expect(response.status).to.equal(201);
    });
    test("Test response type", async function() {
        let response = await chai.request(this.app).get("/api/boards/63ac211847fb6bd3976d5247/tasks").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");

        expect(response.body).to.be.an("number");


    });
    test("Test response element field title", async function() {
        let response = await chai.request(this.app).get("/api/boards/63ac211847fb6bd3976d5247/tasks").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");

        expect(response.body[0]).to.have.property('title_f');
    });
    test("Test response element field userId", async function() {
        let response = await chai.request(this.app).get("/api/boards/63ac211847fb6bd3976d5247/tasks").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");

        expect(response.body[0]).to.have.property('userId_f');
    });
    test("Test response element field id", async function() {
        let response = await chai.request(this.app).get("/api/boards/63ac211847fb6bd3976d5247/tasks").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");

        expect(response.body[0]).to.have.property('id_f');
    });
    test("Test response element field boardId", async function() {
        let response = await chai.request(this.app).get("/api/boards/63ac211847fb6bd3976d5247/tasks").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");

        expect(response.body[0]).to.have.property('boardId_f');
    });
    test("Test response element field columnId", async function() {
        let response = await chai.request(this.app).get("/api/boards/63ac211847fb6bd3976d5247/tasks").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWMwNGVlYjQwNWMxOTM1OGY1MmVkMyIsImVtYWlsIjoicTEyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTAzMDgxOX0.qbyguJE2-vcmrv-SctiHFvQPRjmDHlaw-xAgAd9UUpY");

        expect(response.body[0]).to.have.property('columnId_f');
    });
});
