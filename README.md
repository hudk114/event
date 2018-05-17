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
add callback, which will always be triggered when event happens

    var obj = { a: 3 }; 
    e.on('on', val => console.log(val));
    e.on('on', _ => console.log(this.a), obj); // the this would be global if without context
    e.trigger('on', 5); // 5 3
    e.trigger('on', 7); // 7 3

### once(eventName, callback, [context])
add callback, which will only be triggered once

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