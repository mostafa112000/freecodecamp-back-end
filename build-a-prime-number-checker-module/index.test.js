const assert = require("node:assert/strict")
const prime = require("./index");

assert.strictEqual(prime.isPrime(121), false);

assert.strictEqual(prime.isPrime(31), true);
