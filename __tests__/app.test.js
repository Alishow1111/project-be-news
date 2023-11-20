const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const app = require("../app.js");

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
})