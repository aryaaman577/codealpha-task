// Polyfill deprecated util methods for NeDB compatibility with modern Node.js
const util = require('util');
if (!util.isDate) util.isDate = (obj) => Object.prototype.toString.call(obj) === '[object Date]';
if (!util.isRegExp) util.isRegExp = (obj) => Object.prototype.toString.call(obj) === '[object RegExp]';
if (!util.isArray) util.isArray = Array.isArray;

// Polyfill String.prototype.equals for Mongoose ObjectId compatibility
if (!String.prototype.equals) {
  String.prototype.equals = function(other) {
    return this.toString() === (other ? other.toString() : '');
  };
}

const Datastore = require('nedb');
const bcrypt = require('bcryptjs');

const dbStores = {};
const models = {};

// Helper to generate UUID-like IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

class Schema {
  constructor(definition, options = {}) {
    this.definition = definition;
    this.options = options;
    this.preHooks = {};
    this.methods = {};
    this.statics = {};
  }

  pre(hookName, fn) {
    if (!this.preHooks[hookName]) {
      this.preHooks[hookName] = [];
    }
    this.preHooks[hookName].push(fn);
  }

  post(hookName, fn) {
    // No-op or basic implementation
  }

  index(fields, options = {}) {
    // No-op for mock Schema
  }
}

Schema.Types = {
  ObjectId: String,
  String: String,
  Number: Number,
  Boolean: Boolean,
  Date: Date
};

class QueryBuilder {
  constructor(executor) {
    this.executor = executor;
    this.sortOpt = null;
    this.limitOpt = null;
    this.skipOpt = null;
    this.populateOpts = [];
  }

  sort(opt) {
    this.sortOpt = opt;
    return this;
  }

  limit(opt) {
    this.limitOpt = opt;
    return this;
  }

  skip(opt) {
    this.skipOpt = opt;
    return this;
  }

  populate(opt) {
    if (opt) this.populateOpts.push(opt);
    return this;
  }

  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }

  async execute() {
    return await this.executor(this);
  }
}

// Populate references dynamically in-memory
async function performPopulate(docs, populateOpts) {
  if (!docs || populateOpts.length === 0) return docs;
  const isArray = Array.isArray(docs);
  const docList = isArray ? docs : [docs];

  for (const doc of docList) {
    for (const opt of populateOpts) {
      const field = typeof opt === 'string' ? opt : opt.path;
      const refId = doc[field];
      if (refId && typeof refId === 'string') {
        let targetModelName = null;
        if (field === 'user') targetModelName = 'User';
        else if (field === 'post') targetModelName = 'Post';
        else if (field === 'following' || field === 'follower') targetModelName = 'User';

        if (targetModelName && models[targetModelName]) {
          const targetDoc = await models[targetModelName].findById(refId);
          doc[field] = targetDoc;
        }
      }
    }
  }
  return isArray ? docList : docList[0];
}

