/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Released under the the MIT License.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT and BSD Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );

//Need Jquery
//Need translate

var pagesize = 10;

var passwordReg = /^[A-Za-z0-9\_]+$/;

var ImageDomain = "https://image2.highpin.cn";

var JobSearchDomain = "http://j.highpin.cn";

var SeekerDomain = "http://c.highpin.cn";

var WWWDomain = "http://www.highpin.cn";

var HunterDomian = "http://h.highpin.cn";

var RecruiterDomian = "http://hr.highpin.cn";


function isChinese(inputString) {
    var ret = true;
    for (var i = 0; i < inputString.length; i++) {
        var tmp = (inputString.charCodeAt(i) >= 10000);
        if (!tmp && inputString.charAt(i) == '.') {
            tmp = true;
        }
        ret = ret && tmp;
    }
    return ret;
}

function isEnglishName(str) {
    var result = false;

    if (str != undefined && str != null && str != "") {
        str = str.replace(/\s+/g, " ");

        result = /^([A-Za-z]+\s?)*[A-Za-z]$/.test(str);
    }



    return result;

}

function valid_email(email) {
    var patten = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/);
    return patten.test(email);
}

//验证固定电话
function valid_Telephone(telephone) {
    var patten = new RegExp(/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,10}){1}(\-[0-9]{1,8})?$/);
    return patten.test(telephone);
}

function valid_mobile(mobile) {
    var expression = "^\\d{1,20}$";
    //数字表达式
    var patten = new RegExp(expression);
    var result = patten.test(mobile);

    return result;
}

//上传失败提示语
function GetUploadResult(result) {
    var txt = "";

    switch (result) {
        case -2:
            txt = "您上传的图片格式不正确，图片仅支持JPG、GIF、PNG格式";
            break;
        case -3:
            txt = "上传文件过宽";
            break;
        case -4:
            txt = "上传文件过高";
            break;
        case -5:
            txt = "上传超时";
            break;
        case -6:
            txt = "您没有权限上传";
            break;
        case -7:
            txt = "您上传的图片格式不正确，图片仅支持JPG、GIF、PNG格式";
            break;
        case -8:
            txt = "您上传的图片不可超过500K";
            break;
        case -9:
            txt = "请选择您要上传的文件";
            break;
        case -10:
            txt = "您上传的图片不可超过2M";
            break;
    }

    return txt;
}


//客户端检查文件名称
function CheckPhotoName(uploadFileID) {
    var b = false;

    var resultID = -2;

    var fileName = $("#" + uploadFileID).val();
    //$("#" + uploadFileID)[0].
    try {
        var list = fileName.split(".");

        if (list.length == undefined || list.length < 2) {
            return -2;
        }
        else {
            var extend = list[list.length - 1].toLowerCase();

            switch (extend) {
                case "jpg":
                case "gif":
                case "png":
                    resultID = 0;
                    break;
            }
        }
    }
    catch (e) {
        return -2;
    }



    return resultID;

}


//检查数组是否仅有一列
function CheckArraySameContent(dataArray) {
    var cell0 = dataArray[0];

    var sameData = false;

    var type = cell0 instanceof Array;

    if (!type) {
        sameData = true;
    }

    return sameData;
}


function CheckAndInsertArray(list, item) {
    if (list == null) {
        list = new Array();
    }

    var has = false;

    for (var i = 0; i < list.length; i++) {
        if (list[i] == item) {
            has = true;
        }
    }

    if (!has) {
        list.push(item);
    }
}

//添加一个Dropdownlist
//@parentElementID 父容器ID
//@newDropdownListID新创建的DropdownListID
//@dataArray数据词典
function AddDropdownlist(parentElementID, newDropdownListID, dataArray) {
    //初始化下拉框
    AddDropDownListToParent(parentElementID, newDropdownListID);

    //添加数据
    if (dataArray != null && dataArray.length > 0) {
        var sameData = CheckArraySameContent(dataArray);

        var v;
        var t;

        for (var i = 0; i < dataArray.length; i++) {
            if (sameData) {
                v = dataArray[i];
                t = dataArray[i];
            }
            else {
                v = dataArray[i][0];
                t = dataArray[i][1];
            }

            $("#" + newDropdownListID).append("<option value='" + v + "'>" + t + "</option>");
        }
    }
}


//将DropdownList添加至父Elements
function AddRadioToParent(parentElementID, newRadioName, radioValue, radioText, checked) {
    var radio = $("<input/>");

    radio.attr({ "type": "radio", "name": newRadioName, id: newRadioName + "_" + radioValue, value: radioValue, checked: checked });

    radio.appendTo("div[id=" + parentElementID + "]");

    $("#" + parentElementID).append(" " + radioText + " ");

}


function GetTextAreaInputHtml(id, itemValue, className, maxlength, ValueType) {
    var txt = "";

    if (itemValue == null) {
        itemValue = "";
    }


    var classString = "";

    if (className != null && className != "") {
        classString = " class='" + className + "'";
    }

    var onkeyupEventString = " onkeyup='if(this.value.length > " + maxlength.toString() + ") this.value=this.value.substr(0," + maxlength.toString() + ");ShowTextAreaLenthEx(\"" + id.toString() + "\"," + maxlength.toString() + ")'";

    var Onblur = "";

    Onblur = " onblur='CheckValueIsLegal(" + id.toString() + "," + ValueType + ")' ";
    //}
    //else {
    //    Onblur = " onblur='CheckValueIsLegal(" + id.toString() + ")' ";
    //}

    var alreadyInputLen = 0;

    var canInputLen = maxlength;

    if (itemValue != undefined && itemValue != null) {
        alreadyInputLen = itemValue.length;

        canInputLen = maxlength - alreadyInputLen;
    }

    txt += "<textarea id='" + id.toString() + "'" + classString + "" + onkeyupEventString + Onblur + ">" + textSpecCode(itemValue) + "</textarea><a>您已经输入 <span id='Already_Input_" + id.toString() + "'>" + alreadyInputLen + "</span> 字，还可以输入 <span id='Can_Input_" + id.toString() + "'>" + canInputLen.toString() + "</span> 字</a>";

    return txt;
}

function GetTextAreaInputHtmlEx(id, itemValue, className, maxlength, ValueType, enlength) {
    var txt = "";

    if (itemValue == null) {
        itemValue = "";
    }


    var classString = "";

    if (className != null && className != "") {
        classString = " class='" + className + "'";
    }

    var onkeyupEventString = " onkeyup='changeLength(this," + maxlength + "," + enlength + ");ShowTextAreaLenthEx(\"" + id.toString() + "\"," + maxlength.toString() + "," + enlength + ")'";

    var Onblur = "";

    Onblur = " onblur='CheckValueIsLegal(" + id.toString() + "," + ValueType + ")' ";
    //}
    //else {
    //    Onblur = " onblur='CheckValueIsLegal(" + id.toString() + ")' ";
    //}

    var alreadyInputLen = 0;

    var canInputLen = maxlength;

    if (itemValue != undefined && itemValue != null) {
        alreadyInputLen = itemValue.length;

        canInputLen = maxlength - alreadyInputLen;
    }

    var obj = GetInputLength(itemValue, maxlength, enlength);
    alreadyInputLen = obj.inputLength;
    canInputLen = obj.caninputLength;

    txt += "<textarea id='" + id.toString() + "'" + classString + "" + onkeyupEventString + Onblur + ">" + textSpecCode(itemValue) + "</textarea><a>您已经输入 <span class='grewColor' id='Already_Input_" + id.toString() + "'>" + alreadyInputLen + "</span> 字，还可以输入 <span id='Can_Input_" + id.toString() + "'>" + canInputLen.toString() + "</span> 字</a>";

    return txt;
}

//获取元素的绝对位置
function GetAbsoluteLocation(element) {
    if (arguments.length != 1 || element == null) {
        return null;
    }
    var offsetTop = element.offsetTop;
    var offsetLeft = element.offsetLeft;
    var offsetWidth = element.offsetWidth;
    var offsetHeight = element.offsetHeight;
    while (element = element.offsetParent) {
        offsetTop += element.offsetTop;
        offsetLeft += element.offsetLeft;
    }
    return {
        absoluteTop: offsetTop, absoluteLeft: offsetLeft,
        offsetWidth: offsetWidth, offsetHeight: offsetHeight
    };
}


function GetScrollTop() {
    var browser = GetBrowser();

    var scrollTop;

    if (browser.IsChrome) {
        scrollTop = document.body.scrollTop;
    }
    else {
        scrollTop = document.documentElement.scrollTop;

    }

    return scrollTop;
}

function ShowBox(showID, html, openLayerID, callBackFunctionName, callBackFunctionParameter) {
    var browser = GetBrowser();
    //SetDocumentScrollbar(true);
    var obj = document.getElementById(showID);

    //弹出层定位
    var newbox = document.createElement("div");

    newbox.id = openLayerID;

    var left = 0;

    var top = 0;

    if (obj != null) {
        var location = GetAbsoluteLocation(obj);

        left = location.absoluteLeft;

        top = location.absoluteTop + obj.clientHeight;
    }

    newbox.className = "alertfull";
    newbox.innerHTML = html;
    newbox.style.zIndex = "9999";
    newbox.style.display = "block";
    newbox.style.position = "absolute";
    document.body.appendChild(newbox);

    newbox.style.top = top.toString() + "px";
    newbox.style.left = left.toString() + "px";
    //蒙层
    var layer = document.createElement("div");
    layer.id = gloabid;
    layer.style.width = layer.style.height = "100%";
    if (browser.IsIE6) {
        layer.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
        layer.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
    }
    layer.style.position = !browser.IsIE6 ? "fixed" : "absolute";
    layer.style.top = layer.style.left = 0;
    layer.className = "showlayerbackwhite";
    layer.style.zIndex = "9998";

    layer.onclick = function () {
        eval(callBackFunctionName + "(" + callBackFunctionParameter + ")");
    };

    document.body.appendChild(layer);


}


function ShowTextAreaLenth(id, maxlength) {
    var obj = document.getElementById(id);

    if (obj != undefined && obj != null) {
        var inputLength = obj.value.length;
        if (inputLength > 0) {
            DiscardAlert(id);
            //ResponseAlert(true, id, "");
        }
        var caninputLength = parseInt(maxlength - inputLength);

        $("#Already_Input_" + id.toString()).html(inputLength.toString());

        $("#Can_Input_" + id.toString()).html(caninputLength.toString());

    }
}

function ShowTextAreaLenthEx(id, cnlength, enlength) {

    var obj = document.getElementById(id);

    if (obj != undefined && obj != null) {

        var content = obj.value;
        var inputLength = 0;
        var caninputLength = 0;
        var obj = GetInputLength(content, cnlength, enlength);
        inputLength = obj.inputLength;
        caninputLength = obj.caninputLength;
        $("#Already_Input_" + id.toString()).html(inputLength.toString());
        $("#Can_Input_" + id.toString()).html(caninputLength.toString());
    }
}

function GetInputLength(content, cnlength, enlength) {
    var obj = null;
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;

    if (content == undefined || content == null) {
        content = "";
    }
    var tmplen = content.length;
    if ($Current["lauguage"] != null &&
           $Current["lauguage"] != undefined &&
           $Current["lauguage"] == "en-us") {
        obj = GetAllInputLength(content, enlength);
    } else {
        obj = GetAllInputLength(content, cnlength);
    }
    //var inputLength = content.length;
    //var caninputLength = cnlength - content.length;
    //return { "inputLength": inputLength, "caninputLength": caninputLength };
    return obj;

    function GetCnInputLength(content, maxlength) {
        var inputLength = content.length;
        var caninputLength = parseInt(maxlength - inputLength);
        return { "inputLength": inputLength, "caninputLength": caninputLength };
    }

    function GetEnInputLength(content, maxlength) {
        var inputLength = content.length;
        var caninputLength = parseInt(maxlength - inputLength);
        return { "inputLength": inputLength, "caninputLength": caninputLength };
    }

    function GetAllInputLength(content, maxlength) {
        var inputLength = content.length,
            caninputLength = parseInt(maxlength - inputLength);
        return { "inputLength": inputLength, "caninputLength": caninputLength };
    }
}



//获取文本框html(id,默认值)
function GetTextInputHtml(id, itemValue, size, onblurEvent, className, onfocusEvent, addType, onkeyupEvent) {
    var txt = "";

    if (itemValue == null) {
        itemValue = "";
    }


    var sizeString = "";

    if (size != undefined && size != null && size != "") {
        sizeString = " maxlength=" + size.toString();
    }

    var classString = "";

    if (className != null && className != "") {
        classString = " class='" + className + "'";
    }

    var onfocusEventString = "";

    if (onfocusEvent != undefined && onfocusEvent != null && onfocusEvent != "") {
        onfocusEventString += " onfocus='" + onfocusEvent + "'";
    }

    var onblurEventString = "";

    if (onblurEvent != null && onblurEvent != "") {
        onblurEventString += " onblur='" + onblurEvent + "'";
    }

    var addTypeString = "";

    if (addType != undefined && addType != null && addType != "") {
        addTypeString = " style=\"" + addType + "\"";
    }

    var keyupString = "";
    if (onkeyupEvent != undefined && onkeyupEvent != null && onkeyupEvent != "") {
        keyupString = " onkeyup='" + onkeyupEvent + "'";
    }

    txt += "<input type='text' id='" + id.toString() + "' " + onfocusEventString + " " + sizeString + " value='" + textSpecCode(itemValue) + "'" + classString + "" + onblurEventString + addTypeString + keyupString + "/>";

    return txt;
}


function GetTextInputHtmlAutoValid(id, itemValue, size, onkeyupEvent, className) {
    var txt = "";

    if (itemValue == null) {
        itemValue = "";
    }


    var sizeString = "";

    if (size != null && size != "") {
        sizeString = " maxlength=" + size.toString();
    }

    var classString = "";

    if (className != null && className != "") {
        classString = " class='" + className + "'";
    }

    var onblurEventString = "";

    if (onkeyupEvent != null && onkeyupEvent != "") {
        onblurEventString += " onkeyup='" + onkeyupEvent + "'";
    }

    txt += "<input type='text' id='" + id.toString() + "' " + sizeString + " value='" + textSpecCode(itemValue) + "'" + classString + "" + onblurEventString + "/>";

    return txt;
}

function GetHiddenInputHtml(id, itemValue) {
    var txt = "";

    if (itemValue == null) {
        itemValue = "";
    }

    txt += "<input type='hidden' id='" + id.toString() + "' value='" + itemValue + "'/>";

    return txt;
}

function GetButtonInputHtml(id, itemValue, onclickEvent, className) {
    var txt = "";

    if (itemValue == null) {
        itemValue = "";
    }

    var classString = "";

    if (className != null && className != "") {
        classString = " class='" + className + "'";
    }

    var onclickEventString = "";

    if (onclickEvent != null && onclickEvent != "") {
        onclickEventString += " onclick='" + onclickEvent + "'";
    }

    txt += "<input type='button' id='" + id.toString() + "' value='" + itemValue + "'" + classString + "" + onclickEventString + "/>";

    return txt;
}


function GetRadioInputHtml(radioName, dataArray, checkedValue, classname,flag) {
    var sameData = CheckArraySameContent(dataArray);

    var v;
    var t;

    var blank = "";

    var txt = "";

    for (var i = 0; i < dataArray.length; i++) {
        if (sameData) {
            v = dataArray[i];
            t = dataArray[i];
        }
        else {
            v = dataArray[i][0];
            t = dataArray[i][1];
        }

        var selectedString = "";

        if (checkedValue != null && checkedValue != undefined) {
            if (v.toString() == checkedValue.toString()) {
                selectedString = " checked";
            }
        }

        var classnamestring = "";

        if (classname != undefined) {
            classnamestring = " class='" + classname + "'";
        }
        if (flag)
            txt += blank + "<div style='float:left; width:140px;'><input type=\"radio\" name=\"" + radioName + "\" " + classnamestring + " id=\"" + radioName + "_" + v.toString() + "\" style='margin-top:1px;'  value=\"" + v + "\"" + selectedString + "/><span class=\"mar-r6\">" + t + "</span></div> ";
        else
            txt += blank + "<input type=\"radio\" name=\"" + radioName + "\" " + classnamestring + " id=\"" + radioName + "_" + v.toString() + "\" value=\"" + v + "\"" + selectedString + "/><span class=\"mar-r6\">" + t + "</span> ";

        //txt += blank + "<input type=\"radio\" name=\"" + radioName + "\" " + classnamestring + " id=\"" + radioName + "_" + v.toString() + "\" value=\"" + v + "\"" + selectedString + "/><span class=\"mar-r6\">" + t + "</span> ";
    }

    return txt;
}

function GetSelectHtml(newDropdownListID, dataArray, selectValue, onChangeText, classname, disabledchoose) {
    var onchange = "";

    if (onChangeText != null && onChangeText != "") {
        onchange += " onchange='" + onChangeText + "'";
    }

    var classnamestring = "";

    if (classname != undefined) {
        classnamestring = " class='" + classname + "'";
    }

    var txt = "<select id='" + newDropdownListID + "'" + onchange + " name='" + newDropdownListID + "'  " + classnamestring + ">";

    var sameData = CheckArraySameContent(dataArray);

    var v;
    var t;

    if (disabledchoose == undefined || disabledchoose == false) {
        txt += "<option value='0'>" + GetKeyTranslate("choosealert") + "</option>";
    }



    for (var i = 0; i < dataArray.length; i++) {
        if (sameData) {
            v = dataArray[i];
            t = dataArray[i];
        }
        else {
            v = dataArray[i][0];
            t = dataArray[i][1];
        }

        var selectedString = "";

        if (selectValue != null && selectValue != undefined) {
            if (v.toString() == selectValue.toString()) {
                selectedString = " selected";
            }
        }

        txt += "<option value='" + v + "'" + selectedString + ">" + t + "</option>";
    }

    txt += "</select>";

    return txt;

}

//将DropdownList添加至父Elements
function AddDropDownListToParent(parentElementID, newDropdownListID) {

    var select = $("<select/>");

    select.attr({ "name": newDropdownListID, "id": newDropdownListID });

    select.appendTo("div[id=" + parentElementID + "]");


    $("#" + newDropdownListID).append("<option value='0'>" + GetKeyTranslate("choosealert") + "</option>");


}


function GetYearDropdownListHtml(newDropdownListID, startYear, selectedValue, classname) {
    var endYear = new Date().getFullYear();

    var yearArray = GetYearArray(startYear, endYear);

    var txt = "";

    txt += GetSelectHtml(newDropdownListID, yearArray, selectedValue, "", classname);

    txt += "<a>" + GetKeyTranslate("year") + "</a>";

    return txt;


}

///
function GetYearMonthDropdownListHtml(newDropdownListID, containerElementID, startYear, dateString, classname) {
    var endYear = new Date().getFullYear();

    var txt = "";

    var selectyear = "";

    var selectmonth = "";

    var yearID = newDropdownListID + "_year";

    var monthID = newDropdownListID + "_month";

    var onchangetxt = "ChangeYearAndMonthDropdownList(\"" + yearID + "\", \"" + monthID + "\", \"" + containerElementID + "\")";

    var yearArray = GetYearArray(startYear, endYear);

    if (dateString != null && dateString != "" && dateString.indexOf('-') != -1) {
        var dateArray = dateString.split('-');

        selectyear = dateArray[0];

        selectmonth = parseInt(dateArray[1]).toString();
    }

    txt += GetSelectHtml(yearID, yearArray, selectyear, onchangetxt, classname);

    txt += "<a>" + GetKeyTranslate("year") + "</a>";

    var monthArray = GetMonthArray();

    txt += GetSelectHtml(monthID, monthArray, selectmonth, onchangetxt, classname);

    txt += "<a>" + GetKeyTranslate("month") + "</a>";

    return txt;

}


//创建一个年月选择菜单
//@parentElementID 父容器ID
//@containerElementID存储年月字符串的ID
//@startYear年开始
//@endYear年结束
function CreateYearMonthDropdownList(parentElementID, containerElementID, startYear, endYear) {

    var yearID = parentElementID + "_year";

    var yearArray = GetYearArray(startYear, endYear);

    AddDropdownlist(parentElementID, yearID, yearArray);

    $("#" + parentElementID).append("&nbsp;" + GetKeyTranslate("month") + "&nbsp;");

    var monthID = parentElementID + "_month";

    var monthArray = GetMonthArray();

    AddDropdownlist(parentElementID, monthID, monthArray);

    $("#" + parentElementID).append("&nbsp;" + GetKeyTranslate("month"));

    if ($("#" + containerElementID).val() != "") {
        var initValue = $("#" + containerElementID).val();

        if (initValue.indexOf("-") != -1) {
            var array = initValue.split("-");

            $("#" + yearID).val(array[0]);

            $("#" + monthID).val(parseInt(array[1]).toString());
        }
    }


    var selectObj = document.getElementById(yearID);

    if (selectObj != null) {
        selectObj.onchange = function () { ChangeYearAndMonthDropdownList(yearID, monthID, containerElementID); };
    }

    selectObj = document.getElementById(monthID);

    if (selectObj != null) {
        selectObj.onchange = function () { ChangeYearAndMonthDropdownList(yearID, monthID, containerElementID); };
    }
}

function GetArrayFromDate(date) {
    var array = null;

    if (date == null || date == "") {
        return array;
    }

    if (date.indexOf("-") != -1) {
        array = date.split("-");
    }
    else {
        array = date;
    }


    return array;
}

//内部方法
function ChangeYearAndMonthDropdownList(yearID, monthID, containerID) {

    var year = $("#" + yearID).val();

    var month = $("#" + monthID).val();

    if (year != "0" && month != "0") {
        $("#" + containerID).val(year + "-" + month + "-1");
    }
    else {
        $("#" + containerID).val("");
    }
}


//获取年下拉菜单起始，结束
function GetYearArray(startyear, endyear) {
    var i = startyear;

    var array = new Array();

    if (startyear > endyear) return array;

    while (i <= endyear) {
        array.push(i);

        i++;
    }

    return array;
}

//获取月下拉菜单1-12
function GetMonthArray() {
    var array = new Array();

    for (var i = 1; i <= 12; i++) {
        array.push(i);
    }

    return array;
}


function ConvertToComputerTimeArray(dateTime) {
    var yearString = "";

    var monthString = "";

    var dateValue;

    if (!(dateTime == undefined || dateTime == null || dateTime == "")) {
        if (dateTime.toString().split('-').length == 3) {
            var dv = dateTime.toString().split('-');

            yearString = dv[0];

            monthString = dv[1];
        }
        else {
            var date = eval('new ' + eval(dateTime).source);

            yearString = (date.getFullYear()).toString();
            //yearString = (date.getUTCFullYear()).toString();
            monthString = (date.getMonth() + 1).toString();
            //monthString = (date.getUTCMonth() + 1).toString();
        }
    }


    var array = new Array();

    array.push(yearString);

    array.push(monthString);

    return array;
}

function ConvertToComputerTime(dateTime) {
    var yearString;

    var monthString;

    var dateValue;

    if (dateTime == undefined || dateTime == null || dateTime == "") {
        return "";
    }

    if (dateTime.toString().split('-').length == 3) {
        var dv = dateTime.toString().split('-');

        yearString = dv[0];

        monthString = dv[1];
    }
    else {
        var date = eval('new ' + eval(dateTime).source);

        yearString = (date.getFullYear()).toString();
        monthString = (date.getMonth() + 1).toString();
    }

    dateValue = yearString + "-" + monthString + "-1";

    return dateValue;
}


