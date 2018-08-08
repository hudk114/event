function Event (prepare) {
  this.pool = {};
  // prepare function is used for prepare key
  this.prepare = prepare;
}

function E (cb, once) {
  this.cb = cb;
  this.once = once;
  // 用于单次事件
  this.done = false;
}

var judgeFunction = function (f) {
  return typeof f === 'function';
};

Event.prototype = {
  constructor: Event,
  setPrepare (prepare) {
    this.prepare = prepare;
  },
  _getPool (eventName) {
    var c = typeof this.prepare === 'function' ? this.prepare : function (a, b) { return a === b; };

    for (const key in this.pool) {
      if (this.pool.hasOwnProperty(key) && c(key, eventName)) {
        return this.pool[key];
      }
    }

    if (!this.pool[eventName]) {
      this.pool[eventName] = {
        stop: true,
        list: []
      };
    }
    return this.pool[eventName];
  },
  // 有的话直接返回，没有的话创建一个
  _createPool (eventName) {
    if (!this._getPool(eventName)) {
      this.pool[eventName] = {
        stop: true,
        list: []
      };
    }
    return this._getPool(eventName);
  },
  // 注册触发多次的函数
  on (eventName, cb, ctx) {
    if (!judgeFunction(cb)) {
      return;
    }

    var f = new E(cb.bind(ctx), false);
    this._createPool(eventName).list.push(f);
    return f;
  },
  // 注册触发一次的函数
  once (eventName, cb, ctx) {
    if (!judgeFunction(cb)) {
      return;
    }

    var f = new E(cb.bind(ctx), true)
    this._createPool(eventName).list.push(f);
    return f;
  },
  // 触发函数并传递options
  trigger (eventName, msg) {
    var p = this._getPool(eventName);
    var f = null;
    if (!p) {
      return;
    }

    p.stop = false;

    for (var i in p.list) {
      f = p.list[i];
      if (p.stop) {
        return;
      }

      if (!f.once || !f.done) {
        f.cb(msg);
      }
      if (f.once) {
        f.done = true;
      }
    }

    p.list = p.list.filter(f => !f.once || !f.done);
    p.stop = true;
  },
  // stop event trigger
  stop (eventName) {
    var p = this._getPool(eventName);
    if (!p) {
      return;
    }

    p.stop = true;
  },
  // remove selected event
  remove (eventName, e) {
    let i = this._getPool(eventName).list.findIndex(f => f === e);
    if (i < 0) {
      return null;
    }
    this._getPool(eventName).list.splice(i, 1);
  }
};

export default Event;
