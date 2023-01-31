const mongoose = require("mongoose");
const client = require("./cacheClient");

const exec = mongoose.Query.prototype.exec;

// logic to decide which query should be cached
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  return this;
};

// patch the exec function from mongoose to implement caching
// whenever the exec method of query is called
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  // cache key = params passed to the query + the collection name
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name,
  });

  // reddid stores strings not js objects
  jsonKey = JSON.stringify(key);

  //lazy loading first
  const cacheValue = await client.hGet(this.hashKey, jsonKey);

  if (cacheValue) {
    console.log("serving data from REDIS");
    const doc = JSON.parse(cacheValue);

    // transform it to the same format as the result of queries
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  await client.hSet(this.hashKey, jsonKey, JSON.stringify(result), { EX: 10 });
  console.log("serving from MONGODB");
  return result;
};

// can be useful to put this function inside a middleware
// to invalidate the cache when necessary
module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
