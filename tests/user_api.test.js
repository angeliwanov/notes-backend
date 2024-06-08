const { beforeEach, after, test, describe } = require("node:test");
const mongoose = require("mongoose");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("where there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const userAtStart = await helper.usersInDb();

    const newUser = {
      username: "angelivanov",
      name: "Angel Ivanov",
      password: "123456",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const userAtEnd = await helper.usersInDb();
    assert.strictEqual(userAtStart.length + 1, userAtEnd.length);

    const usernames = userAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

test("creation fails with proper statucodes and message if username already taken", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "root",
    name: "Superuser",
    password: "password",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  assert(result.body.error.includes("expected `username` to be unique"));
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

after(async () => {
  await mongoose.connection.close();
});
