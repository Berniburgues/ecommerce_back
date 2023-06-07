const request = require("supertest");
const app = require("../app.js");
const Product = require("../models/Product.js");
require("../models");

let cartId;
let token;

beforeAll(async () => {
  const credentials = {
    email: "testuser@gmail.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST /cart debe retornar status 201", async () => {
  const product = await Product.create({
    title: "Auriculares",
    description: "Gama alta",
    brand: "JBL",
    price: 500,
  });
  const body = {
    productId: product.id,
    quantity: 5,
  };
  const res = await request(app)
    .post("/cart")
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  await product.destroy();
  cartId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /cart debe retornar todos los productos del carro", async () => {
  const res = await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /cart/:id debe actualizar los productos del carro", async () => {
  const cartUpdated = {
    quantity: 10,
  };
  const res = await request(app)
    .put(`/cart/${cartId}`)
    .send(cartUpdated)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.quantity).toBe(cartUpdated.quantity);
});

test("DELETE /cart/:id debe eliminar los productos del carro", async () => {
  const res = await request(app)
    .delete(`/cart/${cartId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
