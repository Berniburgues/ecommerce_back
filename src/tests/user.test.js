const request = require("supertest");
const app = require("../app.js");
const { expectCt } = require("helmet");

let userId;
let token;

test("POST /users debe retornar status 201", async () => {
  const body = {
    firstName: "Bernardo",
    lastName: "Burgués",
    email: "burguesbernardo@gmail.com",
    password: "berna123",
    phone: "2364538935",
  };
  const res = await request(app).post("/users").send(body);
  userId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("POST /users/login debe loguear un usuario", async () => {
  const credentials = {
    email: "burguesbernardo@gmail.com",
    password: "berna123",
  };
  const res = await request(app).post(`/users/login`).send(credentials);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});

test("GET /users debe retornar todos los usuarios", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
});

test("PUT /users/:id debe actualizar un usuario", async () => {
  const userUpdated = {
    firstName: "Miguel",
  };
  const res = await request(app)
    .put(`/users/${userId}`)
    .send(userUpdated)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(userUpdated.firstName);
});

test("POST /users/login con credenciales invalidas debe dar error", async () => {
  const credentials = {
    email: "burguesberna@gmail.com",
    password: "berna",
  };
  const res = await request(app).post(`/users/login`).send(credentials);
  expect(res.status).toBe(401);
});

test("DELETE /users/:id debe eliminar un usuario", async () => {
  const res = await request(app)
    .delete(`/users/${userId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
