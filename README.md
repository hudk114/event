# event.js
simple event implement

## import
npm install -S @hudk/event

## usage

    var Event = require('@hudk/event');
    var e = new Event();

## api
### trigger(eventName, [message])
trigger event

    e.trigger('trigger', { author: hudk });
### on(eventName, callback, [context])
add callback, which will always be triggered when event happens, return the handler

    var obj = { a: 3 }; 
    e.on('on', val => console.log(val));
    e.on('on', _ => console.log(this.a), obj); // the this would be global if without context
    e.trigger('on', 5); // 5 3
    e.trigger('on', 7); // 7 3

### once(eventName, callback, [context])
add callback, which will only be triggered once, return the handler

    var obj = { a: 3 }; 
    e.on('once', val => console.log(val));
    e.on('once', _ => console.log(this.a), obj);
    e.trigger('once', 5); // 5 3
    e.trigger('once', 7); // no output

### stop(eventName)
stop event from continue triggering

    e.once('stop', _ => {
      e.stop('stop');
    });
    e.once('stop', _ => console.log(3));
    e.trigger('stop') // no output
    e.trigger('stop') // 3
*stop should only used in once, or all your callbacks defined later won't be triggered*

**0.1.1 add**
### remove(eventName)
remove event handler

    var h = e.once('remove', _ => {
      console.log('remove once');
    });
    e.on('remove', _ => {
      console.log('remove on');
    });

    e.remove('remove', h);
    e.trigger('remove'); // remove on

**0.1.1 add**
### setPrepare(prepareFunction)
you can use your own prepare function `function (a, b) {}` to compare eventName
which means you can use all data structure as eventName

    var e = new Event();
      e.setPrepare(function (a, b) {
      for (const key in a) {
        if (a.hasOwnProperty(key)) {
          if (a[key] !== b[key]) return false;
        }
      }
    
      for (const key in b) {
        if (b.hasOwnProperty(key)) {
          if (a[key] !== b[key]) return false;
        }
      }
    
      return true;
    });

    var k = e.on({ a: 1, b: 2 }, _ => {
      console.log('this event has object name!');
    });

    e.trigger({ b: 2, a: 1 }); // this event has object name!
*the default compare function is  `function (a, b) { return a === b; }`*