function createModel(modelName, schema) {
  const store = new Datastore({ inMemoryOnly: true });
  store.loadDatabase();
  dbStores[modelName] = store;

  class Model {
    constructor(data = {}) {
      Object.assign(this, data);
      if (!this._id) {
        this._id = generateId();
      }
      
      // Inject schema methods
      for (const [methodName, fn] of Object.entries(schema.methods)) {
        this[methodName] = fn.bind(this);
      }

      // Initialize default arrays from schema definition
      if (schema.definition) {
        for (const [key, val] of Object.entries(schema.definition)) {
          const isArrayType = Array.isArray(val) || val === Array || (val && (val.type === Array || Array.isArray(val.type)));
          if (isArrayType && this[key] === undefined) {
            this[key] = [];
          }
        }
      }
    }

    isModified(path) {
      return true;
    }

    async save() {
      // Run pre-save hooks
      if (schema.preHooks['save']) {
        for (const hookFn of schema.preHooks['save']) {
          await new Promise((resolve, reject) => {
            hookFn.call(this, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }

      // Add timestamps
      if (schema.options.timestamps) {
        const now = new Date();
        if (!this.createdAt) {
          this.createdAt = now;
        }
        this.updatedAt = now;
      }

      // Prepare clean object for NeDB (no methods)
      const dataToSave = {};
      for (const [key, val] of Object.entries(this)) {
        if (typeof val !== 'function') {
          dataToSave[key] = val;
        }
      }

      return new Promise((resolve, reject) => {
        store.update({ _id: this._id }, dataToSave, { upsert: true }, (err, numReplaced, upsertDoc) => {
          if (err) return reject(err);
          resolve(this);
        });
      });
    }

    static find(query = {}) {
      return new QueryBuilder(async (builder) => {
        return new Promise((resolve, reject) => {
          let cursor = store.find(query);
          
          if (builder.sortOpt) {
            // NeDB sort format is { field: 1 } or { field: -1 }
            let sortObj = builder.sortOpt;
            if (typeof builder.sortOpt === 'string') {
              const isDesc = builder.sortOpt.startsWith('-');
              const field = isDesc ? builder.sortOpt.substring(1) : builder.sortOpt;
              sortObj = { [field]: isDesc ? -1 : 1 };
            }
            cursor = cursor.sort(sortObj);
          }
          
          if (builder.skipOpt !== null) cursor = cursor.skip(builder.skipOpt);
          if (builder.limitOpt !== null) cursor = cursor.limit(builder.limitOpt);

          cursor.exec(async (err, docs) => {
            if (err) return reject(err);
            const instances = docs.map(d => new Model(d));
            const populated = await performPopulate(instances, builder.populateOpts);
            resolve(populated);
          });
        });
      });
    }

    static findOne(query = {}) {
      return new QueryBuilder(async (builder) => {
        return new Promise((resolve, reject) => {
          store.findOne(query, async (err, doc) => {
            if (err) return reject(err);
            if (!doc) return resolve(null);
            const instance = new Model(doc);
            const populated = await performPopulate(instance, builder.populateOpts);
            resolve(populated);
          });
        });
      });
    }

    static findById(id) {
      return this.findOne({ _id: id });
    }

    static findByIdAndDelete(id) {
      return new Promise((resolve, reject) => {
        store.findOne({ _id: id }, (err, doc) => {
          if (err) return reject(err);
          if (!doc) return resolve(null);
          store.remove({ _id: id }, {}, (removeErr) => {
            if (removeErr) return reject(removeErr);
            resolve(new Model(doc));
          });
        });
      });
    }

    static deleteOne(query = {}) {
      return new Promise((resolve, reject) => {
        store.remove(query, {}, (err, numRemoved) => {
          if (err) return reject(err);
          resolve({ deletedCount: numRemoved });
        });
      });
    }

    static deleteMany(query = {}) {
      return new Promise((resolve, reject) => {
        store.remove(query, { multi: true }, (err, numRemoved) => {
          if (err) return reject(err);
          resolve({ deletedCount: numRemoved });
        });
      });
    }

    static async create(data) {
      const isArray = Array.isArray(data);
      const list = isArray ? data : [data];
      const created = [];
      for (const item of list) {
        const doc = new Model(item);
        await doc.save();
        created.push(doc);
      }
      return isArray ? created : created[0];
    }

    static countDocuments(query = {}) {
      return new Promise((resolve, reject) => {
        store.count(query, (err, count) => {
          if (err) return reject(err);
          resolve(count);
        });
      });
    }
  }

  // Inject schema statics
  for (const [staticName, fn] of Object.entries(schema.statics)) {
    Model[staticName] = fn.bind(Model);
  }

  models[modelName] = Model;
  return Model;
}

const mockMongoose = {
  Schema,
  Types: {
    ObjectId: String
  },
  model: (name, schema) => {
    if (models[name]) return models[name];
    return createModel(name, schema);
  },
  connect: async () => {
    console.log('✓ Mock MongoDB Connected: in-memory NeDB Datastore');
    return {
      connection: {
        host: 'in-memory',
        name: 'circlesphere-mock'
      }
    };
  },
  connection: {
    on: (event, cb) => {
      if (event === 'error' || event === 'disconnected') {
        // No-op
      }
    },
    close: async () => {
      // No-op
    }
  }
};

module.exports = mockMongoose;
