Seeing Is Believing
===================

Evaluates JavaScript code, recording the results of each line.
See the [ruby implementation](https://github.com/JoshCheek/seeing_is_believing/)
for a better sense of what it could be.


Status
------

Currently not good enough to use and important enough to be a priority for me.
I'll maybe find my way back here to work on it every now and then.


Notes for later
---------------

* Put it on travis
* Node has some sort of event API, eg `process.stdout.on("data", ...)`, would be good to use that with SiB as it discovers results
* Creating a property https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

  ```javascript
  var o = {}; // Creates a new object
  Object.defineProperty(o, 'a', {
    value: 37,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  ```
* Needs to pull from stdin if there is no filename
* It should use something smarter to determine where it can put the annotations
* The line-end processing is iffy
* Make sure it doesn't wipe out existing comments
* etc, just look at the Ruby version for a better list
