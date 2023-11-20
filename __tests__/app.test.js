const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const app = require("../app.js");
const fs = require('fs/promises')

afterAll(() => {
    return db.end();
});
  
beforeEach(() => {
return seed(testData);
});

describe("/api/topics", () => {
    test("GET: 200 sends an array of topic objects to the client", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            const expected = [
                {
                  
                  description: 'The man, the Mitch, the legend',
                  slug: 'mitch'
                },
                {
                  description: 'Not dogs',
                  slug: 'cats'
                },
                {
                  description: 'what books are made of',
                  slug: 'paper'
                }
            ];
            expect(response.body.topics).toEqual(expected);
          });
      });

      test("GET: 404 Send get request to a incorrect path", () => {
        return request(app)
          .get("/api/topic")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Not Found!");
          });
      });
});

describe("/api", () => {
    test("GET: 200 sends an array of endpoints to the client", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then((response) => {
            fs.readFile(`${__dirname}/../endpoints.json`).then((result) => {
                const endpointObject = JSON.parse(result);
                expect(response.body.endpoints_info).toEqual(endpointObject);
            })
          });
      });
})