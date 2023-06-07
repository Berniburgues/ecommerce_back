const request = require("supertest");
const app = require("../app.js");
require("../models");

let token;
let categoryId;

beforeAll(async () => {
  const credentials = {
    email: "testuser@gmail.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST /categories debe retornar status 201", async () => {
  const body = {
    name: "Smartphones",
  };
  const res = await request(app)
    .post("/categories")
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  categoryId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /categories debe retornar todas los categorías", async () => {
  const res = await request(app).get("/categories");
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /categories/:id debe actualizar una categoría", async () => {
  const categoryUpdated = {
    name: "Consolas",
  };
  const res = await request(app)
    .put(`/categories/${categoryId}`)
    .send(categoryUpdated)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(categoryUpdated.name);
});

test("DELETE /categories/:id debe eliminar una categoría", async () => {
  const res = await request(app)
    .delete(`/categories/${categoryId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
