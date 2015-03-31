# Worker [![Build Status](https://travis-ci.org/CloudKidStudio/Worker.svg)](https://travis-ci.org/CloudKidStudio/Worker) [![Dependency Status](https://david-dm.org/cloudkidstudio/worker.svg)](https://david-dm.org/cloudkidstudio/worker)

Execute inline JavaScript with a Web Worker API polyfill.

## Installation

Installation is available using [Bower](http://bower.io). 

```shell
bower install cloudkid-worker
```

## Example Usage

```js
var workerCode = "this.onmessage = function(event)" +
"{" +
	"var data = event.data;" +
	"var returnVal = data.value * data.value;" +
	"this.postMessage(returnVal);" +
"};";

// Create the worker
var worker = cloudkid.Worker.init(workerCode);
worker.onmessage = function(e)
{
	console.log(e.data); // returns 400
};

// Start the worker.
worker.postMessage({value:20});
``` 

## License

Copyright (c) 2015 CloudKid

Released under the MIT License.