function ConvertToComputerShortDateString(datetime) {
    var dateValue = "";

    try {
        var obj = eval('(' + ("{Date: " + datetime.toString() + "}").replace(/\/Date\((\d+)\)\//gi, "new Date($1)") + ')');

        //var yearString = obj["Date"].getFullYear();
        var yearString = (obj["Date"].getUTCFullYear());

        //var monthString = obj["Date"].getMonth() + 1;
        var monthString = obj["Date"].getUTCMonth() + 1;

        //var dayString = obj["Date"].getDate();
        var dayString = obj["Date"].getUTCDate();

        dateValue += yearString.toString().substring(2, 4) + "-";
        if (monthString >= 10) {
            dateValue += monthString + "-";
        }
        else {
            dateValue += "0" + monthString + "-";
        }
        if (dayString >= 10) {
            dateValue += dayString;
        }
        else {
            dateValue += "0" + dayString;
        }


    }
    catch (e) {

    }

    return dateValue;
}

function ConvertToComputerDateString(datetime) {
    var dateValue = "";

    try {
        var obj = eval('(' + ("{Date: " + datetime.toString() + "}").replace(/\/Date\((\d+)\)\//gi, "new Date($1)") + ')');

        //var yearString = obj["Date"].getFullYear();
        var yearString = (obj["Date"].getUTCFullYear());

        //var monthString = obj["Date"].getMonth() + 1;
        var monthString = obj["Date"].getUTCMonth() + 1;

        //var dayString = obj["Date"].getDate();
        var dayString = obj["Date"].getUTCDate();

        dateValue += yearString + "-";
        if (monthString >= 10) {
            dateValue += monthString + "-";
        }
        else {
            dateValue += "0" + monthString + "-";
        }
        if (dayString >= 10) {
            dateValue += dayString;
        }
        else {
            dateValue += "0" + dayString;
        }


    }
    catch (e) {

    }

    return dateValue;
}

function ConvertToComputerShortMiniteString(datetime) {
    var dateValue = "";

    try {
        var obj = eval('(' + ("{Date: " + datetime.toString() + "}").replace(/\/Date\((\d+)\)\//gi, "new Date($1)") + ')');

        //var yearString = (obj["Date"].getFullYear()).toString().substring(2, 4);
        var yearString = (obj["Date"].getUTCFullYear()).toString().substring(2, 4);

        //var monthString = parseInt(obj["Date"].getMonth() + 1);
        var monthString = parseInt(obj["Date"].getUTCMonth() + 1);

        //var dayString = obj["Date"].getDate();
        var dayString = obj["Date"].getUTCDate();


        dateValue += yearString + "-";
        if (monthString >= 10) {
            dateValue += monthString + "-";
        }
        else {
            dateValue += "0" + monthString + "-";
        }
        if (dayString >= 10) {
            dateValue += dayString;
        }
        else {
            dateValue += "0" + dayString;
        }


        //var hou = obj["Date"].getHours();
        var hou = obj["Date"].getUTCHours();

        var hour = "";

        if (hou < 10) {
            hour = "0" + hou.toString();
        }
        else {
            hour = hou.toString();
        }

        var minute = "";

        //var min = obj["Date"].getMinutes();
        var min = obj["Date"].getUTCMinutes();

        if (min < 10) {
            minute = "0" + min.toString();
        }
        else {
            minute = min.toString();
        }

        dateValue = dateValue + " " + hour + ":" + minute;
    }
    catch (e) {

    }

    return dateValue;
}

function ConvertToComputerMiniteString(datetime) {

    var dateValue = "";

    try {
        var obj = eval('(' + ("{Date: " + datetime.toString() + "}").replace(/\/Date\((\d+)\)\//gi, "new Date($1)") + ')');

        //var yearString = (obj["Date"].getFullYear());
        var yearString = (obj["Date"].getUTCFullYear());

        //var monthString = parseInt(obj["Date"].getMonth() + 1);
        var monthString = parseInt(obj["Date"].getUTCMonth() + 1);

        //var dayString = obj["Date"].getDate();
        var dayString = obj["Date"].getUTCDate();


        dateValue += yearString + "-";
        if (monthString >= 10) {
            dateValue += monthString + "-";
        }
        else {
            dateValue += "0" + monthString + "-";
        }
        if (dayString >= 10) {
            dateValue += dayString;
        }
        else {
            dateValue += "0" + dayString;
        }


        //var hou = obj["Date"].getHours();
        var hou = obj["Date"].getUTCHours();

        var hour = "";

        if (hou < 10) {
            hour = "0" + hou.toString();
        }
        else {
            hour = hou.toString();
        }

        var minute = "";

        //var min = obj["Date"].getMinutes();
        var min = obj["Date"].getUTCMinutes();

        if (min < 10) {
            minute = "0" + min.toString();
        }
        else {
            minute = min.toString();
        }

        dateValue = dateValue + " " + hour + ":" + minute;
    }
    catch (e) {

    }

    return dateValue;
}


function ConvertToComputerTimeString(datetime) {
    var dateValue = "";

    try {
        var obj = eval('(' + ("{Date: " + datetime.toString() + "}").replace(/\/Date\((\d+)\)\//gi, "new Date($1)") + ')');

        //var yearString = (obj["Date"].getFullYear()).toString();

        //var monthString = (obj["Date"].getMonth() + 1).toString();

        //var dayString = (obj["Date"].getDate()).toString();

        //var hour = (obj["Date"].getHours()).toString();

        //var minute = (obj["Date"].getMinutes()).toString();

        //var second = (obj["Date"].getSeconds()).toString();    


        var yearString = (obj["Date"].getUTCFullYear()).toString();

        var monthString = (obj["Date"].getUTCMonth() + 1).toString();

        var dayString = (obj["Date"].getUTCDate()).toString();

        var hour = (obj["Date"].getUTCHours()).toString();

        var minute = (obj["Date"].getUTCMinutes()).toString();

        var second = (obj["Date"].getUTCSeconds()).toString();

        dateValue = yearString + "-" + monthString + "-" + dayString + " " + hour + ":" + minute + ":" + second;
    }
    catch (e) {

    }

    return dateValue;
}

function ConvertToJSDateString(dateTimeString) {
    if (dateTimeString == null) {
        return dateTimeString;
    }

    if (dateTimeString == "") {
        return dateTimeString;
    }


    var array = dateTimeString.split('-');

    var date = "/Date(" + Date.UTC(parseInt(array[0]), parseInt(array[1]) - 1, parseInt(array[2])).toString() + ")/";

    return date;
}

function ConvertToJSDate(dateTimeString) {
    var array = dateTimeString.split('-');

    var date = new Date(parseInt(array[0]), parseInt(array[1]) - 1, parseInt(array[2]));

    return date;
}


//转化时间格式
function ConvertDateTime(dateTime) {
    if (!dateTime) return "";

    var yearString;

    var monthString;

    var language = "zh-cn";

    var dateValue;

    try {
        language = $Current["lauguage"];
    }
    catch (e) {

    }

    if (dateTime.toString().split('-').length == 3) {
        var dv = dateTime.toString().split('-');

        yearString = dv[0];

        monthString = dv[1];
    }
    else {
        var date = eval('new ' + eval(dateTime).source);

        yearString = (date.getFullYear()).toString();
        //yearString = (date.getUTCFullYear()).toString();
        monthString = (date.getMonth() + 1).toString();
        //monthString = (date.getUTCMonth() + 1).toString();
    }

    if (language == "zh-cn") {
        dateValue = yearString + " " + GetKeyTranslate("year") + " " + monthString + " " + GetKeyTranslate("month");
    }
    else {
        dateValue = yearString + "/" + monthString;
    }

    return dateValue;
}

function GetLineBreakHtml(content) {
    var txt = "";

    txt = content.replace(/[\r]/g, "");

    txt = txt.replace(/[\n]/g, "<br/>");

    return txt;
}


/** 浏览器相关开始 **/

//初始化浏览器数据
function GetBrowser() {
    var browserName = navigator.userAgent.toLowerCase();

    this.BrowserName = browserName;

    this.IsIE = false;

    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
        this.IsIE = true;

        if (browserName.indexOf('msie 6.0') != -1) {
            this.IsIE6 = true;
        }

        else if (browserName.indexOf('msie 7.0') != -1) {
            this.IsIE7 = true;
        }

        else if (browserName.indexOf('msie 8.0') != -1) {
            this.IsIE8 = true;
        }

        else if (browserName.indexOf('msie 9.0') != -1) {
            this.IsIE9 = true;
        }

        else if (browserName.indexOf('msie 10.0') != -1) {
            this.IsIE10 = true;
        }

        else if (/Trident\/7.*rv:11./i.test(browserName)) {
            this.IsIE11 = true;
        }
    }
    else if (/firefox/i.test(browserName)) {
        this.IsFF = true;
    }
    else if (/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)) {
        this.IsChrome = true;
    }
    else if (/opera/i.test(browserName)) {
        this.IsOpera = true;
    }
    else if (/webkit/i.test(browserName) && !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))) {
        this.IsSafari = true;
    }

    return this;
}

function valid_email(email) {
    var patten = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/);
    return patten.test(email);
}

///禁用浏览器滚动条，如果禁用传true，不禁用传false
function SetDocumentScrollbar(disableStatus) {
    var browser = GetBrowser();
    var temp_h1 = document.body.clientHeight;
    var temp_h2 = document.documentElement.clientHeight;
    var isXhtml = (temp_h2 <= temp_h1 && temp_h2 != 0) ? true : false;
    var htmlbody = isXhtml ? document.documentElement : document.body;

    if (!disableStatus) {
        if (browser.IsChrome) {
            document.body.removeAttribute("style");
            htmlbody.style.overflow = "auto";
            enable_scroll();
        }
        else {
            htmlbody.style.overflow = "auto";
        }

        //document.body.style.overflow = "auto";
    }
    else {
        if (browser.IsChrome) {
            //document.body.style.overflow = "hidden";
            htmlbody.style.overflow = "hidden";
            disable_scroll();
        }
        else {
            htmlbody.style.overflow = "hidden";
        }

    }
}
//阻止浏览器默认鼠标滚轮事件(chrome浏览器bug)
function wheel(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}
//禁止鼠标滚轮事件(chrome浏览器bug)
function disable_scroll() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;
}
//启用鼠标滚轮事件(chrome浏览器bug)
function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = null;
}




/** 浏览器相关结束 **/

/** 验证相关 **/

function GetSafetyLevel(pass) {
    if (pass.length < 6) {
        //位数不够
        return 0;
    }
    if (pass.length == 6) {
        //长度等于4位，强度：低
        return 1;
    }

    var level = 0;
    if (CheckHasCapital(pass)) {
        //有大写字母
        level++;
    }
    if (CheckHasLowercase(pass)) {
        //有小写字母
        level++;
    }
    if (CheckHasNumber(pass)) {
        //有数字
        level++;
    }
    if (CheckHasUnderScore(pass)) {
        //有其他字符
        level++;
    }

    if (level == 1) {
        //只有一种组合，强度：低
        return 1;
    }
    else if (level == 2) {
        //只有两种组合，强度：中
        return 2;
    }
    else if (level > 2) {
        //有三种或以上组合，强度：高
        return 3;
    }
}

// 判断是否含有大写字母
function CheckHasCapital(str) {
    var result = str.match(/^.*[A-Z]+.*$/);
    if (result == null) return false;
    return true;
}

// 判断是否含有小写字母
function CheckHasLowercase(str) {
    var result = str.match(/^.*[a-z]+.*$/);
    if (result == null) return false;
    return true;
}

// 是否含有数字
function CheckHasNumber(str) {
    var result = str.match(/^.*[0-9]+.*$/);
    if (result == null) return false;
    return true;
}

// 是否含有下划线
function CheckHasUnderScore(str) {
    var result = str.match(/^.*[_]+.*$/);
    if (result == null) return false;
    return true;
}

function ReplaceToBR(text) {

}

/** 验证结束 **/

/** 分页码开始 **/

//pageIndex:当前页;paramDic:参数词典;funcName:触发js函数名称;inputID:分页码input框id（主要功能是不和别的ID重复）;maxCount:分页查询的总条数
function GetPageBarHtml(pageIndex, paramDic, funcName, inputID, maxCount) {
    var txt = "";

    if (!$.isNumeric(pageIndex) || pageIndex <= 0) {
        //return;
        if ($.isNumeric($("#CurrentPageIndex_" + inputID).val())) {
            pageIndex = parseInt($("#CurrentPageIndex_" + inputID).val());
        } else {
            pageIndex = 1;
        }
    }

    var funchead = "SetData";

    var mainParam = new Array();

    var notclickclass = "c-nopress";

    var canclickclass = "c-press";

    pageIndex = parseInt(pageIndex);



    txt += "<ul class='pagebar_ul'>";

    var maxPage = 1;

    if (maxCount % pagesize == 0) {
        maxPage = parseInt(maxCount / pagesize);
    }
    else {
        maxPage = parseInt(maxCount / pagesize) + 1;
    }

    if (pageIndex > maxPage) {
        pageIndex = maxPage;
    }

    if (pageIndex > 1) {

        txt += "<li class=\"c-preto-li\"><a " + GetPageFunctionBody(pageIndex - 1, paramDic, funcName) + " class=\"c-preto " + canclickclass + "\">上一页</a></li>";
    }
    else {
        txt += "<li class=\"c-preto-li\"><a class=\"c-preto " + notclickclass + "\">上一页</a></li>";
    }

    if (pageIndex > 3) {
        txt += "<li><a " + GetPageFunctionBody(1, paramDic, funcName) + " class=\"c-page sign\">1</a></li>";

        txt += "<li>…</li>";
    }

    for (var i = pageIndex - 2; i < pageIndex; i++) {

        if (i > 0) {
            txt += "<li><a " + GetPageFunctionBody(i, paramDic, funcName) + " class=\"c-page sign\">" + i.toString() + "</a></li>";
        }
    }

    txt += "<li><a class=\"c-pageactive sign\">" + pageIndex.toString() + "</a></li>";

    for (var i = pageIndex + 1; i < pageIndex + 3; i++) {
        if (i <= maxPage) {
            txt += "<li><a " + GetPageFunctionBody(i, paramDic, funcName) + "  class=\"c-page sign\">" + i.toString() + "</a></li>";
        }
    }

    if (pageIndex + 3 <= maxPage) {
        txt += "<li>…</li>";
        txt += "<li><a " + GetPageFunctionBody(maxPage, paramDic, funcName) + " class=\"c-page sign\">" + maxPage.toString() + "</a></li>";
    }


    if (pageIndex < maxPage) {
        txt += "<li class=\"c-pagenext-li\"><a " + GetPageFunctionBody(pageIndex + 1, paramDic, funcName) + " class=\"c-pagenext " + canclickclass + "\">下一页</a></li>";
    }
    else {
        txt += "<li class=\"c-pagenext-li\"><a class=\"c-pagenext " + notclickclass + "\">下一页</a></li>";
    }



    txt += "<li class=\"c-color100\"> 到";
    txt += "<input class=\"c-pageto\" id=\"" + inputID + "\" type=\"text\" value='" + pageIndex + "'/>";
    //增加翻页中当前页的记录
    txt += "<input type='hidden' id='CurrentPageIndex_" + inputID + "' value='" + pageIndex + "'/>";
    txt += "页";
    txt += "<input type=\"button\" " + GetPageFunctionInput(funcName, paramDic) + " class=\"c-page-sure\" value=\"确定\"/>";
    txt += "</li>";
    txt += "</ul>";

    return txt;

}


function GetPageFunctionBody(pageIndex, paramDic, funcName) {
    var txt = "";

    txt += "onclick='" + funcName + "(" + pageIndex.toString();

    if (paramDic != null && paramDic.length > 0) {
        for (var i = 0; i < paramDic.length; i++) {
            txt += "," + paramDic[i].toString();
        }
    }

    txt += ")'";

    return txt;
}

function GetPageFunctionInput(funcName, paramDic) {
    var txt = "";

    txt += "onclick='" + funcName + "(null";

    if (paramDic != null && paramDic.length > 0) {
        txt += "," + paramDic.join(",");
    }

    txt += ");'";

    return txt;
}

function GetPageIndex(inputId, itemCount) {

    var pageIndex = 1;

    var inputPageIndex = parseInt($("#" + inputId).val());

    var currentPageIndex = parseInt($("#CurrentPageIndex_" + inputId).val());

    if (inputPageIndex != currentPageIndex) {
        pageIndex = inputPageIndex;
    } else {
        pageIndex = currentPageIndex;
    }

    if (!$.isNumeric(pageIndex)) {
        pageIndex = 1;
    }

    var maxPage = Math.ceil(itemCount / pagesize) || 1;

    if (maxPage <= pageIndex) {
        pageIndex = maxPage;
    }

    return pageIndex;
}

/** 分页码结束 **/

function ClosePage() {
    window.opener = null;
    window.open('', '_self');
    window.close();
}

/** Seeker首页相关开始 **/

function HiddenBarList(itemindex) {
    $("#seeker_title_list_" + itemindex.toString()).hide();
}

function ShowBarList(itemindex) {
    for (var i = 1; i <= 7; i++) {
        if (i != itemindex) {
            $("#seeker_title_list_" + i.toString()).hide();
        }
    }

    var containerID = "seeker_title_" + itemindex.toString();

    var listID = "seeker_title_list_" + itemindex.toString();

    var obj = document.getElementById(containerID);


    var left = 0;

    var top = 0;

    if (obj != null) {
        var location = GetAbsoluteLocation(obj);

        if (itemindex != 7) {
            left = location.absoluteLeft + 4;
        }
        else {
            left = location.absoluteLeft - 41;
        }


        top = location.absoluteTop + 38;
    }

    var newbox = document.getElementById(listID);

    if (newbox != null) {
        newbox.style.top = top.toString() + "px";

        newbox.style.left = left.toString() + "px";

        newbox.style.display = "block";
    }




}

function GetSeekerBarListHtml(itemindex) {
    var txt = "";

    switch (itemindex) {
        case 2:
            txt += "<div class=\"sub-nav\"  id=\"seeker_title_list_2\" onmouseover=\"ShowBarList(2);\" onmouseout=\"HiddenBarList(2);\">";
            txt += "<a href=\"/Resumes/ResumeList\"><span class=\"t_m_top_5\">简历管理列表</span></a><a href=\"/Resumes/ResumeList\"><span>谁看了我</span></a><div class=\"nav-bottom-bg\"></div>";
            //txt += "<a href=\"/Resumes/ResumeList\"><span class=\"t_m_top_5\">简历管理列表</span></a><a href=\"/Resumes/ResumeList\"><span>谁看过我的简历</span></a><div class=\"nav-bottom-bg\"></div>";
            txt += "</div>";
            break;
    }


    return txt;
}

/** Seeker首页相关结束 **/


/** 提示框开始 **/

function GetAlertHtml(alertText) {
    var txt = "";

    txt += "<div class=\"alertinner\">";
    txt += "<div class=\"alertcorner\"></div>";
    txt += "<div class=\"alertcontent\">";
    txt += alertText;
    txt += "</div>";
    txt += "</div>";

    return txt;
}


function ShowAlert(containerID, alertText, portName) {
    DiscardAlert(containerID);

    var obj = document.getElementById(containerID);

    var left = 0;

    var top = 0;

    if (obj != null) {
        var location = GetAbsoluteLocation(obj);

        left = location.absoluteLeft + parseInt(location.offsetWidth + 10);

        if ((typeof portName == 'string') && (portName == 'c')) {
            if (obj.parentNode.className == 'highpinlayershowlong') {
                top = GetAbsoluteLocation(obj.parentNode).absoluteTop;
            }
            else {
                top = location.absoluteTop;
            }
        }
        else {
            top = location.absoluteTop - 20;
        }


        //top = location.absoluteTop - location.offsetHeight;
    }

    var newbox = document.createElement("div");

    newbox.id = "alert_" + containerID;

    newbox.className = "alertfull";

    newbox.innerHTML = GetAlertHtml(alertText);

    document.body.appendChild(newbox);

    newbox.style.top = top.toString() + "px";

    newbox.style.left = left.toString() + "px";
    //newbox.style.overflow = "hidden";
}

function ReSetAlertMessageLocation(containerID) {
    var obj = document.getElementById(containerID);

    var newbox = document.getElementById("alert_" + containerID);

    if (newbox == null) {
        return;
    }

    var left = 0;

    var top = 0;

    if (obj != null) {
        var location = GetAbsoluteLocation(obj);

        left = location.absoluteLeft + parseInt(location.offsetWidth + 10);

        top = location.absoluteTop - 20;
    }



    newbox.style.top = top.toString() + "px";

    newbox.style.left = left.toString() + "px";
}



function DiscardAlert(containerID) {
    var newbox = document.getElementById("alert_" + containerID);

    if (newbox != null) {
        newbox.parentNode.removeChild(newbox);
    }
}

/** 提示框结束 **/


/** 验证开始 **/


/** 验证结束 **/



//wangzeyijs

var updateDynamicParam = null;

//添加hidden参数 验证数字 分页 wangzy
(function ($) {
    $.extend({
        dynamicForm: function (action, model) {
            return $('<form name="DynamicForm" />').attr({ action: action, method: (model == undefined ? "post" : model) }).appendTo("body");
        }
    });

    $.fn.extend({
        addHidden: function (name, value) {
            //return $(this).append('<input type="hidden" name="' + name + '" value="' + value + '" />');
            var $hidden=$(this).find('input[name=' + name + ']');
            if ($hidden.length == 0) {
                $(this).append($('<input type="hidden" name="'+name+'" value="'+(value||"")+'"/>'));
            } else {
                $hidden.val(value);
            }
        }
    });

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || "");
            } else {
                o[this.name] = this.value || "";
            }
        });
        return o;
    };

    $.fn.numeral = function () {
        $(this).css("ime-mode", "disabled");
        this.bind("keypress", function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (!$.browser.msie && (e.keyCode == 0x8)) {
                return;
            }
            return code >= 48 && code <= 57;
        });
        this.bind("blur", function () {
            if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
                this.value = this.value.substr(0, this.value.length - 1);
            } else if (isNaN(this.value)) {
                this.value = "";
            }
        });
        this.bind("paste", function () {
            var s = clipboardData.getData('text');
            if (!/\D/.test(s));
            value = s.replace(/^0*/, '');
            return false;
        });
        this.bind("dragenter", function () {
            return false;
        });
        this.bind("keyup", function () {
            if (/(^0+)/.test(this.value)) {
                this.value = this.value.replace(/^0*/, '');
            }
        });
    };

    $.fn.maxlength = function (settings) {
        if (typeof settings == 'string') {
            settings = { feedback: settings };
        }

        settings = $.extend({}, $.fn.maxlength.defaults, settings);

        function length(el) {
            var parts = el.value;
            if (settings.words)
                parts = el.value.length ? parts.split(/\s+/) : { length: 0 };
            return parts.length;
        }

        return this.each(function () {
            var field = this,
	        	$field = $(field),
	        	$form = $(field.form),
	        	limit = settings.useInput ? $form.find('input[name=maxlength]').val() : $field.attr('maxlength'),
	        	$charsLeft = $form.find(settings.feedback);

            function limitCheck(event) {
                var len = length(this),
	        	    exceeded = len >= limit,
	        		code = event.keyCode;

                if (!exceeded)
                    return;

                switch (code) {
                    case 8:  // allow delete
                    case 9:
                    case 17:
                    case 36: // and cursor keys
                    case 35:
                    case 37:
                    case 38:
                    case 39:
                    case 40:
                    case 46:
                    case 65:
                        return;

                    default:
                        return settings.words && code != 32 && code != 13 && len == limit;
                }
            }


            var updateCount = function () {
                var len = length(field),
	            	diff = limit - len;

                $charsLeft.html(diff || "0");

                // truncation code
                if (settings.hardLimit && diff < 0) {
                    field.value = settings.words ?
                    // split by white space, capturing it in the result, then glue them back
	            		field.value.split(/(\s+)/, (limit * 2) - 1).join('') :
	            		field.value.substr(0, limit);

                    updateCount();
                }
            };

            $field.keyup(updateCount).change(updateCount);
            if (settings.hardLimit) {
                $field.keydown(limitCheck);
            }

            updateCount();
        });
    };

    $.fn.maxlength.defaults = {
        useInput: false,
        hardLimit: true,
        feedback: '.charsLeft',
        words: false
    };

    $.fn.disableSelection = function () {
        return this.each(function () {
            $(this).attr('unselectable', 'on')
               .css({
                   '-moz-user-select': 'none',
                   '-webkit-user-select': 'none',
                   'user-select': 'none',
                   '-ms-user-select': 'none'
               })
               .each(function () {
                   this.onselectstart = function () { return false; };
               });
        });
    };

    $.fn.toggleOption = function (show) {
        $(this).toggle(show);
        if (show) {
            if ($(this).parent('span.toggleOption').length)
                $(this).unwrap();
        } else {
            if ($(this).parent('span.toggleOption').length == 0)
                $(this).wrap('<span class="toggleOption" style="display: none;" />');
        }
    };
})(jQuery);

//分割中(英)文字符串  wangzyjs
function formatString(info, len) {
    var result = "";
    var res = "";
    var strTmp;
    var strEnd;
    var strLen;
    info = info.replace('，', ',').replace('。', '.').replace('；', ';').replace('：', ':').replace('“', '"').replace('”', '"').replace('！', '!');
    strLen = info.length;
    if (strLen <= len)
        return info;
    while (info.length > 0) {
        result += info.substring(0, len);
        strTmp = info.substring(len, len + 1);
        strEnd = info.substring(len - 1, len);
        info = info.substring(len, info.length);
        //只有>256是只分割中文,有>256和<256 就是中英文都分割
        if (isFH(strEnd) != "" || strTmp.charCodeAt(0) > 256 || strTmp.charCodeAt(0) < 256)
            result += ",";
        else {
            var i = getNextVlidChar(info);
            result += info.substring(0, i) + ",";
            info = info.substring(i, info.length);
        }
        if (info.length <= len) {
            result += info;
            return result.split(',');;
        }
    }

    return result.split(',');
}

function isFH(info) {
    if (info == ',' || info == '.' || info == ':' || info == ';' || info == '"' || info == '!' || info == ' ')
        return info;
    else
        return "";
}

function getNextVlidChar(info) {
    var i = 0;
    for (i = 0; i < info.length; i++) {
        var strTmp = info.substring(i, i + 1);
        if (isFH(strTmp) || strTmp.charCodeAt(0) > 256 || strTmp.charCodeAt(0) < 256)
            return i + 1;
    }
    return info.length;
}

function getRemovalSpecialSymbols(info) {
    var info = info.replace(/[&\|\\\*\/^%$#@\-]/g, "");
    return info;
}




function StringToArray(str, substr) {
    /* 函数功能：字符串按照指定字符串分割转换为数组 
    参数: 
    str :需转换的字符串 
    substr:分割字符串 
    返回值: 
    转换后的数组 
    */
    var arrTmp = new Array();
    if (substr == "") {
        arrTmp.push(str);
        return arrTmp;
    }
    var i = 0, j = 0, k = str.length;
    while (i < k) {
        j = str.indexOf(substr, i);
        if (j != -1) {
            if (str.substring(i, j) != "") { arrTmp.push(str.substring(i, j)); }
            i = j + 1;
        } else {
            if (str.substring(i, k) != "") { arrTmp.push(str.substring(i, k)); }
            i = k;
        }
    }
    return arrTmp;
}

function ArrayToString(arr, str) {
    /* 函数功能：数组根据分割字符（串）转换为字符串 
    参数: 
    arr:需转换的字符串数组 
    str:分割字符串 
    返回值: 
    转换后的字符串 
    */
    var strTmp = "";
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != "") {
            if (strTmp == "") {
                strTmp = arr[i];
            } else {
                strTmp = strTmp + str + arr[i];
            }
        }
    }
    return strTmp;
}

//判断输入字符数量
var maxstrlen = 1000;
var minstrlen = 10;
function checkWord(c, ctype, maxlen, minlen) {
    if (maxlen == undefined) {
        maxlen = maxstrlen;
    }
    else {
        maxstrlen = maxlen;
    }

    if (minlen == undefined) {
        minlen = minstrlen;
    }
    else {
        minstrlen = minlen;
    }

    var str = $.trim(c.value);
    myLen = str.length;

    if (ctype == 1) {
        var iw = $("#inputword");
    }

    if (myLen > maxlen) {
        if (maxlen == 200) {
            c.value = str.substring(0, maxlen);
        }
        else {
            c.value = str.substring(0, maxlen - 1);
        }
    }

    else {
        iw.html("您已输入<span class=\"word-red\" id=\"wordInput\" >" + Math.floor((myLen)) + "</span>字，还可以输入<span class=\"word-red\" id=\"wordCheck\">" + Math.floor((maxlen - myLen)) + "</span>字");
    }

}

function getStrleng(str) {
    myLen = 0;
    i = 0;
    for (; (i < str.length) && (myLen <= maxstrlen * 2) ; i++) {
        if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128)
            myLen++;
        else
            myLen += 2;
    }
    return myLen;
}

function CheckValue(containerID, alertValue,str) {

    if ($(containerID).val() != "") {
        DiscardAlert(containerID.id);
        CheckValueIsLegal(containerID);
    } else {
        if (typeof str == 'string' && str == 'c') {
            ShowAlert(containerID.id, alertValue, 'c');
        }
        else {
            ShowAlert(containerID.id, alertValue);
        }
    }

}

//结果若为true为合法（即未检测到敏感词）
function CheckValueIsLegal(containerID, ValueType) {
    var isLegal = filter($(containerID).val());

    if (isLegal) {
        ShowAlert(containerID.id, "您输入的内容存在不当信息，请修改后重新提交");
    }

    return !isLegal;
}

function CheckSelectValue(containerID) {
    if (containerID.id == "drop_resumeinfo_mobiletype") {
        if ($(containerID).val() == "1") {
            $("#txt_resumeinfo_mobile").attr("maxlength", "11");
            if ($("#txt_resumeinfo_mobile").val().length > 11) {
                var newValue = $("#txt_resumeinfo_mobile").val().substr(0, 11);
                $("#txt_resumeinfo_mobile").val(newValue);
            }
        }
        else {
            $("#txt_resumeinfo_mobile").attr("maxlength", "20");
            //$("#txt_resumeinfo_mobile").maxlen = 20;
        }
    }

    if ($(containerID).val() != "0") {
        DiscardAlert(containerID.id);
    }
}

/** 
功能大体同上("move"). 
不同之处在于当源list中的选中option在目标list中存在时,源list中的option不会删除. 

isAll参数(true或者false):是否全部移动或添加 
*/
jQuery.list2list = function (fromid, toid, isAll) {
    if (isAll == true) {
        $("#" + fromid + " option").each(function () {
            $(this).appendTo($("#" + toid + ":not(:has(option[value=" + $(this).val() + "]))"));
        });
    }
    else if (isAll == false) {
        $("#" + fromid + " option:selected").each(function () {
            $(this).appendTo($("#" + toid + ":not(:has(option[value=" + $(this).val() + "]))"));
        });
    }
};

jQuery.listTolist = function (objfrom, objbto, isAll) {
    if (isAll == true) {
        objfrom.each(function () {
            $(this).appendTo($("objbto:has(option[value=" + $(this).val() + "]))"));
        });
    }
    else if (isAll == false) {
        objfrom.each(function () {
            $(this).appendTo($("objbto:has(option[value=" + $(this).val() + "]))"));
        });
    }
};


//去掉特殊符号的方法（调用在下面）
String.prototype.TextFilter = function () {
    var pattern = new RegExp("[`~%!@#^=''?~！@#￥……&——+‘”“'？*()（），,。.、]"); //[]内输入你要过滤的字符，这里是我的
    var rs = "";
    for (var i = 0; i < this.length; i++) {
        rs += this.substr(i, 1).replace(pattern, '');
    }
    return rs;
}


//wangzy结束

function filter(input) {
    var rtn = false;
    $.ajax({
        url: "/home/filter",
        type: "POST",
        data: { input: input },
        async: false,
        success: function (data) {
            rtn = data;
        }
    });
    return rtn;
}

function cut_str(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4  
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；  
    if (str_length < len) {
        return str;
    }
}

function jquery_cut_str($sourcestr, $cutlength) {

    $returnstr = '';
    $i = 0;
    $n = 0;
    $str_length = $sourcestr.length;//字符串的字节数 
    while (($n < $cutlength) && ($i <= $str_length)) {
        $temp_str = $sourcestr.substr($i, 1);
        $ascnum = $temp_str.charCodeAt(0);;//得到字符串中第$i位字符的ascii码 
        if ($ascnum >= 224)    //如果ASCII位高与224，
        {
            //根据UTF-8编码规范，将3个连续的字符计为单个字符
            $returnstr += $sourcestr.substr($i, 3);
            $i = $i + 3;            //实际Byte计为3
            $n++;            //字串长度计1
        }
        else if ($ascnum >= 192) //如果ASCII位高与192，
        {
            //根据UTF-8编码规范，将2个连续的字符计为单个字符
            $returnstr += $sourcestr.substr($i, 2);
            $i = $i + 2;            //实际Byte计为2
            $n++;            //字串长度计1
        }
        else if ($ascnum >= 65 && $ascnum <= 90) //如果是大写字母，
        {
            $returnstr += $sourcestr.substr($i, 1);
            $i = $i + 1;            //实际的Byte数仍计1个
            $n++;            //但考虑整体美观，大写字母计成一个高位字符
        }
        else                //其他情况下，包括小写字母和半角标点符号，
        {
            $returnstr += $sourcestr.substr($i, 1);
            $i = $i + 1;            //实际的Byte数计1个
            $n = $n + 0.5;        //小写字母和半角标点等与半个高位字符宽...
        }
    }
    if ($str_length > $cutlength) {
        $returnstr = $returnstr + "...";//超过长度时在尾处加上省略号
    }
    return $returnstr;
}



//一个汉字相当于2个字符
function get_length(s) {
    var char_length = 0;
    for (var i = 0; i < s.length; i++) {
        var son_char = s.charAt(i);
        encodeURI(son_char).length > 2 ? char_length += 1 : char_length += 0.5;
    }
    return char_length;
}
function cut_str_js(str, len, ishow) {
    var char_length = 0;
    var s = "...";
    var strResult = "";
    if (ishow == false) {
        s = "";
    }
    for (var i = 0; i < str.length; i++) {
        var son_str = str.charAt(i);
        encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
        if (char_length >= len) {
            var sub_len = char_length == len ? i + 1 : i;

            strResult = str.substr(0, sub_len) + s;
            break;
        }
    }
    return strResult == "" ? str : strResult;
}

