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

describe("/api/articles", () => {
    test("GET 200: sends an array of article objects", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBe(13);
            response.body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
            });
        });
    });

    test("Ensure article object array is sorted by created_at date descending", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            expect(response.body.articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        });
    });
})

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: Inserts new comment with specified article_id", () => {
    const newMessage = {
      username: 'butter_bridge', 
      body: 'Great Article!'
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newMessage)
    .expect(201)
    .then((response) => {
      expect(response.body.comment).toMatchObject({
        comment_id: 19, 
        body: 'Great Article!', 
        article_id: 1, 
        author: 'butter_bridge',
        votes: 0 
      })
    })
  })

  test("POST 400: No body given", () => {
    const newMessage = {}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newMessage)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('no request body')
    })
  })
})
