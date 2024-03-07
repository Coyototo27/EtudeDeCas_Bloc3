const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");

describe("Tester API articles", () => {
  let token;
  const USER_ID = "fake";
  const USER_DATA = {
    _id: USER_ID,
    name: "Tom",
    email: "tom@example.com",
    role: "admin",
  };

  const MOCK_ARTICLE_ID = "fake_content_article";
  const MOCK_DATA = [
    {
      _id: MOCK_ARTICLE_ID,
      title: "Test Article",
      content: "Test contenu article",
      user: USER_ID,
    },
  ];
  const MOCK_DATA_CREATED = {
    title: "New Test Article",
    content: "Lorem ipsum dolor sit amet",
    user: USER_ID,
  };

  beforeEach(() => {
    

    token = jwt.sign({ userId: USER_DATA }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_DATA, "find");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
  });


  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${MOCK_ARTICLE_ID}`)
      .send({ title: "Updated Title" })
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${MOCK_ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