//判断特殊字符
function CheckValueIsSpecial(containerID) {

    if (containSpecial($(containerID).val())) {
        ShowAlert(containerID.id, "您输入的内容存在不当信息，请修改后重新提交");
    }
}


//判断特殊字符
function containSpecial(s) {
    var pattern = new RegExp("[`~#^=~￥&——+*()<>/]");
    return (pattern.test(s));
}
//获得当前日期
function GetCurrentDate() {
    var d = new Date();
    var vYear = d.getFullYear();
    var vMon = d.getMonth() + 1;
    var vDay = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var se = d.getSeconds();
    s = vYear.toString() + "-" + (vMon < 10 ? "0" + vMon : vMon).toString() + "-" + (vDay < 10 ? "0" + vDay : vDay).toString() + " " + (h < 10 ? "0" + h : h).toString() + ":" + (m < 10 ? "0" + m : m).toString();
    return s;
}

//替换<>为文本
function textencode(str) {
    if (!str) return "";
    str = str.toString().replace(/</gi, '&lt;');
    str = str.toString().replace(/>/gi, '&gt;');
    return str.toString();
}
//反向替换<>
function textdecode(str) {

    str = str.toString().replace(/&lt;/gi, '<');
    str = str.toString().replace(/&gt;/gi, '>');
    return str.toString();
}
//替换特殊字符，如&、#等等
function textSpecCode(str) {
    str = str.toString().replace(/&/gi, '&amp;');
    return str.toString();
}

//反向替换特殊字符，如&、#等等
function textUnSpecCode(str) {
    str = str.toString().replace(/&amp;/gi, '&');
    return str.toString();
}

//社交化分享
function ShareData(obj, shareType) {
    var arrData = $(obj).attr("sharedata").split("|");
    var p_url = encodeURIComponent ? encodeURIComponent(arrData[0]) : escape(arrData[0]);
    var p_title = encodeURIComponent ? encodeURIComponent(arrData[1]) : escape(arrData[1]);
    var p_pic = encodeURIComponent ? encodeURIComponent(arrData[2]) : escape(arrData[2]);

    var reslut = SaveShareDataLog(shareType);

    CloseSubLayer();
    //新浪微博
    if (shareType == 0) {
        var shareUrl = "http://v.t.sina.com.cn/share/share.php?url=" + p_url + "&title=" + p_title + "&pic=" + p_pic;
        window.open(shareUrl, 'sinaShareWindow', 'height=460,width=660,top=' + (screen.height - 460) / 2 + ',left=' + (screen.width - 660) / 2 + ', toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no');
    }
    //(new Image).src = p_id;
    return false;

}

//是否包含中文
function isChina(s) {
    var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(s)) {
        return false;
    }
    else {
        return true;
    }
}

// 输入框特殊字符处理
function createSpecialChars() {

    var inputChars = /[<>]/g;
    var numChars = /[0-9]/g;
    var inputType = 1;
    var numType = 2;

    // 通用验证判断
    function checkExists(txt, type) {
        var flag = false;
        if (txt.length > 0) {
            switch (type) {
                case inputType:
                    flag = inputChars.test(txt);
                    break;
                case numType:
                    flag = numChars.test(txt);
                    break;
            }
        }
        return flag;
    };

    var Construct = function () {
    };
    // 判断输入框特殊字符
    Construct.prototype.isExistsSpecialChars = function (txt) {
        return checkExists(txt, inputType);
    };
    // 判断字符串是否含有数字
    Construct.prototype.isExistsNum = function (txt) {
        return checkExists(txt, numType);
    };
    // 获取正则
    Construct.prototype.getInputChars = function () {
        return inputChars;
    };
    Construct.prototype.getNumChars = function () {
        return numChars;
    };

    return new Construct();
};




// 输入框特殊字符处理
var specialChars = createSpecialChars();



//获取简历列表（C端简历列表页）
function GetResumeViewInfoList(viewType, pageIndex) {
    var resumeViewInfoList;

    $.ajax(
      {
          url: "/Home/GetResumeViewInfoList/",
          type: "POST",
          data: { "viewType": viewType, "pageIndex": pageIndex, "itemCount": resumeViewInfoItemCount },
          async: false,
          dataType: "json",
          success: function (data) {
              resumeViewInfoList = data.ListInfoSearchResult;
              resumeViewInfoItemCount = data.ItemCount;

          }
      });

    return resumeViewInfoList;
}

//获取当前Seeker
function GetCurrentSeeker() {
    var seeker = null;

    $.ajax(
    {
        url: "/Home/GetCurrentSeeker/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (data) {
            seeker = data;

        }
    });

    return seeker;
}

//设置职位机会隐藏显示状态（C端）
function SumbitJobChanceOpenStatus(id, openstatus) {
    var result = false;

    $.ajax(
      {
          url: "/Home/SetJobChanceOpenStatus/",
          type: "POST",
          data: { "id": id, "openstatus": openstatus },
          async: false,
          dataType: "json",
          success: function (data) {
              result = true;
          }
      });

    return result;
}

//设置职位机会隐藏显示状态（C端）
function SumbitJobChanceOpenStatusNoCheck(id, openstatus) {
    var result = false;

    $.ajax(
      {
          url: "/Home/SetJobChanceOpenStatusNoSign/",
          type: "POST",
          data: { "id": id, "openstatus": openstatus },
          async: false,
          dataType: "json",
          success: function (data) {
              result = true;
          }
      });

    return result;
}

//获取应聘列表（C端）
function GetApplicationList(pageIndex, referrerType) {
    var jobList;

    $.ajax(
      {
          url: "/Home/GetJobApplicationList/",
          type: "POST",
          data: { "pageIndex": pageIndex, "itemCount": applyItemCount, "referrerType": referrerType },
          async: false,
          dataType: "json",
          success: function (data) {
              jobList = data.ListInfoSearchResult;
              applyItemCount = data.ItemCount;
          }
      });

    return jobList;
}

// 将应聘记录标记为删除
function UpdateApplicationIsDelete(applyId, callback) {
    $.ajax(
       {
           url: "/Home/UpdateJobApplicationIsDelete/",
           type: "POST",
           data: { "applyId": applyId },
           async: true,
           dataType: "json",
           success: function (data) {
               if (data.IsSuccess == true) {
                   window.location.href = window.location.href;
               } else {
                   if (typeof (callback) == "function") {
                       callback();
                   }
               }
           },
           error: function (data) {
               if (typeof (callback) == "function") {
                   callback();
               }
           }
       });
}

//获取消息列表（C端）
function GetMessageList(pageIndex) {
    var messageList;

    $.ajax(
      {
          url: "/Home/GetMessageList/",
          type: "POST",
          data: { "pageIndex": pageIndex, "itemCount": messageItemCount },
          async: false,
          dataType: "json",
          success: function (data) {
              messageList = data.ListInfoSearchResult;
              messageItemCount = data.ItemCount;

          }
      });

    return messageList;
}

//获取用户积分明细列表（C端）
function GetUserScoreList(pageIndex) {
    var userScoreList;

    $.ajax(
      {
          url: "/Home/GetUserScoreList/",
          type: "POST",
          data: { "pageIndex": pageIndex, "itemCount": creditItemCount },
          async: false,
          dataType: "json",
          success: function (data) {
              userScoreList = data.ListInfoSearchResult;
              creditItemCount = data.ItemCount;

          }
      });

    return userScoreList;
}


//获取职位机会列表（C端）
function GetJobChanceList(pageIndex, recommendStatus, openStatus, referrerType, pageValue, callback, recommendType) {
    if (recommendStatus == undefined) {
        recommendStatus = null;
    }

    var jobList;
    var isAsync = false;
    if (typeof callback === "function") {
        isAsync = true;
    }

    $.ajax(
      {
          url: "/Home/GetJobChanceList/",
          type: "POST",
          data: { "pageIndex": pageIndex, "itemCount": chanceItemCount, "recommendStatus": recommendStatus, "openStatus": openStatus, "ReferrerType": referrerType, "pageValue": pageValue, "recommendType": recommendType },
          async: isAsync,
          dataType: "json",
          success: function (data) {
              jobList = data.ListInfoSearchResult;
              chanceItemCount = data.ItemCount;

              if (recommendStatus != undefined &&
                  recommendStatus != null &&
                  recommendStatus == 4) {
                  jobChanceCountItems.setEmergencyAllCount(data.EmergencyAllCount);
                  jobChanceCountItems.setEmergencyHRCount(data.EmergencyHRCount);
                  jobChanceCountItems.setEmergencyHunterCount(data.EmergencyHunterCount);
              }

              if (isAsync) {
                  callback(jobList);
              }
          }
      });

    return jobList;
}

//获取评价列表（C端）
function GetReceivedAppraisementList(pageIndex, replyStatus, openStatus, itemStatus, isCHEvaluation, isHCEvaluation, isIgnore, callback) {
    if (replyStatus == undefined || replyStatus == null) {
        replyStatus = 0;
    }

    if (openStatus == undefined || openStatus == null) {
        openStatus = 3;
    }

    if (itemStatus == undefined || itemStatus == null) {
        itemStatus = false;
    }

    //已完成的评价 是否按追评显示列表
    if (isCHEvaluation == undefined || isCHEvaluation == null) {
        isCHEvaluation = false;
    }

    //来自猎头的评价 是否按追评显示列表
    if (isHCEvaluation == undefined || isHCEvaluation == null) {
        isHCEvaluation = false;
    }
    if (isIgnore == undefined || isIgnore == null) {
        isIgnore = false;
    }

    var appraisementList;
    // 增加兼容同步判断
    var isAsync = false;
    if (typeof callback === "function") {
        isAsync = true;
    }

    $.ajax(
      {
          url: "/Home/GetReceivedAppraisementList/",
          type: "POST",
          data: { "pageIndex": pageIndex, "itemCount": appraisementItemCount, "replyStatus": replyStatus, "openStatus": openStatus, "itemStatus": itemStatus, "isCHEvaluation": isCHEvaluation, "isHCEvaluation": isHCEvaluation, isIgnore: isIgnore },
          async: isAsync,
          dataType: "json",
          success: function (data) {
              appraisementList = data.ListInfoSearchResult;
              appraisementItemCount = data.ItemCount;
              appraisementItemAllCount = data.ItemAllCount;
              //C端来自猎头评价 全部C对H未回评数
              chAllNonCount = data.chAllNonCount;
              //C端来自猎头评价 H对C最新追评数（未查看的追平数）
              hcAfterCount = data.hcAfterCount;
              //C端来自猎头评价 H对C追评数（全部的追平数）
              if ("undefined" != typeof itemCountHC) {
                  itemCountHC = data.itemCountHC;
              }
              //C端已完成的评价 C对H追评数（全部的追平数）
              if ("undefined" != typeof itemCountCH) {
                  itemCountCH = data.itemCountCH;
              }

              if (isAsync) {
                  callback(appraisementList);
              }
          }
      });

    return appraisementList;
}

//获取获取C端来自猎头评价 H对C最新追评数（未查看的追平数）
function GetHCAfterCount() {
    var defer = Q.defer();
    $.ajax({
        url: "/Home/GetHCAfterCount/",
        type: "POST",
        data: {},
        async: true,
        dataType: "text",
        success: function (data) {
            defer.resolve(data);
        }
    });
    return defer.promise;
}

//C端回复评论（C端）
function ReplyAppraisement(id, professionaldegree, manner, replycontent, replyType, othercontent) {
    var result = false;

    $.ajax(
      {
          url: "/Home/ReplyAppraisement/",
          type: "POST",
          data: { "id": id, "replyContent": replycontent, "professionalDegree": professionaldegree, "manner": manner, "replyType": replyType, "otherContent": othercontent },
          async: false,
          dataType: "json",
          success: function (data) {
              result = data.IsSuccess;
          }
      });

    return result;
}

//C端回复评论（C端）
function EDMReplyAppraisement(id, professionaldegree, manner, replycontent, replyType, othercontent) {
    var result = false;

    $.ajax(
      {
          url: "/Home/EDMReplyAppraisement/",
          type: "POST",
          data: { "id": id, "replyContent": replycontent, "professionalDegree": professionaldegree, "manner": manner, "replyType": replyType, "otherContent": othercontent },
          async: false,
          dataType: "json",
          success: function (data) {
              result = data.IsSuccess;
          }
      });

    return result;
}


//设置评论公开隐藏状态（C端）
function SetAppraisementShowStatus(id, openstatus) {

    var result = false;

    $.ajax(
      {
          url: "/Home/SetAppraisementShowStatus/",
          type: "POST",
          data: { "id": id, "showStatusEnum": openstatus },
          async: false,
          dataType: "json",
          success: function (data) {
              result = data;
          }
      });

    return result;
}

