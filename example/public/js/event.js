(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.event = factory());
}(this, (function () { 'use strict';

  function Event() {
    this.pool = {};
  }

  function E(cb, once) {
    this.cb = cb;
    this.once = once;
    // 用于单次事件
    this.done = false;
  }
  var judgeFunction = function judgeFunction(f) {
    return typeof f === 'function';
  };

  Event.prototype = {
    constructor: Event,
    // 有的话直接返回，没有的话创建一个
    _getPool: function _getPool(eventName) {
      if (!this.pool[eventName]) {
        this.pool[eventName] = {
          stop: true,
          list: []
        };
      }
      return this.pool[eventName];
    },

    // 注册触发多次的函数
    on: function on(eventName, cb, ctx) {
      if (!judgeFunction(cb)) {
        return;
      }

      this._getPool(eventName).list.push(new E(cb.bind(ctx), false));
      return this;
    },

    // 注册触发一次的函数
    once: function once(eventName, cb, ctx) {
      if (!judgeFunction(cb)) {
        return;
      }

      this._getPool(eventName).list.push(new E(cb.bind(ctx), true));
      return this;
    },

    // 触发函数并传递options
    trigger: function trigger(eventName, msg) {
      var p = this.pool[eventName];
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

      p.list = p.list.filter(function (f) {
        return !f.once || !f.done;
      });
      p.stop = true;
    },

    // stop event trigger
    stop: function stop(eventName) {
      var p = this.pool[eventName];
      if (!p) {
        return;
      }

      p.stop = true;
    }
  };

  /**
   * 库代码入口
   */

  return Event;

})));
