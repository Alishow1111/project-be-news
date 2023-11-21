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
});


describe("/api/articles/:article_id", () => {
    test("GET: 200 sends the article with the specified aritle_id", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
            expect(response.body.article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
        })
    });

    test("GET 404: given a valid article_id that doesnt exist ", () => {
        return request(app)
          .get("/api/articles/700")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("article_id doesnt exist");
          });
    });

    test("GET 400: given a invalid param for article_id", () => {
        return request(app)
          .get("/api/articles/hello")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid Param");
          });
    });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: sends the comments with the specfied article_id", () => {
    return request(app)
    .get("/api/articles/5/comments")
    .expect(200)
    .then((response) => {
      expect(response.body.comments).toMatchObject([{
        body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        votes: 16,
        author: "icellusedkars",
        article_id: 5,
        created_at: "2020-06-09T05:00:00.000Z",
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        votes: 1,
        author: "butter_bridge",
        article_id: 5,
        created_at: "2020-11-24T00:08:00.000Z",
      }])
    })
  });

  test("If article_id exists, but has no comments, expect an empty array returned back", () => {
    return request(app)
    .get("/api/articles/8/comments")
    .expect(200)
    .then((response) => {
      expect(response.body.comments).toEqual([]);
   })
  });

  test("If article_id doesn't exist, expect not found returned back", () => {
    return request(app)
    .get("/api/articles/20/comments")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('not found');
   })
  });


})