//重置密码（C端）
function SendModifyPassword(oldPassword, newPassword) {
    var result = 1;

    $.ajax(
    {
        url: "/Home/ModifyPass/",
        type: "POST",
        data: { "oldPassword": oldPassword, "newPassword": newPassword, source: 2 },
        async: false,
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}

//检查密码是否正确（C端）
function CheckPassword(password) {
    var result = false;

    $.ajax(
    {
        url: "/Home/CheckPassword/",
        type: "POST",
        data: { "oldPassword": password },
        async: false,
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}


//移除简历子项（C端）
function RemoveResumeSubItem(path, resumeID, id) {
    var removeSucess = false;

    $.ajax(
      {
          url: path,
          type: "POST",
          async: false,
          data: { "resumeID": resumeID, "itemID": id },
          dataType: "json",
          success: function (data) {
              removeSucess = true;
          }
      });

    return removeSucess;
}

//提交保存简历项（C端）
function SubmitResumeItem(path, asyn, subData, returnContainerID, callbackString) {
    var suc = false;


    $.ajax(
    {
        url: path,
        type: "POST",
        async: asyn,
        data: subData,
        dataType: "json",
        success: function (data) {
            if (returnContainerID != undefined && returnContainerID != null && returnContainerID != "") {
                var returnString = data.OtherMessage;

                $("#" + returnContainerID).val(returnString);

            }

            suc = true;
        }
    });

    if (!asyn && suc && callbackString != undefined && callbackString != null && callbackString != "") {
        eval(callbackString);
    }

    return suc;
}


//获取邮件验证状态（C端）
function GetEmailStatus(email, validControllerID) {
    var repeat = true;

    $.ajax({
        url: "/Home/CheckEmail/",
        type: "POST",
        async: false,
        data: { "email": email },
        dataType: "json",
        success: function (data) {
            var returnString = data.OtherMessage;

            if (returnString == "true") {
                repeat = true;
            }
            else {
                repeat = false;
            }
        },
        error: function (
            XMLHttpRequest, textStatus, errorThrown) {
            $("#" + validControllerID).val("false");
        }
    });

    return repeat;
}

//获取完整简历（C端）
function GetFullResume(resumeID) {
    var defer = Q.defer();
    $.ajax({
        url: "/Home/GetFullResume/",
        type: "POST",
        async: true,
        data: { "resumeID": resumeID },
        dataType: "json",
        success: function (data) {
            defer.resolve(data || {});
        }
    });
    return defer.promise;
}

//获取简历总结数据（C端）
function GetResumeSumInfo(resumeID) {
    var defer = Q.defer();
    $.ajax({
        url: "/Home/GetSummarize/",
        type: "POST",
        async: true,
        data: { "resumeID": resumeID },
        dataType: "json",
        success: function (returnData) {
            window.$SumInfo = returnData;
            defer.resolve(returnData);
        }
    });
    return defer.promise;
}

//获取上传文件实体
function GetUploadFile(fileID) {
    var file = null;

    $.ajax(
    {
        url: "/Home/GetUploadFile/",
        type: "POST",
        async: false,
        data: { "fileID": fileID },
        dataType: "json",
        success: function (data) {
            file = data;
        }
    });

    return file;
    // 
}
//获取上传文件实体（加密方法）
function GetUploadFileBYEncryptID(fileID, uploadFileType) {
    var file = null;

    $.ajax(
    {
        url: "/Home/GetUploadFileBYEncryptID/",
        type: "POST",
        async: false,
        data: { "strfileID": fileID, "uploadFileType": uploadFileType },
        dataType: "json",
        success: function (data) {
            file = data;
        }
    });

    return file;
    // 
}

//删除临时上传文件
function DeleteFile(fileID) {
    var result = null;

    $.ajax(
    {
        url: "/Home/DeleteFile/",
        type: "POST",
        async: true,
        data: { "fileID": fileID },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
    // 
}
//删除临时上传文件
function DeleteFileBYEncryptID(fileID, uploadFileType) {
    var result = null;

    $.ajax(
    {
        url: "/Home/DeleteFileBYEncryptID/",
        type: "POST",
        async: true,
        data: { "strFileID": fileID, "uploadFileType": uploadFileType },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
    // 
}
//获取当前Seeker基本信息
function GetCurrentSeekerBasicInfo() {
    var user = null;

    $.ajax(
    {
        url: "/Home/GetCurrentSeekerBasicInfo/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (data) {
            user = data;
        }
    });

    return user;
}

//上传意见反馈附件
function SubmitSuggestion(formID) {

    $("#" + formID).ajaxSubmit(
        {
            url: '/Handler/SuggestionFileReceiver.ashx',
            success: function (data) {
                ShowUploadResult(data);
            },
            error: function (data, status, e) {
                ShowUploadResult("-9");
            }
        });
}

//上传企业端直属领导照片
function SubmitCompaniesPhoto(formID) {
    $("#" + formID).ajaxSubmit({
        url: '/Handler/CompaniesPhotoReceiver.ashx',
        success: function (data) {
            ShowPhotoResult(data);
        },
        error: function (data, status, e) {
            ShowPhotoResult("-9");
        }
    });
}

//上传猎头照片
function SubmitHunterPhoto(formID) {
    $("#" + formID).ajaxSubmit({
        url: '/Handler/HunterPhotoReceiver.ashx',
        success: function (data) {
            ShowPhotoResult(data);
        },
        error: function (data, status, e) {
            ShowPhotoResult("-9");
        }
    });
}

//上传个人照片
function SubmitSeekerPhoto(formID) {
    $("#" + formID).ajaxSubmit(
    {
        url: '/Handler/SeekerPhotoReceiver.ashx',
        success: function (data) {
            ShowPhotoResult(data);
        },
        error: function (data, status, e) {
            ShowPhotoResult("-9");
        }
    });
}

function RotatingPicture(fileID, angle) {
    var result = null;

    $.ajax(
    {
        url: "/Home/RotatingPicture/",
        type: "POST",
        async: false,
        data: { "strFileID": fileID, "angle": angle },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}

//提交B端直属领导头像
function SaveCompaniesPhoto(fileID, photo_startx1, photo_starty1, photo_startx2, photo_starty2) {
    var result = null;

    $.ajax({
        url: "/Home/SaveCompaniesPhoto",
        type: "POST",
        async: false,
        data: { strFileID: fileID, photo_startx1: photo_startx1, photo_starty1: photo_starty1, photo_startx2: photo_startx2, photo_starty2: photo_starty2 },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}


//提交H端头像
function SaveHunterPhoto(fileID, photo_startx1, photo_starty1, photo_startx2, photo_starty2) {
    var result = null;

    $.ajax({
        url: "/Home/SaveHunterPhoto",
        type: "POST",
        async: false,
        data: { strFileID: fileID, photo_startx1: photo_startx1, photo_starty1: photo_starty1, photo_startx2: photo_startx2, photo_starty2: photo_starty2 },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}

//提交C端头像
function SaveSeekerPhoto(fileID, photo_startx, photo_starty) {
    var result = null;

    $.ajax(
    {
        url: "/Home/SaveSeekerPhoto/",
        type: "POST",
        async: false,
        data: { "strFileID": fileID, "photo_startx": photo_startx, "photo_starty": photo_starty },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}

//提交C端头像
function SaveSeekerPhoto(fileID, photo_startx1, photo_starty1, photo_startx2, photo_starty2) {
    var result = null;

    $.ajax(
    {
        url: "/Home/SaveSeekerPhoto/",
        type: "POST",
        async: false,
        data: { "strFileID": fileID, "photo_startx1": photo_startx1, "photo_starty1": photo_starty1, "photo_startx2": photo_startx2, "photo_starty2": photo_starty2 },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}

//提交意见反馈
function AddSuugestion(realname, email, mobile, suggestionContent, tempFileID, userType, postCode) {
    var result = null;

    $.ajax(
    {
        url: "/Home/AddSuugestion/",
        type: "POST",
        async: false,
        data: { "realname": realname, "email": email, "mobile": mobile, "suggestionContent": suggestionContent, "strTempFileID": tempFileID, "userType": userType, 'postCode': postCode },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}


//注销Seeker登陆
function LogOffSeeker() {
    var logoffsuc = false;

    $.ajax(
    {
        url: "/Home/LogOffSeeker/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (data) {
            logoffsuc = data;

        }
    });

    return logoffsuc;
}


//登陆
function Logon(username, password, postcode, rememberme, userType) {
    var logonsuc = 2;

    $.ajax(
    {
        url: "/Home/JsonLogon/",
        type: "POST",
        async: false,
        data: { "username": username, "password": password, "postcode": postcode, "rememberme": rememberme, "userType": userType },
        dataType: "json",
        success: function (data) {
            logonsuc = data;

        }
    });

    return logonsuc;
}


//注销Hunter登陆
function LogOffHunter() {
    var logoffsuc = false;

    $.ajax(
    {
        url: "/Home/LogOffHunter/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (data) {
            logoffsuc = data;

        }
    });

    return logoffsuc;
}

//获取当前Hunter
function GetCurrentHunter() {
    var hunter = null;

    $.ajax(
    {
        url: "/Home/GetCurrentHunter/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (data) {
            hunter = data;
        }
    });

    return hunter;
}


//获取当前Hunter
function GetCurrentHunterBasicInfo() {
    var hunter = null;

    $.ajax(
    {
        url: "/Home/GetCurrentHunterBasicInfo/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (data) {
            hunter = data;
        }
    });

    return hunter;
}

//获取当前Recruiter信息
function GetCurrentRecruiter() {
    var recruiter = null;

    $.ajax(
    {
        url: "/Home/GetRecruiter/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (data) {
            recruiter = data;
        }
    });

    return recruiter;
}

function RefreshSeekerUpdateTime(resumeID) {

    var result = null;

    $.ajax(
    {
        url: "/Home/JsonRefreshSeekerUpdateTime/",
        type: "POST",
        async: false,
        data: { "resumeID": resumeID },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}

function SaveShareDataLog(shareTypeID) {


    var result = null;

    $.ajax(
    {
        url: "/Home/JsonSaveShareDataLog/",
        type: "POST",
        async: false,
        data: { "shareTypeID": shareTypeID },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}

function SaveHunterShareDataLog(shareTypeID) {


    var result = null;

    $.ajax(
    {
        url: "/Home/JsonSaveHunterShareDataLog/",
        type: "POST",
        async: false,
        data: { "shareTypeID": shareTypeID },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result;
}

function GetCurrentUserEducationStatus() {
    var Education = null;

    $.ajax(
    {
        url: "/Home/GetEducationStatus/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (data) {
            Education = data;
        }
    });

    return Education;
}

function GetWeiboWinnerList(published) {
    var weibolottery = null;

    $.ajax(
    {
        url: "/Home/JsonGetWeiboWinnerList/",
        type: "POST",
        async: false,
        data: { "published": published },
        dataType: "json",
        success: function (data) {
            weibolottery = data;
        }
    });

    return weibolottery;
}


function RemoveWeiboBinding() {

    var bResult = false;
    $.ajax(
   {
       url: "/Home/JsonRemoveSNSBinding/",
       type: "POST",
       async: false,
       dataType: "json",
       success: function (data) {
           bResult = data.IsSuccess;
       }
   });

    return bResult;
}

//获取用户标签
function GetSeekerKeywordList() {

    var KeywordList;

    $.ajax(
      {
          url: "/Home/JsonGetSeekerResumeKeywordList/",
          type: "POST",
          async: false,
          dataType: "json",
          success: function (data) {
              KeywordList = data;

          }
      });

    return KeywordList;
}

//
function GetInputKeywordList(strValue) {

    var KeywordList;

    $.ajax(
      {
          url: "/Home/JsonGetInputKeywordList/",
          type: "POST",
          async: false,
          data: { "strValue": strValue },
          dataType: "json",
          success: function (data) {
              KeywordList = data;

          }
      });

    return KeywordList;
}

function SaveSeekerKeyword(strKeyword) {
    var bResult = false;
    $.ajax(
      {
          url: "/Home/SaveSeekerKeyword/",
          type: "POST",
          async: false,
          data: { "keywordList": strKeyword },
          dataType: "json",
          success: function (data) {
              bResult = data.IsSuccess;

          }
      });

    return bResult;
}

function GeAllKeywordList() {

    var KeywordList;

    $.ajax(
      {
          url: "/Home/JsonGetAllKeywordConfigList/",
          type: "POST",
          async: false,
          dataType: "json",
          success: function (data) {
              KeywordList = data;

          }
      });

    return KeywordList;
}

function RefreshSeekerResumeKeyword() {

    var KeywordList;

    $.ajax(
      {
          url: "/Home/JsonRefreshSeekerResumeKeyword/",
          type: "POST",
          async: true,
          dataType: "json",
          success: function (data) {
              KeywordList = data;

          }
      });

    return KeywordList;
}

//获取应聘列表（C端）
function GetCollectionList(pageIndex, referrerType) {
    var jobList;

    $.ajax(
      {
          url: "/Home/GetJobCollectionList/",
          type: "POST",
          data: { "pageIndex": pageIndex, "itemCount": collectItemCount, "referrerType": referrerType },
          async: false,
          dataType: "json",
          success: function (data) {
              jobList = data.ListInfoSearchResult;
              collectItemCount = data.ItemCount;

          }
      });

    return jobList;
}

//删除收藏职位
function DeleteJobCollection(ID) {

    var result;

    $.ajax(
    {
        url: "/Home/DeleteJobCollection/",
        type: "POST",
        async: false,
        data: { "ID": ID },
        dataType: "json",
        success: function (data) {
            result = data;
        }
    });

    return result.IsSuccess;
    // 
}

//根据标签名称获取猎头认可的标签列表
function GetHunterInfoKeyWorkList(keyWord) {
    var HunterInfo;

    $.ajax(
      {
          url: "/Home/GetHunterInfoKeyWorkList/",
          type: "POST",
          async: false,
          data: { "keyWord": keyWord },
          dataType: "json",
          success: function (data) {
              HunterInfo = data;

          }
      });
    return HunterInfo;
}

//根据标签名称获取猎头认可的标签列表(H端)
function GetHunterInfoKeyWorkListHunter(keyWord, seekerUserID) {
    var HunterInfo;

    $.ajax(
      {
          url: "/ResumeManage/GetHunterInfoKeyWorkListHunter/",
          type: "POST",
          async: false,
          data: { "keyWord": keyWord, "seekerUserID": seekerUserID },
          dataType: "json",
          success: function (data) {
              HunterInfo = data;
          }
      });

    return HunterInfo;
}

//根据标签名称获取猎头认可的标签列表(HR企业端)
function GetHunterInfoKeyWorkListCompanies(keyWord, seekerUserID) {
    var HunterInfo;

    $.ajax(
      {
          url: "/Resume/GetHunterInfoKeyWorkListHunter/",
          type: "POST",
          async: false,
          data: { "keyWord": keyWord, "seekerUserID": seekerUserID },
          dataType: "json",
          success: function (data) {
              HunterInfo = data;
          }
      });

    return HunterInfo;
}
//根据标签名称获取猎头认可的标签列表(后台)
function GetHunterInfoKeyWorkListAdmin(keyWord, seekerUserID) {
    var HunterInfo;

    $.ajax(
      {
          url: "/Seeker/GetHunterInfoKeyWorkListHunter/",
          type: "POST",
          async: false,
          data: { "keyWord": keyWord, "seekerUserID": seekerUserID },
          dataType: "json",
          success: function (data) {
              HunterInfo = data;
          }
      });

    return HunterInfo;
}
//当删除评论标签时判断标签是否有关联的认可信息
function ExistsSeekerResumeKeyWordRecognition(keyWord) {

    var kw = 0;

    $.ajax(
      {
          url: "/Home/ExistsSeekerResumeKeyWordRecognition/",
          type: "POST",
          async: false,
          data: { "keyWord": keyWord },
          dataType: "text",
          success: function (data) {
              kw = data;
          }
      });
    return kw;
}

//C端用户对H端用户追评回复（C端）
function ReplyAfterAppraisement(id, replycontent) {

    var result = false;

    $.ajax(
      {
          url: "/Home/ReplyAfterAppraisement/",
          type: "POST",
          data: { "id": id, "replyContent": replycontent },
          async: false,
          dataType: "json",
          success: function (data) {
              result = data.IsSuccess;
          }
      });

    return result;
}

//C端来自猎头的评价,设置C对H端追评状态为已查看 
function SetCH_IsToViewTrue() {

    var isToViewTrue = false;
    $.ajax(
      {
          url: "/Home/SetCH_IsToViewTrue/",
          type: "POST",
          data: {},
          async: false,
          dataType: "json",
          success: function (data) {
              if (data == "true") {
                  isToViewTrue = true;
              }
          }
      });

    return isToViewTrue;
}

//H端来自候选人的评价,设置H对C端追评状态为已查看 
function SetHC_IsToViewTrue() {
    var isToViewTrue = false;
    $.ajax(
      {
          url: "/Home/SetHC_IsToViewTrue/",
          type: "POST",
          data: {},
          async: false,
          dataType: "json",
          success: function (data) {
              //alert(data);
              if (data == "true") {
                  isToViewTrue = true;
              }
          }
      });

    return isToViewTrue;
}

function ChangeDefaultResume(resumeType, callback) {
    var isToViewTrue = false;
    $.ajax(
      {
          url: "/Home/SetDefaultResume/",
          type: "POST",
          data: { resumeType: resumeType },
          async: false,
          dataType: "json",
          success: function (data) {
              isToViewTrue = true;
              if (callback != null) callback();
          }
      });
    if (isToViewTrue) {
        eval(RefreshResumeDynData());
    }
}

function SetIndexGuide() {
    var isToViewTrue = false;
    $.ajax(
      {
          url: "/Home/SetSeekerIndexGuideHide/",
          type: "POST",
          data: {},
          async: false,
          dataType: "json",
          success: function (data) {
              isToViewTrue = data;
          }
      });
}

function SetIsResumeTop() {
    var isToViewTrue = false;
    $.ajax(
      {
          url: "/Home/SetSeekerIsResumeTop/",
          type: "POST",
          data: {},
          async: false,
          dataType: "json",
          success: function (data) {
              isToViewTrue = data;
          }
      });
}

function SetChatGuide() {
    var isToViewTrue = false;
    $.ajax(
      {
          url: "/Home/SetSeekerChatGuideHide/",
          type: "POST",
          data: {},
          async: false,
          dataType: "json",
          success: function (data) {
              isToViewTrue = data;
          }
      });

}

//获取首页职位邀请信息
function GetInvitePositionList() {
    var invitePositionList = null;

    $.ajax(
      {
          url: "/Home/GetInvitePositionList/",
          type: "POST",
          data: {},
          async: false,
          dataType: "json",
          success: function (data) {
              invitePositionList = data.ListInfoSearchResult;
          }
      });

    return invitePositionList;
}

//C端回复评论（C端）
function KingSoftCallBack(id, IsCallBack, BackString) {
    var result = false;

    $.ajax(
      {
          url: "/Home/JsonKingSoftCallBack/",
          type: "POST",
          data: { "ID": id, "IsCallBack": IsCallBack, "BackString": BackString },
          async: false,
          dataType: "json",
          success: function (data) {
              result = data.IsSuccess;
          }
      });

    return result;
}

//H端—待评价,设置H对C端 忽略评价
function SetIgnoreHComments(id) {
    var bl = false;
    $.ajax(
      {
          url: "/Home/SetIgnoreHComments/",
          type: "POST",
          data: { id: id },
          async: false,
          dataType: "json",
          success: function (data) {
              bl = data;
          }
      });

    return bl;
}

//检查是否已首评（C端）
function CheckCHIsReply(appraisementID, isClosePage) {

    return CheckCHIsIgnore(appraisementID, isClosePage);
    //var result = false;

    //$.ajax(
    //{
    //    url: "/Home/CheckCHIsIgnore/",
    //    type: "POST",
    //    data: { "appraisementID": appraisementID },
    //    async: false,
    //    dataType: "json",
    //    success: function (data) {
    //        if (!data) {
    //            if (isClosePage == 1) {
    //                CustomConfirm("您已完成本次评价", 1);
    //            } else {
    //                CustomConfirm("您已完成本次评价", 2);
    //            }

    //        }
    //        result = data;
    //    }
    //});

    //return result;
}

//检查是否已忽略（C端）
function CheckCHIsIgnore(appraisementID, isClosePage) {
    var result = false;
    $.ajax(
    {
        url: "/Home/CheckCHIsIgnore/",
        type: "POST",
        data: { "appraisementID": appraisementID },
        async: false,
        dataType: "json",
        success: function (data) {
            if (!data.Value) {
                if (isClosePage == 1) {
                    CustomConfirm(data.Memo, 1);
                } else {
                    CustomConfirm(data.Memo, 2);
                }
            }
            result = data.Value;
        }
    });
    return result;
}

//检查C对H是否可以追评（C端）
function CheckIsCHAfterComment(appraisementID, isClosePage) {
    var result = false;

    $.ajax(
    {
        url: "/Home/CheckCHIsAfterAppraisement/",
        type: "POST",
        data: { "appraisementID": appraisementID },
        async: false,
        dataType: "json",
        success: function (data) {
            if (!data) {
                CustomConfirm("您已完成本次追评", isClosePage);
            }
            result = data;
        }
    });

    return result;
}

//检查H对C是否可以追评（H端）
function CheckIsHCAfterComment(commId) {
    var result = false;

    $.ajax(
    {
        url: "/CommentsManage/CheckIsHCAfterComment/",
        type: "POST",
        data: { "commId": commId },
        async: false,
        dataType: "json",
        success: function (data) {
            if (!data) {
                CustomConfirm("您已完成本次追评", 2);
            }
            result = data;
        }
    });

    return result;
}


/*!
 * jQuery Form Plugin
 * version: 3.10 (20-JUL-2012)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses:
 *    http://malsup.github.com/mit-license.txt
 *    http://malsup.github.com/gpl-license-v2.txt
 */
/*global ActiveXObject alert */
;(function($) {
"use strict";

/*
    Usage Note:
    -----------
    Do not use both ajaxSubmit and ajaxForm on the same form.  These
    functions are mutually exclusive.  Use ajaxSubmit if you want
    to bind your own submit handler to the form.  For example,

    $(document).ready(function() {
        $('#myForm').on('submit', function(e) {
            e.preventDefault(); // <-- important
            $(this).ajaxSubmit({
                target: '#output'
            });
        });
    });

    Use ajaxForm when you want the plugin to manage all the event binding
    for you.  For example,

    $(document).ready(function() {
        $('#myForm').ajaxForm({
            target: '#output'
        });
    });
    
    You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
    form does not have to exist when you invoke ajaxForm:

    $('#myForm').ajaxForm({
        delegation: true,
        target: '#output'
    });
    
    When using ajaxForm, the ajaxSubmit function will be invoked for you
    at the appropriate time.
*/

/**
 * Feature detection
 */
var feature = {};
feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
feature.formdata = window.FormData !== undefined;

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
    /*jshint scripturl:true */

    // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
    if (!this.length) {
        log('ajaxSubmit: skipping submit process - no element selected');
        return this;
    }
    
    var method, action, url, $form = this;

    if (typeof options == 'function') {
        options = { success: options };
    }

    method = this.attr('method');
    action = this.attr('action');
    url = (typeof action === 'string') ? $.trim(action) : '';
    url = url || window.location.href || '';
    if (url) {
        // clean url (don't include hash vaue)
        url = (url.match(/^([^#]+)/)||[])[1];
    }

    options = $.extend(true, {
        url:  url,
        success: $.ajaxSettings.success,
        type: method || 'GET',
        iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
    }, options);

    // hook for manipulating the form data before it is extracted;
    // convenient for use with rich editors like tinyMCE or FCKEditor
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
        return this;
    }

    // provide opportunity to alter form data before it is serialized
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    var traditional = options.traditional;
    if ( traditional === undefined ) {
        traditional = $.ajaxSettings.traditional;
    }
    
    var elements = [];
    var qx, a = this.formToArray(options.semantic, elements);
    if (options.data) {
        options.extraData = options.data;
        qx = $.param(options.data, traditional);
    }

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    // fire vetoable 'validate' event
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
        return this;
    }

    var q = $.param(a, traditional);
    if (qx) {
        q = ( q ? (q + '&' + qx) : qx );
    }    
    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else {
        options.data = q; // data is the query string for 'post'
    }

    var callbacks = [];
    if (options.resetForm) {
        callbacks.push(function() { $form.resetForm(); });
    }
    if (options.clearForm) {
        callbacks.push(function() { $form.clearForm(options.includeHidden); });
    }

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            var fn = options.replaceTarget ? 'replaceWith' : 'html';
            $(options.target)[fn](data).each(oldSuccess, arguments);
        });
    }
    else if (options.success) {
        callbacks.push(options.success);
    }

    options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
        var context = options.context || options;    // jQuery 1.4+ supports scope context 
        for (var i=0, max=callbacks.length; i < max; i++) {
            callbacks[i].apply(context, [data, status, xhr || $form, $form]);
        }
    };

    // are there files to upload?
    var fileInputs = $('input:file:enabled[value]', this); // [value] (issue #113)
    var hasFileInputs = fileInputs.length > 0;
    var mp = 'multipart/form-data';
    var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

    var fileAPI = feature.fileapi && feature.formdata;
    log("fileAPI :" + fileAPI);
    var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

    // options.iframe allows user to force iframe mode
    // 06-NOV-09: now defaulting to iframe mode if file input is detected
    if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
        // hack to fix Safari hang (thanks to Tim Molendijk for this)
        // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
        if (options.closeKeepAlive) {
            $.get(options.closeKeepAlive, function() {
                fileUploadIframe(a);
            });
        }
          else {
            fileUploadIframe(a);
          }
    }
    else if ((hasFileInputs || multipart) && fileAPI) {
        fileUploadXhr(a);
    }
    else {
        $.ajax(options);
    }

    // clear element array
    for (var k=0; k < elements.length; k++)
        elements[k] = null;

    // fire 'notify' event
    this.trigger('form-submit-notify', [this, options]);
    return this;

     // XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
    function fileUploadXhr(a) {
        var formdata = new FormData();

        for (var i=0; i < a.length; i++) {
            formdata.append(a[i].name, a[i].value);
        }

        if (options.extraData) {
            for (var p in options.extraData)
                if (options.extraData.hasOwnProperty(p))
                    formdata.append(p, options.extraData[p]);
        }

        options.data = null;

        var s = $.extend(true, {}, $.ajaxSettings, options, {
            contentType: false,
            processData: false,
            cache: false,
            type: 'POST'
        });
        
        if (options.uploadProgress) {
            // workaround because jqXHR does not expose upload property
            s.xhr = function() {
                var xhr = jQuery.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.onprogress = function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position; /*event.position is deprecated*/
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        options.uploadProgress(event, position, total, percent);
                    };
                }
                return xhr;
            };
        }

        s.data = null;
            var beforeSend = s.beforeSend;
            s.beforeSend = function(xhr, o) {
                o.data = formdata;
                if(beforeSend)
                    beforeSend.call(this, xhr, o);
        };
        $.ajax(s);
    }

    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUploadIframe(a) {
        var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
        var useProp = !!$.fn.prop;

        if ($(':input[name=submit],:input[id=submit]', form).length) {
            // if there is an input with a name or id of 'submit' then we won't be
            // able to invoke the submit fn on the form (at least not x-browser)
            alert('Error: Form elements must not have name or id of "submit".');
            return;
        }
        
        if (a) {
            // ensure that every serialized input is still enabled
            for (i=0; i < elements.length; i++) {
                el = $(elements[i]);
                if ( useProp )
                    el.prop('disabled', false);
                else
                    el.removeAttr('disabled');
            }
        }

        s = $.extend(true, {}, $.ajaxSettings, options);
        s.context = s.context || s;
        id = 'jqFormIO' + (new Date().getTime());
        if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr('name');
            if (!n)
                 $io.attr('name', id);
            else
                id = n;
        }
        else {
            $io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
            $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
        }
        io = $io[0];


        xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function(status) {
                var e = (status === 'timeout' ? 'timeout' : 'aborted');
                log('aborting upload... ' + e);
                this.aborted = 1;
                $io.attr('src', s.iframeSrc); // abort op in progress
                xhr.error = e;
                if (s.error)
                    s.error.call(s.context, xhr, e, status);
                if (g)
                    $.event.trigger("ajaxError", [xhr, s, e]);
                if (s.complete)
                    s.complete.call(s.context, xhr, e);
            }
        };

        g = s.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && 0 === $.active++) {
            $.event.trigger("ajaxStart");
        }
        if (g) {
            $.event.trigger("ajaxSend", [xhr, s]);
        }

        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            if (s.global) {
                $.active--;
            }
            return;
        }
        if (xhr.aborted) {
            return;
        }

        // add submitting element to data if we know it
        sub = form.clk;
        if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
                s.extraData = s.extraData || {};
                s.extraData[n] = sub.value;
                if (sub.type == "image") {
                    s.extraData[n+'.x'] = form.clk_x;
                    s.extraData[n+'.y'] = form.clk_y;
                }
            }
        }
        
        var CLIENT_TIMEOUT_ABORT = 1;
        var SERVER_ABORT = 2;

        function getDoc(frame) {
            var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
            return doc;
        }
        
        // Rails CSRF hack (thanks to Yvan Barthelemy)
        var csrf_token = $('meta[name=csrf-token]').attr('content');
        var csrf_param = $('meta[name=csrf-param]').attr('content');
        if (csrf_param && csrf_token) {
            s.extraData = s.extraData || {};
            s.extraData[csrf_param] = csrf_token;
        }

        // take a breath so that pending repaints get some cpu time before the upload starts
        function doSubmit() {
            // make sure form attrs are set
            var t = $form.attr('target'), a = $form.attr('action');

            // update form attrs in IE friendly way
            form.setAttribute('target',id);
            if (!method) {
                form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
                form.setAttribute('action', s.url);
            }

            // ie borks in some cases when setting encoding
            if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (s.timeout) {
                timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }
            
            // look for server aborts
            function checkState() {
                try {
                    var state = getDoc(io).readyState;
                    log('state = ' + state);
                    if (state && state.toLowerCase() == 'uninitialized')
                        setTimeout(checkState,50);
                }
                catch(e) {
                    log('Server abort: ' , e, ' (', e.name, ')');
                    cb(SERVER_ABORT);
                    if (timeoutHandle)
                        clearTimeout(timeoutHandle);
                    timeoutHandle = undefined;
                }
            }

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
                if (s.extraData) {
                    for (var n in s.extraData) {
                        if (s.extraData.hasOwnProperty(n)) {
                            extraInputs.push(
                                $('<input type="hidden" name="'+n+'">').attr('value',s.extraData[n])
                                    .appendTo(form)[0]);
                        }
                    }
                }

                if (!s.iframeTarget) {
                    // add iframe to doc and submit the form
                    $io.appendTo('body');
                    if (io.attachEvent)
                        io.attachEvent('onload', cb);
                    else
                        io.addEventListener('load', cb, false);
                }
                setTimeout(checkState,15);
                form.submit();
            }
            finally {
                // reset attrs and remove "extra" input elements
                form.setAttribute('action',a);
                if(t) {
                    form.setAttribute('target', t);
                } else {
                    $form.removeAttr('target');
                }
                $(extraInputs).remove();
            }
        }

        if (s.forceSync) {
            doSubmit();
        }
        else {
            setTimeout(doSubmit, 10); // this lets dom updates render
        }

        var data, doc, domCheckCount = 50, callbackProcessed;

        function cb(e) {
            if (xhr.aborted || callbackProcessed) {
                return;
            }
            try {
                doc = getDoc(io);
            }
            catch(ex) {
                log('cannot access response document: ', ex);
                e = SERVER_ABORT;
            }
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                xhr.abort('timeout');
                return;
            }
            else if (e == SERVER_ABORT && xhr) {
                xhr.abort('server abort');
                return;
            }

            if (!doc || doc.location.href == s.iframeSrc) {
                // response not received yet
                if (!timedOut)
                    return;
            }
            if (io.detachEvent)
                io.detachEvent('onload', cb);
            else    
                io.removeEventListener('load', cb, false);

            var status = 'success', errMsg;
            try {
                if (timedOut) {
                    throw 'timeout';
                }

                var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                log('isXml='+isXml);
                if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                    if (--domCheckCount) {
                        // in some browsers (Opera) the iframe DOM is not always traversable when
                        // the onload callback fires, so we loop a bit to accommodate
                        log('requeing onLoad callback, DOM not available');
                        setTimeout(cb, 250);
                        return;
                    }
                    // let this fall through because server response could be an empty document
                    //log('Could not access iframe DOM after mutiple tries.');
                    //throw 'DOMException: not available';
                }

                //log('response detected');
                var docRoot = doc.body ? doc.body : doc.documentElement;
                xhr.responseText = docRoot ? docRoot.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                if (isXml)
                    s.dataType = 'xml';
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': s.dataType};
                    return headers[header];
                };
                // support for XHR 'status' & 'statusText' emulation :
                if (docRoot) {
                    xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
                    xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                }

                var dt = (s.dataType || '').toLowerCase();
                var scr = /(json|script|text)/.test(dt);
                if (scr || s.textarea) {
                    // see if user embedded response in textarea
                    var ta = doc.getElementsByTagName('textarea')[0];
                    if (ta) {
                        xhr.responseText = ta.value;
                        // support for XHR 'status' & 'statusText' emulation :
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                    }
                    else if (scr) {
                        // account for browsers injecting pre around json response
                        var pre = doc.getElementsByTagName('pre')[0];
                        var b = doc.getElementsByTagName('body')[0];
                        if (pre) {
                            xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                        }
                        else if (b) {
                            xhr.responseText = b.textContent ? b.textContent : b.innerText;
                        }
                    }
                }
                else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
                    xhr.responseXML = toXml(xhr.responseText);
                }

                try {
                    data = httpData(xhr, dt, s);
                }
                catch (e) {
                    status = 'parsererror';
                    xhr.error = errMsg = (e || status);
                }
            }
            catch (e) {
                log('error caught: ',e);
                status = 'error';
                xhr.error = errMsg = (e || status);
            }

            if (xhr.aborted) {
                log('upload aborted');
                status = null;
            }

            if (xhr.status) { // we've set xhr.status
                status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (status === 'success') {
                if (s.success)
                    s.success.call(s.context, data, 'success', xhr);
                if (g)
                    $.event.trigger("ajaxSuccess", [xhr, s]);
            }
            else if (status) {
                if (errMsg === undefined)
                    errMsg = xhr.statusText;
                if (s.error)
                    s.error.call(s.context, xhr, status, errMsg);
                if (g)
                    $.event.trigger("ajaxError", [xhr, s, errMsg]);
            }

            if (g)
                $.event.trigger("ajaxComplete", [xhr, s]);

            if (g && ! --$.active) {
                $.event.trigger("ajaxStop");
            }

            if (s.complete)
                s.complete.call(s.context, xhr, status);

            callbackProcessed = true;
            if (s.timeout)
                clearTimeout(timeoutHandle);

            // clean up
            setTimeout(function() {
                if (!s.iframeTarget)
                    $io.remove();
                xhr.responseXML = null;
            }, 100);
        }

        var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else {
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            }
            return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
        };
        var parseJSON = $.parseJSON || function(s) {
            /*jslint evil:true */
            return window['eval']('(' + s + ')');
        };

        var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

            var ct = xhr.getResponseHeader('content-type') || '',
                xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
                if ($.error)
                    $.error('parsererror');
            }
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            if (typeof data === 'string') {
                if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                    data = parseJSON(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    $.globalEval(data);
                }
            }
            return data;
        };
    }
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
    options = options || {};
    options.delegation = options.delegation && $.isFunction($.fn.on);
    
    // in jQuery 1.3+ we can fix mistakes with the ready state
    if (!options.delegation && this.length === 0) {
        var o = { s: this.selector, c: this.context };
        if (!$.isReady && o.s) {
            log('DOM not ready, queuing ajaxForm');
            $(function() {
                $(o.s,o.c).ajaxForm(options);
            });
            return this;
        }
        // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
        log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
        return this;
    }

    if ( options.delegation ) {
        $(document)
            .off('submit.form-plugin', this.selector, doAjaxSubmit)
            .off('click.form-plugin', this.selector, captureSubmittingElement)
            .on('submit.form-plugin', this.selector, options, doAjaxSubmit)
            .on('click.form-plugin', this.selector, options, captureSubmittingElement);
        return this;
    }

    return this.ajaxFormUnbind()
        .bind('submit.form-plugin', options, doAjaxSubmit)
        .bind('click.form-plugin', options, captureSubmittingElement);
};

// private event handlers    
function doAjaxSubmit(e) {
    /*jshint validthis:true */
    var options = e.data;
    if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
        e.preventDefault();
        $(this).ajaxSubmit(options);
    }
}
    
function captureSubmittingElement(e) {
    /*jshint validthis:true */
    var target = e.target;
    var $el = $(target);
    if (!($el.is(":submit,input:image"))) {
        // is this a child element of the submit el?  (ex: a span within a button)
        var t = $el.closest(':submit');
        if (t.length === 0) {
            return;
        }
        target = t[0];
    }
    var form = this;
    form.clk = target;
    if (target.type == 'image') {
        if (e.offsetX !== undefined) {
            form.clk_x = e.offsetX;
            form.clk_y = e.offsetY;
        } else if (typeof $.fn.offset == 'function') {
            var offset = $el.offset();
            form.clk_x = e.pageX - offset.left;
            form.clk_y = e.pageY - offset.top;
        } else {
            form.clk_x = e.pageX - target.offsetLeft;
            form.clk_y = e.pageY - target.offsetTop;
        }
    }
    // clear form vars
    setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
}


// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
    return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic, elements) {
    var a = [];
    if (this.length === 0) {
        return a;
    }

    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) {
        return a;
    }

    var i,j,n,v,el,max,jmax;
    for(i=0, max=els.length; i < max; i++) {
        el = els[i];
        n = el.name;
        if (!n) {
            continue;
        }

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(!el.disabled && form.clk == el) {
                a.push({name: n, value: $(el).val(), type: el.type });
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            }
            continue;
        }

        v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            if (elements) 
                elements.push(el);
            for(j=0, jmax=v.length; j < jmax; j++) {
                a.push({name: n, value: v[j]});
            }
        }
        else if (feature.fileapi && el.type == 'file' && !el.disabled) {
            if (elements) 
                elements.push(el);
            var files = el.files;
            if (files.length) {
                for (j=0; j < files.length; j++) {
                    a.push({name: n, value: files[j], type: el.type});
                }
            }
            else {
                // #180
                a.push({ name: n, value: '', type: el.type });
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            if (elements) 
                elements.push(el);
            a.push({name: n, value: v, type: el.type, required: el.required});
        }
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle it here
        var $input = $(form.clk), input = $input[0];
        n = input.name;
        if (n && !input.disabled && input.type == 'image') {
            a.push({name: n, value: $input.val()});
            a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) {
            return;
        }
        var v = $.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++) {
                a.push({name: n, value: v[i]});
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            a.push({name: this.name, value: v});
        }
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *    array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
            continue;
        }
        if (v.constructor == Array)
            $.merge(val, v);
        else
            val.push(v);
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (successful === undefined) {
        successful = true;
    }

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1)) {
            return null;
    }

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) {
            return null;
        }
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
                var v = op.value;
                if (!v) { // extra pain for IE...
                    v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                }
                if (one) {
                    return v;
                }
                a.push(v);
            }
        }
        return a;
    }
    return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function(includeHidden) {
    return this.each(function() {
        $('input,select,textarea', this).clearFields(includeHidden);
    });
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (re.test(t) || tag == 'textarea') {
            this.value = '';
        }
        else if (t == 'checkbox' || t == 'radio') {
            this.checked = false;
        }
        else if (tag == 'select') {
            this.selectedIndex = -1;
        }
        else if (includeHidden) {
            // includeHidden can be the valud true, or it can be a selector string
            // indicating a special test; for example:
            //  $('#myForm').clearForm('.special:hidden')
            // the above would clean hidden inputs that have the class of 'special'
            if ( (includeHidden === true && /hidden/.test(t)) ||
                 (typeof includeHidden == 'string' && $(this).is(includeHidden)) )
                this.value = '';
        }
    });
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
            this.reset();
        }
    });
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
    if (b === undefined) {
        b = true;
    }
    return this.each(function() {
        this.disabled = !b;
    });
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
    if (select === undefined) {
        select = true;
    }
    return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio') {
            this.checked = select;
        }
        else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
                // deselect all other options
                $sel.find('option').selected(false);
            }
            this.selected = select;
        }
    });
};

// expose debug var
$.fn.ajaxSubmit.debug = false;

// helper fn for console logging
function log() {
    if (!$.fn.ajaxSubmit.debug) 
        return;
    var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
    if (window.console && window.console.log) {
        window.console.log(msg);
    }
    else if (window.opera && window.opera.postError) {
        window.opera.postError(msg);
    }
}

})(jQuery);

var gloabid = "showlayercurrent";
var customerid = "showlayercontent";

//弹出层，蒙层代码
function ShowSubLayer(containerID, autoDisabled) {
    var browser = GetBrowser();

    SetDocumentScrollbar(true);

    var org = document.getElementById(containerID);


    //弹出层定位
    var newbox = document.createElement("div");

    newbox.id = customerid;
    newbox.innerHTML = org.innerHTML;

    if (org.className.toLowerCase() != "") {
        newbox.className = org.className;
    }

    if (org.style.width != "") {
        newbox.style.width = org.style.width;
    }

    newbox.style.zIndex = "9999";
    newbox.style.display = "block";
    newbox.style.position = !browser.IsIE6 ? "fixed" : "absolute";
    newbox.style.margin = "0px auto";
    newbox.style.height = "auto";
    newbox.style.overflow = "hidden";

    document.body.appendChild(newbox);

    //蒙层
    var layer = document.createElement("div");
    layer.id = gloabid;


    layer.style.width = layer.style.height = "100%";

    if (browser.IsIE6) {
        //layer.style.width = document.documentElement.clientWidth;
        //layer.style.height = document.documentElement.clientHeight;
        layer.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
        layer.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
    }

    layer.style.position = !browser.IsIE6 ? "fixed" : "absolute";

    layer.style.top = layer.style.left = 0;

    if (!browser.IsIE6) {
        layer.style.backgroundColor = "#000000";
    }


    layer.style.zIndex = "9998";

    layer.style.opacity = "0.6";

    if (browser.IsIE) {
        layer.style.filter = "alpha(opacity=60)";
    }

    if (browser.IsIE6) {
        layer.style.backgroundColor = "#666666";
    }

    document.body.appendChild(layer);


    SetSubBoxStyle(newbox);

    if (autoDisabled) {
        layer.onclick = function () {
            CloseSubLayer();
        }
    }
    //$("#" + gloabid).html("<iframe style=\"z-index:-1;position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border-style:none;\"></iframe>");

}

//zfw 2013.7.1(异步弹层，事件触发先动态填充内容，再弹出层)
function ShowSubLayerAsync(containerID, autoDisabled) {
    //var havecreateobj = document.getElementById(containerID + "_layer");
    //if (havecreateobj == null) {

    var browser = GetBrowser();

    SetDocumentScrollbar(true);

    var org = document.getElementById(containerID);

    //弹出层定位
    var newbox = document.createElement("div");

    newbox.id = customerid;
    newbox.innerHTML = org.innerHTML;

    var copyorg = newbox;
    var selectlist = copyorg.getElementsByTagName("select");
    for (var i = 0; i < selectlist.length; i++) {
        if (selectlist[i].id != "") {
            selectlist[i].id = selectlist[i].id + "_layer";
        }
        if (selectlist[i].name != "") {
            selectlist[i].name = selectlist[i].name + "_layer";
        }
    }

    var divlist = copyorg.getElementsByTagName("div");
    for (var i = 0; i < divlist.length; i++) {
        if (divlist[i].id != "") {
            divlist[i].id = divlist[i].id + "_layer";
        }
    }

    var inputlist = copyorg.getElementsByTagName("input");
    for (var i = 0; i < inputlist.length; i++) {
        if (inputlist[i].id != "") {
            inputlist[i].id = inputlist[i].id + "_layer";
        }
        if (inputlist[i].name != "") {
            inputlist[i].name = inputlist[i].name + "_layer";
        }
    }

    var spanlist = copyorg.getElementsByTagName("span");
    for (var i = 0; i < spanlist.length; i++) {
        if (spanlist[i].id != "") {
            spanlist[i].id = spanlist[i].id + "_layer";
        }
    }

    var spanlist = copyorg.getElementsByTagName("p");
    for (var i = 0; i < spanlist.length; i++) {
        if (spanlist[i].id != "") {
            spanlist[i].id = spanlist[i].id + "_layer";
        }
    }

    var textarealist = copyorg.getElementsByTagName("textarea");
    for (var i = 0; i < textarealist.length; i++) {
        if (textarealist[i].id != "") {
            textarealist[i].id = textarealist[i].id + "_layer";
        }
        if (textarealist[i].name != "") {
            textarealist[i].name = textarealist[i].name + "_layer";
        }
    }
    //alert(newbox.innerHTML);
    if (org.className.toLowerCase() != "") {
        newbox.className = org.className;
    }

    if (org.style.width != "") {
        newbox.style.width = org.style.width;
    }

    newbox.style.zIndex = "9999";
    newbox.style.display = "block";
    newbox.style.position = !browser.IsIE6 ? "fixed" : "absolute";
    newbox.style.margin = "0px auto";
    newbox.style.height = "auto";
    newbox.style.overflow = "hidden";

    document.body.appendChild(newbox);

    //蒙层
    var layer = document.createElement("div");
    layer.id = gloabid;


    layer.style.width = layer.style.height = "100%";

    if (browser.IsIE6) {
        layer.style.width = document.documentElement.clientWidth;
        layer.style.height = document.documentElement.clientHeight;
    }

    layer.style.position = !browser.IsIE6 ? "fixed" : "absolute";

    layer.style.top = layer.style.left = 0;

    if (!browser.IsIE6) {
        layer.style.backgroundColor = "#000000";
    }


    layer.style.zIndex = "9998";

    layer.style.opacity = "0.6";

    if (browser.IsIE) {
        layer.style.filter = "alpha(opacity=60)";
    }

    if (browser.IsIE6) {
        layer.style.backgroundColor = "#666666";
    }

    document.body.appendChild(layer);


    SetSubBoxStyle(newbox);

    if (autoDisabled) {
        layer.onclick = function () {
            CloseSubLayer();
        }
    }
    //}
    //else {
    //    alert("请不要连续点击");
    //}

}

