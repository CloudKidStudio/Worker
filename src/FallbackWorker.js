/**
*  @module BlobWorker
*  @namespace cloudkid
*/
(function()
{
	// Include classes
	var SubWorker = include('cloudkid.SubWorker');

	/**
	*	An internal class that duplicates the Worker API as a fallback when WebWorkers are not supported.
	*	@class FallbackWorker
	*	@constructor
	*	@param {String} codeString A string to evaluate into worker code.
	*/
	var FallbackWorker = function(codeString)
	{
		this._wChild = new SubWorker(codeString, this);
	};

	// Reference to prototype
	p = FallbackWorker.prototype;

	/**
	*	See https://developer.mozilla.org/en-US/docs/Web/API/Worker.postMessage
	*	@method postMessage
	*	@param {*} data The data to send.
	*/
	p.postMessage = function(data)
	{
		var child = this._wChild;
		setTimeout(child.onmessage.bind(child, {data:data}), 1);
	};

	/**
	*	See https://developer.mozilla.org/en-US/docs/Web/API/Worker.terminate
	*	@method terminate
	*/
	p.terminate = function()
	{
		this.onmessage = null;
		var child = this._wChild;
		child._wParent = null;
		child.onmessage = null;
		this._wChild = null;
	};

	/**
	*	See https://developer.mozilla.org/en-US/docs/Web/API/Worker.onmessage
	*	@property {Function} onmessage
	*/
	p.onmessage = null;
	
	/**
	*	The SubWorker that is controlled by this FallbackWorker.
	*	@property {SubWorker} _wChild
	*	@private
	*/
	p._wChild = null;

	// Assign to namespace
	namespace("cloudkid").FallbackWorker = FallbackWorker;

}());