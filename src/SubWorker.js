/**
*  @module BlobWorker
*  @namespace cloudkid
*/
(function()
{
	/**
	*	Internal class that pretends to be a Web Worker's context.
	*	@class SubWorker
	*	@constructor
	*	@param {String} codeString A string to evaluate into worker code.
	*	@param {FallbackWorker} parent The FallbackWorker that owns this SubWorker.
	*/
	var SubWorker = function(codeString, parent)
	{
		this._wParent = parent;
		eval(codeString); // jshint ignore:line
	};

	// Referene to the prototpye
	var p = SubWorker.prototype;

	/**
	*	See https://developer.mozilla.org/en-US/docs/Web/API/Worker.onmessage
	*	@property {Function} onmessage
	*/
	p.onmessage = null;

	/**
	*	The FallbackWorker that is controlls by this SubWorker.
	*	@property {FallbackWorker} _wParent
	*	@private
	*/
	p._wParent = null;

	/**
	*	See https://developer.mozilla.org/en-US/docs/Web/API/Worker.postMessage
	*	@method postMessage
	*	@param {*} data The data to send.
	*/
	p.postMessage = function(data)
	{
		var parent = this._wParent;
		setTimeout(parent.onmessage.bind(parent, {data:data}), 1);
	};

	// Assign to namespace
	namespace("cloudkid").SubWorker = SubWorker;

}());