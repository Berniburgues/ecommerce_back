const request = require("supertest");
const app = require("../app.js");
const Category = require("../models/Category.js");
const ProductImg = require("../models/ProductImg.js");

let productId;
let token;

beforeAll(async () => {
  const credetianls = {
    email: "testuser@gmail.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credetianls);
  token = res.body.token;
});

test("POST /products debe retornar status 201", async () => {
  const category = await Category.create({
    name: "Consolas",
  });
  const body = {
    title: "PS5",
    description: "Consola Sony Play Station 5",
    price: 500.0,
    brand: "Sony",
    categoryId: category.id,
  };
  const res = await request(app)
    .post("/products")
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  await category.destroy();
  productId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /products debe retornar todos los productos", async () => {
  const res = await request(app).get("/products");
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("POST products/:id/images debe setear las imagenes del producto", async () => {
  const image = await ProductImg.create({
    url: "http://testimage.com",
    publicId: "test id",
  });
  const res = await request(app)
    .post(`/products/${productId}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${token}`);
  await image.destroy();
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /products/:id debe actualizar un producto", async () => {
  const productUpdated = {
    title: "PS4",
  };
  const res = await request(app)
    .put(`/products/${productId}`)
    .send(productUpdated)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toBe(productUpdated.title);
});

test("DELETE /products/:id debe eliminar un producto", async () => {
  const res = await request(app)
    .delete(`/products/${productId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