//设置浮层滑动
function SetSubBoxStyle(newbox) {
    var scrollTop = GetScrollTop();

    var browser = GetBrowser();

    var scrollempty = parseInt(document.documentElement.scrollHeight - document.documentElement.clientHeight);

    if (newbox.offsetHeight > document.documentElement.clientHeight) {
        if (scrollTop == 0) {
            newbox.style.top = "0px";
        }
        else if (scrollTop == scrollempty) {
            newbox.style.top = (parseInt(document.documentElement.clientHeight - newbox.offsetHeight)).toString() + "px";
        }
        else {
            newbox.style.top = (parseInt(document.documentElement.clientHeight - newbox.offsetHeight) / 2).toString() + "px";
        }

    }
    else {

        var h = parseInt((document.documentElement.clientHeight - newbox.offsetHeight) / 2);

        if (browser.IsIE6) {
            newbox.style.top = (scrollTop + h).toString() + "px";
        }
        else {
            newbox.style.top = h.toString() + "px";
        }
    }

    newbox.style.left = (parseInt(document.documentElement.clientWidth - newbox.offsetWidth) / 2).toString() + "px";
}

//关闭弹出层
function CloseSubLayer() {

    if (customerid == "") return;

    var obj = document.getElementById(customerid);
    if (obj != null && obj != undefined) {
        obj.parentNode.removeChild(obj);
    }

    var obj = document.getElementById(gloabid);
    if (obj != null && obj != undefined) {
        obj.parentNode.removeChild(obj);
    }

    SetDocumentScrollbar(false);
}

function ShowSubLayerByText(html, className, autoDisabled) {
    var browser = GetBrowser();

    SetDocumentScrollbar(true);

    //弹出层定位
    var newbox = document.createElement("div");

    newbox.id = customerid;
    newbox.innerHTML = html;

    newbox.className = className;

    newbox.style.zIndex = "9999";
    newbox.style.display = "block";
    newbox.style.position = !browser.IsIE6 ? "fixed" : "absolute";
    newbox.style.margin = "auto auto";
    newbox.style.height = "auto";
    newbox.style.overflow = "hidden";

    document.body.appendChild(newbox);

    //蒙层
    var layer = document.createElement("div");
    layer.id = gloabid;
    //alert(browser.IsIE6);

    if (!browser.IsIE6) {
        layer.style.width = layer.style.height = "100%";
    }
    else {
        layer.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
        layer.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";

        //alert("width:" + layer.style.width);
        //alert("height:" + layer.style.height);
    }


    layer.style.position = !browser.IsIE6 ? "fixed" : "absolute";
    layer.style.top = layer.style.left = "0px";
    layer.style.zIndex = "9998";
    layer.className = "showlayerback";

    document.body.appendChild(layer);


    SetSubBoxStyle(newbox);

    if (autoDisabled) {
        layer.onclick = function () {
            CloseSubLayer();
        }
    }
    //$("#" + gloabid).html("<iframe style=\"z-index:-1;position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border-style:none;\"></iframe>");

}

//没有遮罩层 
function ShowLayerByText(ele, html, className, autoDisabled) {
    var browser = GetBrowser();

    // SetDocumentScrollbar(true);

    //弹出层定位
    var newbox = document.createElement("div");

    newbox.id = customerid;
    newbox.innerHTML = html;

    newbox.className = className;

    newbox.style.zIndex = "9999";
    newbox.style.display = "block";
    newbox.style.position = "absolute"; //!browser.IsIE6 ? "fixed" : "absolute";
    newbox.style.margin = "auto auto";
    newbox.style.height = "auto";
    newbox.style.overflow = "hidden";

    document.body.appendChild(newbox);

    // SetSubBoxStyle(newbox);

    //var targetNode = ele;
    var offset = HP.getOffset(ele);
    var left = offset.left - newbox.offsetWidth + ele.offsetWidth;
    var top = offset.top + ele.offsetHeight + 5;
    $(newbox).css({ "left": left + "px", "top": top + "px" });



    if (autoDisabled) {
        layer.onclick = function () {
            CloseSubLayer();
        }
    }
    //$("#" + gloabid).html("<iframe style=\"z-index:-1;position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border-style:none;\"></iframe>");

}

///提交成功后刷新当前页面
function RefPage() {
    CloseSubLayer();
    window.location = location;
}

function RefreshApplyPage(url) {
    CloseSubLayer();
    window.location = url;
}

//提示成功后关闭页面
function ClosePage() {
    //window.opener = null;
    //window.open('', '_self');
    //window.close();
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null; window.close();
        }
        else {
            window.open('', '_top'); window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank ';
        //window.history.go(-2);  
    }
    else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}

///在IE6中下拉框显示在弹出层上
function CustomLayerZindex() {
    var browser = GetBrowser();
    if (browser.IsIE6) {
        var sel = document.getElementsByTagName("select");
        for (var i = 0; i < sel.length; i++) {
            sel[i].style.visibility = "hidden";
        }
    }
}


