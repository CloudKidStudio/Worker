/**
*  @module BlobWorker
*  @namespace cloudkid
*/
(function()
{
	// Include classes
	var FallbackWorker = include('cloudkid.FallbackWorker');

	// Combine prefixed URL for createObjectURL from blobs.
	var URL = window.URL || window.webkitURL;

	// Combine prefixed blob builder
	var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

	/**
	*  The Web Workers specification defines an API for spawning background scripts in your web
	*  application. Web Workers allow you to do things like fire up long-running scripts to
	*  handle computationally intensive tasks, but without blocking the UI or other scripts
	*  to handle user interactions. Because Workers aren't available on all browsers, we provide
	*  a helpful polyfill for backward compatibility. This worker is designed to run
	*  asyncronously instead of calling an external file.
	*
	*	var workerCode = "this.initialVariable = 10;" +
	*	"this.onmessage = function(event)" +
	*	"{" +
	*		"var data = event.data;" +
	*		"var returnVal = this.initialVariable + data.addValue;" +
	*		"this.postMessage(returnVal);" +
	*	"};";
	*
	*	// Create the worker
	*	var worker = cloudkid.Worker.init(workerCode);
	*	worker.onmessage = function(e) {
	*		// e.data is the returnVal
	*	};
	*
	*	// Start the worker.
	*	worker.postMessage();
	*
	*  @class Worker
	*/
	var Worker = {};

	/**
	*  Initialize the worker, this is how you create a Worker or FallbackWorker object.
	*  @method init
	*  @static
	*  @param {String} codeString The code in string form to make the worker from. As a string, fallback support is easier.
	*  @return {cloudkid.FallbackWorker|window.Worker} Either a Web Worker or a fallback with the same API to use.
	*/
	Worker.init = function(codeString)
	{
		if(!URL || !window.Worker) return new FallbackWorker(codeString);

		var blob;
		try
		{
			blob = new Blob([codeString], {type: 'application/javascript'});
		}
		catch (e)
		{
			// try Backwards-compatibility with blob builders
			if (!BlobBuilder) return new FallbackWorker(codeString);

			try
			{
				blob = new BlobBuilder();
				blob.append(codeString);
				blob = blob.getBlob();
			}
			catch(error)
			{
				// no way of generating a blob to create the worker from
				return new FallbackWorker(codeString);
			}
		}

		// if somehow no blob was created, return a fallback worker
		if (!blob) return new FallbackWorker(codeString);

		try
		{
			// IE 10 and 11, while supporting Blob and Workers, should
			// throw an error here, so we should catch it and fall back
			var worker = new window.Worker(URL.createObjectURL(blob));
			return worker;
		}
		catch(e)
		{
			// can't create a worker
			return new FallbackWorker(codeString);
		}
	};

	// Assign to namespace
	namespace("cloudkid").Worker = Worker;
	
}());