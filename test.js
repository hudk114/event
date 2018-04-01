const Event = require('./event');
const e = new Event();

const obj = {
  prop: 3,
  func () {
    console.log(this);
  }
};

// simple usage
e.once('simple', _ => {
  console.log('once will only be triggered once!');
});
e.on('simple', _ => {
  console.log('on will always be triggered!')
});
e.trigger('simple');
e.trigger('simple');

// trigger msg
e.on('msg', val => {
  console.log(val.name);
});
e.trigger('msg', { name: 'hudk' });

// bind this
// event will lose this
e.once('bind', obj.func);
// simple way to bind this
e.once('bind', obj.func, obj);
// another way to bind this
e.once('bind', obj.func.bind(obj));
e.on('bind', obj.func);
e.on('bind', obj.func, obj);
e.on('bind', obj.func.bind(obj));
e.trigger('bind');
e.trigger('bind');

// Event.stop
e.once('stop', _ => {
  console.log('this event would trigger once, and prevent other callback!');
  e.stop('stop');
});
e.on('stop', _ => {
  console.log('this event would be triggered on the second time;')
});
// e.on won't be triggered this time
e.trigger('stop');
// e.on will be triggered this time
e.trigger('stop');