//弹出层
//innerhtml 提示
//iscolsepage 1关闭页面,2刷新页面,3关闭页面
//title 标题,默认为：提示信息
//closeMethod 关闭触发的方法,默认为CloseSubLayer()
function CustomConfirm(innerHtml, isClosePage, title, closeMethod) {

    CustomLayerZindex();

    var txt = "";

    if (isClosePage == undefined) {
        isClosePage = 1;
    }

    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_n_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_n_e\"></div>";
    txt += "</div>";
    txt += "<div class=\"customlayermain\">";
    txt += "<div class=\"customlayerbody\">";
    txt += "<div class=\"customlayerbody_title\">";
    if (title == undefined) {
        txt += "<div class=\"customlayerbody_title_l\">提示信息</div>";
    }
    else {
        txt += "<div class=\"customlayerbody_title_l\">" + title + "</div>";
    }
    //txt += "<div class=\"customlayerbody_title_r\"></div>";
    if (closeMethod == undefined) {
        txt += "<div class=\"customlayerbody_title_r\" onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    }
    else if (closeMethod == 1) {
        txt += "<div class=\"customlayerbody_title_r\" onclick='RefPageUrl();'>[&nbsp;关闭&nbsp;]</div>";
    }
    else {
        txt += "<div class=\"customlayerbody_title_r\" onclick=\"RedirectMainPage();\">[&nbsp;关闭&nbsp;]</div>";
    }
    txt += "</div>";
    txt += "<div class=\"customlayercontent\">";
    txt += "<div class=\"customlayercontent_c\">";
    if (isClosePage == 4) {
        txt += innerHtml;
    } else {
        txt += "<div class=\"customlayer_alert_div\">" + innerHtml + "</div>";
        if (isClosePage == 1) {
            var funName = "CloseSubLayer();";
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='" + funName + "' value=\"确定\"></div>";
        } else if (isClosePage == 2) {
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='RefPage();' value=\"确定\"></div>";
        } else if (isClosePage == 9) {
            var url = 0;
            if (innerHtml != "评价候选人成功！" && innerHtml != "操作成功！") {
                url = 2;
            }
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='layer-common-btn2' onclick='RefCurrentPage(" + url + ");' value=\"确定\"></div>";
        } else if (isClosePage == 111) {
            var url = 0;
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='layer-common-btn2' onclick='RefCurrentPage(" + url + ");' value=\"确定\"></div>";
        }
        else if (isClosePage == 12) {
            var url = 1;
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='layer-common-btn2' onclick='RefCurrentPage(" + url + ");' value=\"确定\"></div>";
        }
        else if (isClosePage == 10) {
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='RefPageUrl();' value=\"确定\"></div>";
        } else if (isClosePage == 20) {
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='RedirectMainPage();' value=\"确定\"></div>";
        } else if (isClosePage == 3) {
            txt += "<div class=\"customlayer_btn_div\"></div>";
        } else if (isClosePage == 11) {
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='GetDenyApplyPage();' value=\"确定\"></div>";
        } else {
            txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='CloseSubLayer();' value=\"确定\"></div>";
        }
    }
    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_s_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_s_e\"></div>";
    txt += "</div>";

    ShowSubLayerByText(txt, "custom_pop_layer", false);
}

//只有一个确定按钮，同时，可以传入一个回调函数
function HighPinAlertWithCallBack(html, CallBackFucnName, CallBackParamString, withoutClosed) {

    var txt = "";
    if (withoutClosed == undefined) {
        withoutClosed = true;
    }

    if (CallBackFucnName == undefined) {
        CallBackFucnName = "";
    }

    if (CallBackParamString == undefined) {
        CallBackParamString = "";
    }

    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_n_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_n_e\"></div>";
    txt += "</div>";
    txt += "<div class=\"customlayermain\">";
    txt += "<div class=\"customlayerbody\">";
    txt += "<div class=\"customlayerbody_title\">";
    txt += "<div class=\"customlayerbody_title_l\">提示信息</div>";
    txt += "<div class=\"customlayerbody_title_r\" onclick=\"" + CallBackFucnName + "(" + CallBackParamString + ");CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "</div>";
    txt += "<div class=\"customlayercontent_highpinalert\">";
    txt += "<div class=\"customlayercontent_c_highpinalert\">";
    txt += "<div class=\"customlayer_alert_div_alert\">" + html + "</div>";

    if (withoutClosed) {
        if (CallBackFucnName == "") {
            txt += "<div class=\"customlayer_btn_div_alert\"><div class='btn_openlayer_div_submit'><input id='CurrentBtn' type='button' class='btn_confirm_submit' value=\"确定\"  onclick=\"CloseSubLayer();\"></div></div>";
        }
        else {
            txt += "<div class=\"customlayer_btn_div_alert\"><div class='btn_openlayer_div_submit'><input id='CurrentBtn' type='button' class='btn_confirm_submit' value=\"确定\"  onclick=\"" + CallBackFucnName + "(" + CallBackParamString + ");CloseSubLayer();\"></div></div>";
        }
    }
    else {
        txt += "<div class=\"customlayer_btn_div_alert\"><div class='btn_openlayer_div_submit'><input id='CurrentBtn' type='button' class='btn_confirm_submit' value=\"确定\"  onclick=\"" + CallBackFucnName + "(" + CallBackParamString + ");\"></div></div>";
    }

    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_s_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_s_e\"></div>";
    txt += "</div>";

    ShowSubLayerByText(txt, "custom_pop_layer", false);
    document.activeElement.blur();
}

//自定义的Confirm
function HighPinConfirm(html, CallBackFucnName, CallBackParamString, withoutClosed) {
    var txt = "";

    if (withoutClosed == undefined) {
        withoutClosed = true;
    }


    if (CallBackParamString == undefined) {
        CallBackParamString = "";
    }

    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_n_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_n_e\"></div>";
    txt += "</div>";
    txt += "<div class=\"customlayermain\">";
    txt += "<div class=\"customlayerbody\">";
    txt += "<div class=\"customlayerbody_title\">";
    txt += "<div class=\"customlayerbody_title_l\">提示信息</div>";
    //txt += "<div class=\"customlayerbody_title_r\"></div>";
    txt += "<div class=\"customlayerbody_title_r\" onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "</div>";
    txt += "<div class=\"customlayercontent_highpinalert\">";
    txt += "<div class=\"customlayercontent_c_highpinalert\">";
    txt += "<div class=\"customlayer_alert_div_alert fSearchDelLayer\">" + html + "</div>";

    if (withoutClosed) {
        txt += "<div class=\"customlayer_btn_div_alert\"><div class='btn_openlayer_div_submit'><input type='button' class='layer-common-2btn2' value=\"确定\"  onclick=\"" + CallBackFucnName + "(" + CallBackParamString + ");CloseSubLayer();\"><input type='button' class='layer-common-gray-btn2' onclick=\"CloseSubLayer();\" value=\"取消\"></div></div>";
    }
    else {
        txt += "<div class=\"customlayer_btn_div_alert\"><div class='btn_openlayer_div_submit'><input type='button' class='layer-common-2btn2' value=\"确定\"  onclick=\"" + CallBackFucnName + "(" + CallBackParamString + ");\"><input type='button' class='layer-common-gray-btn2' onclick=\"CloseSubLayer();\" value=\"取消\"></div></div>";
    }

    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_s_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_s_e\"></div>";
    txt += "</div>";
    ShowSubLayerByText(txt, "custom_pop_layer", false);
}

//自定义的Confirm 提示语居左显示
function HighPinConfirmLeft(html, CallBackFucnName, CallBackParamString, withoutClosed) {
    var txt = "";

    if (withoutClosed == undefined) {
        withoutClosed = true;
    }


    if (CallBackParamString == undefined) {
        CallBackParamString = "";
    }

    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_n_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_n_e\"></div>";
    txt += "</div>";
    txt += "<div class=\"customlayermain\">";
    txt += "<div class=\"customlayerbody\">";
    txt += "<div class=\"customlayerbody_title\">";
    txt += "<div class=\"customlayerbody_title_l\">提示信息</div>";
    //txt += "<div class=\"customlayerbody_title_r\"></div>";
    txt += "<div class=\"customlayerbody_title_r\" onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "</div>";
    txt += "<div class=\"customlayercontent_highpinalert\">";
    txt += "<div class=\"customlayercontent_c_highpinalert\">";
    txt += "<div class=\"customlayer_alert_div_alert fSearchDelLayer2\">" + html + "</div>";

    if (withoutClosed) {
        txt += "<div class=\"customlayer_btn_div_alert\"><div class='btn_openlayer_div_submit'><input type='button' class='layer-common-2btn2' value=\"确定\"  onclick=\"" + CallBackFucnName + "(" + CallBackParamString + ");CloseSubLayer();\"><input type='button' class='layer-common-gray-btn2' onclick=\"CloseSubLayer();\" value=\"取消\"></div></div>";
    }
    else {
        txt += "<div class=\"customlayer_btn_div_alert\"><div class='btn_openlayer_div_submit'><input type='button' class='layer-common-2btn2' value=\"确定\"  onclick=\"" + CallBackFucnName + "(" + CallBackParamString + ");\"><input type='button' class='layer-common-gray-btn2' onclick=\"CloseSubLayer();\" value=\"取消\"></div></div>";
    }

    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_s_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_s_e\"></div>";
    txt += "</div>";
    ShowSubLayerByText(txt, "custom_pop_layer", false);
}

//自定义的Confirm
function HighPinAlert(html) {
    var txt = "";

    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_n_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_n_e\"></div>";
    txt += "</div>";
    txt += "<div class=\"customlayermain\">";
    txt += "<div class=\"customlayerbody\">";
    txt += "<div class=\"customlayerbody_title\">";
    txt += "<div class=\"customlayerbody_title_l\">提示信息</div>";
    txt += "<div class=\"customlayerbody_title_r\" onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "</div>";
    txt += "<div class=\"customlayercontent_highpinalert\">";
    txt += "<div class=\"customlayercontent_c_highpinalert\">";
    txt += "<div class=\"customlayer_alert_div_alert\">" + html + "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "</div>";
    txt += "<div class=\"customlayertitle\">";
    txt += "<div class=\"customlayercorner_s_w\"></div>";
    txt += "<div class=\"customlayertitle_c\"></div>";
    txt += "<div class=\"customlayercorner_s_e\"></div>";
    txt += "</div>";

    ShowSubLayerByText(txt, "custom_pop_layer", false);
}


//举报职位H端 wangzeyi
function ReportPositionH(value) {
    var txt = "";

    txt += "<!--举报职位-->";
    txt += " <div  id=\"report-position\" class=\"pop-mode-box\">";
    txt += " <table>";
    txt += "           <!--弹出层标题-->";
    txt += "           <tr>";
    txt += "           <td class=\"top-l\"></td>";
    txt += "        <td class=\"top-c\">";
    txt += "         <div class=\"pop-title-box\">";
    txt += "            <span class=\"new-pop-title\">举报</span>";
    txt += "               <span class=\"pop-close\" onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</span>";
    txt += "                </div>     ";
    txt += "                 </td>";
    txt += "                <td class=\"top-r\"></td>";
    txt += "       </tr>   ";

    txt += "       <!--弹出层内容-->  ";

    txt += "      <tr>  ";
    txt += "      <td class=\"center-l\"></td> ";
    txt += "       <td> ";


    txt += "                    <!--内容-->";
    txt += "                     <div class=\"pop-report\">";
    txt += "                         <div class=\"clearfix pop-mart10\">";
    txt += "                         	<h6 class=\"pop-title\">举报内容</h6>";
    txt += "                         	 <textarea class=\"pop-area\" style=\"color:rgb(129,129,129)\" maxlength=\"1000\" name=\"RContent\" id=\"RContent\" onKeyUp=\"javascript:checkWord(this,1);\" onfocus=\"if(this.value=='最多可输入1000字') {this.value='';}this.style.color='rgb(0,0,0)';\"onblur=\"if(this.value=='') {this.value='最多可输入1000字';this.style.color='rgb(129,129,129)';}\">最多可输入1000字</textarea>";
    txt += "                         </div>";
    txt += "                          <p class=\"report-p\" id=\"inputword\">您已输入<span class=\"word-red\" id=\"wordInput\" >0</span>字，还可以输入<span class=\"word-red\" id=\"wordCheck\">1000</span>字</p>";
    txt += "                          <button class=\"layer-common-btn2\" onclick=\"repinfo()\" >提交</button>";
    txt += "                     </div>";
    txt += "                   <!--内容--> ";


    txt += "                </td>";
    txt += "           <td class=\"center-r\"></td>";
    txt += "        </tr>";
    txt += "  <!--弹出层底部-->";
    txt += "        <tr>";
    txt += "                <td class=\"bottom-l\"></td>";
    txt += "                 <td class=\"bottom-c\"></td>";
    txt += "                <td class=\"bottom-r\"></td>";
    txt += "       </tr>";
    txt += " </table>";
    txt += " </div>";

    ShowSubLayerByText(txt, "report-position", false);
}


//举报职位C端 wangzeyi
function ReportPosition(value) {
    var txt = "";

    txt += "<!--举报职位-->";
    txt += " <div  id=\"report-position\" style=\"width:610px;\">";
    txt += "        <div class=\"layertitle wid-550\">";
    txt += "            <div class=\"layercorner_n_w\"></div>";
    txt += "            <div class=\"layertitle_c wid-532\"></div>";
    txt += "            <div class=\"layercorner_n_e\"></div>";
    txt += "        </div>";
    txt += "        <div class=\"layermain wid-550\">";
    txt += "            <div class=\"layerbody wid-530\">";
    txt += "                <div class=\"layerbody_title  wid-530\">";
    txt += "                    <div class=\"layerbody_title_l\">举报" + value + "</div><!-- 关闭函数 弹出后其他按钮调用即可 CloseSubLayer();-->";
    txt += "                    <div class=\"layerbody_title_r\"  onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "                </div>";
    txt += "                <div class=\"layercontent wid-530\">";
    txt += "                    <!--内容-->";
    txt += "                     <div class=\"pop-report\">";
    txt += "                     	<p class=\"pop-line\">如果您发现" + value + "信息存在不真实的情况，请通过以下方式告知我们。</p>";
    txt += "                        <p class=\"pop-line\">我们会根据您反馈的情况尽快核实，最大程度的保护您的个人权益。</p>";
    txt += "                         <div class=\"clearfix pop-mart10\">";
    txt += "                         	<h6 class=\"pop-title\">举报内容</h6>";
    txt += "                         	 <textarea class=\"pop-area\" style=\"color:rgb(129,129,129)\" maxlength=\"1000\" name=\"RContent\" id=\"RContent\" onKeyUp=\"javascript:checkWord(this,1);\" onMouseDown=\"javascript:checkWord(this,1);\" placeholder=\"10-1000字\"></textarea>";
    txt += "                         </div>";
    txt += "                          <p class=\"report-p\" id=\"inputword\">您已输入<span class=\"word-red\" id=\"wordInput\" >0</span>字，还可以输入<span class=\"word-red\" id=\"wordCheck\">1000</span>字</p>";
    txt += "                          <button class=\"layer-common-btn2\" onclick=\"repinfo()\" >提交</button>";
    txt += "                     </div>";
    txt += "                   <!--内容--> ";
    txt += "                </div>";
    txt += "            </div>";
    txt += "        </div>";
    txt += "";
    txt += "        <div class=\"layertitle wid-550\">";
    txt += "                <div class=\"layercorner_s_w\"></div>";
    txt += "                <div class=\"layertitle_c wid-532\"></div>";
    txt += "                <div class=\"layercorner_s_e\"></div>";
    txt += "        </div>";
    txt += "</div>";

    ShowSubLayerByText(txt, "report-position", false);
}



//登录框
function LoginInnerHtml(type, jobid, operateId) {
    var backUrl = encodeURI(top.location.href);
    var ssoUrlQ = encodeURI("http://c.highpin.cn/sso/auth?t=1");
    var ssoUrlWx = encodeURI("http://c.highpin.cn/sso/auth?t=2");
    var txt = "";
    txt += "<div  id=\"apply-login\">";
    if (type || jobid || operateId)
        txt += "<input type=\"hidden\"   id=\"JobId\"  name=\"JobId\"  value=" + jobid + " />  <input type=\"hidden\"   id=\"TypeId\"  name=\"TypeId\"  value=" + type + " /> <input type=\"hidden\"   id=\"OperateId\"  name=\"OperateId\"  value=" + operateId + " />   ";

    txt += "	    <div class=\"c-pop-login\">";
    txt += "    	    <div class=\"pop-login-title\">";
    txt += "        	    <h4 class=\"p-l-t\">个人会员登录</h4>";
    txt += "            	<div class=\"pop-l-close\"  onclick=\"CloseSubLayer();\"></div>";
    txt += "         </div>";
    txt += "         <div class=\"pop-login-con clearfix\">";
    //左侧 start
    txt += "        	<div class=\"p-l-cl\">";
    txt += "            <h5 class=\"login-tip\">已有智联账号可直接登录</h5>";
    txt += "           		<ul class=\"p-l-ul\">";
    txt += "                	<li class=\"pos-r\"><span id=\"AlertLogon_UserEmail\" class=\"\"></span><input type=\"text\" style=\"color:#999999;\" id=\"Logon_UserEmail\" class=\"p-l-inputArea1\" size=27 maxlength=100 onKeyUp=\"CheckKeyUp('UserEmail')\" style=\"color: rgb(187, 187, 187);\" onfocus=\"if(this.value=='登录邮箱（手机注册用户可输入手机号）') {this.value='';this.style.color='#333333';this.className='p-l-inputArea1';document.getElementById('AlertLogon_UserEmail').className='';document.getElementById('AlertLogon_UserEmail').innerText='';}\" onblur=\"if(this.value=='') {this.value='登录邮箱（手机注册用户可输入手机号）';this.style.color='#999999'}\" value=\"登录邮箱（手机注册用户可输入手机号）\"/></li>";
    txt += "                    <li class=\"pos-r\"><span id=\"AlertLogon_Password\" class=\"\"></span><input type=\"password\" style=\"color:#999999;\" class=\"p-l-inputArea1\" id=\"Logon_Password\" size=\"27\" maxlength=\"25\" onKeyUp=\"CheckKeyUp('Password')\"  onfocus=\"if(this.value=='登录密码') {this.value='';this.style.color='#333333';this.className='p-l-inputArea1';document.getElementById('AlertLogon_Password').className='';document.getElementById('AlertLogon_Password').innerText='';}\" onblur=\"if(this.value=='') {this.value='登录密码';$('#txt_password').show();this.style.color='#999999'}\" value=\"\" />";
    txt += "                                                                                                    <input type='text' id='txt_password' style='position: absolute; width: 252px; height: 34px; border: 1px solid #cccccc; background: #ffffff; border-radius: 2px; line-height: 34px;padding: 0 8px; top: 0px; left:0px; color: #999999;' value='密码' onclick='$(this).hide();$(\"#Logon_Password\").focus();' />";
    txt += "";
    txt += "";
    txt += "";
    txt += "</li>";
    txt += "                    <li class=\"pos-r\"><span id=\"AlertLogon_PostCode\" class=\"\"></span><input type=\"text\" style=\"color:#999999;\" id=\"Logon_PostCode\" onKeyUp=\"CheckKeyUp('Logon_PostCode')\" class=\"p-l-inputArea2\" size=\"4\" maxlength=\"4\" value=\"验证码\"  onfocus=\"if(this.value=='验证码') {this.value='';this.style.color='#333333';;this.className='p-l-inputArea2';document.getElementById('AlertLogon_PostCode').className='';document.getElementById('AlertLogon_PostCode').innerText='';}\" onblur=\"if(this.value=='') {this.value='验证码';this.style.color='#999999'}\" value=\"验证码\"  /><img src=\"/Home/GetValidatingCode?imgtype=6&time=636023813938521851\" class=\"p-l-check-img\" id=\"img_postcode_reg\"/><a href=\"#\" class=\"p-l-change-img\" onclick=\"RefreshImgUrl('img_postcode_reg')\">换一换</a></li>";
    txt += "                    <li class=\"special\"><input type=\"checkbox\"  class=\"auto-login-check \" id=\"Logon_RememberMe\"/><span class=\"auto-login-text\">下次自动登录</span><a href=\"http://passport.zhaopin.com/findpassword/email/step1?bkurl=" + SeekerDomain + "\" title=\"忘记密码？\" class=\"forget-password\" target=\"_blank\">忘记密码？</a></li>";
    txt += "                </ul> ";
    txt += "                <div class=\" new-btn-box\">";
    txt += "                    <input class=\"p-login-btn \" type=\"button\" onclick=\"ApplyLogin();\" value=\"登&nbsp;&nbsp;录\"/>";
    txt += "                </div>";
    txt += "          </div>";
    //左侧 end
    txt += "            <div class=\"p-l-cm\"></div>";
    //右侧 start
    txt += "          <div class=\"p-l-cr\">";
    txt += "              <p class=\"noAccount\">还没有账号？</p>";
    txt += "              <div style=\" text-align:center; \">";
    txt += "                    <div class=\"mt-13\"><input type=\"button\" class=\"immeRegisterBtn\" value=\"立即注册>>\" /></div>";
    txt += "                    <div class=\"mt-48 ml-20 clearfix\"><div class=\"line-left-right\"></div><div class=\"line-middle-content\">&nbsp;使用其他方式登录&nbsp;</div><div class=\"line-left-right \" style=\"width:52px; \"></div></div>";
    txt += "                    <div class=\"mt-20\"><input type=\"button\" class=\"loginTypeBtn weixinBtn\" onclick=\"window.location.href ='https://passport.zhaopin.com/oauth/weixin/enter?bkurl=" + ssoUrlWx + "';\"/>";
    txt += "                    <input type=\"button\" class=\"loginTypeBtn qqBtn ml-15\" onclick=\"window.location.href ='https://passport.zhaopin.com/oauth/qq/enter?bkurl=" + ssoUrlQ + "';\"/>";
    txt += "                    <input type=\"button\" class=\"loginTypeBtn weiboBtn ml-15\" onclick=\"window.location.href ='http://c.highpin.cn/users/oauth?type=sinaweibo&backUrl=" + backUrl + "';\"/></div>";
    txt += "               </div>";
    txt += "           </div>";
    //右侧 end 
    txt += "        </div>	";
    txt += "    </div>";
    txt += "</div>";
    $(".immeRegisterBtn").live("click", function () {
        window.location.href = "http://c.highpin.cn/users/register";
    });
    ShowSubLayerByText(txt, "apply-login", false);
}

//type 1-看好他
function NewLoginInnerHtml(type, jobid, operateId) {
    var backUrl = encodeURI(top.location.href);

    var txt = "";
    //txt += "<form action=\"/Users/Logon/\" id=\"registerform\" method=\"post\" methodtype = 2 onsubmit=\"return CheckLogon()\"> ";
    txt += "<div  id=\"apply-login\">";
    txt += "<input type=\"hidden\"   id=\"JobId\"  name=\"JobId\"  value=" + jobid + " />  <input type=\"hidden\"   id=\"TypeId\"  name=\"TypeId\"  value=" + type + " /> <input type=\"hidden\"   id=\"OperateId\"  name=\"OperateId\"  value=" + operateId + " />   ";
    txt += "	<div class=\"c-pop-login\">";
    txt += "    	<div class=\"pop-login-title\">";
    txt += "        	<h4 class=\"p-l-t\">个人会员登录</h4>";
    txt += "        	<div class=\"pop-l-close\"  onclick=\"CloseSubLayer();\"></div>";
    txt += "        </div>";
    txt += "        <div class=\"pop-login-con clearfix\">";
    txt += "        	<div class=\"p-l-cl\">";
    txt += "            <h5 class=\"login-tip\">已有智联账号可直接登录</h5>";
    txt += "           		<ul class=\"p-l-ul\">";
    txt += "                	<li><span class=\"p-l-lable\">登录邮箱</span><input type=\"text\" id=\"Logon_UserEmail\" class=\"p-l-i\" size=27 maxlength=100 onKeyUp=\"CheckKeyUp('UserEmail')\" style=\"color: rgb(187, 187, 187);\" onfocus=\"if(this.value=='手机注册用户可在此输入手机号') {this.value='';this.style.color='rgb(0,0,0)'}\" onblur=\"if(this.value=='') {this.value='手机注册用户可在此输入手机号';this.style.color='#bbbbbb'}\" value=\"手机注册用户可在此输入手机号\"/><p id=\"AlertLogon_UserEmail\"></p></li>";
    txt += "                    <li><span class=\"p-l-lable\">登录密码</span><input type=\"Password\" class=\"p-l-i\" id=\"Logon_Password\" size=\"27\" maxlength=\"25\" onKeyUp=\"CheckKeyUp('Password')\"/><p id=\"AlertLogon_Password\"></p></li>";
    txt += "                    <li><span class=\"p-l-lable\">验证码</span><input type=\"text\" id=\"Logon_PostCode\" onKeyUp=\"CheckKeyUp('Logon_PostCode')\" class=\"p-l-is\" size=\"4\" maxlength=\"4\"/><img src=\"/Users/GetValidatingCode?imgtype=2\" class=\"pop-check-img\" id=\"img_postcode_reg\"/><a href=\"#\" class=\"postlink\" onclick=\"RefreshImgUrl('img_postcode_reg')\">换一张</a><p id=\"AlertLogon_PostCode\"></p></li>";
    txt += "                    <li><input type=\"checkbox\"  class=\"login-pop-check\" id=\"Logon_RememberMe\"/>下次自动登录<a href=\"http://passport.zhaopin.com/findpassword/email/step1?bkurl=" + SeekerDomain + "\" title=\"忘记密码？\" class=\"pop-forget\" target=\"_blank\">忘记密码？</a></li>";
    txt += "                </ul> ";

    txt += "            <div class=\" new-btn-box\">";
    txt += "                <input class=\"p-login-btn pop-btn-marnew\" type=\"button\" onclick=\"SeekerApplyLogin('" + backUrl + "');\" value=\"登&nbsp;&nbsp;录\"/>";
    txt += "                     <span class=\"microblog-login\"><a style=\"color:#268CC1\" href=\"http://c.highpin.cn/users/oauth?type=sinaweibo&backUrl=" + backUrl + "\">用微博登录</a></span>";
    txt += "            </div>";

    txt += "            </div>";
    txt += "           ";
    txt += "                <div class=\"p-l-cr\">";
    txt += "               ";

    txt += "                    <p class=\"login-pop\">还没有卓聘账号？<a href=\"" + SeekerDomain + "/Users/Register?fromPage=" + backUrl + "&operateType=" + type + "&operateId=" + operateId + "\" target=\"_blank\" class=\"add-color\" title=\"马上注册\">马上注册<em class=\"pop-arrow\"></em></a></p>	";


    txt += "                ";
    txt += "                ";
    txt += "            </div>";
    txt += "        </div>	";
    txt += "    </div>";
    txt += "</div>";
    //txt += "</form>";


    ShowSubLayerByText(txt, "apply-login", false);

}

//草稿提示
function ApplyDraftSuggests(showText) {
    var resumeType = 1;

    $.ajax(
     {
         url: "/SearchJobs/GetDefaultResumeType/",
         type: "POST",
         async: false,
         dataType: "json",
         success: function (data) {
             resumeType = data;

         }
     });

    var txt = "";
    txt += "<div  id=\"ApplyDraftSuggests\" style=\"width:360px;\">";
    txt += "  <div class=\"layertitle wid-360\">";
    txt += "    <div class=\"layercorner_n_w\"></div>";
    txt += "    <div class=\"layertitle_c wid-342\"></div>";
    txt += "    <div class=\"layercorner_n_e\"></div>";
    txt += "  </div>";
    txt += "  <div class=\"layermain wid-360\">";
    txt += "    <div class=\"layerbody wid-340\">";
    txt += "      <div class=\"layerbody_title  wid-340\">";
    txt += "        <div class=\"layerbody_title_l\">提示信息</div>";
    txt += "        <!-- 关闭函数 弹出后其他按钮调用即可 CloseSubLayer();-->";
    txt += "        <div class=\"layerbody_title_r\"  onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "      </div>";
    txt += "      <div class=\" clearfix  wid-340 prompt-box\">";
    txt += "        <div class=\"prompt-con\"> <span>您简历中的" + showText + "项尚不完整,</span>";
    txt += "            <input type=\"button\" value=\"立即完善简历\" onclick=\"javascript:window.location.href='http://c.highpin.cn/PersonalCenter/Index?resumeType=" + resumeType + "'\" class=\"btn-green font12\"/>";
    txt += "        </div>";
    txt += "      </div>";
    txt += "    </div>";
    txt += "  </div>";
    txt += "  <div class=\"layertitle wid-360\">";
    txt += "    <div class=\"layercorner_s_w\"></div>";
    txt += "    <div class=\"layertitle_c wid-342\"></div>";
    txt += "    <div class=\"layercorner_s_e\"></div>";
    txt += "  </div>";
    txt += "</div>";

    ShowSubLayerByText(txt, "ApplyDraftSuggests", false);
}

//未审核提示
function ApplyNotAudit(showText) {
    var resumeType = 1;

    $.ajax(
     {
         url: "/SearchJobs/GetDefaultResumeType/",
         type: "POST",
         async: false,
         dataType: "json",
         success: function (data) {
             resumeType = data;

         }
     });

    var txt = "";
    txt += "<div  id=\"ApplyNotAudit\" style=\"width:360px;\">";
    txt += "  <div class=\"layertitle wid-360\">";
    txt += "    <div class=\"layercorner_n_w\"></div>";
    txt += "    <div class=\"layertitle_c wid-342\"></div>";
    txt += "    <div class=\"layercorner_n_e\"></div>";
    txt += "  </div>";
    txt += "  <div class=\"layermain wid-360\">";
    txt += "    <div class=\"layerbody wid-340\">";
    txt += "      <div class=\"layerbody_title  wid-340\">";
    txt += "        <div class=\"layerbody_title_l\">提示信息</div>";
    txt += "        <!-- 关闭函数 弹出后其他按钮调用即可 CloseSubLayer();-->";
    txt += "        <div class=\"layerbody_title_r\"  onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "      </div>";
    txt += "      <div class=\" clearfix  wid-340 prompt-box\">";
    txt += "        <div class=\"prompt-con\"> <span>" + showText + "，无法申请职位，建议您</span>";
    txt += "          <input type=\"button\" value=\"立即完善简历\" onclick=\"javascript:window.location.href='http://c.highpin.cn/PersonalCenter/Index?resumeType=1'\" class=\"btn-green font12\"/>";
    //txt += "          <br/>";
    //txt += "          <span>或进入智联招聘</span>";
    //txt += "          <input type=\"button\" value=\"搜索职位\" onclick=\"javascript:window.location.href='http://sou.zhaopin.com/'\" class=\"btn-or\"/>";
    txt += "        </div>";
    txt += "      </div>";
    txt += "    </div>";
    txt += "  </div>";
    txt += "  <div class=\"layertitle wid-360\">";
    txt += "    <div class=\"layercorner_s_w\"></div>";
    txt += "    <div class=\"layertitle_c wid-342\"></div>";
    txt += "    <div class=\"layercorner_s_e\"></div>";
    txt += "  </div>";
    txt += "</div>";

    ShowSubLayerByText(txt, "ApplyNotAudit", false);
}

//没有简历提示
function ApplyNotResume() {
    var txt = "";
    txt += "<div  id=\"ApplyNotResume\" style=\"width:360px;\">";
    txt += "  <div class=\"layertitle wid-360\">";
    txt += "    <div class=\"layercorner_n_w\"></div>";
    txt += "    <div class=\"layertitle_c wid-342\"></div>";
    txt += "    <div class=\"layercorner_n_e\"></div>";
    txt += "  </div>";
    txt += "  <div class=\"layermain wid-360\">";
    txt += "    <div class=\"layerbody wid-340\">";
    txt += "      <div class=\"layerbody_title  wid-340\">";
    txt += "        <div class=\"layerbody_title_l\">提示信息</div>";
    txt += "        <!-- 关闭函数 弹出后其他按钮调用即可 CloseSubLayer();-->";
    txt += "        <div class=\"layerbody_title_r\"  onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "      </div>";
    txt += "      <div class=\" clearfix  wid-340 prompt-box\">";
    txt += "        <div class=\"prompt-con\"> <span>您目前还没有简历，请填写简历后再申请职位 </span>  <br/>";
    txt += "          <input type=\"button\" value=\"立即创建简历\" onclick=\"javascript:window.location.href='http://c.highpin.cn/PersonalCenter/Index?resumeType=1'\" class=\"btn-green\"/>";
    txt += "        </div>";
    txt += "      </div>";
    txt += "    </div>";
    txt += "  </div>";
    txt += "  <div class=\"layertitle wid-360\">";
    txt += "    <div class=\"layercorner_s_w\"></div>";
    txt += "    <div class=\"layertitle_c wid-342\"></div>";
    txt += "    <div class=\"layercorner_s_e\"></div>";
    txt += "  </div>";
    txt += "</div>";

    ShowSubLayerByText(txt, "ApplyNotResume", false);
}

//提示信息投递
function ApplyByLastTime(seekerUserID, accountID, jobID, companyID, lasttime, type) {
    var txt = "";

    txt += "<div  id=\"ApplyByLastTime\" style=\"width:360px;\">";
    txt += "  <div class=\"layertitle wid-360\">";
    txt += "    <div class=\"layercorner_n_w\"></div>";
    txt += "    <div class=\"layertitle_c wid-342\"></div>";
    txt += "    <div class=\"layercorner_n_e\"></div>";
    txt += "  </div>";
    txt += "  <div class=\"layermain wid-360\">";
    txt += "    <div class=\"layerbody wid-340\">";
    txt += "      <div class=\"layerbody_title  wid-340\">";
    txt += "        <div class=\"layerbody_title_l\">提示信息</div>";
    txt += "        <!-- 关闭函数 弹出后其他按钮调用即可 CloseSubLayer();-->";
    txt += "        <div class=\"layerbody_title_r\"  onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</div>";
    txt += "      </div>";
    txt += "      <div class=\" clearfix  wid-340 prompt-box\">";
    txt += "        <div class=\"prompt-con\"> <span>您于" + lasttime + "申请过该职位，是否再次申请 ？</span>";
    txt += "        </div>";
    if (type == 1) {
        txt += "          <input id=\"sureApply\" type=\"button\" value=\"确定\" onclick=\"sureApply(" + seekerUserID + "," + accountID + "," + jobID + ");\"  class=\"layer-common-btn2\"/>";
    } else if (type == 2) {
        txt += "          <input id=\"sureApply\" type=\"button\" value=\"确定\" onclick=\"sureApply(" + seekerUserID + "," + accountID + "," + jobID + "," + companyID + ");\"  class=\"layer-common-btn2\"/>";
    }
    txt += "          <span id='process' style='display:none'>处理中...</span>";
    txt += "      </div>";
    txt += "    </div>";
    txt += "  </div>";
    txt += "  <div class=\"layertitle wid-360\">";
    txt += "    <div class=\"layercorner_s_w\"></div>";
    txt += "    <div class=\"layertitle_c wid-342\"></div>";
    txt += "    <div class=\"layercorner_s_e\"></div>";
    txt += "  </div>";
    txt += "</div>";

    ShowSubLayerByText(txt, "ApplyByLastTime", false);
}


//重复投递提示
function ApplyRepeatTo() {
    new HP.Popup({
        width: 500,
        title: '提示',
        innerHtml: '<div class="commonLayerContainer pos_r clearfix" id="downloaddiv">' +
                                  '<div class="acceptInvitationMain">' +
                                     ' <div class="tipTitleBox">' +
                                         ' <span>您已申请过该职位，3天内不可重复投递简历</span>' +
                                      '</div>' +
                                     ' <div class="acceptInvitationMainnew font0">' +
                                         '<span class="cApplyJob805"></span>' +
                                         '<span class="dp_b font12 lh_12 color666">扫一扫 下载APP</span>' +
                                         '<p class="actualTimeTip">实时跟进 求职进展</p>' +
                                      '</div>' +
                                 ' </div>' +
                              '</div>',
        //点击弹出框右上'关闭' 按钮之后的回调事件
        closeCallBack: function () {
            // closeEvent();
        }
    });

    //ShowSubLayerByText(txt, "ApplyRepeatTo", false);
}



//已邀请未回复提示
function InviteToNoReply(type, inviteUrl) {
    var inviteDes = type == 1 ? "推荐" : "邀请";
    var identityType = type == 1 ? "猎头" : "HR";
    new HP.Popup({
        width: 500,
        title: '提示',
        innerHtml: '<div class="commonLayerContainer pos_r clearfix" id="downloaddiv">' +
                       '<div class="acceptInvitationMain">' +
                          ' <div class="tipTitleBox">' +
                              '<span>该职位的' + identityType + '已经' + inviteDes + '过您，无需再投递。</span>' +
                              '<a href="' + inviteUrl + '" class="dp_b colorBlue0 font14 td_u cursor-p mt_26">点击查看详情 ></a>' +
                           '</div>' +
                          ' <div class="acceptInvitationMainnew font0">' +
                              '<span class="cApplyJob805"></span>' +
                              '<span class="dp_b font12 lh_12 color666">扫一扫 下载APP</span>' +
                              '<p class="actualTimeTip">实时跟进 求职进展</p>' +
                           '</div>' +
                      ' </div>' +
                   '</div>',
        //innerHtml: '<div><p class="needless_pop_txt fr">该职位的' + identityType + '已经主动' + inviteDes + '您，对您非常感兴趣，您无需再投递。</p><em class="front_ico h_48"></em></div>' +
        //        '<a href="' + inviteUrl + '" class="needlessApply_jobDetail_txt" >点击查看职位' + inviteDes + '详情 ></a>' +
        //        '<div class="quick_mark"></div>',
        //closeEvent是内部调用返回的关闭方法,可以直接用于关闭弹出框
        layerEvent: function (closeEvent) {
            document.getElementById('cancelBtn_layer').onclick = function () {
                closeEvent();
            };
        },
        //点击弹出框右上'关闭' 按钮之后的回调事件
        closeCallBack: function () {
        }
    });
}

//已邀请并接受提示
function InviteToAccept(type) {
    var identityType = type == 1 ? "猎头" : "HR";
    var inviteDes = type == 1 ? "推荐" : "邀请";
    var readCount = 0;
    var allCount = 100;
    var txt = "";
    txt += "<div class=\"pop-mode-box\"  id=\"InviteToAccept\">";
    txt += " <table><tr><td class=\"top-l\"></td><td class=\"top-c\">";
    txt += "  <div class=\"pop-title-box\">";
    txt += "<span class=\"new-pop-title\">提示</span>";
    txt += "<span class=\"pop-close\" onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</span>";
    txt += "</div></td><td class=\"top-r\"></td></tr>";
    txt += "<tr><td class=\"center-l\"></td>";
    txt += "<td><div class=\"padding30\">";
    txt += "<h1 class=\"con-title\">您已经接受过该职位的" + inviteDes + "</h1>	";
    txt += "<p style=\"font-size:16px;font-family: 'microsoft yahei';padding-left:40px;\">" + identityType + "对您非常感兴趣，无需再次投递。<br/>请留意" + identityType + "的下一步通知</p>";
    txt += "<p class=\"line22 mar-t10 pb_6\">向" + identityType + "说两句</p>";
    txt += "<textarea class=\"commonTxtarea  line22 width324 ht78\" style=\"color:rgb(129,129,129)\" maxlength=\"50\" name=\"RContent\" id=\"RContent\" onKeyUp=\"javascript:checkWord(this,1,50,0);\" onMouseDown=\"javascript:checkWord(this,1,50,0);\" placeholder=\"0-50字\"></textarea>";
    txt += "<p class=\"wordLimit line24\" id=\"inputword\"></p>";//您已经输入<span  id=\"wordInput\">0</span>字，还可以输入<span  id=\"wordCheck\">100</span>字
    //txt += " <p class=\"alert-red line24\" id=\"altRed\"></p>";
    txt += " <input type=\"button\" class=\"layer-common-btn2\" value=\"确定\" onclick=\"repinfo()\" /></div>";
    txt += "</td><td class=\"center-r\"></td></tr><tr><td class=\"bottom-l\"></td><td class=\"bottom-c\"></td><td class=\"bottom-r\"></td></tr></table></div>";
    ShowSubLayerByText(txt, "InviteToAccept", false);
}
//已邀请并接受提示  职位列表页
function InviteToAccept(type, referrerid, jobID) {
    var identityType = type == 1 ? "猎头" : "HR";
    var inviteDes = type == 1 ? "推荐" : "邀请";
    var readCount = 0;
    var allCount = 100;
    var txt = "";
    txt += "<div class=\"pop-mode-box\"  id=\"InviteToAccept\">";
    txt += " <table><tr><td class=\"top-l\"></td><td class=\"top-c\">";
    txt += "  <div class=\"pop-title-box\">";
    txt += "<span class=\"new-pop-title\">提示</span>";
    txt += "<span class=\"pop-close\" onclick=\"CloseSubLayer();\">[&nbsp;关闭&nbsp;]</span>";
    txt += "</div></td><td class=\"top-r\"></td></tr>";
    txt += "<tr><td class=\"center-l\"></td>";
    txt += "<td><div class=\"padding30\">";
    txt += "<h1 class=\"con-title\">您已经接受过该职位的" + inviteDes + "</h1>	";
    txt += "<p style=\"font-size:16px;font-family: 'microsoft yahei';padding-left:40px;\">" + identityType + "对您非常感兴趣，无需再次投递。<br/>请留意" + identityType + "的下一步通知</p>";
    txt += "<p class=\"line22 mar-t10 pb_6\">向" + identityType + "说两句</p>";
    txt += "<textarea class=\"commonTxtarea  line22 width324 ht78\" style=\"color:rgb(129,129,129)\" maxlength=\"50\" name=\"RContent\" id=\"RContent\" onKeyUp=\"javascript:checkWord(this,1,50,0);\" onMouseDown=\"javascript:checkWord(this,1,50,0);\" placeholder=\"0-50字\"></textarea>";
    txt += "<p class=\"wordLimit line24\" id=\"inputword\"></p>";//您已经输入<span  id=\"wordInput\">0</span>字，还可以输入<span  id=\"wordCheck\">100</span>字
    //txt += " <p class=\"alert-red line24\" id=\"altRed\"></p>";
    txt += " <input type=\"button\" class=\"layer-common-btn2\" value=\"确定\" onclick=\"repinfo()\" /></div>";
    txt += "</td><td class=\"center-r\"></td></tr><tr><td class=\"bottom-l\"></td><td class=\"bottom-c\"></td><td class=\"bottom-r\"></td></tr></table></div>";
    txt += " <input type=\"hidden\" id=\"ReferrerId\" value=\"" + referrerid + "\" />";
    txt += " <input type=\"hidden\" id=\"jobID\" value=\"" + jobID + "\" />";
    ShowSubLayerByText(txt, "InviteToAccept", false);
}

//关闭年份日期
function CloseYear(showID) {
    if (customerid == "") return;

    var obj = document.getElementById("year_" + showID);

    if (obj != undefined && obj != null) {

        obj.parentNode.removeChild(obj);

        obj = document.getElementById(gloabid);

        obj.parentNode.removeChild(obj);

        SetDocumentScrollbar(false);
    }
}

function CloseYearSpecial(showID) {
    if (customerid == "") return;

    var obj = document.getElementById("year_" + showID);

    if (obj != undefined && obj != null) {

        obj.parentNode.removeChild(obj);

        obj = document.getElementById(gloabid);

        obj.parentNode.removeChild(obj);

        SetDocumentScrollbar(false);

        //判断是否有月份的选择，判断是否需要清空月份选择的值
        //showID  div_workexperience_startdate_136712_year 
        var arrDate = showID.split("_"), monthInputId = "", monthShowId = "", yearInputId = "";
        arrDate[0] = "txt";
        yearInputId = arrDate.join("_");

        arrDate[4] = "month";
        monthInputId = arrDate.join("_");
        arrDate[0] = "div";
        monthShowId = arrDate.join("_");

        if ($("#" + monthInputId).length > 0 && $("#" + monthInputId).val()) {
            var curDate = new Date();
            if ($("#" + yearInputId).val() == curDate.getFullYear() && parseInt($("#" + monthInputId).val()) > (curDate.getMonth() + 1))
                ClearMonth(monthInputId, monthShowId, yearInputId, "");
        }
    }
}

//显示年份日期
function ShowYearBox(inputID, showID, yearMin, showTitle, defaultStartYear, defaultEndYear) {
    var html = GetShowYearTableHtml(inputID, showID, yearMin, null, showTitle, defaultStartYear, defaultEndYear);

    var callBackFunctionName = "CloseYear";

    var callBackFunctionParameter = "\"" + showID + "\"";

    var openLayerID = "year_" + showID; //year_div_workexperience_startdate_136712_year

    ShowBox(showID, html, openLayerID, callBackFunctionName, callBackFunctionParameter);
}

function ShowYearBox_special(inputID, showID, yearMin, showTitle, defaultStartYear, defaultEndYear) {
    var html = GetShowYearTableHtml_special(inputID, showID, yearMin, null, showTitle, defaultStartYear, defaultEndYear);

    var callBackFunctionName = "CloseYearSpecial";

    var callBackFunctionParameter = "\"" + showID + "\"";

    var openLayerID = "year_" + showID;

    ShowBox(showID, html, openLayerID, callBackFunctionName, callBackFunctionParameter);
}

//清除年份日期
function ClearYear(inputID, showID, yearMin, page, showTitle) {
    $("#" + inputID).val("");

    $("#" + showID).html("");

    CheckedYearRange(inputID, showID, yearMin, page, showTitle);
}


function CheckedYearRange(inputID, showID, yearMin, page, showTitle, defaultEndYear) {
    var txt = '';
    if (defaultEndYear) {
        txt = GetShowYearTableHtml(inputID, showID, yearMin, page, showTitle, '', defaultEndYear);

    } else {
        txt = GetShowYearTableHtml(inputID, showID, yearMin, page, showTitle);
    }

    var id = "year_" + showID;

    $("#" + id).html(txt);
}


function GetShowYearTableHtml(inputID, showID, yearMin, page, showTitle, defaultStartYear, defaultEndYear) {

    var array = CalMinYear(inputID, showID, yearMin, page, defaultStartYear, defaultEndYear);

    var minyear = array[0];

    var selectyear = array[1];

    var currentyear = array[2];


    page = array[3];

    var allpage = array[4];

    var txt = "";

    txt += "<div class='year-box'><iframe style=\"z-index:-1;position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border-style:none;\"></iframe>";
    txt += "<div class=\"date-title\">";

    if (page > 1) {
        if (inputID == 'txt_resumeinfo_birthday_year' || inputID == 'BirthDayYear') {
            txt += "<em class=\"date-img arrow-left date-img_empty_left\" onclick='CheckedYearRange(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page - 1).toString() + ",\"" + showTitle + "\",\"1997\")'></em>";
            currentyear = new Date().getFullYear() - 18;
            var yearRange = (currentyear - yearMin) + 1;
            //总页数
            if (yearRange % 12 == 0) {
                allpage = parseInt(yearRange / 12);
            }
            else {
                allpage = parseInt(yearRange / 12) + 1;
            }
        } else
            txt += "<em class=\"date-img arrow-left date-img_empty_left\" onclick='CheckedYearRange(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page - 1).toString() + ",\"" + showTitle + "\")'></em>";
    }
    else {
        txt += "<em class=\"date-img_empty_left\"></em>";
    }


    txt += "<b>请选择" + showTitle + "</b>";

    if (page < allpage) {
        if (inputID == 'txt_resumeinfo_birthday_year' || inputID == 'BirthDayYear') {
            txt += "<em class=\"date-img arrow-right date-img_empty_right\" onclick='CheckedYearRange(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page + 1).toString() + ",\"" + showTitle + "\",\"1997\")'></em>";
        } else {
            txt += "<em class=\"date-img arrow-right date-img_empty_right\" onclick='CheckedYearRange(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page + 1).toString() + ",\"" + showTitle + "\")'></em>";
        }
    }
    else {
        txt += "<em class=\"date-img_empty_right\"></em>";
    }



    txt += "</div>";
    txt += "<div id=\"inner_year_showID\"> ";

    txt += "<table cellpadding=\"0\" cellspacing=\"0\" class=\"date-table\">";

    txt += GetShowyearRowHtml(minyear, selectyear, currentyear, inputID, showID);

    txt += "<tr >";
    txt += "<td colspan=\"2\" class=\"clear con-td\"> <span class='hand' onclick='ClearYear(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page).toString() + ",\"" + showTitle + "\")'>[&nbsp;清空&nbsp;]&nbsp;&nbsp;</span></td>";
    txt += "<td colspan=\"2\" class=\"close\">&nbsp;&nbsp;<span class='hand' onclick='CloseYear(\"" + showID + "\")'>[&nbsp;关闭&nbsp;]</span></td>";
    txt += "</tr>";
    txt += "</table>";

    txt += "</div>";
    txt += "</div>";

    return txt;
}


function GetShowYearTableHtml_special(inputID, showID, yearMin, page, showTitle, defaultStartYear, defaultEndYear) {

    var array = CalMinYear(inputID, showID, yearMin, page, defaultStartYear, defaultEndYear);

    var minyear = array[0];

    var selectyear = array[1];

    var currentyear = array[2];


    page = array[3];

    var allpage = array[4];

    var txt = "";

    txt += "<div class='year-box'><iframe style=\"z-index:-1;position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border-style:none;\"></iframe>";
    txt += "<div class=\"date-title\">";

    if (page > 1) {
        if (inputID == 'txt_resumeinfo_birthday_year' || inputID == 'BirthDayYear') {
            txt += "<em class=\"date-img arrow-left date-img_empty_left\" onclick='CheckedYearRange(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page - 1).toString() + ",\"" + showTitle + "\",\"1997\")'></em>";
            currentyear = new Date().getFullYear() - 18;
            var yearRange = (currentyear - yearMin) + 1;
            //总页数
            if (yearRange % 12 == 0) {
                allpage = parseInt(yearRange / 12);
            }
            else {
                allpage = parseInt(yearRange / 12) + 1;
            }
        } else
            txt += "<em class=\"date-img arrow-left date-img_empty_left\" onclick='CheckedYearRange(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page - 1).toString() + ",\"" + showTitle + "\")'></em>";
    }
    else {
        txt += "<em class=\"date-img_empty_left\"></em>";
    }
    txt += "<b>请选择" + showTitle + "</b>";

    if (page < allpage) {
        if (inputID == 'txt_resumeinfo_birthday_year' || inputID == 'BirthDayYear') {
            txt += "<em class=\"date-img arrow-right date-img_empty_right\" onclick='CheckedYearRange(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page + 1).toString() + ",\"" + showTitle + "\",\"1997\")'></em>";
        } else {
            txt += "<em class=\"date-img arrow-right date-img_empty_right\" onclick='CheckedYearRange(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page + 1).toString() + ",\"" + showTitle + "\")'></em>";
        }
    }
    else {
        txt += "<em class=\"date-img_empty_right\"></em>";
    }
    txt += "</div>";
    txt += "<div id=\"inner_year_showID\"> ";

    txt += "<table cellpadding=\"0\" cellspacing=\"0\" class=\"date-table\">";

    txt += GetShowyearRowHtml_special(minyear, selectyear, currentyear, inputID, showID);

    txt += "<tr >";
    txt += "<td colspan=\"2\" class=\"clear con-td\"> <span class='hand' onclick='ClearYear(\"" + inputID + "\",\"" + showID + "\"," + yearMin.toString() + "," + (page).toString() + ",\"" + showTitle + "\")'>[&nbsp;清空&nbsp;]&nbsp;&nbsp;</span></td>";
    txt += "<td colspan=\"2\" class=\"close\">&nbsp;&nbsp;<span class='hand' onclick='CloseYear(\"" + showID + "\")'>[&nbsp;关闭&nbsp;]</span></td>";
    txt += "</tr>";
    txt += "</table>";

    txt += "</div>";
    txt += "</div>";

    return txt;
}

function CalMinYear(inputID, showID, yearMin, page, defaultStartYear, defaultEndYear) {
    var currentyear = '';
    if (defaultEndYear) {
        if (defaultEndYear.length == 4) {
            currentyear = defaultEndYear;
        } else {
            currentyear = parseInt(new Date().getFullYear()) - 18;
        }
    } else {
        currentyear = parseInt(new Date().getFullYear());
    }

    yearRange = (currentyear - yearMin) + 1;

    var allpage;

    var selectyear = null;

    //总页数
    if (yearRange % 12 == 0) {
        allpage = parseInt(yearRange / 12);
    }
    else {
        allpage = parseInt(yearRange / 12) + 1;
    }

    var yearRange;

    var inputValue = $.trim($("#" + inputID).val());

    if (inputValue != "") {
        selectyear = parseInt(inputValue);
    }

    if (page == undefined || page == null) {
        page = allpage;

        if (selectyear != null) {
            yearRange = (selectyear - yearMin) + 1;

            //总页数
            if (yearRange % 12 == 0) {
                page = parseInt(yearRange / 12);
            }
            else {
                page = parseInt(yearRange / 12) + 1;
            }

        }
        else if (defaultStartYear != undefined && defaultStartYear != null) {
            yearRange = (defaultStartYear - yearMin) + 1;

            //总页数
            if (yearRange % 12 == 0) {
                page = parseInt(yearRange / 12);
            }
            else {
                page = parseInt(yearRange / 12) + 1;
            }
        }
    }



    var minyear = yearMin + ((page - 1) * 12);

    var array = new Array();

    array.push(minyear);

    array.push(selectyear);

    array.push(currentyear);

    array.push(page);

    array.push(allpage);

    return array;
}


function HighPinSelectYear(year, inputID, showID) {
    $("#" + inputID).val(year.toString());

    $("#" + showID).html("<div class='date_show_inner_year'>" + year.toString() + "</div>");

    if (year > 0) {
        ResponseAlert(true, showID, "");
    }

    CloseYear(showID);
}
function HighPinSelectYear_special(year, inputID, showID) {
    $("#" + inputID).val(year.toString());

    $("#" + showID).html("<div class='date_show_inner_year'>" + year.toString() + "</div>");

    if (year > 0) {
        ResponseAlert(true, showID, "");
    }
    CloseYearSpecial(showID);
    //CloseYear(showID);
}


function GetShowyearRowHtml(minyear, selectyear, currentyear, inputID, showID) {
    var txt = "";

    for (var i = 0; i < 12; i++) {
        if (i % 4 == 0) {
            if (i == 0) {
                txt += "<tr>";
            }
            else {
                txt += "</tr>";
                txt += "<tr >";
            }
        }

        if ((minyear + i) <= currentyear) {
            if (selectyear != null) {
                if ((minyear + i) == selectyear) {
                    txt += "<td class=\"select-year con-td con-bor wid25\" onclick='HighPinSelectYear(" + (minyear + i).toString() + ",\"" + inputID + "\",\"" + showID + "\")'>" + (minyear + i).toString() + "年</td>";
                }
                else {
                    txt += "<td class=\"con-td con-bor wid25\" onclick='HighPinSelectYear(" + (minyear + i).toString() + ",\"" + inputID + "\",\"" + showID + "\")'>" + (minyear + i).toString() + "年</td>";
                }

            }
            else {
                txt += "<td class=\"con-td con-bor wid25\" onclick='HighPinSelectYear(" + (minyear + i).toString() + ",\"" + inputID + "\",\"" + showID + "\")'>" + (minyear + i).toString() + "年</td>";
            }

        }
        else {
            txt += "<td class=\"con-td con-bor wid25\">&nbsp;</td>";
        }

        if (i == 11) {
            txt += "</tr>";
        }
    }

    return txt;
}

function GetShowyearRowHtml_special(minyear, selectyear, currentyear, inputID, showID) {
    var txt = "";

    for (var i = 0; i < 12; i++) {
        if (i % 4 == 0) {
            if (i == 0) {
                txt += "<tr>";
            }
            else {
                txt += "</tr>";
                txt += "<tr >";
            }
        }
        if ((minyear + i) <= currentyear) {
            if (selectyear != null) {
                if ((minyear + i) == selectyear) {
                    txt += "<td class=\"select-year con-td con-bor wid25\" onclick='HighPinSelectYear_special(" + (minyear + i).toString() + ",\"" + inputID + "\",\"" + showID + "\")'>" + (minyear + i).toString() + "年</td>";
                }
                else {
                    txt += "<td class=\"con-td con-bor wid25\" onclick='HighPinSelectYear_special(" + (minyear + i).toString() + ",\"" + inputID + "\",\"" + showID + "\")'>" + (minyear + i).toString() + "年</td>";
                }
            }
            else {
                txt += "<td class=\"con-td con-bor wid25\" onclick='HighPinSelectYear_special(" + (minyear + i).toString() + ",\"" + inputID + "\",\"" + showID + "\")'>" + (minyear + i).toString() + "年</td>";
            }
        }
        else {
            txt += "<td class=\"con-td con-bor wid25\">&nbsp;</td>";
        }
        if (i == 11) {
            txt += "</tr>";
        }
    }
    return txt;
}

//弹出月份弹出框
function ShowMonthBox(inputID, showID, yearInputID, showTitle) {

    var html = GetShowMonthTableHtml(inputID, showID, yearInputID, showTitle);

    var callBackFunctionName = "CloseMonth";

    var callBackFunctionParameter = "\"" + showID + "\"";

    var openLayerID = "month_" + showID;


    ShowBox(showID, html, openLayerID, callBackFunctionName, callBackFunctionParameter);

}

//获取月份整体Html
function GetShowMonthTableHtml(inputID, showID, yearInputID, showTitle) {
    var txt = "";

    txt += "<div class='date-box'><iframe style=\"z-index:-1;position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border-style:none;\"></iframe>";
    txt += "<div class=\"date-title\">";
    txt += "请选择" + showTitle + "月份";
    txt += "</div>";
    txt += "<div>";
    txt += "<table cellpadding=\"0\" cellspacing=\"0\" class=\"date-table\">";

    txt += GetShowMonthRowHtml(inputID, showID, yearInputID);

    txt += "<tr >";
    txt += "<td colspan=\"2\" class=\"clear con-td\"> <span class='hand' onclick='ClearMonth(\"" + inputID + "\",\"" + showID + "\",\"" + yearInputID + "\",\"" + showTitle + "\")'>[&nbsp;清空&nbsp;]&nbsp;&nbsp;</span></td>";
    txt += "<td colspan=\"2\" class=\"close\">&nbsp;&nbsp;<span class='hand' onclick='CloseMonth(\"" + showID + "\")'>[&nbsp;关闭&nbsp;]</span></td>";
    txt += "</tr>";
    txt += "</table>";
    txt += "</div>";
    txt += "</div>";

    return txt;
}


//获取三行月份
function GetShowMonthRowHtml(inputID, showID, yearInputID) {
    var txt = "";

    //输入年
    var inputYear = $.trim($("#" + yearInputID).val());

    var currentyear = parseInt(new Date().getFullYear());

    //年输入框是否选择了今年
    var thisYear = false;

    if (inputYear != "" && currentyear.toString() == inputYear) {
        thisYear = true;
    }


    var maxMonth = null;

    //如果选择了今年，定义不能选择的月份
    if (thisYear) {
        maxMonth = parseInt(new Date().getMonth() + 1);
    }
    else {

        maxMonth = 12;
    }

    var currentMonth = null;

    if ($.trim($("#" + inputID).val()) != "") {
        currentMonth = parseInt($.trim($("#" + inputID).val()));

        if (currentMonth > maxMonth) {
            currentMonth = maxMonth;
        }

        $("#" + inputID).val(currentMonth.toString());

        $("#" + showID).html("<div class='date_show_inner_month'>" + currentMonth.toString() + "</div>");
    }


    for (var i = 0; i < 12; i++) {
        if (i % 4 == 0) {
            if (i == 0) {
                txt += "<tr>";
            }
            else {
                txt += "</tr>";
                txt += "<tr >";
            }
        }

        if ((i + 1) <= maxMonth) {
            if (currentMonth != null && (i + 1) == currentMonth) {
                txt += "<td class=\"select-year con-td con-bor wid25\"><span onclick='HighPinSelectMonth(" + (i + 1).toString() + ",\"" + inputID + "\",\"" + showID + "\")'>" + (i + 1).toString() + "月</span></td>";
            }
            else {
                txt += "<td class=\"con-td con-bor wid25\"><span onclick='HighPinSelectMonth(" + (i + 1).toString() + ",\"" + inputID + "\",\"" + showID + "\")'>" + (i + 1).toString() + "月</span></td>";
            }

        }
        else {
            txt += "<td class=\"con-td con-bor wid25\" style='background-color:#eeeeee;'>" + (i + 1).toString() + "月</td>";
        }

        if (i == 11) {
            txt += "</tr>";
        }
    }

    return txt;
}

//选择月份
function HighPinSelectMonth(month, inputID, showID) {
    $("#" + inputID).val(month.toString());


    $("#" + showID).html("<div class='date_show_inner_month'>" + month.toString() + "</div>");

    if (month > 0) {
        ResponseAlert(true, showID, "");
    }
    CloseMonth(showID);
}


//清除月份日期
function ClearMonth(inputID, showID, yearInputID, showTitle) {
    $("#" + inputID).val("");

    $("#" + showID).html("<div class='date_show_inner_month'>&nbsp;</div>");

    CheckedMonthRange(inputID, showID, yearInputID, showTitle);
}

//关闭月份
function CloseMonth(showID) {

    if (customerid == "") return;

    var obj = document.getElementById("month_" + showID);

    if (obj != undefined && obj != null) {

        obj.parentNode.removeChild(obj);


        obj = document.getElementById(gloabid);

        obj.parentNode.removeChild(obj);

        SetDocumentScrollbar(false);
    }

}


function CheckedMonthRange(inputID, showID, yearInputID, showTitle) {
    var txt = GetShowMonthTableHtml(inputID, showID, yearInputID, showTitle);

    var id = "month_" + showID;

    $("#" + id).html(txt);
}



//弹出层
//innerhtml 提示
//iscolsepage 1关闭页面,2刷新页面,3关闭页面
function CustomConfirmNew(innerHtml, isOkBtn, title, isClosePage, CloseBtnFun, MainBoxClass) {

    CustomLayerZindex();

    var txt = "";

    if (isOkBtn == undefined) {
        isOkBtn = 1;
    }
    if (isClosePage == undefined) {
        isClosePage = 1;
    }

    txt += "<div class=\"pop-mode-box\">";
    txt += "<table>";
    txt += "<!--弹出层标题-->";
    txt += "<tr>";
    txt += "	<td class=\"top-l\"></td>";
    txt += "   <td class=\"top-c\">";
    txt += "            <div class=\"pop-title-box\">";
    if (title == undefined) {
        txt += "                <span class=\"new-pop-title\">" + title + "</span>";
    } else {
        txt += "                <span class=\"new-pop-title\">" + title + "</span>";
    }
    if (isClosePage == 1) {
        var funName = "CloseSubLayer();";
        if (CloseBtnFun == undefined || CloseBtnFun == "") {
            funName = "CloseSubLayer();";
        } else {
            funName += CloseBtnFun;
        }
        txt += "                <span class=\"pop-close\" onclick=\"" + funName + "\">[&nbsp;关闭&nbsp;]</span>";
    } else {
        txt += "                <span class=\"pop-close\" ></span>";
    }
    txt += "            </div>";
    txt += "        </td>";
    txt += "        <td class=\"top-r\"></td>";
    txt += "    </tr>";
    txt += "   <!--弹出层内容-->";
    txt += "   <tr>";
    txt += "    	<td class=\"center-l\"></td><td class=\"center-c\">";

    txt += "        <!--添加内容-->";

    txt += innerHtml;


    if (isOkBtn == 1) {
        txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='ClosePage();' value=\"确定\"></div>";
    }
    else if (isOkBtn == 2) {
        txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='RefPage();' value=\"确定\"></div>";
    }
    else if (isOkBtn == 9) {
        var url = 0;
        //if (innerHtml != "评价候选人成功！") {
        //    url = 2;
        //}
        txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='RefCurrentPage(" + url + ");' value=\"确定\"></div>";
    }
    else if (isOkBtn == 10) {
        txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='RefPageUrl();' value=\"确定\"></div>";
    }
    else if (isOkBtn == 20) {
        txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='RedirectMainPage();' value=\"确定\"></div>";
    }
    else if (isOkBtn == 3) {

    }
    else if (isOkBtn == 11) {
        txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='GetDenyApplyPage();' value=\"确定\"></div>";
    }
    else if (isOkBtn.indexOf("5&") == 0) {
        var params = isOkBtn.substr(2, isOkBtn.length - 2);
        txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='ResumeExportDoc(" + params + ");' value=\"确定\"></div>";
    }
    else {
        txt += "<div class=\"customlayer_btn_div\"><input type='button' class='btn_confirm_submit' onclick='CloseSubLayer();' value=\"确定\"></div>";
    }

    txt += "              <!--添加内容-->";

    txt += "       </td>";
    txt += "        <td class=\"center-r\"></td>";
    txt += "   </tr>";
    txt += "    <!--弹出层底部-->";
    txt += "    <tr>";
    txt += "  		<td class=\"bottom-l\"></td>";
    txt += "        <td class=\"bottom-c\"></td>";
    txt += "       <td class=\"bottom-r\"></td>";
    txt += "    </tr>";
    txt += "</table>";
    txt += "</div>";

    if (MainBoxClass == undefined || MainBoxClass == "") {
        MainBoxClass = "custom_pop_layer";
    }

    ShowSubLayerByText(txt, MainBoxClass, false);
}

//刷新当前页面
function RefPageUrl() {
    CloseSubLayer();
    location.reload();
}

//简历不完整申请职位失败
function ApplyFailDlg(showText) {
    if (!showText) return;
    var textArray = showText.split('、');
    var firstText = '';
    var textHtml = '';
    $.each(textArray, function (i, item) {
        if (i == 0) {
            firstText = item;
        }
        if (i == textArray.length - 1) {
            textHtml += '<span class="mr_0">' + item + '</span>';
        } else {
            textHtml += '<span>' + item + '</span>';
        }
    });
    var resumeType = 1;
    $.ajax(
     {
         url: "/SearchJobs/GetDefaultResumeType/",
         type: "POST",
         async: false,
         dataType: "json",
         success: function (data) {
             resumeType = data;
         }
     });
    var rUrl = 'http://c.highpin.cn/PersonalCenter/Index?resumeType=' + resumeType;
    if (firstText == '职业意向' || firstText == 'Career Goal') {
        rUrl += '#an_jobintension';
    }
    if (firstText == '工作经验' || firstText == 'Work Experience') {
        rUrl += '#an_workexperience';
    }
    if (firstText == '教育背景' || firstText == 'Education') {
        rUrl += '#an_educationbackground';
    }
    new HP.Popup({
        width: 660,
        title: '卓聘提示',
        innerHtml: ''
            + '<p class="font14"><b>您的简历尚不完整</b>：请您填写以下必填项后申请职位</p>'
            + '<p class="layer_labelLists clearfix">'
            + textHtml
            + '</p>'
            + '<p class="txt-center">'
            + "<span class=\"hoverBtnBg\" onclick=\"window.location.href='" + rUrl + "';\">马上填写"
            + '</span>'
            + '</p>',
        layerEvent: function (closeEvent) {
            $("#closeBtn_layer").on("click", function () {
                closeEvent();
            });
        }
    });
}
function applyDlg(seekerUserID) {
    $.ajax({
        url: "/RecruiterJob/GetResumeStatus/",
        type: "POST",
        async: false,
        data: { "seekerUserID": seekerUserID },
        dataType: "json",
        success: function (data) {
            if (data) {
                ApplySuccDlg();
            } else {
                ApplySuccDigWithSetting();
            }
        },
        error: function () {
            ApplySuccDlg();
        }
    });
}

//简历状态为公开状态   职位申请弹出框
function ApplySuccDlg() {
    new HP.Popup({
        width: 500,
        title: '提示',
        innerHtml: '<div class="commonLayerContainer pos_r clearfix" id="downloaddiv">' +
                   '<div class="acceptInvitationMain">' +
                       ' <div class="tipTitleBox">' +
                           ' <p class="jobSuccessPstyle"><em></em>恭喜您，职位申请成功！</p>' +
                        '</div>' +
                       ' <div class="acceptInvitationMainnew font0">' +
                           '<span class="cApplyJob805"></span>' +
                           '<span class="dp_b font12 lh_12 color666">扫一扫 下载APP</span>' +
                           '<p class="actualTimeTip">实时跟进 求职进展</p>' +
                        '</div>' +
                   ' </div>' +
               '</div>',
        //innerHtml: '<div class="commonLayerContainer pos_r clearfix" id="downloaddiv">' +
        //        '<div class="quickMarkImg">' +
        //            '<span class="QuickMarkNews"></span>' +
        //            '<p>扫一扫下载客户端</p>' +
        //            '<p>应聘进展早知道</p>' +
        //        '</div>' +
        //        '<div class="jobSuccessMain">' +
        //            '<p class="jobSuccessPstyle">恭喜您，职位申请已成功！</p>' +
        //            '<span class="jobSuccessSpanBox">' +
        //                '<input type="checkbox" checked/><span>公开简历，让高薪工作主动找上门。</span>' +
        //           ' </span>' +
        //           ' <span class="jobSuccessBtns" id="jobSuccessBtns">确定</span>' +
        //        '</div>' +
        //    '</div>',
        //closeEvent是内部调用返回的关闭方法,可以直接用于关闭弹出框
        //layerEvent: function (closeEvent) {
        //    document.getElementById('jobSuccessBtns').onclick = function () {
        //        closeEvent();
        //    };
        //},
        ////点击弹出框右上'关闭' 按钮之后的回调事件
        //closeCallBack: function () {
        //}
    });
}
//简历状态为隐藏状态   职位申请弹出框
function ApplySuccDigWithSetting() {
    new HP.Popup({
        width: 500,
        title: '提示',
        innerHtml: '<div class="commonLayerContainer pos_r clearfix" id="downloaddiv">' +
            	    '<div class="quickMarkImg">' +
            		    '<span class="cApplyJob805"></span>' +
                        '<span class="dp_b font12 lh_12 color666">扫一扫 下载APP</span>' +
                        '<p class="actualTimeTip">实时跟进 求职进展</p>' +
            	    '</div>' +
            	    '<div class="jobSuccessMain">' +
            		    '<p class="jobSuccessPstyle"><em></em>恭喜您，职位申请成功！</p>' +
            		    '<span class="jobSuccessSpanBox">' +
            			    '<input type="checkbox"  checked="true" id="chkOpenResume"/><span>公开简历，让高薪工作主动找上门。</span>' +
            		   ' </span>' +
            		   ' <span class="jobSuccessBtns" id="jobSuccessBtns">确定</span>' +
            	    '</div>' +
                '</div>',
        //innerHtml: '<div class="commonLayerContainer pos_r clearfix" id="downloaddiv">' +
        //            '<div class="quickMarkImg">' +
        //                '<span class="QuickMarkNews"></span>' +
        //                '<p>扫一扫下载客户端</p>' +
        //                '<p>应聘进展早知道</p>' +
        //            '</div>' +
        //            '<div class="jobSuccessMain">' +
        //                '<p class="jobSuccessPstyle">恭喜您，职位申请已成功！</p>' +
        //                '<span class="jobSuccessSpanBox">' +
        //                    '<input type="checkbox" checked="true" id="chkOpenResume" style="margin-right: 4px;vertical-align: text-bottom;"/><span>公开简历，让高薪工作主动找上门。</span>' +
        //                    //'<input type="checkbox" checked/><span>公开简历，让高薪工作主动找上门。</span>' +
        //               ' </span>' +
        //               ' <span class="jobSuccessBtns" id="jobSuccessBtns">确定</span>' +
        //            '</div>' +
        //        '</div>',
        layerEvent: function (closeEvent) {
            $("#jobSuccessBtns").on("click", function () {
                //对复选框进行判断
                if ($("#chkOpenResume").attr("checked")) {
                    //后台修改简历的公开状态
                    $.ajax({
                        url: "/SearchJobs/EnableSeekerPrivateSetting",
                        type: "post",
                        dataType: "json",
                        success: function () {

                        }, error: function () {
                        }
                    })
                }
                closeEvent();
            });
        }
    });
}

function applyDlgRecommend(referrerType, seekerUserID, jobID) {
    $.ajax({
        url: "/RecruiterJob/GetResumeStatus/",
        type: "POST",
        async: false,
        data: { "seekerUserID": seekerUserID },
        dataType: "json",
        success: function (data) {
            if (data) {
                location.href = "http://j.highpin.cn/position/recommend/?jobId=" + jobID + "&referrerType=" + referrerType;
            } else {
                ApplySuccDigWithSetting();
            }
        },
        error: function () {
            location.href = "http://j.highpin.cn/position/recommend/?jobId=" + jobID + "&referrerType=" + referrerType;
        }
    });
}

//创建简历完成后APP下载的引导提示弹出框
function downAppQuickMark() {
    new HP.Popup({
        width: 380,
        title: '提示',
        innerHtml: '<div class="commonLayerContainer pos_r clearfix" id="downloaddiv">' +
                        '<div class="downLoadMain">' +
                            '<span class="HpQuickMark_text"></span>' +
                           ' <p>下载智联卓聘APP，<span>高薪</span>工作随时找</p>' +
                        '</div>' +
                   ' </div>',
        //点击弹出框右上'关闭' 按钮之后的回调事件
        closeCallBack: function () {
            $("#save_tipBox").css({ display: "block" });
            intervalid = setInterval("JumpToHighPinIndex()", 1000);
        }
    });
}

//创建简历完成后APP下载的引导提示弹出框
function downAppQRCode() {
    new HP.PopupLayer({
        width: 490,
        innerHtml: '<div class="HpQRCode_bg"><span class="btnCls"></span></div>',
        layerEvent: function (clsEvent) {
            $(".HpQRCode_bg .btnCls").on("click", function () {
                clsEvent();
                $("#save_tipBox").css({ display: "block" });
                intervalid = setInterval("JumpToHighPinIndex()", 1000);
            });
        }
    });
}

//根据积分获取等级
function GetCreditLevel(score) {

    if (score == 0)
    {
        return 0;
    }

    if (score <= 3) {
        return 1;
    }

    if (score >= 4 && score <= 7) {
        return 2;
    }

    if (score >= 8 && score <= 12) {
        return 3;
    }

    if (score >= 13 && score <= 18) {
        return 4;
    }

    if (score >= 19 && score <= 25) {
        return 5;
    }

    if (score >= 26 && score <= 35) {
        return 6;
    }

    if (score >= 36 && score <= 50) {
        return 7;
    }

    if (score >= 51 && score <= 70) {
        return 8;
    }

    if (score >= 71 && score <= 95) {
        return 9;
    }

    if (score >= 96 && score <= 130) {
        return 10;
    }

    if (score >= 131 && score <= 180) {
        return 11;
    }

    if (score >= 181 && score <= 250) {
        return 12;
    }

    if (score >= 251 && score <= 350) {
        return 13;
    }

    if (score >= 351 && score <= 500) {
        return 14;
    }

    if (score >= 501&&score<=800) {
        return 15;
    }
    
    if (score >= 801 && score <= 1500) {
        return 16;
    }
    if (score >= 1501 && score <= 3000) {
        return 17;
    }
    if (score >= 3001 && score <= 6000) {
        return 18;
    }
    if (score >= 6001 && score <= 12000) {
        return 19;
    }
    if (score >= 12001) {
        return 20;
    }
}


function SetCreditScore(creditShowID, score)
{

    var level = GetCreditLevel(score);

    var degree = 0;
    if (level <= 5)
    {
        degree = 0;
    }
    else if (level > 5 && level <= 10) {
        degree = 1;
    }
    else if (level > 10 && level <= 15) {
        degree = 2;
    } else {
        degree = 3;
    }

    var mod = 0;
     if (level > 0 && level % 5 == 0) {
         mod = 5;
     }
     else
     {
         mod = level % 5;
     }
    for (var i = 1; i <= 5; i++)
    {
        $("#" + creditShowID).removeClass("heart"+i.toString());
    }

    $("#" + creditShowID).removeClass("heart-img");
    $("#" + creditShowID).removeClass("diamond-img");
    $("#" + creditShowID).removeClass("crown-img");

    if (level == 0)
    {
        $("#" + creditShowID).text("-");
        return;
    }
    //highercrown-img highercrown1
    switch(degree)
    {
        case 0:
            $("#" + creditShowID).addClass("heart-img");
            break;
        case 1:
            $("#" + creditShowID).addClass("diamond-img");
            break;
        case 2:
            $("#" + creditShowID).addClass("crown-img");
            break;
        case 3:
            $("#" + creditShowID).addClass("highercrown-img");
            break;
    }

    switch (degree) {
        case 0:
            $("#" + creditShowID).addClass("heart" + mod.toString());
            break;
        case 1:
            $("#" + creditShowID).addClass("diamond" + mod.toString());
            break;
        case 2:
            $("#" + creditShowID).addClass("crown" + mod.toString());
            break;
        case 3:
            $("#" + creditShowID).addClass("highercrown" + mod.toString());
            break;
    }

    
}

function GetJobUrl(jobID, jobType)
{
    switch (jobType) {
        case 1:
            return "http://www.highpin.cn/job/h" + jobID + ".html";
        case 2:
            return "http://www.highpin.cn/job/b" + jobID + ".html";
        default:
            return "http://www.highpin.cn/job/h" + jobID + ".html";
    }
}

function GetEmergencyUrl(recommendId) {
    return "http://c.highpin.cn/Job/EmergencyJobChance/" + recommendId;
}

function GetHunterUrl(accountID)
{
    return "http://www.highpin.cn/hunter/" + accountID.toString() + ".html";
}

function GetReferrerUrl(referrerID, referrerType) {
    switch (referrerType){
        case 1:
            return "http://www.highpin.cn/hunter/" + referrerID + ".html";
        case 2:
            return "http://www.highpin.cn/company/" + referrerID + ".html";
        default:
            return "http://www.highpin.cn/hunter/" + referrerID + ".html";
    }
}
//输入框最大长度
var suggestionMaxLength = 1000;

//输入框最小长度
var suggestionMinLength = 10;

//上传文件的ID
var uploadFileID = 0;
var uploadFiles = "";
//上传文件格式限制提示语
var uploadValueText = "图片仅支持JPG、GIF、PNG格式，图片大小不得超过2M";

var currentUserType = 1;//用户类型默认为1即游客
var currentFileId = "";

//输入的意见内容
function GetSuggestionTextAreaInputHtml() {
    var onkeyupEventString = " onkeyup='if(this.value.length > " + suggestionMaxLength.toString() + ") this.value=this.value.substr(0," + suggestionMaxLength.toString() + ");ShowSuggestionInputLength()'";

    var txt = "";

    txt += "<div class=\"clearfix\">";
    txt += "<div class=\"feedbackone feedback-label\"><span class=\"word-red\">*</span>意见或建议：</div>";
    txt += "<div class=\"feedbackone feedback-area\">";

    txt += "<textarea class=\"evaluate-area\" name=\"suggestion_content\" id=\"suggestion_content\"" + onkeyupEventString + " onblur='Suggestion_Onblur()' onfocus=\"if(this.value=='请输入意见反馈内容，" + suggestionMinLength.toString() + "-" + suggestionMaxLength.toString() + "字') {this.value='';}this.style.color='rgb(129,129,129)';\">请输入意见反馈内容，" + suggestionMinLength.toString() + "-" + suggestionMaxLength.toString() + "字</textarea>";
    txt += "</div> ";
    txt += "</div>";

    return txt;
}

//输入意见内容时的字数自动刷新
function ShowSuggestionInputLength() {
    var obj = document.getElementById("suggestion_content");

    if (obj != undefined && obj != null) {
        var inputLength = obj.value.length;

        var caninputLength = parseInt(suggestionMaxLength - inputLength);
        if (inputLength > 10) {
            $("#Alertsuggestion_content").css("display", "none");
            $("#suggestionMess").css("display", "");
        }
        else {
            $("#suggestionMess").css("display", "");
        }
        $("#suggestion_already_input").html(inputLength.toString());

        $("#suggestion_can_input").html(caninputLength.toString());

    }


}

//意见反馈弹出层html
function GetSuggestionHtml() {
    var txt = "";
    var seeker = GetCurrentSeekerBasicInfo();
    var hunter = null;
    var recruiter = null;

    if (seeker == null) {
        hunter = GetCurrentHunterBasicInfo();

        if (hunter == null) {
            recruiter = GetCurrentRecruiter();
        }
    }

    txt += "<div id=\"evaluate_alert\" > ";
    txt += " <table>";
    txt += "           <!--弹出层标题-->";
    txt += "           <tr>";
    txt += "           <td class=\"top-l\"></td>";
    txt += "        <td class=\"top-c\">";
    txt += "         <div class=\"pop-title-box\">";
    txt += "            <span class=\"new-pop-title\">意见反馈</span>";
    txt += "               <span class=\"pop-close\" onclick=\"CloseSuggestion();\">[&nbsp;关闭&nbsp;]</span>";
    txt += "                </div>     ";
    txt += "                 </td>";
    txt += "                <td class=\"top-r\"></td>";
    txt += "       </tr>   ";

    txt += "       <!--弹出层内容-->  ";

    txt += "      <tr>  ";
    txt += "      <td class=\"center-l\"></td> ";
    txt += "       <td> ";
    txt += "                    <!--内容-->";

    txt += "<div class=\"feedback\" style=\"position:relative;\">";

    // 在线QQ客服 
    txt += "<div style=\"position: absolute;top: 65px;left: 537px;\" id=\"qq_service_layer\">";
    txt += "<script charset=\"utf-8\" type=\"text/javascript\" src=\"http://wpa.b.qq.com/cgi/wpa.php?key=XzgwMDAwNjc0NF8yMTYyODVfODAwMDA2NzQ0Xw\"><\/script>";
    txt += "</div>";

    txt += "<p class=\"feedback-alert\">您的使用体验和建议，将是卓聘全体员工努力的方向，任何想法、意见或建议，欢迎您通过以下方式反馈给我们，我们将竭尽所能为您提供优质的服务和更好的用户体验。</p> ";
    txt += "<p class=\"feedback-alert\">您也可以将意见或建议直接发送到卓聘客服邮箱：<a href=\"mailto:highpin-kf@zhaopin.com.cn\" style=\"color:rgb(40,70,140);font-family: Arial,SimSun;text-decoration:underline;\">highpin-kf@zhaopin.com.cn</a><span>或直接联系</span></p>    ";
    txt += "<div class=\"feedback-list clearfix\">";
    txt += "<div class=\"clearfix\">";
    txt += "<div class=\"feedbackone feedback-label\"><span class=\"word-red\">*</span>用户姓名：</div>";
    if (seeker != null) {
        var name = seeker.ShowName;

        if (name == null) {
            name = seeker.CurrentEmail;
        }

        txt += "<div class=\"feedbackone feedback-center\">" + name + "<input type='hidden' name='realname' id='realname' value='" + name + "'></div>";

    }
    else if (hunter != null) {
        txt += "<div class=\"feedbackone feedback-center\">" + hunter.Name + "<input type='hidden' name='realname' id='realname' value='" + hunter.Name + "'></div>";
    }

    txt += "</div>";
    txt += "<div class=\"clearfix\">";
    txt += "<div class=\"feedbackone feedback-label\">手机号码：</div>";
    if (seeker != null) {
        var mobile = seeker.Mobile;

        if (mobile == null) {
            mobile = "";
        }
        txt += "<div class=\"feedbackone feedback-center\"><input type=\"text\" maxlength='20'  id=\"Mobile\" name=\"Mobile\" class=\"feedback-input\" value=\"" + mobile + "\"  onblur='Mobile_Onblur()'/></div>";
    }
    else if (hunter != null) {
        txt += "<div class=\"feedbackone feedback-center\"><input type=\"text\" maxlength='20'  id=\"Mobile\" name=\"Mobile\" class=\"feedback-input\" value=\"" + hunter.HandPhoneNo + "\"  onblur='Mobile_Onblur()'/></div>";
    }

    txt += "<div class=\"feedbackone feedback-check\"><span id=\"AlertMobile\" class='word-red' style=\"color:#bbbbbb;\">如果是关于网站使用的问题，建议填写手机号码</span><input type='hidden' name='MobileQunlified' id='MobileQunlified'  value='true'></div>";
    txt += "</div>";
    txt += "<div class=\"clearfix\">";
    txt += "<div class=\"feedbackone feedback-label\"><span class=\"word-red\">*</span>联系邮箱：</div>";

    if (seeker != null) {

        txt += "<div class=\"feedbackone feedback-center\"><input type=\"text\" id=\"UserEmail\" name=\"UserEmail\" class=\"feedback-input\"  value=\"" + seeker.CurrentEmail + "\" onblur='UserEmail_Onblur()' maxlength='25'/></div>";
    }
    else if (hunter != null) {
        txt += "<div class=\"feedbackone feedback-center\"><input type=\"text\" id=\"UserEmail\" name=\"UserEmail\" class=\"feedback-input\"  value=\"" + hunter.FrequentlyEmail + "\" onblur='UserEmail_Onblur()' maxlength='25'/></div>";
    }
    else if (recruiter != null) {
        var email = "";
        if (recruiter.Email) {
            email = recruiter.Email;
        }
        else if (recruiter.AccountName) {
            email = recruiter.AccountName;
        }

        txt += "<div class=\"feedbackone feedback-center\"><input type=\"text\" id=\"UserEmail\" name=\"UserEmail\" class=\"feedback-input\"  value=\"" + email + "\" onblur='UserEmail_Onblur()' maxlength='25'/></div>";
    }

    txt += "<div class=\"feedbackone feedback-check\"><span id=\"AlertUserEmail\" class='word-red'></span><input type='hidden' name='UserEmailQunlified' id='UserEmailQunlified' value='true'></div>";
    txt += "</div>";

    txt += GetSuggestionTextAreaInputHtml();

    txt += "<p class=\"much feedback-mar\" id=\"suggestionAlertShowBar\"><input type='hidden' name='suggestion_contentQunlified' id='suggestion_contentQunlified'  value='true'><span class=\"word-red\" id=\"Alertsuggestion_content\" style=\"display:none\"></span></p>";
    txt += "<p class=\"much feedback-mar\" id=\"suggestionMess\">您已输入<span class=\"word-red\" id=\"suggestion_already_input\">0</span>个字，还可以输入<span class=\"word-red\"  id=\"suggestion_can_input\">1000</span>个字</p>";
    txt += "<div class=\"clearfix\" style=\"position:relative;\">";
    txt += "<div class=\"feedbackone feedback-label\">上传辅助说明图片：</div>";
    txt += "<div class=\"feedbackone feedback-file\" id=\"sugestionupload\">";
    txt += "<form action='/' enctype=\"multipart/form-data\" id=\"imageform\" method=\"post\"  name=\"imageform\">";
    txt += "<input type=\"text\" value=\"" + uploadValueText + "\" class=\"img-address\" id=\"add-status\" onchange=\"CleareUploadBlank()\"  disabled=\"disabled\"/>";
    txt += "<input type=\"file\" class=\"feedback-browse\" name=\"status-btn\"  id=\"status-btn\" size=\"1\" style=\"display:block;right:14px;\" onchange=\"TryUploadSuggestion($(this))\"/>";
    txt += "<a class=\"newBrowse\" id=\"status-btn-a\" onclick=\"$(this).prev().click();\"></a> ";
    txt += "</form>";
    txt += "</div>";
    txt += "<div id=\"uploadSuccessResult\" style=\"display:none;float:left;display:inline;margin-top:13px;position: relative;z-index: 2;\"></div>";

    txt += "<div id=\"uploadresult\" style=\"display:none;float: left;width: 100%;padding-left: 130px;margin-top: 3px;\"></div>";
    txt += "<form action='/' enctype=\"multipart/form-data\" id=\"multiaddimg\" method=\"post\"  name=\"multiaddimg\" style=\"position: absolute;top: 14px;left: -136px;z-index: 1;\"><div class=\"fileInputContainer\"><input id=\"fileInput\" name=\"fileInput\" class=\"fileInput\" type=\"file\" onchange=\"TryUploadSuggestion($(this))\" title=\"\" style=\"display:block;right:14px;\" /><a class=\"newBrowse\" style=\"width:0px;height:0px;\" id=\"status-btn-a\" onclick=\"$(this).prev().click();\"></a></div></form>";
    txt += "</div>";
    txt += " <div style=\"margin-left:130px;\">";
    txt += "<div class=\"fl\" style=\"padding-right:5px\">";
    txt += "<input id=\"PostCode\" type=\"text\" class=\"feedback-input\" value=\"验证码\" size=\"4\" maxlength=\"4\" style =\"color: #999999;width:60px;height:22px;margin:0px\" onblur = \"if(this.value == '') { this.style.color='#999999'; this.value='验证码';}\" onfocus = \"if(this.value == '验证码') {this.style.color='#333333'; this.value='';}\">";
    txt += "</div>";
    txt += "<a class=\"postimg\" style=\"cursor: pointer;\">";
    if (hunter != null) {
        txt += "<img id=\"img_postcode_sug\" class=\"CheckImg unselectctrl fl\" style=\"margin-left:0px;\" src=\"/home/GetValidatingCode?imgtype=15&time=" + (new Date()).getTime() + "\" />";
    } else {
        txt += "<img id=\"img_postcode_sug\" class=\"CheckImg unselectctrl fl\" style=\"margin-left:0px;\" src=\"/Users/GetValidatingCode?imgtype=15&time=" + (new Date()).getTime() + "\" />";
    }
    txt += "</a>";
    txt += "<a id=\"aChangeVcode\" style=\"cursor: pointer;margin-top:4px;margin-left:5px;color:#999999\" class=\"changeCheckImg fl\">换一换</a>&nbsp;<span style=\"margin-top:5px;display:inline-block\" class=\"word-red\" id=\"AlertPostCode\"></span>";
    txt += "</div>";
    txt += "<input type=\"button\" class=\"layer-common-btn2\" value=\"提交\" onclick='CheckAndSaveSuggestion()'/>";
    txt += "</div>";
    txt += "</div>";



    txt += "                   <!--内容--> ";


    txt += "                </td>";
    txt += "           <td class=\"center-r\"></td>";
    txt += "        </tr>";
    txt += "  <!--弹出层底部-->";
    txt += "        <tr>";
    txt += "                <td class=\"bottom-l\"></td>";
    txt += "                 <td class=\"bottom-c\"></td>";
    txt += "                <td class=\"bottom-r\"></td>";
    txt += "       </tr>";
    txt += " </table>";
    txt += " </div>";

    return txt;
}

//清除伪上传框
function CleareUploadBlank() {
    var thisValue = $("#add-status").val();

    if (thisValue == "") {
        $("#status-btn").val("");
    }
}

//上传
function TryUploadSuggestion(fileValue) {
    currentFileId = fileValue[0].id;

    var thisValue = fileValue.val();

    if (thisValue.length < 1) {
        return false;
    }
    // $("#add-status").val(thisValue);

    var chekckFileResult = CheckFileName();

    if (chekckFileResult == 0) {
        //if (uploadFileID != 0) {
        //    DeleteUploadFile();
        //}
        ShowUpload();
        if ($("#uploadSuccessResult").children().length <= 0) {
            SubmitSuggestion("imageform");
            //$("#status-btn").parent().html("<input type=\"file\" class=\"feedbackBrowses\"  id=\"status-btn\"  name=\"status-btn\" size=\"1\" onchange=\"TryUploadSuggestion($(this))\"/>");
        }
        else {
            SubmitSuggestion("multiaddimg");
            //$("#fileInput").parent().html("<input id=\"fileInput\" name=\"fileInput\" class=\"fileInput\" type=\"file\" onchange=\"TryUploadSuggestion($(this))\" title=\"\" />");
        }
    }
    else {

        ShowUploadResult(chekckFileResult.toString());
    }

}

//客户端检查文件名称
function CheckFileName() {
    return CheckPhotoName(currentFileId);
}

//弹出意见建议框
function ShowSuggestion(userType) {
    currentUserType = userType;
    var txt = GetSuggestionHtml();

    ShowSubLayerByText(txt, "wid-760", false);
    //$("#fileInput").bind("change",(TryUploadSuggestion($(this))));

    /*引用QQ在线客服的js*/
    $("#qq_service_layer").append('<script charset="utf-8" type="text/javascript" src="http://wpa.b.qq.com/cgi/wpa.php?key=XzgwMDAwNjc0NF8yMTYyODVfODAwMDA2NzQ0Xw"></script>');

}

//上传加载时
function ShowUpload() {
    $("#sugestionupload").css("display", "none");
    $("#uploadresult").css("display", "");
    $("#uploadresult").html("<img src='https://image1.highpin.cn/image/shared/logo/indicator.gif'>正在上传,请稍后");
}


//删除临时文件
function DeleteUploadFile(currentDel, delElement) {
    if (!currentDel) return;
    DeleteFileBYEncryptID(currentDel, 2);
    delElement.parent().remove();
    uploadFiles = uploadFiles.replace(currentDel, "").replace(",,", ",");
    if ($("#uploadSuccessResult").children().length > 0) {
        $(".fileInputContainer").show();
    }
    else {
        //$("#add-status").val(uploadValueText);
        $("#sugestionupload").css("display", "");
        $("#uploadresult").css("display", "none");
        $("#uploadSuccessResult").css("display", "none");
        $(".fileInputContainer").hide();
        $("#status-btn").parent().html("<input disabled=\"disabled\" class=\"img-address\" id=\"add-status\" onchange=\"CleareUploadBlank()\" type=\"text\" value=\"图片仅支持JPG、GIF、PNG格式，图片大小不得超过2M\"><input name=\"status-btn\" class=\"feedback-browse1\" id=\"status-btn\" onchange=\"TryUploadSuggestion($(this))\" type=\"file\" size=\"1\" style=\"display:block;right:14px;\"><a class=\"newBrowse\" id=\"status-btn-a\" onclick=\"$(this).prev().click();\"></a>");
    }
}

//显示上传文件结果
function ShowUploadResult(result) {
    var reg = /^(?:<pre[^>]*>)?(-?[a-zA-Z\d]+)(?:<\/pre>)?$/i;
    result = result.replace(reg, "$1");

    if (result.indexOf("-") == 0) {
        if ($("#uploadSuccessResult").children().length <= 0) {
            $("#sugestionupload").css("display", "");
        }
        var resultText = GetUploadResult(parseInt(result));

        $("#uploadresult").css("display", "");

        $("#uploadresult").addClass("word-red");

        $("#uploadresult").html(resultText);
    }
    else {

        uploadFileID = result;
        uploadFiles += uploadFileID + ",";
        var file = GetUploadFileBYEncryptID(uploadFileID, 2);

        $("#uploadresult").removeClass("word-red");

        if (file != null) {
            $("#uploadresult").html("");
            var fileName = (file.OriginalFileName.length < 25 ? file.OriginalFileName : (file.OriginalFileName.substring(0, 25) + "..."));
            var fileInfo = "<div><a href='" + file.HttpPath + "' target='_blank'>" + fileName + "</a>&nbsp;&nbsp;<a class=\"pointer\" onclick=\"DeleteUploadFile('" + result + "',$(this))\">删除</a></div>";
            $("#uploadSuccessResult").append(fileInfo);

            if ($("#uploadSuccessResult").children().length >= 3) {
                $(".fileInputContainer").hide();
            }
            else {
                $(".fileInputContainer").show();
            }
            $("#uploadSuccessResult").css("display", "");
            $("#fileInput").parent().html("<input id=\"fileInput\" name=\"fileInput\" class=\"fileInput\" type=\"file\" onchange=\"TryUploadSuggestion($(this))\" title=\"\" />");
        }
    }
}

function realname_Onblur() {
    var realname = $.trim($("#realname").val());

    if (realname == "") {
        $("#Alertrealname").html("<font color='#ce0919'>请输入您的真实姓名</font>");
        $("#realnameQunlified").val("false");
        return;
    }

    $("#Alertrealname").html("");
    $("#realnameQunlified").val("true");
}

function UserEmail_Onblur() {
    var useremail = $.trim($("#UserEmail").val());

    if (useremail == "") {
        $("#AlertUserEmail").html("<font color='#ce0919'>请输入联系邮箱</font>");
        $("#UserEmailQunlified").val("false");
        return;
    }

    if (!valid_email(useremail)) {
        $("#AlertUserEmail").html("<font color='#ce0919'>您输入的联系邮箱格式不正确</font>");
        $("#UserEmailQunlified").val("false");
        return;
    }
    else {
        $("#AlertUserEmail").html("");
        $("#UserEmailQunlified").val("true");
    }
}

function Mobile_Onblur() {
    var mobile = $.trim($("#Mobile").val());

    if (mobile == "") {
        $("#AlertMobile").html("如果是关于网站使用的问题，建议填写手机号码");
        $("#MobileQunlified").val("true");
        return;
    }

    var result = valid_mobile(mobile);

    if (!result) {
        $("#AlertMobile").html("<font color='#ce0919'>您输入的手机号码格式不正确</font>");
        $("#MobileQunlified").val("false");
        return;
    }
    else {
        $("#AlertMobile").html("如果是关于网站使用的问题，建议填写手机号码");
        $("#MobileQunlified").val("true");
    }
}
function PostCode_Onblur() {
    var postCode = $("#PostCode").val().trim();
    if (postCode == "" || postCode == "验证码") {
        $("#AlertPostCode").html("<font color='#ce0919'>请输入验证码</font>");
        return false;
    } else {
        $("#AlertPostCode").html("");
        return true;
    }
}

function ClearInputAlert() {
    var alertText = "请输入意见反馈内容，" + suggestionMinLength.toString() + "-" + suggestionMaxLength.toString() + "字";

    if ($.trim($("#suggestion_content").val()) == alertText) {
        $("#suggestion_content").val("");
    }
}

function SetInputAlert() {
    var alertText = "请输入意见反馈内容，" + suggestionMinLength.toString() + "-" + suggestionMaxLength.toString() + "字";

    if ($.trim($("#suggestion_content").val()) == "") {
        $("#suggestion_content").val(alertText);
    }
}


function Suggestion_Onblur() {
    ClearInputAlert();

    var suggestion = $.trim($("#suggestion_content").val());

    $("#suggestionAlertShowBar").css("display", "none");

    if (suggestion == "") {
        $("#Alertsuggestion_content").css("display", "");
        $("#suggestion_contentQunlified").val("false");
        $("#Alertsuggestion_content").html("<font color='#ce0919'>您输入的意见反馈少于" + suggestionMinLength.toString() + "字，请继续补充</font>");
        $("#suggestionMess").css("display", "none");
    }


    if (suggestion.length < suggestionMinLength) {
        $("#Alertsuggestion_content").css("display", "");
        $("#Alertsuggestion_content").html("<font color='#ce0919'>您输入的意见反馈少于" + suggestionMinLength.toString() + "字，请继续补充</font>");
        $("#suggestion_contentQunlified").val("false");
        $("#suggestionMess").css("display", "none");
    }
    else {
        $("#Alertsuggestion_content").css("display", "none");
        $("#suggestion_contentQunlified").val("true");
        $("#suggestionMess").css("display", "");
    }

    if ($("#suggestion_contentQunlified").val() == "false") {
        $("#suggestionAlertShowBar").css("display", "");
    }

    SetInputAlert();
}

function CloseSuggestion() {
    if (uploadFiles !== "") {
        var filses = uploadFiles.split(',');
        for (var i = 0; i < filses.length; i++) {
            if ($.trim(filses[i]) !== "") {
                DeleteFileBYEncryptID(filses[i], 2);
            }
        }
    }
    uploadFiles = "";
    CloseSubLayer();
}

function CheckAndSaveSuggestion() {
    var index = $("#uploadresult").html();

    //alert(index);
    if (index != null && index != "") {
        return;
    }

    UserEmail_Onblur();

    Mobile_Onblur();

    Suggestion_Onblur();

    var vaildPostCode = PostCode_Onblur();
    if ($("#UserEmailQunlified").val() == "true" && $("#MobileQunlified").val() == "true" && $("#suggestion_contentQunlified").val() == "true" && vaildPostCode) {
        var realname = $("#realname").val();
        var email = $.trim($("#UserEmail").val());
        var mobile = $.trim($("#Mobile").val());
        var suggestion = $.trim($("#suggestion_content").val());
        var postCode = $.trim($("#PostCode").val());
        //uploadFileID
        //AddSuugestion(realname, email, mobile, suggestion, uploadFileID, currentUserType);
        var result = AddSuugestion(realname, email, mobile, suggestion, uploadFiles, currentUserType, postCode);
        if (result.Value) {
            uploadFiles = "";
            //alert("您的意见反馈已提交成功");
            //CustomConfirm("您的意见反馈已提交成功", 0, "提示信息");
            new HP.Popup({
                width: 380,
                title: '提示信息',
                innerHtml: '<p class="font16 txt-center yahei" style="margin-top:15px;line-height:14px;">您的意见反馈已提交成功</p>' +
                          '<p class="txt-center font16" style="margin-top:50px;"><span class="layer-common-newBtn" id="submitBtn_layer"><em class="wid_80">确定</em></span></p>',
                //closeEvent是内部调用返回的关闭方法,可以直接用于关闭弹出框
                layerEvent: function (closeEvent) {
                    //尽量采用 事件绑定的方式添加事件处理程序 (原生js或jquery方式都行)
                    document.getElementById('submitBtn_layer').onclick = function () {
                        closeEvent();
                    };
                    //document.getElementById('cancelBtn_layer').onclick = function () {
                    //    closeEvent();
                    //};
                },
                //点击弹出框右上'关闭' 按钮之后的回调事件
                closeCallBack: function () {
                }
            });
            CloseSubLayer();
        } else {
            FlushPostCode();
            //CustomConfirm(result.Memo, 1, "提示信息");
            new HP.Popup({
                width: 380,
                title: '提示信息',
                innerHtml: '<p class="font16 txt-center yahei" style="margin-top:15px;line-height:14px;">' + result.Memo + '</p>' +
                          '<p class="txt-center font16" style="margin-top:50px;"><span class="layer-common-newBtn" id="submitBtn_layer"><em class="wid_80">确定</em></span></p>',
                //closeEvent是内部调用返回的关闭方法,可以直接用于关闭弹出框
                layerEvent: function (closeEvent) {
                    //尽量采用 事件绑定的方式添加事件处理程序 (原生js或jquery方式都行)
                    document.getElementById('submitBtn_layer').onclick = function () {
                        closeEvent();
                    };
                    //document.getElementById('cancelBtn_layer').onclick = function () {
                    //    closeEvent();
                    //};
                },
                //点击弹出框右上'关闭' 按钮之后的回调事件
                closeCallBack: function () {
                }
            });
        }

    }

}
$(function () {
    $(document).on('click', '#img_postcode_sug,#aChangeVcode', function () {
        FlushPostCode();
    })
    $(document).on('blur', '#PostCode', function () {
        PostCode_Onblur();
    })
})
function FlushPostCode() {
    var url = "/Users/GetValidatingCode?imgtype=15&time=" + (new Date()).getTime();
    var hunter = GetCurrentHunterBasicInfo();
    if (hunter != null) {
        url = "/home/GetValidatingCode?imgtype=15&time=" + (new Date()).getTime();
    }
    $("#img_postcode_sug").attr("src", url);
}
function CustomCheckAndSaveSuggestion() {
    realname_Onblur();

    UserEmail_Onblur();

    Mobile_Onblur();

    Suggestion_Onblur();

    var vaildPostCode = PostCode_Onblur();

    if ($("#realnameQunlified").val() == "true" && $("#UserEmailQunlified").val() == "true" && $("#MobileQunlified").val() == "true" && $("#suggestion_contentQunlified").val() == "true" && vaildPostCode) {
        var realname = $("#realname").val();
        var email = $.trim($("#UserEmail").val());
        var mobile = $.trim($("#Mobile").val());
        var suggestion = $.trim($("#suggestion_content").val());
        var postCode = $.trim($("#PostCode").val());
        if (postCode == "验证码") postCode = "";

        //AddSuugestion(realname, email, mobile, suggestion, uploadFileID, currentUserType);
        var result = AddSuugestion(realname, email, mobile, suggestion, uploadFiles, currentUserType, postCode);
        if (result.Value) {
            uploadFiles = "";
            uploadFileID = 0;
            new HP.Popup({
                width: 380,
                title: '提示信息',
                innerHtml: '<p class="font16 txt-center yahei" style="margin-top:15px;line-height:14px;">您的意见反馈已提交成功</p>' +
                          '<p class="txt-center font16" style="margin-top:50px;"><span class="layer-common-newBtn" id="submitBtn_layer"><em class="wid_80">确定</em></span></p>',
                //closeEvent是内部调用返回的关闭方法,可以直接用于关闭弹出框
                layerEvent: function (closeEvent) {
                    //尽量采用 事件绑定的方式添加事件处理程序 (原生js或jquery方式都行)
                    document.getElementById('submitBtn_layer').onclick = function () {
                        closeEvent();
                    };
                    //document.getElementById('cancelBtn_layer').onclick = function () {
                    //    closeEvent();
                    //};
                },
                //点击弹出框右上'关闭' 按钮之后的回调事件
                closeCallBack: function () {
                }
            });
            //CustomConfirm("您的意见反馈已提交成功", 1, "提示信息");
        } else {
            new HP.Popup({
                width: 380,
                title: '提示信息',
                innerHtml: '<p class="font16 txt-center yahei" style="margin-top:15px;line-height:14px;">' + result.Memo + '</p>' +
                          '<p class="txt-center font16" style="margin-top:50px;"><span class="layer-common-newBtn" id="submitBtn_layer"><em class="wid_80">确定</em></span></p>',
                //closeEvent是内部调用返回的关闭方法,可以直接用于关闭弹出框
                layerEvent: function (closeEvent) {
                    //尽量采用 事件绑定的方式添加事件处理程序 (原生js或jquery方式都行)
                    document.getElementById('submitBtn_layer').onclick = function () {
                        closeEvent();
                    };
                    //document.getElementById('cancelBtn_layer').onclick = function () {
                    //    closeEvent();
                    //};
                },
                //点击弹出框右上'关闭' 按钮之后的回调事件
                closeCallBack: function () {
                }
            });
        }
        FlushPostCode();

        //alert("您的意见反馈已提交成功");

        //CustomConfirm("您的意见反馈已提交成功", 1, "提示信息");
        //CloseSubLayer();
        //window.opener = null;   
        //window.open('', '_top');
        //window.top.close();

    }
}


function GetMessageCount() {
    //var messageCount = 0;

    $.ajax({
        url: "/Message/GetMessageCount/",
        type: "POST",
        //async: false,
        dataType: "json",
        success: ShowSeekerMessage
    });

    //return messageCount;
}

function ShowSeekerMessage(count) {
    var cell = document.getElementById("messagealert");

    if (cell == null) {
        //var count = GetMessageCount();

        if (count > 0) {
            var obj = document.getElementById("seeker_title_6");

            var left = 0;

            var top = 0;

            if (obj != null) {
                var location = GetAbsoluteLocation(obj);

                left = location.absoluteLeft + parseInt(location.offsetWidth - 5);

                top = location.absoluteTop - 5;

                var newbox = document.createElement("span");

                newbox.id = "messagealert";

                newbox.className = "messagecell";

                newbox.innerHTML = count.toString();

                document.body.appendChild(newbox);

                newbox.style.top = top.toString() + "px";

                newbox.style.left = left.toString() + "px";
            }
        }

    }
    else {
        //var count = GetMessageCount();
        if (count > 0) {
            $("#messagealert").css("display", "block");
            $("#messagealert").html(count.toString());
        }
        else {
            $("#messagealert").css("display", "none");
        }
    }

}

$(function () {
    GetMessageCount();
});
$(function(){
    $("#new-navigation li").on('click', function () {
        $(this).addClass("navigation-active").siblings().removeClass("navigation-active");
    });
	
	var $mynav_li =$(".mynav li"),
	    $sub_li = $(".sub-nav li");
	if ($mynav_li.length > 0) {
	    $mynav_li.on('click', function () {
	        $(this).addClass("mynav-click").siblings().removeClass("mynav-click");
	    }).hover(function () {
	        $(this).addClass("mynav-click").siblings().removeClass("mynav-click");
	        $(this).children(".sub-nav").show();
	    }, function () {
	        $(this).children(".sub-nav").hide();
	    });
	}
	
	if ($sub_li.length > 0) {
	    $sub_li.on('mouseover', function () {
	        $(this).addClass("sub-bg").siblings().removeClass("sub-bg");
	    });
	}
});


	