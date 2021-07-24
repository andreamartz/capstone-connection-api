"use strict";

afterEach(function() {
  delete process.env.SECRET_KEY;
  delete process.env.PORT;
  delete process.env.BCRYPT_WORK_FACTOR;
  delete process.env.DATABASE_URL;
});

describe("config can come from env", function () {
  test("DATABASE_URL and NODE_ENV are both 'other'", function() {
    process.env.SECRET_KEY = "abc";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "other";
    process.env.NODE_ENV = "other";

    let config;
    // use jest.isolateModules to require ./config so that local module state will not interfere with other tests requireing config 
    jest.isolateModules(() => {
      config = require("./config");
    });

    expect(config.SECRET_KEY).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.DB_URI).toEqual("other");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);
  });

  test("NODE_ENV is 'other' and no DATABASE_URL is given", function() {
    process.env.SECRET_KEY = "def";
    process.env.PORT = "5001";
    process.env.NODE_ENV = "other";

    let config;
    jest.isolateModules(() => {
      config = require("./config");
    });

    console.log("DATABASE_URL: ", process.env.DATABASE_URL, "NODE_ENV: ", process.env.NODE_ENV, "DB_URI: ", config.DB_URI);

    expect(config.SECRET_KEY).toEqual("def");
    expect(config.PORT).toEqual(5001);
    expect(config.DB_URI).toEqual("postgresql:///capstone_connections");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);
  });

  test("NODE_ENV is 'test'", function() {
    process.env.SECRET_KEY = "ghi";
    process.env.PORT = "5002";
    process.env.NODE_ENV = "test";

    let config;
    jest.isolateModules(() => {
      config = require("./config");
    });

    expect(config.SECRET_KEY).toEqual("ghi");
    expect(config.PORT).toEqual(5002);
    expect(config.DB_URI).toEqual("postgresql:///capstone_connections_test");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(1);
  });
});