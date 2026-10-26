/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "node_modules/core-js/internals/try-to-string.html");
var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};

/***/ }),

/***/ "./node_modules/core-js/internals/a-possible-prototype.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/a-possible-prototype.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var $String = String;
var $TypeError = TypeError;
module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};

/***/ }),

/***/ "./node_modules/core-js/internals/add-to-unscopables.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/add-to-unscopables.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var create = __webpack_require__(/*! ../internals/object-create */ "node_modules/core-js/internals/object-create.html");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html").f);
var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};

/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-non-extensible.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-non-extensible.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
module.exports = fails(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', {
      value: 8
    });
  }
});

/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "node_modules/core-js/internals/to-absolute-index.html");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "node_modules/core-js/internals/length-of-array-like.html");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};
module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

/***/ }),

/***/ "./node_modules/core-js/internals/array-iteration.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "node_modules/core-js/internals/function-bind-context.html");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "node_modules/core-js/internals/indexed-object.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "node_modules/core-js/internals/length-of-array-like.html");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "node_modules/core-js/internals/array-species-create.html");
var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (; length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3:
            return true;
          // some
          case 5:
            return value;
          // find
          case 6:
            return index;
          // findIndex
          case 2:
            push(target, value);
          // filter
        } else switch (TYPE) {
          case 4:
            return false;
          // every
          case 7:
            push(target, value);
          // filterReject
        }
      }
    }

    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};
module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};

/***/ }),

/***/ "./node_modules/core-js/internals/array-slice-simple.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice-simple.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "node_modules/core-js/internals/to-absolute-index.html");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "node_modules/core-js/internals/length-of-array-like.html");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "node_modules/core-js/internals/create-property.html");
var $Array = Array;
var max = Math.max;
module.exports = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = $Array(max(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};

/***/ }),

/***/ "./node_modules/core-js/internals/array-slice.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
module.exports = uncurryThis([].slice);

/***/ }),

/***/ "./node_modules/core-js/internals/array-species-constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-constructor.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ../internals/is-array */ "node_modules/core-js/internals/is-array.html");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "node_modules/core-js/internals/is-constructor.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }
  return C === undefined ? $Array : C;
};

/***/ }),

/***/ "./node_modules/core-js/internals/array-species-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-create.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "node_modules/core-js/internals/array-species-constructor.html");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);
module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "node_modules/core-js/internals/to-string-tag-support.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "node_modules/core-js/internals/classof-raw.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) {/* empty */}
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
  // builtinTag case
  : CORRECT_ARGUMENTS ? classofRaw(O)
  // ES3 arguments fallback
  : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "node_modules/core-js/internals/own-keys.html");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "node_modules/core-js/internals/object-get-own-property-descriptor.html");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html");
module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
module.exports = !fails(function () {
  function F() {/* empty */}
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

/***/ }),

/***/ "./node_modules/core-js/internals/create-iter-result-object.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-iter-result-object.js ***!
  \*********************************************************************/
/***/ (function(module) {

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return {
    value: value,
    done: done
  };
};

/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "node_modules/core-js/internals/create-property-descriptor.html");
module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),

/***/ "./node_modules/core-js/internals/create-property.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/create-property.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "node_modules/core-js/internals/to-property-key.html");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "node_modules/core-js/internals/create-property-descriptor.html");
module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
};

/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html");
var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "node_modules/core-js/internals/make-built-in.html");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "node_modules/core-js/internals/define-global-property.html");
module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];else if (O[key]) simple = true;
    } catch (error) {/* empty */}
    if (simple) O[key] = value;else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  }
  return O;
};

/***/ }),

/***/ "./node_modules/core-js/internals/define-global-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/define-global-property.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
module.exports = function (key, value) {
  try {
    defineProperty(global, key, {
      value: value,
      configurable: true,
      writable: true
    });
  } catch (error) {
    global[key] = value;
  }
  return value;
};

/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, {
    get: function () {
      return 7;
    }
  })[1] != 7;
});

/***/ }),

/***/ "./node_modules/core-js/internals/document-all.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/document-all.js ***!
  \********************************************************/
/***/ (function(module) {

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;
module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};

/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

/***/ }),

/***/ "./node_modules/core-js/internals/dom-iterables.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/dom-iterables.js ***!
  \*********************************************************/
/***/ (function(module) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

/***/ }),

/***/ "./node_modules/core-js/internals/dom-token-list-prototype.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/dom-token-list-prototype.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "node_modules/core-js/internals/document-create-element.html");
var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;
module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "node_modules/core-js/internals/get-built-in.html");
module.exports = getBuiltIn('navigator', 'userAgent') || '';

/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "node_modules/core-js/internals/engine-user-agent.html");
var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}
module.exports = version;

/***/ }),

/***/ "./node_modules/core-js/internals/engine-webkit-version.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-webkit-version.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "node_modules/core-js/internals/engine-user-agent.html");
var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);
module.exports = !!webkit && +webkit[1];

/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ (function(module) {

// IE8- don't enum bug keys
module.exports = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "node_modules/core-js/internals/object-get-own-property-descriptor.html").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "node_modules/core-js/internals/create-non-enumerable-property.html");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "node_modules/core-js/internals/define-built-in.html");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "node_modules/core-js/internals/define-global-property.html");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "node_modules/core-js/internals/copy-constructor-properties.html");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "node_modules/core-js/internals/is-forced.html");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || targetProperty && targetProperty.sham) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/freezing.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/freezing.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});

/***/ }),

/***/ "./node_modules/core-js/internals/function-apply.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/function-apply.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "node_modules/core-js/internals/function-bind-native.html");
var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});

/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-context.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-context.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "node_modules/core-js/internals/function-uncurry-this-clause.html");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "node_modules/core-js/internals/a-callable.html");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "node_modules/core-js/internals/function-bind-native.html");
var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function /* ...args */
  () {
    return fn.apply(that, arguments);
  };
};

/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = function () {/* empty */}.bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "node_modules/core-js/internals/function-bind-native.html");
var call = Function.prototype.call;
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && function something() {/* empty */}.name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable);
module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this-clause.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-clause.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "node_modules/core-js/internals/classof-raw.html");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};

/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "node_modules/core-js/internals/function-bind-native.html");
var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};

/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};
module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator-method.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-method.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof */ "node_modules/core-js/internals/classof.html");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "node_modules/core-js/internals/get-method.html");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "node_modules/core-js/internals/is-null-or-undefined.html");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "node_modules/core-js/internals/iterators.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var ITERATOR = wellKnownSymbol('iterator');
module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR) || getMethod(it, '@@iterator') || Iterators[classof(it)];
};

/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "node_modules/core-js/internals/a-callable.html");
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "node_modules/core-js/internals/try-to-string.html");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "node_modules/core-js/internals/get-iterator-method.html");
var $TypeError = TypeError;
module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw $TypeError(tryToString(argument) + ' is not iterable');
};

/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "node_modules/core-js/internals/a-callable.html");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "node_modules/core-js/internals/is-null-or-undefined.html");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};

/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
// eslint-disable-next-line es/no-global-this -- safe
check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) ||
// eslint-disable-next-line no-restricted-globals -- safe
check(typeof self == 'object' && self) || check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
// eslint-disable-next-line no-new-func -- fallback
function () {
  return this;
}() || Function('return this')();

/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ (function(module) {

module.exports = {};

/***/ }),

/***/ "./node_modules/core-js/internals/html.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "node_modules/core-js/internals/get-built-in.html");
module.exports = getBuiltIn('document', 'documentElement');

/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "node_modules/core-js/internals/document-create-element.html");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () {
      return 7;
    }
  }).a != 7;
});

/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "node_modules/core-js/internals/classof-raw.html");
var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;

/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var store = __webpack_require__(/*! ../internals/shared-store */ "node_modules/core-js/internals/shared-store.html");
var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}
module.exports = store.inspectSource;

/***/ }),

/***/ "./node_modules/core-js/internals/internal-metadata.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/internal-metadata.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "node_modules/core-js/internals/hidden-keys.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html").f);
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "node_modules/core-js/internals/object-get-own-property-names.html");
var getOwnPropertyNamesExternalModule = __webpack_require__(/*! ../internals/object-get-own-property-names-external */ "node_modules/core-js/internals/object-get-own-property-names-external.html");
var isExtensible = __webpack_require__(/*! ../internals/object-is-extensible */ "node_modules/core-js/internals/object-is-extensible.html");
var uid = __webpack_require__(/*! ../internals/uid */ "node_modules/core-js/internals/uid.html");
var FREEZING = __webpack_require__(/*! ../internals/freezing */ "node_modules/core-js/internals/freezing.html");
var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;
var setMetadata = function (it) {
  defineProperty(it, METADATA, {
    value: {
      objectID: 'O' + id++,
      // object ID
      weakData: {} // weak collections IDs
    }
  });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
    // return object ID
  }
  return it[METADATA].objectID;
};
var getWeakData = function (it, create) {
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
    // return the store of weak collections IDs
  }
  return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
  return it;
};
var enable = function () {
  meta.enable = function () {/* empty */};
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = uncurryThis([].splice);
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      }
      return result;
    };
    $({
      target: 'Object',
      stat: true,
      forced: true
    }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};
var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};
hiddenKeys[METADATA] = true;

/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "node_modules/core-js/internals/weak-map-basic-detection.html");
var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "node_modules/core-js/internals/create-non-enumerable-property.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var shared = __webpack_require__(/*! ../internals/shared-store */ "node_modules/core-js/internals/shared-store.html");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "node_modules/core-js/internals/shared-key.html");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "node_modules/core-js/internals/hidden-keys.html");
var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;
var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};
var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    }
    return state;
  };
};
if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}
module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-array-iterator-method.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/is-array-iterator-method.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "node_modules/core-js/internals/iterators.html");
var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-array.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof-raw */ "node_modules/core-js/internals/classof-raw.html");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $documentAll = __webpack_require__(/*! ../internals/document-all */ "node_modules/core-js/internals/document-all.html");
var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-constructor.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/is-constructor.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var classof = __webpack_require__(/*! ../internals/classof */ "node_modules/core-js/internals/classof.html");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "node_modules/core-js/internals/get-built-in.html");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "node_modules/core-js/internals/inspect-source.html");
var noop = function () {/* empty */};
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);
var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};
var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction':
      return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};
isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
    called = true;
  }) || called;
}) ? isConstructorLegacy : isConstructorModern;

/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var replacement = /#|\.prototype\./;
var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true : value == NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
};
var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};
var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
module.exports = isForced;

/***/ }),

/***/ "./node_modules/core-js/internals/is-null-or-undefined.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-null-or-undefined.js ***!
  \****************************************************************/
/***/ (function(module) {

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var $documentAll = __webpack_require__(/*! ../internals/document-all */ "node_modules/core-js/internals/document-all.html");
var documentAll = $documentAll.all;
module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ (function(module) {

module.exports = false;

/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "node_modules/core-js/internals/get-built-in.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "node_modules/core-js/internals/object-is-prototype-of.html");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "node_modules/core-js/internals/use-symbol-as-uid.html");
var $Object = Object;
module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};

/***/ }),

/***/ "./node_modules/core-js/internals/iterate.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/iterate.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "node_modules/core-js/internals/function-bind-context.html");
var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "node_modules/core-js/internals/try-to-string.html");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "node_modules/core-js/internals/is-array-iterator-method.html");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "node_modules/core-js/internals/length-of-array-like.html");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "node_modules/core-js/internals/object-is-prototype-of.html");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "node_modules/core-js/internals/get-iterator.html");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "node_modules/core-js/internals/get-iterator-method.html");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "node_modules/core-js/internals/iterator-close.html");
var $TypeError = TypeError;
var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};
var ResultPrototype = Result.prototype;
module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;
  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };
  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    }
    return INTERRUPTED ? fn(value, stop) : fn(value);
  };
  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      }
      return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }
  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  }
  return new Result(false);
};

/***/ }),

/***/ "./node_modules/core-js/internals/iterator-close.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-close.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "node_modules/core-js/internals/get-method.html");
module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

/***/ }),

/***/ "./node_modules/core-js/internals/iterator-create-constructor.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-create-constructor.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "node_modules/core-js/internals/iterators-core.html").IteratorPrototype);
var create = __webpack_require__(/*! ../internals/object-create */ "node_modules/core-js/internals/object-create.html");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "node_modules/core-js/internals/create-property-descriptor.html");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "node_modules/core-js/internals/set-to-string-tag.html");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "node_modules/core-js/internals/iterators.html");
var returnThis = function () {
  return this;
};
module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, {
    next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next)
  });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

/***/ }),

/***/ "./node_modules/core-js/internals/iterator-define.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-define.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "node_modules/core-js/internals/is-pure.html");
var FunctionName = __webpack_require__(/*! ../internals/function-name */ "node_modules/core-js/internals/function-name.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "node_modules/core-js/internals/iterator-create-constructor.html");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "node_modules/core-js/internals/object-get-prototype-of.html");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "node_modules/core-js/internals/object-set-prototype-of.html");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "node_modules/core-js/internals/set-to-string-tag.html");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "node_modules/core-js/internals/create-non-enumerable-property.html");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "node_modules/core-js/internals/define-built-in.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "node_modules/core-js/internals/iterators.html");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "node_modules/core-js/internals/iterators-core.html");
var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';
var returnThis = function () {
  return this;
};
module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);
  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS:
        return function keys() {
          return new IteratorConstructor(this, KIND);
        };
      case VALUES:
        return function values() {
          return new IteratorConstructor(this, KIND);
        };
      case ENTRIES:
        return function entries() {
          return new IteratorConstructor(this, KIND);
        };
    }
    return function () {
      return new IteratorConstructor(this);
    };
  };
  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() {
        return call(nativeIterator, this);
      };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({
      target: NAME,
      proto: true,
      forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
    }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, {
      name: DEFAULT
    });
  }
  Iterators[NAME] = defaultIterator;
  return methods;
};

/***/ }),

/***/ "./node_modules/core-js/internals/iterators-core.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterators-core.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var create = __webpack_require__(/*! ../internals/object-create */ "node_modules/core-js/internals/object-create.html");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "node_modules/core-js/internals/object-get-prototype-of.html");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "node_modules/core-js/internals/define-built-in.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "node_modules/core-js/internals/is-pure.html");
var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}
var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});
if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}
module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

/***/ }),

/***/ "./node_modules/core-js/internals/iterators.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/iterators.js ***!
  \*****************************************************/
/***/ (function(module) {

module.exports = {};

/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(/*! ../internals/to-length */ "node_modules/core-js/internals/to-length.html");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

/***/ }),

/***/ "./node_modules/core-js/internals/make-built-in.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/make-built-in.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "node_modules/core-js/internals/function-name.html").CONFIGURABLE);
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "node_modules/core-js/internals/inspect-source.html");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "node_modules/core-js/internals/internal-state.html");
var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () {/* empty */}, 'length', {
    value: 8
  }).length !== 8;
});
var TEMPLATE = String(String).split('String');
var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
    if (DESCRIPTORS) defineProperty(value, 'name', {
      value: name,
      configurable: true
    });else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', {
      value: options.arity
    });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', {
        writable: false
      });
      // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) {/* empty */}
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  }
  return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');

/***/ }),

/***/ "./node_modules/core-js/internals/math-trunc.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-trunc.js ***!
  \******************************************************/
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-assign.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-assign.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "node_modules/core-js/internals/object-keys.html");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "node_modules/core-js/internals/object-get-own-property-symbols.html");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "node_modules/core-js/internals/object-property-is-enumerable.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "node_modules/core-js/internals/indexed-object.html");

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({
    b: 1
  }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), {
    b: 2
  })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) {
    B[chr] = chr;
  });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  }
  return T;
} : $assign;

/***/ }),

/***/ "./node_modules/core-js/internals/object-create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "node_modules/core-js/internals/object-define-properties.html");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "node_modules/core-js/internals/enum-bug-keys.html");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "node_modules/core-js/internals/hidden-keys.html");
var html = __webpack_require__(/*! ../internals/html */ "node_modules/core-js/internals/html.html");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "node_modules/core-js/internals/document-create-element.html");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "node_modules/core-js/internals/shared-key.html");
var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');
var EmptyConstructor = function () {/* empty */};
var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) {/* ignore */}
  NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
  : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};
hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-define-properties.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "node_modules/core-js/internals/v8-prototype-define-bug.html");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html");
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "node_modules/core-js/internals/object-keys.html");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "node_modules/core-js/internals/ie8-dom-define.html");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "node_modules/core-js/internals/v8-prototype-define-bug.html");
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "node_modules/core-js/internals/to-property-key.html");
var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  }
  return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "node_modules/core-js/internals/object-property-is-enumerable.html");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "node_modules/core-js/internals/create-property-descriptor.html");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "node_modules/core-js/internals/to-property-key.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "node_modules/core-js/internals/ie8-dom-define.html");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) {/* empty */}
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names-external.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names-external.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-object-getownpropertynames -- safe */
var classof = __webpack_require__(/*! ../internals/classof-raw */ "node_modules/core-js/internals/classof-raw.html");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var $getOwnPropertyNames = (__webpack_require__(/*! ../internals/object-get-own-property-names */ "node_modules/core-js/internals/object-get-own-property-names.html").f);
var arraySlice = __webpack_require__(/*! ../internals/array-slice-simple */ "node_modules/core-js/internals/array-slice-simple.html");
var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) == 'Window' ? getWindowNames(it) : $getOwnPropertyNames(toIndexedObject(it));
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "node_modules/core-js/internals/object-keys-internal.html");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "node_modules/core-js/internals/enum-bug-keys.html");
var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "node_modules/core-js/internals/shared-key.html");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "node_modules/core-js/internals/correct-prototype-getter.html");
var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  }
  return object instanceof $Object ? ObjectPrototype : null;
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-is-extensible.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-extensible.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "node_modules/core-js/internals/classof-raw.html");
var ARRAY_BUFFER_NON_EXTENSIBLE = __webpack_require__(/*! ../internals/array-buffer-non-extensible */ "node_modules/core-js/internals/array-buffer-non-extensible.html");

// eslint-disable-next-line es/no-object-isextensible -- safe
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails(function () {
  $isExtensible(1);
});

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
module.exports = FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE ? function isExtensible(it) {
  if (!isObject(it)) return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;

/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
module.exports = uncurryThis({}.isPrototypeOf);

/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "node_modules/core-js/internals/array-includes.html").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "node_modules/core-js/internals/hidden-keys.html");
var push = uncurryThis([].push);
module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "node_modules/core-js/internals/object-keys-internal.html");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "node_modules/core-js/internals/enum-bug-keys.html");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({
  1: 2
}, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

/***/ }),

/***/ "./node_modules/core-js/internals/object-prototype-accessors-forced.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-prototype-accessors-forced.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "node_modules/core-js/internals/is-pure.html");
var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var WEBKIT = __webpack_require__(/*! ../internals/engine-webkit-version */ "node_modules/core-js/internals/engine-webkit-version.html");

// Forced replacement object prototype accessors methods
module.exports = IS_PURE || !fails(function () {
  // This feature detection crashes old WebKit
  // https://github.com/zloirock/core-js/issues/232
  if (WEBKIT && WEBKIT < 535) return;
  var key = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call, es/no-legacy-object-prototype-accessor-methods -- required for testing
  __defineSetter__.call(null, key, function () {/* empty */});
  delete global[key];
});

/***/ }),

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "node_modules/core-js/internals/a-possible-prototype.html");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) {/* empty */}
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
    return O;
  };
}() : undefined);

/***/ }),

/***/ "./node_modules/core-js/internals/object-to-array.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/object-to-array.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "node_modules/core-js/internals/object-keys.html");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var $propertyIsEnumerable = (__webpack_require__(/*! ../internals/object-property-is-enumerable */ "node_modules/core-js/internals/object-property-is-enumerable.html").f);
var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
var push = uncurryThis([].push);

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable(O, key)) {
        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};
module.exports = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod(false)
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-to-string.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/object-to-string.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "node_modules/core-js/internals/to-string-tag-support.html");
var classof = __webpack_require__(/*! ../internals/classof */ "node_modules/core-js/internals/classof.html");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};

/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "node_modules/core-js/internals/get-built-in.html");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "node_modules/core-js/internals/object-get-own-property-names.html");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "node_modules/core-js/internals/object-get-own-property-symbols.html");
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

/***/ }),

/***/ "./node_modules/core-js/internals/path.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/path.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
module.exports = global;

/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "node_modules/core-js/internals/is-null-or-undefined.html");
var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};

/***/ }),

/***/ "./node_modules/core-js/internals/set-to-string-tag.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/set-to-string-tag.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html").f);
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, {
      configurable: true,
      value: TAG
    });
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(/*! ../internals/shared */ "node_modules/core-js/internals/shared.html");
var uid = __webpack_require__(/*! ../internals/uid */ "node_modules/core-js/internals/uid.html");
var keys = shared('keys');
module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "node_modules/core-js/internals/define-global-property.html");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});
module.exports = store;

/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "node_modules/core-js/internals/is-pure.html");
var store = __webpack_require__(/*! ../internals/shared-store */ "node_modules/core-js/internals/shared-store.html");
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.26.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.26.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

/***/ }),

/***/ "./node_modules/core-js/internals/symbol-constructor-detection.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-constructor-detection.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "node_modules/core-js/internals/engine-v8-version.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
  // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
  !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/***/ }),

/***/ "./node_modules/core-js/internals/symbol-define-to-primitive.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-define-to-primitive.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "node_modules/core-js/internals/get-built-in.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "node_modules/core-js/internals/define-built-in.html");
module.exports = function () {
  var Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call(valueOf, this);
    }, {
      arity: 1
    });
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/symbol-registry-detection.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-registry-detection.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "node_modules/core-js/internals/symbol-constructor-detection.html");

/* eslint-disable es/no-symbol -- safe */
module.exports = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;

/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "node_modules/core-js/internals/to-integer-or-infinity.html");
var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "node_modules/core-js/internals/indexed-object.html");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "node_modules/core-js/internals/require-object-coercible.html");
module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "node_modules/core-js/internals/math-trunc.html");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "node_modules/core-js/internals/to-integer-or-infinity.html");
var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "node_modules/core-js/internals/require-object-coercible.html");
var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "node_modules/core-js/internals/is-symbol.html");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "node_modules/core-js/internals/get-method.html");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "node_modules/core-js/internals/ordinary-to-primitive.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "node_modules/core-js/internals/to-primitive.html");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "node_modules/core-js/internals/is-symbol.html");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
test[TO_STRING_TAG] = 'z';
module.exports = String(test) === '[object z]';

/***/ }),

/***/ "./node_modules/core-js/internals/to-string.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-string.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof */ "node_modules/core-js/internals/classof.html");
var $String = String;
module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};

/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ (function(module) {

var $String = String;
module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);
module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "node_modules/core-js/internals/symbol-constructor-detection.html");
module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == 'symbol';

/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () {/* empty */}, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

/***/ }),

/***/ "./node_modules/core-js/internals/weak-map-basic-detection.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-map-basic-detection.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var WeakMap = global.WeakMap;
module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));

/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol-define.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol-define.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var path = __webpack_require__(/*! ../internals/path */ "node_modules/core-js/internals/path.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var wrappedWellKnownSymbolModule = __webpack_require__(/*! ../internals/well-known-symbol-wrapped */ "node_modules/core-js/internals/well-known-symbol-wrapped.html");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html").f);
module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol-wrapped.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol-wrapped.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
exports.f = wellKnownSymbol;

/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var shared = __webpack_require__(/*! ../internals/shared */ "node_modules/core-js/internals/shared.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var uid = __webpack_require__(/*! ../internals/uid */ "node_modules/core-js/internals/uid.html");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "node_modules/core-js/internals/symbol-constructor-detection.html");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "node_modules/core-js/internals/use-symbol-as-uid.html");
var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;
module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  }
  return WellKnownSymbolsStore[name];
};

/***/ }),

/***/ "./node_modules/core-js/modules/es.array.iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.iterator.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "node_modules/core-js/internals/add-to-unscopables.html");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "node_modules/core-js/internals/iterators.html");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "node_modules/core-js/internals/internal-state.html");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html").f);
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "node_modules/core-js/internals/iterator-define.html");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "node_modules/core-js/internals/create-iter-result-object.html");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "node_modules/core-js/internals/is-pure.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated),
    // target
    index: 0,
    // next index
    kind: kind // kind
  });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return createIterResultObject(undefined, true);
  }
  if (kind == 'keys') return createIterResultObject(index, false);
  if (kind == 'values') return createIterResultObject(target[index], false);
  return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', {
    value: 'values'
  });
} catch (error) {/* empty */}

/***/ }),

/***/ "./node_modules/core-js/modules/es.json.stringify.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.json.stringify.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "node_modules/core-js/internals/get-built-in.html");
var apply = __webpack_require__(/*! ../internals/function-apply */ "node_modules/core-js/internals/function-apply.html");
var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isArray = __webpack_require__(/*! ../internals/is-array */ "node_modules/core-js/internals/is-array.html");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "node_modules/core-js/internals/is-callable.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "node_modules/core-js/internals/is-symbol.html");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "node_modules/core-js/internals/array-slice.html");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "node_modules/core-js/internals/symbol-constructor-detection.html");
var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);
var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;
var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
  // WebKit converts symbol values to JSON as null
  || $stringify({
    a: symbol
  }) != '{}'
  // V8 throws on boxed symbols
  || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"' || $stringify('\uDEAD') !== '"\\udead"';
});
var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = replacer;
  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
  if (!isArray(replacer)) replacer = function (key, value) {
    if (isCallable($replacer)) value = call($replacer, this, key, value);
    if (!isSymbol(value)) return value;
  };
  args[1] = replacer;
  return apply($stringify, null, args);
};
var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if (exec(low, match) && !exec(hi, next) || exec(hi, match) && !exec(low, prev)) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  }
  return match;
};
if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({
    target: 'JSON',
    stat: true,
    arity: 3,
    forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE
  }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}

/***/ }),

/***/ "./node_modules/core-js/modules/es.json.to-string-tag.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.json.to-string-tag.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "node_modules/core-js/internals/set-to-string-tag.html");

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);

/***/ }),

/***/ "./node_modules/core-js/modules/es.math.to-string-tag.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.math.to-string-tag.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "node_modules/core-js/internals/set-to-string-tag.html");

// Math[@@toStringTag] property
// https://tc39.es/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.assign.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.assign.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var assign = __webpack_require__(/*! ../internals/object-assign */ "node_modules/core-js/internals/object-assign.html");

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({
  target: 'Object',
  stat: true,
  arity: 2,
  forced: Object.assign !== assign
}, {
  assign: assign
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.define-getter.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.define-getter.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var FORCED = __webpack_require__(/*! ../internals/object-prototype-accessors-forced */ "node_modules/core-js/internals/object-prototype-accessors-forced.html");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "node_modules/core-js/internals/a-callable.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html");

// `Object.prototype.__defineGetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
if (DESCRIPTORS) {
  $({
    target: 'Object',
    proto: true,
    forced: FORCED
  }, {
    __defineGetter__: function __defineGetter__(P, getter) {
      definePropertyModule.f(toObject(this), P, {
        get: aCallable(getter),
        enumerable: true,
        configurable: true
      });
    }
  });
}

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.define-properties.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.define-properties.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var defineProperties = (__webpack_require__(/*! ../internals/object-define-properties */ "node_modules/core-js/internals/object-define-properties.html").f);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
$({
  target: 'Object',
  stat: true,
  forced: Object.defineProperties !== defineProperties,
  sham: !DESCRIPTORS
}, {
  defineProperties: defineProperties
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.define-property.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.define-property.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html").f);

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
// eslint-disable-next-line es/no-object-defineproperty -- safe
$({
  target: 'Object',
  stat: true,
  forced: Object.defineProperty !== defineProperty,
  sham: !DESCRIPTORS
}, {
  defineProperty: defineProperty
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.define-setter.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.define-setter.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var FORCED = __webpack_require__(/*! ../internals/object-prototype-accessors-forced */ "node_modules/core-js/internals/object-prototype-accessors-forced.html");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "node_modules/core-js/internals/a-callable.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html");

// `Object.prototype.__defineSetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
if (DESCRIPTORS) {
  $({
    target: 'Object',
    proto: true,
    forced: FORCED
  }, {
    __defineSetter__: function __defineSetter__(P, setter) {
      definePropertyModule.f(toObject(this), P, {
        set: aCallable(setter),
        enumerable: true,
        configurable: true
      });
    }
  });
}

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.entries.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.entries.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var $entries = (__webpack_require__(/*! ../internals/object-to-array */ "node_modules/core-js/internals/object-to-array.html").entries);

// `Object.entries` method
// https://tc39.es/ecma262/#sec-object.entries
$({
  target: 'Object',
  stat: true
}, {
  entries: function entries(O) {
    return $entries(O);
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.freeze.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.freeze.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var FREEZING = __webpack_require__(/*! ../internals/freezing */ "node_modules/core-js/internals/freezing.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var onFreeze = (__webpack_require__(/*! ../internals/internal-metadata */ "node_modules/core-js/internals/internal-metadata.html").onFreeze);

// eslint-disable-next-line es/no-object-freeze -- safe
var $freeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () {
  $freeze(1);
});

// `Object.freeze` method
// https://tc39.es/ecma262/#sec-object.freeze
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES,
  sham: !FREEZING
}, {
  freeze: function freeze(it) {
    return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it;
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.from-entries.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.from-entries.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var iterate = __webpack_require__(/*! ../internals/iterate */ "node_modules/core-js/internals/iterate.html");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "node_modules/core-js/internals/create-property.html");

// `Object.fromEntries` method
// https://github.com/tc39/proposal-object-from-entries
$({
  target: 'Object',
  stat: true
}, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate(iterable, function (k, v) {
      createProperty(obj, k, v);
    }, {
      AS_ENTRIES: true
    });
    return obj;
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.get-own-property-descriptor.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.get-own-property-descriptor.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var nativeGetOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "node_modules/core-js/internals/object-get-own-property-descriptor.html").f);
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var FAILS_ON_PRIMITIVES = fails(function () {
  nativeGetOwnPropertyDescriptor(1);
});
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$({
  target: 'Object',
  stat: true,
  forced: FORCED,
  sham: !DESCRIPTORS
}, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.get-own-property-descriptors.js":
/*!********************************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.get-own-property-descriptors.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "node_modules/core-js/internals/own-keys.html");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "node_modules/core-js/internals/object-get-own-property-descriptor.html");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "node_modules/core-js/internals/create-property.html");

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
$({
  target: 'Object',
  stat: true,
  sham: !DESCRIPTORS
}, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.get-own-property-names.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.get-own-property-names.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var getOwnPropertyNames = (__webpack_require__(/*! ../internals/object-get-own-property-names-external */ "node_modules/core-js/internals/object-get-own-property-names-external.html").f);

// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
var FAILS_ON_PRIMITIVES = fails(function () {
  return !Object.getOwnPropertyNames(1);
});

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES
}, {
  getOwnPropertyNames: getOwnPropertyNames
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.get-own-property-symbols.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.get-own-property-symbols.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "node_modules/core-js/internals/symbol-constructor-detection.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "node_modules/core-js/internals/object-get-own-property-symbols.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !NATIVE_SYMBOL || fails(function () {
  getOwnPropertySymbolsModule.f(1);
});

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$({
  target: 'Object',
  stat: true,
  forced: FORCED
}, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.get-prototype-of.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.get-prototype-of.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var nativeGetPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "node_modules/core-js/internals/object-get-prototype-of.html");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "node_modules/core-js/internals/correct-prototype-getter.html");
var FAILS_ON_PRIMITIVES = fails(function () {
  nativeGetPrototypeOf(1);
});

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES,
  sham: !CORRECT_PROTOTYPE_GETTER
}, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.is-extensible.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.is-extensible.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var $isExtensible = __webpack_require__(/*! ../internals/object-is-extensible */ "node_modules/core-js/internals/object-is-extensible.html");

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
// eslint-disable-next-line es/no-object-isextensible -- safe
$({
  target: 'Object',
  stat: true,
  forced: Object.isExtensible !== $isExtensible
}, {
  isExtensible: $isExtensible
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.is-frozen.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.is-frozen.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "node_modules/core-js/internals/classof-raw.html");
var ARRAY_BUFFER_NON_EXTENSIBLE = __webpack_require__(/*! ../internals/array-buffer-non-extensible */ "node_modules/core-js/internals/array-buffer-non-extensible.html");

// eslint-disable-next-line es/no-object-isfrozen -- safe
var $isFrozen = Object.isFrozen;
var FAILS_ON_PRIMITIVES = fails(function () {
  $isFrozen(1);
});

// `Object.isFrozen` method
// https://tc39.es/ecma262/#sec-object.isfrozen
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE
}, {
  isFrozen: function isFrozen(it) {
    if (!isObject(it)) return true;
    if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return true;
    return $isFrozen ? $isFrozen(it) : false;
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.is-sealed.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.is-sealed.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "node_modules/core-js/internals/classof-raw.html");
var ARRAY_BUFFER_NON_EXTENSIBLE = __webpack_require__(/*! ../internals/array-buffer-non-extensible */ "node_modules/core-js/internals/array-buffer-non-extensible.html");

// eslint-disable-next-line es/no-object-issealed -- safe
var $isSealed = Object.isSealed;
var FAILS_ON_PRIMITIVES = fails(function () {
  $isSealed(1);
});

// `Object.isSealed` method
// https://tc39.es/ecma262/#sec-object.issealed
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE
}, {
  isSealed: function isSealed(it) {
    if (!isObject(it)) return true;
    if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return true;
    return $isSealed ? $isSealed(it) : false;
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.keys.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.keys.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var nativeKeys = __webpack_require__(/*! ../internals/object-keys */ "node_modules/core-js/internals/object-keys.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var FAILS_ON_PRIMITIVES = fails(function () {
  nativeKeys(1);
});

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES
}, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.lookup-getter.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.lookup-getter.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var FORCED = __webpack_require__(/*! ../internals/object-prototype-accessors-forced */ "node_modules/core-js/internals/object-prototype-accessors-forced.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "node_modules/core-js/internals/to-property-key.html");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "node_modules/core-js/internals/object-get-prototype-of.html");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "node_modules/core-js/internals/object-get-own-property-descriptor.html").f);

// `Object.prototype.__lookupGetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__lookupGetter__
if (DESCRIPTORS) {
  $({
    target: 'Object',
    proto: true,
    forced: FORCED
  }, {
    __lookupGetter__: function __lookupGetter__(P) {
      var O = toObject(this);
      var key = toPropertyKey(P);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor(O, key)) return desc.get;
      } while (O = getPrototypeOf(O));
    }
  });
}

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.lookup-setter.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.lookup-setter.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var FORCED = __webpack_require__(/*! ../internals/object-prototype-accessors-forced */ "node_modules/core-js/internals/object-prototype-accessors-forced.html");
var toObject = __webpack_require__(/*! ../internals/to-object */ "node_modules/core-js/internals/to-object.html");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "node_modules/core-js/internals/to-property-key.html");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "node_modules/core-js/internals/object-get-prototype-of.html");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "node_modules/core-js/internals/object-get-own-property-descriptor.html").f);

// `Object.prototype.__lookupSetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__lookupSetter__
if (DESCRIPTORS) {
  $({
    target: 'Object',
    proto: true,
    forced: FORCED
  }, {
    __lookupSetter__: function __lookupSetter__(P) {
      var O = toObject(this);
      var key = toPropertyKey(P);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor(O, key)) return desc.set;
      } while (O = getPrototypeOf(O));
    }
  });
}

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.prevent-extensions.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.prevent-extensions.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var onFreeze = (__webpack_require__(/*! ../internals/internal-metadata */ "node_modules/core-js/internals/internal-metadata.html").onFreeze);
var FREEZING = __webpack_require__(/*! ../internals/freezing */ "node_modules/core-js/internals/freezing.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");

// eslint-disable-next-line es/no-object-preventextensions -- safe
var $preventExtensions = Object.preventExtensions;
var FAILS_ON_PRIMITIVES = fails(function () {
  $preventExtensions(1);
});

// `Object.preventExtensions` method
// https://tc39.es/ecma262/#sec-object.preventextensions
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES,
  sham: !FREEZING
}, {
  preventExtensions: function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(onFreeze(it)) : it;
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.seal.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.seal.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var isObject = __webpack_require__(/*! ../internals/is-object */ "node_modules/core-js/internals/is-object.html");
var onFreeze = (__webpack_require__(/*! ../internals/internal-metadata */ "node_modules/core-js/internals/internal-metadata.html").onFreeze);
var FREEZING = __webpack_require__(/*! ../internals/freezing */ "node_modules/core-js/internals/freezing.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");

// eslint-disable-next-line es/no-object-seal -- safe
var $seal = Object.seal;
var FAILS_ON_PRIMITIVES = fails(function () {
  $seal(1);
});

// `Object.seal` method
// https://tc39.es/ecma262/#sec-object.seal
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES,
  sham: !FREEZING
}, {
  seal: function seal(it) {
    return $seal && isObject(it) ? $seal(onFreeze(it)) : it;
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.set-prototype-of.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.set-prototype-of.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "node_modules/core-js/internals/object-set-prototype-of.html");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$({
  target: 'Object',
  stat: true
}, {
  setPrototypeOf: setPrototypeOf
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.to-string.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "node_modules/core-js/internals/to-string-tag-support.html");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "node_modules/core-js/internals/define-built-in.html");
var toString = __webpack_require__(/*! ../internals/object-to-string */ "node_modules/core-js/internals/object-to-string.html");

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, {
    unsafe: true
  });
}

/***/ }),

/***/ "./node_modules/core-js/modules/es.object.values.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.values.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var $values = (__webpack_require__(/*! ../internals/object-to-array */ "node_modules/core-js/internals/object-to-array.html").values);

// `Object.values` method
// https://tc39.es/ecma262/#sec-object.values
$({
  target: 'Object',
  stat: true
}, {
  values: function values(O) {
    return $values(O);
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.constructor.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.constructor.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var call = __webpack_require__(/*! ../internals/function-call */ "node_modules/core-js/internals/function-call.html");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "node_modules/core-js/internals/function-uncurry-this.html");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "node_modules/core-js/internals/is-pure.html");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "node_modules/core-js/internals/descriptors.html");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "node_modules/core-js/internals/symbol-constructor-detection.html");
var fails = __webpack_require__(/*! ../internals/fails */ "node_modules/core-js/internals/fails.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "node_modules/core-js/internals/object-is-prototype-of.html");
var anObject = __webpack_require__(/*! ../internals/an-object */ "node_modules/core-js/internals/an-object.html");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "node_modules/core-js/internals/to-indexed-object.html");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "node_modules/core-js/internals/to-property-key.html");
var $toString = __webpack_require__(/*! ../internals/to-string */ "node_modules/core-js/internals/to-string.html");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "node_modules/core-js/internals/create-property-descriptor.html");
var nativeObjectCreate = __webpack_require__(/*! ../internals/object-create */ "node_modules/core-js/internals/object-create.html");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "node_modules/core-js/internals/object-keys.html");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "node_modules/core-js/internals/object-get-own-property-names.html");
var getOwnPropertyNamesExternal = __webpack_require__(/*! ../internals/object-get-own-property-names-external */ "node_modules/core-js/internals/object-get-own-property-names-external.html");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "node_modules/core-js/internals/object-get-own-property-symbols.html");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "node_modules/core-js/internals/object-get-own-property-descriptor.html");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "node_modules/core-js/internals/object-define-property.html");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "node_modules/core-js/internals/object-define-properties.html");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "node_modules/core-js/internals/object-property-is-enumerable.html");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "node_modules/core-js/internals/define-built-in.html");
var shared = __webpack_require__(/*! ../internals/shared */ "node_modules/core-js/internals/shared.html");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "node_modules/core-js/internals/shared-key.html");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "node_modules/core-js/internals/hidden-keys.html");
var uid = __webpack_require__(/*! ../internals/uid */ "node_modules/core-js/internals/uid.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var wrappedWellKnownSymbolModule = __webpack_require__(/*! ../internals/well-known-symbol-wrapped */ "node_modules/core-js/internals/well-known-symbol-wrapped.html");
var defineWellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol-define */ "node_modules/core-js/internals/well-known-symbol-define.html");
var defineSymbolToPrimitive = __webpack_require__(/*! ../internals/symbol-define-to-primitive */ "node_modules/core-js/internals/symbol-define-to-primitive.html");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "node_modules/core-js/internals/set-to-string-tag.html");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "node_modules/core-js/internals/internal-state.html");
var $forEach = (__webpack_require__(/*! ../internals/array-iteration */ "node_modules/core-js/internals/array-iteration.html").forEach);
var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var TypeError = global.TypeError;
var QObject = global.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () {
      return nativeDefineProperty(this, 'a', {
        value: 7
      }).a;
    }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;
var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};
var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, {
        enumerable: createPropertyDescriptor(0, false)
      });
    }
    return setSymbolDescriptor(O, key, Attributes);
  }
  return nativeDefineProperty(O, key, Attributes);
};
var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};
var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};
var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};
var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};
var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn(this, HIDDEN) && hasOwn(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, {
      configurable: true,
      set: setter
    });
    return wrap(tag, description);
  };
  SymbolPrototype = $Symbol[PROTOTYPE];
  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });
  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });
  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;
  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, {
        unsafe: true
      });
    }
  }
}
$({
  global: true,
  constructor: true,
  wrap: true,
  forced: !NATIVE_SYMBOL,
  sham: !NATIVE_SYMBOL
}, {
  Symbol: $Symbol
});
$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});
$({
  target: SYMBOL,
  stat: true,
  forced: !NATIVE_SYMBOL
}, {
  useSetter: function () {
    USE_SETTER = true;
  },
  useSimple: function () {
    USE_SETTER = false;
  }
});
$({
  target: 'Object',
  stat: true,
  forced: !NATIVE_SYMBOL,
  sham: !DESCRIPTORS
}, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});
$({
  target: 'Object',
  stat: true,
  forced: !NATIVE_SYMBOL
}, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);
hiddenKeys[HIDDEN] = true;

/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.for.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.for.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "node_modules/core-js/internals/get-built-in.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var toString = __webpack_require__(/*! ../internals/to-string */ "node_modules/core-js/internals/to-string.html");
var shared = __webpack_require__(/*! ../internals/shared */ "node_modules/core-js/internals/shared.html");
var NATIVE_SYMBOL_REGISTRY = __webpack_require__(/*! ../internals/symbol-registry-detection */ "node_modules/core-js/internals/symbol-registry-detection.html");
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$({
  target: 'Symbol',
  stat: true,
  forced: !NATIVE_SYMBOL_REGISTRY
}, {
  'for': function (key) {
    var string = toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(/*! ../modules/es.symbol.constructor */ "node_modules/core-js/modules/es.symbol.constructor.html");
__webpack_require__(/*! ../modules/es.symbol.for */ "node_modules/core-js/modules/es.symbol.for.html");
__webpack_require__(/*! ../modules/es.symbol.key-for */ "node_modules/core-js/modules/es.symbol.key-for.html");
__webpack_require__(/*! ../modules/es.json.stringify */ "node_modules/core-js/modules/es.json.stringify.html");
__webpack_require__(/*! ../modules/es.object.get-own-property-symbols */ "node_modules/core-js/modules/es.object.get-own-property-symbols.html");

/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.key-for.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.key-for.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "node_modules/core-js/internals/export.html");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "node_modules/core-js/internals/has-own-property.html");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "node_modules/core-js/internals/is-symbol.html");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "node_modules/core-js/internals/try-to-string.html");
var shared = __webpack_require__(/*! ../internals/shared */ "node_modules/core-js/internals/shared.html");
var NATIVE_SYMBOL_REGISTRY = __webpack_require__(/*! ../internals/symbol-registry-detection */ "node_modules/core-js/internals/symbol-registry-detection.html");
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$({
  target: 'Symbol',
  stat: true,
  forced: !NATIVE_SYMBOL_REGISTRY
}, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});

/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.iterator.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.iterator.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "node_modules/core-js/internals/global.html");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "node_modules/core-js/internals/dom-iterables.html");
var DOMTokenListPrototype = __webpack_require__(/*! ../internals/dom-token-list-prototype */ "node_modules/core-js/internals/dom-token-list-prototype.html");
var ArrayIteratorMethods = __webpack_require__(/*! ../modules/es.array.iterator */ "node_modules/core-js/modules/es.array.iterator.html");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "node_modules/core-js/internals/create-non-enumerable-property.html");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "node_modules/core-js/internals/well-known-symbol.html");
var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;
var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};
for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}
handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);
      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }
      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names

  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }
      list.push(item);
    }
  };
  return list;
};
function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }
  return [content].join('\n');
} // Adapted from convert-source-map (MIT)

function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "./node_modules/htm/dist/htm.module.js":
/*!*********************************************!*\
  !*** ./node_modules/htm/dist/htm.module.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
var n = function (t, s, r, e) {
    var u;
    s[0] = 0;
    for (var h = 1; h < s.length; h++) {
      var p = s[h++],
        a = s[h] ? (s[0] |= p ? 1 : 2, r[s[h++]]) : s[++h];
      3 === p ? e[0] = a : 4 === p ? e[1] = Object.assign(e[1] || {}, a) : 5 === p ? (e[1] = e[1] || {})[s[++h]] = a : 6 === p ? e[1][s[++h]] += a + "" : p ? (u = t.apply(a, n(t, a, r, ["", null])), e.push(u), a[0] ? s[0] |= 2 : (s[h - 2] = 0, s[h] = u)) : e.push(a);
    }
    return e;
  },
  t = new Map();
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(s) {
  var r = t.get(this);
  return r || (r = new Map(), t.set(this, r)), (r = n(this, r.get(s) || (r.set(s, r = function (n) {
    for (var t, s, r = 1, e = "", u = "", h = [0], p = function (n) {
        1 === r && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n, e) : 3 === r && (n || e) ? (h.push(3, n, e), r = 2) : 2 === r && "..." === e && n ? h.push(4, n, 0) : 2 === r && e && !n ? h.push(5, 0, !0, e) : r >= 5 && ((e || !n && 5 === r) && (h.push(r, 0, e, s), r = 6), n && (h.push(r, n, 0, s), r = 6)), e = "";
      }, a = 0; a < n.length; a++) {
      a && (1 === r && p(), p(a));
      for (var l = 0; l < n[a].length; l++) t = n[a][l], 1 === r ? "<" === t ? (p(), h = [h], r = 3) : e += t : 4 === r ? "--" === e && ">" === t ? (r = 1, e = "") : e = t + e[0] : u ? t === u ? u = "" : e += t : '"' === t || "'" === t ? u = t : ">" === t ? (p(), r = 1) : r && ("=" === t ? (r = 5, s = e, e = "") : "/" === t && (r < 5 || ">" === n[a][l + 1]) ? (p(), 3 === r && (h = h[0]), r = h, (h = h[0]).push(2, 0, r), r = 0) : " " === t || "\t" === t || "\n" === t || "\r" === t ? (p(), r = 2) : e += t), 3 === r && "!--" === e && (r = 4, h = h[0]);
    }
    return p(), h;
  }(s)), r), arguments, [])).length > 1 ? r : r[0];
}

/***/ }),

/***/ "./node_modules/preact/dist/preact.module.js":
/*!***************************************************!*\
  !*** ./node_modules/preact/dist/preact.module.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": function() { return /* binding */ d; },
/* harmony export */   "Fragment": function() { return /* binding */ p; },
/* harmony export */   "cloneElement": function() { return /* binding */ q; },
/* harmony export */   "createContext": function() { return /* binding */ B; },
/* harmony export */   "createElement": function() { return /* binding */ h; },
/* harmony export */   "createRef": function() { return /* binding */ y; },
/* harmony export */   "h": function() { return /* binding */ h; },
/* harmony export */   "hydrate": function() { return /* binding */ S; },
/* harmony export */   "isValidElement": function() { return /* binding */ i; },
/* harmony export */   "options": function() { return /* binding */ l; },
/* harmony export */   "render": function() { return /* binding */ P; },
/* harmony export */   "toChildArray": function() { return /* binding */ x; }
/* harmony export */ });
var n,
  l,
  u,
  i,
  t,
  o,
  r,
  f = {},
  e = [],
  c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function s(n, l) {
  for (var u in l) n[u] = l[u];
  return n;
}
function a(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
}
function h(l, u, i) {
  var t,
    o,
    r,
    f = {};
  for (r in u) "key" == r ? t = u[r] : "ref" == r ? o = u[r] : f[r] = u[r];
  if (arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : i), "function" == typeof l && null != l.defaultProps) for (r in l.defaultProps) void 0 === f[r] && (f[r] = l.defaultProps[r]);
  return v(l, f, t, o, null);
}
function v(n, i, t, o, r) {
  var f = {
    type: n,
    props: i,
    key: t,
    ref: o,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    __h: null,
    constructor: void 0,
    __v: null == r ? ++u : r
  };
  return null == r && null != l.vnode && l.vnode(f), f;
}
function y() {
  return {
    current: null
  };
}
function p(n) {
  return n.children;
}
function d(n, l) {
  this.props = n, this.context = l;
}
function _(n, l) {
  if (null == l) return n.__ ? _(n.__, n.__.__k.indexOf(n) + 1) : null;
  for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
  return "function" == typeof n.type ? _(n) : null;
}
function k(n) {
  var l, u;
  if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
      n.__e = n.__c.base = u.__e;
      break;
    }
    return k(n);
  }
}
function b(n) {
  (!n.__d && (n.__d = !0) && t.push(n) && !g.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || setTimeout)(g);
}
function g() {
  for (var n; g.__r = t.length;) n = t.sort(function (n, l) {
    return n.__v.__b - l.__v.__b;
  }), t = [], n.some(function (n) {
    var l, u, i, t, o, r;
    n.__d && (o = (t = (l = n).__v).__e, (r = l.__P) && (u = [], (i = s({}, t)).__v = t.__v + 1, j(r, t, i, l.__n, void 0 !== r.ownerSVGElement, null != t.__h ? [o] : null, u, null == o ? _(t) : o, t.__h), z(u, t), t.__e != o && k(t)));
  });
}
function w(n, l, u, i, t, o, r, c, s, a) {
  var h,
    y,
    d,
    k,
    b,
    g,
    w,
    x = i && i.__k || e,
    C = x.length;
  for (u.__k = [], h = 0; h < l.length; h++) if (null != (k = u.__k[h] = null == (k = l[h]) || "boolean" == typeof k ? null : "string" == typeof k || "number" == typeof k || "bigint" == typeof k ? v(null, k, null, null, k) : Array.isArray(k) ? v(p, {
    children: k
  }, null, null, null) : k.__b > 0 ? v(k.type, k.props, k.key, k.ref ? k.ref : null, k.__v) : k)) {
    if (k.__ = u, k.__b = u.__b + 1, null === (d = x[h]) || d && k.key == d.key && k.type === d.type) x[h] = void 0;else for (y = 0; y < C; y++) {
      if ((d = x[y]) && k.key == d.key && k.type === d.type) {
        x[y] = void 0;
        break;
      }
      d = null;
    }
    j(n, k, d = d || f, t, o, r, c, s, a), b = k.__e, (y = k.ref) && d.ref != y && (w || (w = []), d.ref && w.push(d.ref, null, k), w.push(y, k.__c || b, k)), null != b ? (null == g && (g = b), "function" == typeof k.type && k.__k === d.__k ? k.__d = s = m(k, s, n) : s = A(n, k, d, x, b, s), "function" == typeof u.type && (u.__d = s)) : s && d.__e == s && s.parentNode != n && (s = _(d));
  }
  for (u.__e = g, h = C; h--;) null != x[h] && N(x[h], x[h]);
  if (w) for (h = 0; h < w.length; h++) M(w[h], w[++h], w[++h]);
}
function m(n, l, u) {
  for (var i, t = n.__k, o = 0; t && o < t.length; o++) (i = t[o]) && (i.__ = n, l = "function" == typeof i.type ? m(i, l, u) : A(u, i, i, t, i.__e, l));
  return l;
}
function x(n, l) {
  return l = l || [], null == n || "boolean" == typeof n || (Array.isArray(n) ? n.some(function (n) {
    x(n, l);
  }) : l.push(n)), l;
}
function A(n, l, u, i, t, o) {
  var r, f, e;
  if (void 0 !== l.__d) r = l.__d, l.__d = void 0;else if (null == u || t != o || null == t.parentNode) n: if (null == o || o.parentNode !== n) n.appendChild(t), r = null;else {
    for (f = o, e = 0; (f = f.nextSibling) && e < i.length; e += 1) if (f == t) break n;
    n.insertBefore(t, o), r = o;
  }
  return void 0 !== r ? r : t.nextSibling;
}
function C(n, l, u, i, t) {
  var o;
  for (o in u) "children" === o || "key" === o || o in l || H(n, o, null, u[o], i);
  for (o in l) t && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || H(n, o, l[o], u[o], i);
}
function $(n, l, u) {
  "-" === l[0] ? n.setProperty(l, u) : n[l] = null == u ? "" : "number" != typeof u || c.test(l) ? u : u + "px";
}
function H(n, l, u, i, t) {
  var o;
  n: if ("style" === l) {
    if ("string" == typeof u) n.style.cssText = u;else {
      if ("string" == typeof i && (n.style.cssText = i = ""), i) for (l in i) u && l in u || $(n.style, l, "");
      if (u) for (l in u) i && u[l] === i[l] || $(n.style, l, u[l]);
    }
  } else if ("o" === l[0] && "n" === l[1]) o = l !== (l = l.replace(/Capture$/, "")), l = l.toLowerCase() in n ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, u ? i || n.addEventListener(l, o ? T : I, o) : n.removeEventListener(l, o ? T : I, o);else if ("dangerouslySetInnerHTML" !== l) {
    if (t) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");else if ("href" !== l && "list" !== l && "form" !== l && "tabIndex" !== l && "download" !== l && l in n) try {
      n[l] = null == u ? "" : u;
      break n;
    } catch (n) {}
    "function" == typeof u || (null == u || !1 === u && -1 == l.indexOf("-") ? n.removeAttribute(l) : n.setAttribute(l, u));
  }
}
function I(n) {
  this.l[n.type + !1](l.event ? l.event(n) : n);
}
function T(n) {
  this.l[n.type + !0](l.event ? l.event(n) : n);
}
function j(n, u, i, t, o, r, f, e, c) {
  var a,
    h,
    v,
    y,
    _,
    k,
    b,
    g,
    m,
    x,
    A,
    C,
    $,
    H,
    I,
    T = u.type;
  if (void 0 !== u.constructor) return null;
  null != i.__h && (c = i.__h, e = u.__e = i.__e, u.__h = null, r = [e]), (a = l.__b) && a(u);
  try {
    n: if ("function" == typeof T) {
      if (g = u.props, m = (a = T.contextType) && t[a.__c], x = a ? m ? m.props.value : a.__ : t, i.__c ? b = (h = u.__c = i.__c).__ = h.__E : ("prototype" in T && T.prototype.render ? u.__c = h = new T(g, x) : (u.__c = h = new d(g, x), h.constructor = T, h.render = O), m && m.sub(h), h.props = g, h.state || (h.state = {}), h.context = x, h.__n = t, v = h.__d = !0, h.__h = [], h._sb = []), null == h.__s && (h.__s = h.state), null != T.getDerivedStateFromProps && (h.__s == h.state && (h.__s = s({}, h.__s)), s(h.__s, T.getDerivedStateFromProps(g, h.__s))), y = h.props, _ = h.state, v) null == T.getDerivedStateFromProps && null != h.componentWillMount && h.componentWillMount(), null != h.componentDidMount && h.__h.push(h.componentDidMount);else {
        if (null == T.getDerivedStateFromProps && g !== y && null != h.componentWillReceiveProps && h.componentWillReceiveProps(g, x), !h.__e && null != h.shouldComponentUpdate && !1 === h.shouldComponentUpdate(g, h.__s, x) || u.__v === i.__v) {
          for (h.props = g, h.state = h.__s, u.__v !== i.__v && (h.__d = !1), h.__v = u, u.__e = i.__e, u.__k = i.__k, u.__k.forEach(function (n) {
            n && (n.__ = u);
          }), A = 0; A < h._sb.length; A++) h.__h.push(h._sb[A]);
          h._sb = [], h.__h.length && f.push(h);
          break n;
        }
        null != h.componentWillUpdate && h.componentWillUpdate(g, h.__s, x), null != h.componentDidUpdate && h.__h.push(function () {
          h.componentDidUpdate(y, _, k);
        });
      }
      if (h.context = x, h.props = g, h.__v = u, h.__P = n, C = l.__r, $ = 0, "prototype" in T && T.prototype.render) {
        for (h.state = h.__s, h.__d = !1, C && C(u), a = h.render(h.props, h.state, h.context), H = 0; H < h._sb.length; H++) h.__h.push(h._sb[H]);
        h._sb = [];
      } else do {
        h.__d = !1, C && C(u), a = h.render(h.props, h.state, h.context), h.state = h.__s;
      } while (h.__d && ++$ < 25);
      h.state = h.__s, null != h.getChildContext && (t = s(s({}, t), h.getChildContext())), v || null == h.getSnapshotBeforeUpdate || (k = h.getSnapshotBeforeUpdate(y, _)), I = null != a && a.type === p && null == a.key ? a.props.children : a, w(n, Array.isArray(I) ? I : [I], u, i, t, o, r, f, e, c), h.base = u.__e, u.__h = null, h.__h.length && f.push(h), b && (h.__E = h.__ = null), h.__e = !1;
    } else null == r && u.__v === i.__v ? (u.__k = i.__k, u.__e = i.__e) : u.__e = L(i.__e, u, i, t, o, r, f, c);
    (a = l.diffed) && a(u);
  } catch (n) {
    u.__v = null, (c || null != r) && (u.__e = e, u.__h = !!c, r[r.indexOf(e)] = null), l.__e(n, u, i);
  }
}
function z(n, u) {
  l.__c && l.__c(u, n), n.some(function (u) {
    try {
      n = u.__h, u.__h = [], n.some(function (n) {
        n.call(u);
      });
    } catch (n) {
      l.__e(n, u.__v);
    }
  });
}
function L(l, u, i, t, o, r, e, c) {
  var s,
    h,
    v,
    y = i.props,
    p = u.props,
    d = u.type,
    k = 0;
  if ("svg" === d && (o = !0), null != r) for (; k < r.length; k++) if ((s = r[k]) && "setAttribute" in s == !!d && (d ? s.localName === d : 3 === s.nodeType)) {
    l = s, r[k] = null;
    break;
  }
  if (null == l) {
    if (null === d) return document.createTextNode(p);
    l = o ? document.createElementNS("http://www.w3.org/2000/svg", d) : document.createElement(d, p.is && p), r = null, c = !1;
  }
  if (null === d) y === p || c && l.data === p || (l.data = p);else {
    if (r = r && n.call(l.childNodes), h = (y = i.props || f).dangerouslySetInnerHTML, v = p.dangerouslySetInnerHTML, !c) {
      if (null != r) for (y = {}, k = 0; k < l.attributes.length; k++) y[l.attributes[k].name] = l.attributes[k].value;
      (v || h) && (v && (h && v.__html == h.__html || v.__html === l.innerHTML) || (l.innerHTML = v && v.__html || ""));
    }
    if (C(l, p, y, o, c), v) u.__k = [];else if (k = u.props.children, w(l, Array.isArray(k) ? k : [k], u, i, t, o && "foreignObject" !== d, r, e, r ? r[0] : i.__k && _(i, 0), c), null != r) for (k = r.length; k--;) null != r[k] && a(r[k]);
    c || ("value" in p && void 0 !== (k = p.value) && (k !== l.value || "progress" === d && !k || "option" === d && k !== y.value) && H(l, "value", k, y.value, !1), "checked" in p && void 0 !== (k = p.checked) && k !== l.checked && H(l, "checked", k, y.checked, !1));
  }
  return l;
}
function M(n, u, i) {
  try {
    "function" == typeof n ? n(u) : n.current = u;
  } catch (n) {
    l.__e(n, i);
  }
}
function N(n, u, i) {
  var t, o;
  if (l.unmount && l.unmount(n), (t = n.ref) && (t.current && t.current !== n.__e || M(t, null, u)), null != (t = n.__c)) {
    if (t.componentWillUnmount) try {
      t.componentWillUnmount();
    } catch (n) {
      l.__e(n, u);
    }
    t.base = t.__P = null, n.__c = void 0;
  }
  if (t = n.__k) for (o = 0; o < t.length; o++) t[o] && N(t[o], u, i || "function" != typeof n.type);
  i || null == n.__e || a(n.__e), n.__ = n.__e = n.__d = void 0;
}
function O(n, l, u) {
  return this.constructor(n, u);
}
function P(u, i, t) {
  var o, r, e;
  l.__ && l.__(u, i), r = (o = "function" == typeof t) ? null : t && t.__k || i.__k, e = [], j(i, u = (!o && t || i).__k = h(p, null, [u]), r || f, f, void 0 !== i.ownerSVGElement, !o && t ? [t] : r ? null : i.firstChild ? n.call(i.childNodes) : null, e, !o && t ? t : r ? r.__e : i.firstChild, o), z(e, u);
}
function S(n, l) {
  P(n, l, S);
}
function q(l, u, i) {
  var t,
    o,
    r,
    f = s({}, l.props);
  for (r in u) "key" == r ? t = u[r] : "ref" == r ? o = u[r] : f[r] = u[r];
  return arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : i), v(l.type, f, t || l.key, o || l.ref, null);
}
function B(n, l) {
  var u = {
    __c: l = "__cC" + r++,
    __: n,
    Consumer: function (n, l) {
      return n.children(l);
    },
    Provider: function (n) {
      var u, i;
      return this.getChildContext || (u = [], (i = {})[l] = this, this.getChildContext = function () {
        return i;
      }, this.shouldComponentUpdate = function (n) {
        this.props.value !== n.value && u.some(b);
      }, this.sub = function (n) {
        u.push(n);
        var l = n.componentWillUnmount;
        n.componentWillUnmount = function () {
          u.splice(u.indexOf(n), 1), l && l.call(n);
        };
      }), n.children;
    }
  };
  return u.Provider.__ = u.Consumer.contextType = u;
}
n = e.slice, l = {
  __e: function (n, l, u, i) {
    for (var t, o, r; l = l.__;) if ((t = l.__c) && !t.__) try {
      if ((o = t.constructor) && null != o.getDerivedStateFromError && (t.setState(o.getDerivedStateFromError(n)), r = t.__d), null != t.componentDidCatch && (t.componentDidCatch(n, i || {}), r = t.__d), r) return t.__E = t;
    } catch (l) {
      n = l;
    }
    throw n;
  }
}, u = 0, i = function (n) {
  return null != n && void 0 === n.constructor;
}, d.prototype.setState = function (n, l) {
  var u;
  u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof n && (n = n(s({}, u), this.props)), n && s(u, n), null != n && this.__v && (l && this._sb.push(l), b(this));
}, d.prototype.forceUpdate = function (n) {
  this.__v && (this.__e = !0, n && this.__h.push(n), b(this));
}, d.prototype.render = p, t = [], g.__r = 0, r = 0;


/***/ }),

/***/ "./scripts/animation/dataDefault.js":
/*!******************************************!*\
  !*** ./scripts/animation/dataDefault.js ***!
  \******************************************/
/***/ (function(module) {

module.exports = {
  "skin": null,
  "site_id": null,
  "autopost": 1,
  "extraHtml": null,
  "presetColor": "animals",
  "url": "/",
  "widget": {
    "text": "<p>Поддержите наш фонд </p>",
    "place": "right-top",
    "style": {
      "color": "rgba(56,9,1,1)",
      "image": "universal-widget.svg",
      "width": "186",
      "backColor": "rgba(255,249,240,1)",
      "imageWidth": "100"
    },
    "showDelay": 0,
    "afterClose": "",
    "marginWidth": "20",
    "marginHeight": "20",
    "extraHtml": "<span style=\"font-size: 5px; color: green;\">extra html</span>",
    "deviceMD": {
      "place": "left-top",
      "marginWidth": "10",
      "marginHeight": "10",
      "width": "150"
    },
    "deviceSM": {
      "place": "left-bottom",
      "marginWidth": "5",
      "marginHeight": "5",
      "width": "120"
    }
  },
  "block1": {
    "text": "Введите сумму помощи в адрес фонда",
    "state": 1,
    "style": {
      "image": "universal-widget.svg",
      "backImage": "universal-block-back.png",
      "imageRadius": 30
    },
    "title": "Можете помочь?",
    "fields": {
      "sum": {
        "max": 100000,
        "min": 10,
        "name": "sum",
        "order": 1,
        "state": 1,
        "default": 256,
        "validate": null
      },
      "name": {
        "name": "name",
        "order": 4,
        "state": 1,
        "validate": 1
      },
      "email": {
        "name": "email",
        "order": 3,
        "state": 1,
        "validate": 0
      },
      "phone": {
        "name": "phone",
        "order": 6,
        "state": 0,
        "validate": 0
      },
      "repeat": {
        "name": "repeat",
        "text": "Могу помогать ежемесячно",
        "order": 2,
        "state": 1,
        "default": 0,
        "validate": null,
        "textStyle": {
          "color": "rgba(124,92,86,1)"
        },
        "switchStyle": {
          "color": "rgba(248,172,103,1)"
        }
      },
      "anonymous": {
        "name": "anonymous",
        "text": "",
        "order": 5,
        "state": 1,
        "validate": null,
        "textStyle": {
          "color": "rgba(124,92,86,1)"
        },
        "switchStyle": {
          "color": "rgba(248,172,103,1)"
        }
      }
    },
    "btnText": "ДАЛЬШЕ",
    "btnStyle": {
      "color": "rgba(255,255,255,1)",
      "scale": 0,
      "backColor": "rgba(248,127,103,1)",
      "width": 85,
      "height": 45,
      "shadow": 0,
      "borderRadius": 5
    }
  },
  "block2": {
    "text": "Укажите ваши данные для отправки чека",
    "state": 1,
    "style": {
      "image": "",
      "backImage": "universal-block-back.png",
      "imageRadius": 0
    },
    "title": "КАК ВАС ЗОВУТ?",
    "fields": {
      "sum": {
        "max": 100000,
        "min": 10,
        "name": "sum",
        "order": 5,
        "state": 0,
        "default": 250,
        "validate": null
      },
      "name": {
        "name": "name",
        "order": 2,
        "state": 1,
        "validate": 0
      },
      "email": {
        "name": "email",
        "order": 1,
        "state": 1,
        "validate": 0
      },
      "phone": {
        "name": "phone",
        "order": 4,
        "state": 1,
        "validate": 1
      },
      "repeat": {
        "name": "repeat",
        "text": "Могу помогать ежемесячно",
        "order": 6,
        "state": 2,
        "default": 0,
        "validate": null,
        "textStyle": {
          "color": "rgba(124,92,86,1)"
        },
        "switchStyle": {
          "color": "rgba(248,172,103,1)"
        }
      },
      "anonymous": {
        "name": "anonymous",
        "text": "",
        "order": 3,
        "state": 1,
        "validate": null,
        "textStyle": {
          "color": "rgba(124,92,86,1)",
          "backColor": ""
        },
        "switchStyle": {
          "color": "rgba(248,172,103,1)",
          "backColor": ""
        }
      }
    },
    "btnText": "ПОМОЧЬ",
    "btnStyle": {
      "color": "rgba(255,255,255,1)",
      "scale": 0,
      "backColor": "rgba(248,127,103,1)"
    }
  }
};

/***/ }),

/***/ "./scripts/animation/style.css":
/*!*************************************!*\
  !*** ./scripts/animation/style.css ***!
  \*************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "node_modules/css-loader/dist/runtime/api.html");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".widget-help p {\n\tmargin: 0 !important;\n\tpadding: 0 !important;\n\tline-height: initial;\n}\n\n.widget-help {\n\tfont-family: \"Rubik\", sans-serif;\n\tfont-size: 16px;\n\tcolor: #380901;\n\tbox-sizing: border-box;\n\tposition: fixed;\n\tz-index: 99991;\n\t-webkit-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n\n.widget-help * {\n\tbox-sizing: border-box;\n}\n\n.widget-help_left-bottom .widget-help__button {\n\tright: auto;\n\tleft: -500px;\n}\n\n.widget-help_left-bottom .widget-help__button.widgetHelpShow {\n\tleft: 0;\n\tright: auto;\n}\n\n.widget-help_left-bottom .widget-help__text {\n\tright: auto;\n\tleft: 0px;\n\tpadding-left: 50px;\n\twidth: 220px;\n}\n\n.widget-help_left-bottom .widget-help__text.widgetHelpShow {\n\tright: auto;\n\tleft: 40px;\n}\n\n.widget-help_left-bottom .widget-help__pop {\n\tright: auto;\n\tleft: 0;\n}\n\n.widget-help_right-top {\n\tbottom: auto !important;\n\tleft: auto !important;\n}\n\n.widget-help_right-top .widget-help__button {\n\tbottom: auto;\n}\n\n.widget-help_right-top .widget-help__pop {\n\tbottom: auto;\n\ttop: -40px;\n\tright: 0;\n}\n\n.widget-help_right-top .widget-help__pop.widgetHelpShow {\n\tbottom: auto;\n\ttop: 0;\n}\n\n.widget-help_left-top {\n\tbottom: auto !important;\n\tright: auto !important;\n}\n\n.widget-help_left-top .widget-help__button {\n\tright: auto;\n\tleft: -500px;\n\tbottom: auto;\n}\n\n.widget-help_left-top .widget-help__button.widgetHelpShow {\n\tleft: 0;\n\tright: auto;\n}\n\n.widget-help_left-top .widget-help__text {\n\tright: auto;\n\tleft: 0px;\n\tpadding-left: 50px;\n\twidth: 220px;\n}\n\n.widget-help_left-top .widget-help__text.widgetHelpShow {\n\tright: auto;\n\tleft: 40px;\n}\n\n.widget-help_left-top .widget-help__pop {\n\tright: auto;\n\tleft: 0;\n\tbottom: auto;\n\ttop: -40px;\n\tright: 0;\n}\n\n.widget-help_left-top .widget-help__pop.widgetHelpShow {\n\tbottom: auto;\n\ttop: 0;\n}\n\n.widget-help__button {\n\tposition: absolute;\n\tz-index: 1;\n\tbottom: 0;\n\tright: -500px;\n\tcursor: pointer;\n\ttransition: 0.3s;\n}\n\n.widget-help__button.widgetHelpShow {\n\tright: 0;\n}\n\n.widget-help__animate-1 {\n\tmax-width: 10000px;\n\tdisplay: block;\n\theight: auto;\n\tposition: relative;\n\tz-index: 100;\n}\n\n.widget-help__text {\n\tbackground: #FFF9F0;\n\tborder-radius: 20px;\n\tfont-weight: 300;\n\tpadding: 12px 20px;\n\tpadding-bottom: 15px;\n\twidth: 186px;\n\tline-height: 19px;\n\tposition: absolute;\n\tz-index: 50;\n\tright: 0;\n\ttop: 50%;\n\ttransform: translateY(-50%);\n\ttransition: 0.3s;\n\tvisibility: hidden;\n\topacity: 0;\n}\n\n.widget-help__text p:first-child {\n\tmargin-top: 0;\n}\n\n.widget-help__text p:last-child {\n\tmargin-bottom: 0;\n}\n\n.widget-help__text img {\n\tdisplay: inline-block;\n\ttransform: translateY(1px);\n}\n\n.widget-help__text.widgetHelpShow {\n\tvisibility: visible;\n\topacity: 1;\n\tright: 40px;\n}\n\n.widget-help__close {\n\tposition: absolute;\n\ttop: 10px;\n\tright: 10px;\n\tbackground: #FBF3E8;\n\tborder-radius: 50px;\n\twidth: 24px;\n\theight: 24px;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tcursor: pointer;\n\ttransition: 0.3s;\n\tcolor: rgba(73, 22, 13, 0.3);\n\tz-index: 5;\n}\n\n.widget-help__close:hover {\n\topacity: 0.7;\n}\n\n.widget-help__pop {\n\tborder-radius: 20px;\n\twidth: 288px;\n\tposition: absolute;\n\tbottom: -40px;\n\tright: 0;\n\tz-index: 200;\n\topacity: 0;\n\tvisibility: hidden;\n\ttransition: 0.3s;\n\tbox-shadow: 0px 20px 50px rgba(0, 0, 0, 0.1);\n\tborder-radius: 20px;\n\tbackground-color: white;\n}\n\n.widget-help__pop.widgetHelpShow {\n\topacity: 1;\n\tvisibility: visible;\n\tbottom: -12px;\n}\n\n.widget-help__title {\n\ttext-transform: uppercase;\n\ttext-align: center;\n\tfont-weight: bold;\n\tfont-size: 25px;\n\tmargin-bottom: 8px;\n}\n\n.widget-help__title p:first-child {\n\tmargin-top: 0;\n}\n\n.widget-help__title p:last-child {\n\tmargin-bottom: 0;\n}\n\n.widget-help__title span {\n\tcolor: #F87F67;\n}\n\n.widget-help__after-title {\n\ttext-align: center;\n\tfont-weight: 300;\n\tfont-size: 15px;\n\tpadding-bottom: 10px;\n}\n\n.widget-help__after-title p:first-child {\n\tmargin-top: 0;\n}\n\n.widget-help__after-title p:last-child {\n\tmargin-bottom: 0;\n}\n\n.widget-help__animate-2 {\n\tdisplay: block;\n\tmax-width: 200px;\n\tposition: absolute;\n\tdisplay: block;\n\ttop: 0;\n\tleft: 50%;\n\ttransform: translate(-50%, -21%);\n}\n\n.widget-help__fields {\n\tdisplay: flex;\n\tflex-direction: column;\n}\n\n.widget-help__fields>div {\n\tposition: relative;\n}\n\ntextarea.widget-help__input,\ninput[type=tel].widget-help__input,\ninput[type=email].widget-help__input,\ninput[type=text].widget-help__input {\n\t-webkit-appearance: none;\n\tbackground: #FFF9F0;\n\tborder: 1px solid #FFDEAE;\n\tbox-sizing: border-box;\n\tborder-radius: 500px;\n\theight: 45px;\n\twidth: 100% !important;\n\ttext-align: center;\n\toutline: none;\n\tcolor: #380901;\n\tfont-weight: 500;\n\tfont-size: 18px;\n\tmargin-bottom: 6px !important;\n\tfont-family: \"Rubik\", sans-serif;\n}\n\ntextarea.widget-help__input::-webkit-input-placeholder,\ninput[type=tel].widget-help__input::-webkit-input-placeholder,\ninput[type=email].widget-help__input::-webkit-input-placeholder,\ninput[type=text].widget-help__input::-webkit-input-placeholder {\n\tcolor: rgba(0, 0, 0, 0.4);\n\tfont-weight: 300;\n}\n\ntextarea.widget-help__input:-moz-placeholder,\ninput[type=tel].widget-help__input:-moz-placeholder,\ninput[type=email].widget-help__input:-moz-placeholder,\ninput[type=text].widget-help__input:-moz-placeholder {\n\tcolor: rgba(0, 0, 0, 0.4);\n\tfont-weight: 300;\n}\n\ntextarea.widget-help__input::-moz-placeholder,\ninput[type=tel].widget-help__input::-moz-placeholder,\ninput[type=email].widget-help__input::-moz-placeholder,\ninput[type=text].widget-help__input::-moz-placeholder {\n\tcolor: rgba(0, 0, 0, 0.4);\n\tfont-weight: 300;\n}\n\ntextarea.widget-help__input:-ms-input-placeholder,\ninput[type=tel].widget-help__input:-ms-input-placeholder,\ninput[type=email].widget-help__input:-ms-input-placeholder,\ninput[type=text].widget-help__input:-ms-input-placeholder {\n\tcolor: rgba(0, 0, 0, 0.4);\n\tfont-weight: 300;\n}\n\ntextarea.widget-help__input:focus::-webkit-input-placeholder,\ninput[type=tel].widget-help__input:focus::-webkit-input-placeholder,\ninput[type=email].widget-help__input:focus::-webkit-input-placeholder,\ninput[type=text].widget-help__input:focus::-webkit-input-placeholder {\n\topacity: 1;\n}\n\ntextarea.widget-help__input.widget__valid-error,\ninput[type=tel].widget-help__input.widget__valid-error,\ninput[type=email].widget-help__input.widget__valid-error,\ninput[type=text].widget-help__input.widget__valid-error {\n\tborder-color: red !important;\n\tbackground: rgba(255, 0, 0, 0.1) !important;\n}\n\n.widget__valid-error-text {\n\tfont-size: 10px;\n\tbackground: red;\n\tcolor: #fff;\n\tpadding: 0 3px;\n\tborder-radius: 3px;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\ttransform: translateY(-50%);\n}\n\n.widget-help__price {\n\tdisplay: flex;\n\tjustify-content: space-between;\n\tpadding: 0 8px;\n\tmargin-bottom: 20px;\n}\n\n.widget-help__price-link {\n\tfont-size: 20px;\n\tcolor: #F87F67;\n\tborder-bottom: 1px dashed #F87F67;\n\tcursor: pointer;\n\ttransition: 0.3s;\n\topacity: 0.65;\n}\n\n.widget-help__price-link:hover {\n\topacity: 1;\n}\n\n.widget-help__privacy {\n\tcolor: #9B7871;\n\tfont-size: 10px;\n\tfont-weight: 300;\n\ttext-align: center;\n}\n\n.widget-help__privacy a {\n\tcolor: #F8AC67;\n\ttext-decoration: none;\n}\n\n.widget-help__privacy a:hover {\n\ttext-decoration: underline;\n}\n\n.widget-help__submit {\n\tdisplay: block;\n\twidth: 100%;\n\theight: 59px;\n\tbackground: #F87F67;\n\tbox-shadow: 0px 10px 20px rgba(248, 127, 103, 0.3);\n\tborder-radius: 500px;\n\tborder: 0;\n\toutline: 0;\n\t-webkit-appearance: none;\n\ttext-transform: uppercase;\n\tcolor: #fff;\n\tfont-weight: bold;\n\tfont-size: 16px;\n\tcursor: pointer;\n\ttransition: 0.3s;\n\tmargin-left: auto;\n\tmargin-right: auto;\n    border: initial !important;\n}\n\n.widget-help__submit:hover {\n\topacity: 0.7;\n}\n\n.widget-help__submit[disabled] {\n    pointer-events: none;\n    opacity: .5;\n}\n\n.widget-help__check {\n\tdisplay: flex;\n\talign-items: center;\n\tcursor: pointer;\n\tfont-size: 13px;\n\tcolor: #7C5C56;\n\tpadding: 10px 0 13px;\n\tmargin-top: 0;\n\tmargin-bottom: 0;\n}\n\n.widget-help__check.widget-help__check_anonymous {\n    padding: 0px 0 4px;\n}\n\n.widget-help__check input[type=checkbox] {\n\tdisplay: none;\n}\n\n.widget-help__check input[type=checkbox]+span {\n\tborder: 1px solid #F8AC67;\n\tbox-sizing: border-box;\n\tborder-radius: 50px;\n\twidth: 41px;\n\theight: 24px;\n\tmin-width: 41px;\n\tmargin-right: 10px;\n\tposition: relative;\n\ttransition: 0.3s;\n}\n\n.widget-help__check input[type=checkbox]+span span {\n\tcontent: \"\";\n\tposition: absolute;\n\tz-index: 1;\n\tbackground: #F8AC67;\n\twidth: 17px;\n\theight: 17px;\n\tborder-radius: 50%;\n\tleft: 3px;\n\ttop: 3px;\n\ttransition: 0.3s;\n}\n\n.widget-help__check input[type=checkbox]:checked+span {\n\tborder-color: #0cc60c;\n\tanimation: none;\n}\n\n.widget-help__check input[type=checkbox]:checked+span span {\n\tbackground: #0cc60c;\n\ttransform: translateX(16px);\n\tanimation: none;\n}\n\n.widgetHelpShow .widget-help__check.animate-it input[type=checkbox]+span {\n\tanimation-name: tada;\n\tanimation-duration: 4s;\n\tanimation-iteration-count: infinite;\n\tanimation-timing-function: ease-in-out;\n}\n\n.widgetHelpShow .widget-help__step-1 .widget-help__check.animate-it input[type=checkbox]:checked+span {\n\t-background: rgba(248,172,103,1);\n\tanimation: none;\n}\n\n.widgetHelpShow .widget-help__step-2 .widget-help__check.animate-it input[type=checkbox]:checked+span {\n\t-background: rgba(248,172,103,1);\n\tanimation: none;\n}\n\n.widgetHelpShow .widget-help__step-2 .widget-help__check_anonymously input[type=checkbox]:checked+span {\n\t-background: rgba(248,172,103,1);\n\tanimation: none;\n}\n\n.widgetHelpShow .widget-help__step-1 .widget-help__check_anonymously input[type=checkbox]:checked+span {\n\t-background: rgba(248,172,103,1);\n\tanimation: none;\n}\n\n.widget-help__check_in.act {\n\tdisplay: none !important;\n}\n\n.widget-help__check_anonymously {\n\tpadding: 0 0 3px;\n}\n\n.widget-help__check_anonymously input[type=checkbox]+span {\n\ttransform: scale(1, 1);\n}\n\n.widget-help__submit_ok {\n\tmax-width: 100px;\n\tmargin: 0 auto;\n\tdisplay: block;\n}\n\n.widget-help__after-title_thank {\n\tpadding-bottom: 28px;\n}\n\n.widget-help__thank-img {\n\tdisplay: block;\n\tmargin: 0 auto 10px;\n}\n\n.widget-help__pop_thank {\n\tpadding-bottom: 44px;\n\tpadding-top: 85px;\n}\n\n.widget-help__edit-summa {\n\tposition: relative;\n\tmargin: 10px 0 3px;\n}\n\n.widget-help__summa-dec,\n.widget-help__summa-inc {\n\twidth: 33px;\n\theight: 33px;\n\tborder-radius: 50%;\n\tposition: absolute;\n\ttop: 50%;\n\ttransform: translateY(-50%);\n\tz-index: 300;\n\tcursor: pointer;\n\ttransition: 0.3s;\n\tbackground: #F4E9D9; \n\tborder: 1px solid #D9CCB8;\n}\n\n.widget-help__summa-dec:hover,\n.widget-help__summa-inc:hover {\n\topacity: 0.7;\n}\n\n.widget-help__summa-dec span,\n.widget-help__summa-inc span {\n\tdisplay: block;\n\tposition: absolute;\n\tz-index: 1;\n\theight: 2px;\n\twidth: 10px;\n\tposition: absolute;\n\ttop: 50%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%);\n\tbackground: #817057;\n}\n\n.widget-help__summa-dec span:nth-child(2),\n.widget-help__summa-inc span:nth-child(2) {\n\theight: 10px;\n\twidth: 2px;\n}\n\n.widget-help__summa-dec {\n\tleft: 7px;\n}\n\n.widget-help__summa-inc {\n\tright: 7px;\n}\n\n.widget-help__step-2 {\n\tdisplay: none;\n}\n\n@keyframes tada {\n\t0% {\n\t\ttransform: scale(1);\n\t}\n\t50% {\n\t\ttransform: scale(1) rotate(0);\n\t}\n\t55%,\n\t60% {\n\t\ttransform: scale(0.9) rotate(-5deg);\n\t}\n\t65%,\n\t75%,\n\t85%,\n\t95% {\n\t\ttransform: scale(1.05) rotate(5deg);\n\t}\n\t70%,\n\t80%,\n\t90% {\n\t\ttransform: scale(1.05) rotate(-5deg);\n\t}\n\t100% {\n\t\ttransform: scale(1) rotate(0);\n\t}\n}\n\n@keyframes trambling-animation {\n\t85% {\n\t\tbackground: #0cc60c;\n\t}\n}\n\n@keyframes trambling {\n\t85% {\n\t\tborder-color: #0cc60c;\n\t}\n}\n\n@media screen and (max-width: 768px) {\n\t.widget-help {\n\t\tright: 15px;\n\t\tbottom: 15px;\n\t\ttop: auto;\n\t\tleft: auto;\n\t}\n\t.widget-help.widget-help_left-bottom {\n\t\tright: auto;\n\t\tleft: 15px;\n\t}\n\t.widget-help.widget-help_right-top {\n\t\tright: 15px;\n\t\ttop: 15px;\n\t}\n}\n\n/**/\n\n.widget-help__left-top {\n\tleft: 10px;\n\ttop: 10px;\n}\n.widget-help__left-bottom {\n\tleft: 10px;\n\tbottom: 10px;\n}\n.widget-help__right-top {\n\tright: 10px;\n\ttop: 10px;\n}\n.widget-help__right-bottom {\n\tright: 10px;\n\tbottom: 10px;\n}\n\n.widget-help__step-1, .widget-help__step-2 {\n\tpadding: 80px 22px 15px;\n\tbackground-size: cover !important;\n\tborder-radius: 20px;\n}\n.widget-help__step-1 {\n\tpadding: 80px 22px 15px;\n\tbackground-size: cover !important;\n\tborder-radius: 20px;\n}\n\nbody input[type=text].widget-help__input-summa {\n\theight: 45px;\n\tmargin: 0 !important;\n\tfont-size: 22px;\n}\n.widget__hidden-f {\n\tdisplay: none;\n\topacity: 0;\n\theight: 0 !important;\n\tmargin: 0;\n}\n.widget-help__back {\n    position: absolute;\n    top: 10px;\n    left: 10px;\n    background: #FBF3E8;\n    border-radius: 50px;\n    width: 24px;\n    height: 24px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    transition: 0.3s;\n    color: rgba(73, 22, 13, 0.3);\n}\n\n.form-footer {\n    margin-top: 10px;\n    display: flex;\n    flex-direction: column;\n    gap: 10px;\n}\n\n.form-footer .form__list {\n    margin: unset;\n}\n\n.form-footer .form-agreement {\n    font-size: 10.5px;\n    color: #8B8B8B;\n    line-height: 1.3;\n    display: flex;\n    flex-direction: column;\n    gap: 10px;\n}\n\n.form-footer .form-agreement a {\n    color: inherit;\n    display: inline-block;\n}\n\n.form-footer .form-agreement .check {\n    border: solid 1px;\n    height: 13px;\n    width: 13px;\n    cursor: pointer;\n    border-radius: 3px;\n    position: relative;\n    display: inline-block;\n\tmargin: 0 5px -2px 0;\n}\n\n.form-footer .form-agreement .check.checked::before,\n.form-footer .form-agreement .check.checked::after {\n    position: absolute;\n    content: \"\";\n    background: #8B8B8B;\n    width: 4px;\n    height: 1px;\n    transform: rotate(45deg);\n    left: 1px;\n    top: 6px;\n}\n\n.form-footer .form-agreement .check.checked::after {\n    width: 7px;\n    transform: rotate(-45deg);\n    left: 3px;\n    top: 5px;\n}\n\n.form-footer.agreement-first {\n    flex-direction: column-reverse;\n}\n\n.form-footer.agreement-first .form-agreement {\n    font-size: 13px;\n    color: #8B8B8B;\n}\n\n.form-footer.agreement-first .form-agreement .check {\n    height: 15px;\n    width: 15px;\n}\n\n.form-footer.agreement-first .form-agreement .check.checked::before,\n.form-footer.agreement-first .form-agreement .check.checked::after {\n    background: #8B8B8B;\n    left: 2px;\n    top: 7px;\n}\n\n.form-footer.agreement-first .form-agreement .check.checked::after {\n    left: 4px;\n    top: 6px;\n}\n\n.position-relative {\n    position: relative;\n}\n\n.tooltip-alert {\n    position: absolute;\n    top: 0;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    border-radius: 2px;\n    padding: 0 3px;\n    background: white;\n    color: black;\n    line-height: 1.2;\n    font-size: 11px;\n    white-space: nowrap;\n}\n\n.tooltip-alert-danger {\n    background: red;\n    color: white;\n}\n\n.cursor-pointer {\n\tcursor: pointer;\n}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./build/scripts/infoBlock/assets/jpg.svg.mjs":
/*!****************************************************!*\
  !*** ./build/scripts/infoBlock/assets/jpg.svg.mjs ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVk\nIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVy\nIFRvb2xzIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4i\nICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3Zn\nIGhlaWdodD0iODAwcHgiIHdpZHRoPSI4MDBweCIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4\nbWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICAgdmlld0JveD0iMCAwIDU2IDU2\nIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRTlFOUUwOyIg\nZD0iTTM2Ljk4NSwwSDcuOTYzQzcuMTU1LDAsNi41LDAuNjU1LDYuNSwxLjkyNlY1NWMwLDAuMzQ1\nLDAuNjU1LDEsMS40NjMsMWg0MC4wNzQKCQljMC44MDgsMCwxLjQ2My0wLjY1NSwxLjQ2My0xVjEy\nLjk3OGMwLTAuNjk2LTAuMDkzLTAuOTItMC4yNTctMS4wODVMMzcuNjA3LDAuMjU3QzM3LjQ0Miww\nLjA5MywzNy4yMTgsMCwzNi45ODUsMHoiLz4KICAgIDxwb2x5Z29uIHN0eWxlPSJmaWxsOiNEOUQ3\nQ0E7IiBwb2ludHM9IjM3LjUsMC4xNTEgMzcuNSwxMiA0OS4zNDksMTIgCSIvPgogICAgPGNpcmNs\nZSBzdHlsZT0iZmlsbDojRjNENTVCOyIgY3g9IjE4LjkzMSIgY3k9IjE0LjQzMSIgcj0iNC41Njki\nLz4KICAgIDxwb2x5Z29uIHN0eWxlPSJmaWxsOiMyNkI5OUE7IiBwb2ludHM9IjYuNSwzOSAxNy41\nLDM5IDQ5LjUsMzkgNDkuNSwyOCAzOS41LDE4LjUgMjksMzAgMjMuNTE3LDI0LjUxNyAJIi8+CiAg\nICA8cGF0aCBzdHlsZT0iZmlsbDojMTRBMDg1OyIKICAgICAgICAgIGQ9Ik00OC4wMzcsNTZINy45\nNjNDNy4xNTUsNTYsNi41LDU1LjM0NSw2LjUsNTQuNTM3VjM5aDQzdjE1LjUzN0M0OS41LDU1LjM0\nNSw0OC44NDUsNTYsNDguMDM3LDU2eiIvPgogICAgPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZG\nRkZGRjsiIGQ9Ik0yMS40MjYsNDIuNjV2Ny44NDhjMCwwLjQ3NC0wLjA4NywwLjg3My0wLjI2LDEu\nMTk2Yy0wLjE3MywwLjMyMy0wLjQwNiwwLjU4My0wLjY5NywwLjc3OQoJCQljLTAuMjkyLDAuMTk2\nLTAuNjI3LDAuMzMzLTEuMDA1LDAuNDFDMTkuMDg1LDUyLjk2MSwxOC42OTYsNTMsMTguMjk1LDUz\nYy0wLjIwMSwwLTAuNDM2LTAuMDIxLTAuNzA0LTAuMDYyCgkJCWMtMC4yNjktMC4wNDEtMC41NDct\nMC4xMDQtMC44MzQtMC4xOTFzLTAuNTYzLTAuMTg1LTAuODI3LTAuMjk0Yy0wLjI2NS0wLjEwOS0w\nLjQ4OC0wLjIzMi0wLjY3LTAuMzY5bDAuNjk3LTEuMTA3CgkJCWMwLjA5MSwwLjA2MywwLjIyMSww\nLjEzLDAuMzksMC4xOThjMC4xNjgsMC4wNjgsMC4zNTMsMC4xMzIsMC41NTQsMC4xOTFjMC4yLDAu\nMDYsMC40MSwwLjExMSwwLjYyOSwwLjE1NwoJCQlzMC40MjQsMC4wNjgsMC42MTUsMC4wNjhjMC40\nODMsMCwwLjg2OC0wLjA5NCwxLjE1NS0wLjI4czAuNDM5LTAuNTA0LDAuNDU4LTAuOTVWNDIuNjVI\nMjEuNDI2eiIvPgogICAgICAgIDxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMjUuNTE0\nLDUyLjkzMmgtMS42NDFWNDIuODU1aDIuODk4YzAuNDI4LDAsMC44NTIsMC4wNjgsMS4yNzEsMC4y\nMDUKCQkJYzAuNDE5LDAuMTM3LDAuNzk1LDAuMzQyLDEuMTI4LDAuNjE1YzAuMzMzLDAuMjczLDAu\nNjAyLDAuNjA0LDAuODA3LDAuOTkxczAuMzA4LDAuODIyLDAuMzA4LDEuMzA2CgkJCWMwLDAuNTEx\nLTAuMDg3LDAuOTczLTAuMjYsMS4zODhjLTAuMTczLDAuNDE1LTAuNDE1LDAuNzY0LTAuNzI1LDEu\nMDQ2Yy0wLjMxLDAuMjgyLTAuNjg0LDAuNTAxLTEuMTIxLDAuNjU2CgkJCXMtMC45MjEsMC4yMzIt\nMS40NDksMC4yMzJoLTEuMjE3VjUyLjkzMnogTTI1LjUxNCw0NC4xdjMuOTkyaDEuNTA0YzAuMiww\nLDAuMzk4LTAuMDM0LDAuNTk1LTAuMTAzCgkJCWMwLjE5Ni0wLjA2OCwwLjM3Ni0wLjE4LDAuNTQt\nMC4zMzVzMC4yOTYtMC4zNzEsMC4zOTYtMC42NDljMC4xLTAuMjc4LDAuMTUtMC42MjIsMC4xNS0x\nLjAzMmMwLTAuMTY0LTAuMDIzLTAuMzU0LTAuMDY4LTAuNTY3CgkJCWMtMC4wNDYtMC4yMTQtMC4x\nMzktMC40MTktMC4yOC0wLjYxNWMtMC4xNDItMC4xOTYtMC4zNC0wLjM2LTAuNTk1LTAuNDkyQzI3\nLjUsNDQuMTY2LDI3LjE2Myw0NC4xLDI2Ljc0NCw0NC4xSDI1LjUxNHoiLz4KICAgICAgICA8cGF0\naCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTM5LjUsNDcuNzM2djMuODk2Yy0wLjIxLDAuMjY1\nLTAuNDQ0LDAuNDgtMC43MDQsMC42NDlzLTAuNTMzLDAuMzA4LTAuODIsMC40MTcKCQkJcy0wLjU4\nMywwLjE4Ny0wLjg4OSwwLjIzMkMzNi43ODEsNTIuOTc4LDM2LjQ3OSw1MywzNi4xNzgsNTNjLTAu\nNjAyLDAtMS4xNTUtMC4xMDktMS42NjEtMC4zMjhzLTAuOTQ4LTAuNTQyLTEuMzI2LTAuOTcxCgkJ\nCWMtMC4zNzgtMC40MjktMC42NzUtMC45NjYtMC44ODktMS42MTNjLTAuMjE0LTAuNjQ3LTAuMzIx\nLTEuMzk1LTAuMzIxLTIuMjQyczAuMTA3LTEuNTkzLDAuMzIxLTIuMjM1CgkJCWMwLjIxNC0wLjY0\nMywwLjUxLTEuMTc4LDAuODg5LTEuNjA2YzAuMzc4LTAuNDI5LDAuODIyLTAuNzU0LDEuMzMzLTAu\nOTc4YzAuNTEtMC4yMjQsMS4wNjItMC4zMzUsMS42NTQtMC4zMzUKCQkJYzAuNTQ3LDAsMS4wNTcs\nMC4wOTEsMS41MzEsMC4yNzNjMC40NzQsMC4xODMsMC44OTcsMC40NTYsMS4yNzEsMC44MmwtMS4x\nMzUsMS4wMTJjLTAuMjE5LTAuMjY1LTAuNDctMC40NTYtMC43NTItMC41NzQKCQkJYy0wLjI4My0w\nLjExOC0wLjU3NC0wLjE3OC0wLjg3NS0wLjE3OGMtMC4zMzcsMC0wLjY1OSwwLjA2My0wLjk2NCww\nLjE5MWMtMC4zMDYsMC4xMjgtMC41NzksMC4zNDQtMC44MiwwLjY0OQoJCQljLTAuMjQyLDAuMzA2\nLTAuNDMxLDAuNjk5LTAuNTY3LDEuMTgzcy0wLjIxLDEuMDc1LTAuMjE5LDEuNzc3YzAuMDA5LDAu\nNjg0LDAuMDgsMS4yNzYsMC4yMTIsMS43NzcKCQkJYzAuMTMyLDAuNTAxLDAuMzE0LDAuOTExLDAu\nNTQ3LDEuMjNzMC40OTcsMC41NTYsMC43OTMsMC43MTFjMC4yOTYsMC4xNTUsMC42MDgsMC4yMzIs\nMC45MzcsMC4yMzJjMC4xLDAsMC4yMzQtMC4wMDcsMC40MDMtMC4wMjEKCQkJYzAuMTY4LTAuMDE0\nLDAuMzM3LTAuMDM2LDAuNTA2LTAuMDY4YzAuMTY4LTAuMDMyLDAuMzMtMC4wNzUsMC40ODUtMC4x\nM2MwLjE1NS0wLjA1NSwwLjI2OS0wLjEzMiwwLjM0Mi0wLjIzMnYtMi40ODhoLTEuNzA5CgkJCXYt\nMS4xMjFIMzkuNXoiLz4KCTwvZz4KPC9nPgo8L3N2Zz4=\n");

/***/ }),

/***/ "./build/scripts/infoBlock/assets/pdf.svg.mjs":
/*!****************************************************!*\
  !*** ./build/scripts/infoBlock/assets/pdf.svg.mjs ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVk\nIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVy\nIFRvb2xzIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4i\nICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3Zn\nIGhlaWdodD0iODAwcHgiIHdpZHRoPSI4MDBweCIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4\nbWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICAgdmlld0JveD0iMCAwIDU2IDU2\nIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRTlFOUUwOyIg\nZD0iTTM2Ljk4NSwwSDcuOTYzQzcuMTU1LDAsNi41LDAuNjU1LDYuNSwxLjkyNlY1NWMwLDAuMzQ1\nLDAuNjU1LDEsMS40NjMsMWg0MC4wNzQKCQljMC44MDgsMCwxLjQ2My0wLjY1NSwxLjQ2My0xVjEy\nLjk3OGMwLTAuNjk2LTAuMDkzLTAuOTItMC4yNTctMS4wODVMMzcuNjA3LDAuMjU3QzM3LjQ0Miww\nLjA5MywzNy4yMTgsMCwzNi45ODUsMHoiLz4KICAgIDxwb2x5Z29uIHN0eWxlPSJmaWxsOiNEOUQ3\nQ0E7IiBwb2ludHM9IjM3LjUsMC4xNTEgMzcuNSwxMiA0OS4zNDksMTIgCSIvPgogICAgPHBhdGgg\nc3R5bGU9ImZpbGw6I0NDNEI0QzsiIGQ9Ik0xOS41MTQsMzMuMzI0TDE5LjUxNCwzMy4zMjRjLTAu\nMzQ4LDAtMC42ODItMC4xMTMtMC45NjctMC4zMjYKCQljLTEuMDQxLTAuNzgxLTEuMTgxLTEuNjUt\nMS4xMTUtMi4yNDJjMC4xODItMS42MjgsMi4xOTUtMy4zMzIsNS45ODUtNS4wNjhjMS41MDQtMy4y\nOTYsMi45MzUtNy4zNTcsMy43ODgtMTAuNzUKCQljLTAuOTk4LTIuMTcyLTEuOTY4LTQuOTktMS4y\nNjEtNi42NDNjMC4yNDgtMC41NzksMC41NTctMS4wMjMsMS4xMzQtMS4yMTVjMC4yMjgtMC4wNzYs\nMC44MDQtMC4xNzIsMS4wMTYtMC4xNzIKCQljMC41MDQsMCwwLjk0NywwLjY0OSwxLjI2MSwxLjA0\nOWMwLjI5NSwwLjM3NiwwLjk2NCwxLjE3My0wLjM3Myw2LjgwMmMxLjM0OCwyLjc4NCwzLjI1OCw1\nLjYyLDUuMDg4LDcuNTYyCgkJYzEuMzExLTAuMjM3LDIuNDM5LTAuMzU4LDMuMzU4LTAuMzU4YzEu\nNTY2LDAsMi41MTUsMC4zNjUsMi45MDIsMS4xMTdjMC4zMiwwLjYyMiwwLjE4OSwxLjM0OS0wLjM5\nLDIuMTYKCQljLTAuNTU3LDAuNzc5LTEuMzI1LDEuMTkxLTIuMjIsMS4xOTFjLTEuMjE2LDAtMi42\nMzItMC43NjgtNC4yMTEtMi4yODVjLTIuODM3LDAuNTkzLTYuMTUsMS42NTEtOC44MjgsMi44MjIK\nCQljLTAuODM2LDEuNzc0LTEuNjM3LDMuMjAzLTIuMzgzLDQuMjUxQzIxLjI3MywzMi42NTQsMjAu\nMzg5LDMzLjMyNCwxOS41MTQsMzMuMzI0eiBNMjIuMTc2LDI4LjE5OAoJCWMtMi4xMzcsMS4yMDEt\nMy4wMDgsMi4xODgtMy4wNzEsMi43NDRjLTAuMDEsMC4wOTItMC4wMzcsMC4zMzQsMC40MzEsMC42\nOTJDMTkuNjg1LDMxLjU4NywyMC41NTUsMzEuMTksMjIuMTc2LDI4LjE5OHoKCQkgTTM1LjgxMywy\nMy43NTZjMC44MTUsMC42MjcsMS4wMTQsMC45NDQsMS41NDcsMC45NDRjMC4yMzQsMCwwLjkwMS0w\nLjAxLDEuMjEtMC40NDFjMC4xNDktMC4yMDksMC4yMDctMC4zNDMsMC4yMy0wLjQxNQoJCWMtMC4x\nMjMtMC4wNjUtMC4yODYtMC4xOTctMS4xNzUtMC4xOTdDMzcuMTIsMjMuNjQ4LDM2LjQ4NSwyMy42\nNywzNS44MTMsMjMuNzU2eiBNMjguMzQzLDE3LjE3NAoJCWMtMC43MTUsMi40NzQtMS42NTksNS4x\nNDUtMi42NzQsNy41NjRjMi4wOS0wLjgxMSw0LjM2Mi0xLjUxOSw2LjQ5Ni0yLjAyQzMwLjgxNSwy\nMS4xNSwyOS40NjYsMTkuMTkyLDI4LjM0MywxNy4xNzR6CgkJIE0yNy43MzYsOC43MTJjLTAuMDk4\nLDAuMDMzLTEuMzMsMS43NTcsMC4wOTYsMy4yMTZDMjguNzgxLDkuODEzLDI3Ljc3OSw4LjY5OCwy\nNy43MzYsOC43MTJ6Ii8+CiAgICA8cGF0aCBzdHlsZT0iZmlsbDojQ0M0QjRDOyIKICAgICAgICAg\nIGQ9Ik00OC4wMzcsNTZINy45NjNDNy4xNTUsNTYsNi41LDU1LjM0NSw2LjUsNTQuNTM3VjM5aDQz\ndjE1LjUzN0M0OS41LDU1LjM0NSw0OC44NDUsNTYsNDguMDM3LDU2eiIvPgogICAgPGc+CgkJPHBh\ndGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xNy4zODUsNTNoLTEuNjQxVjQyLjkyNGgyLjg5\nOGMwLjQyOCwwLDAuODUyLDAuMDY4LDEuMjcxLDAuMjA1CgkJCWMwLjQxOSwwLjEzNywwLjc5NSww\nLjM0MiwxLjEyOCwwLjYxNWMwLjMzMywwLjI3MywwLjYwMiwwLjYwNCwwLjgwNywwLjk5MXMwLjMw\nOCwwLjgyMiwwLjMwOCwxLjMwNgoJCQljMCwwLjUxMS0wLjA4NywwLjk3My0wLjI2LDEuMzg4Yy0w\nLjE3MywwLjQxNS0wLjQxNSwwLjc2NC0wLjcyNSwxLjA0NmMtMC4zMSwwLjI4Mi0wLjY4NCwwLjUw\nMS0xLjEyMSwwLjY1NgoJCQlzLTAuOTIxLDAuMjMyLTEuNDQ5LDAuMjMyaC0xLjIxN1Y1M3ogTTE3\nLjM4NSw0NC4xNjh2My45OTJoMS41MDRjMC4yLDAsMC4zOTgtMC4wMzQsMC41OTUtMC4xMDMKCQkJ\nYzAuMTk2LTAuMDY4LDAuMzc2LTAuMTgsMC41NC0wLjMzNWMwLjE2NC0wLjE1NSwwLjI5Ni0wLjM3\nMSwwLjM5Ni0wLjY0OWMwLjEtMC4yNzgsMC4xNS0wLjYyMiwwLjE1LTEuMDMyCgkJCWMwLTAuMTY0\nLTAuMDIzLTAuMzU0LTAuMDY4LTAuNTY3Yy0wLjA0Ni0wLjIxNC0wLjEzOS0wLjQxOS0wLjI4LTAu\nNjE1Yy0wLjE0Mi0wLjE5Ni0wLjM0LTAuMzYtMC41OTUtMC40OTIKCQkJYy0wLjI1NS0wLjEzMi0w\nLjU5My0wLjE5OC0xLjAxMi0wLjE5OEgxNy4zODV6Ii8+CiAgICAgICAgPHBhdGggc3R5bGU9ImZp\nbGw6I0ZGRkZGRjsiIGQ9Ik0zMi4yMTksNDcuNjgyYzAsMC44MjktMC4wODksMS41MzgtMC4yNjcs\nMi4xMjZzLTAuNDAzLDEuMDgtMC42NzcsMS40NzdzLTAuNTgxLDAuNzA5LTAuOTIzLDAuOTM3CgkJ\nCXMtMC42NzIsMC4zOTgtMC45OTEsMC41MTNjLTAuMzE5LDAuMTE0LTAuNjExLDAuMTg3LTAuODc1\nLDAuMjE5QzI4LjIyMiw1Mi45ODQsMjguMDI2LDUzLDI3Ljg5OCw1M2gtMy44MTRWNDIuOTI0aDMu\nMDM1CgkJCWMwLjg0OCwwLDEuNTkzLDAuMTM1LDIuMjM1LDAuNDAzczEuMTc2LDAuNjI3LDEuNiwx\nLjA3M3MwLjc0LDAuOTU1LDAuOTUsMS41MjRDMzIuMTE0LDQ2LjQ5NCwzMi4yMTksNDcuMDgsMzIu\nMjE5LDQ3LjY4MnoKCQkJIE0yNy4zNTIsNTEuNzk3YzEuMTEyLDAsMS45MTQtMC4zNTUsMi40MDYt\nMS4wNjZzMC43MzgtMS43NDEsMC43MzgtMy4wOWMwLTAuNDE5LTAuMDUtMC44MzQtMC4xNS0xLjI0\nNAoJCQljLTAuMTAxLTAuNDEtMC4yOTQtMC43ODEtMC41ODEtMS4xMTRzLTAuNjc3LTAuNjAyLTEu\nMTY5LTAuODA3cy0xLjEzLTAuMzA4LTEuOTE0LTAuMzA4aC0wLjk1N3Y3LjYyOUgyNy4zNTJ6Ii8+\nCiAgICAgICAgPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zNi4yNjYsNDQuMTY4djMu\nMTcyaDQuMjExdjEuMTIxaC00LjIxMVY1M2gtMS42NjhWNDIuOTI0SDQwLjl2MS4yNDRIMzYuMjY2\neiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPg==\n");

/***/ }),

/***/ "./build/scripts/infoBlock/assets/phonePreview.png.mjs":
/*!*************************************************************!*\
  !*** ./build/scripts/infoBlock/assets/phonePreview.png.mjs ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("iVBORw0KGgoAAAANSUhEUgAAAfQAAAITCAMAAADGoR4fAAAB+1BMVEUAAAACAgEREQwAAAAAAACc\nnJtQT0wNDQsEBANiYl+BgX8FBQWIiIYHBwUJCAYGBgUKCgYDAwMGBgUEBAMTEg8ICAcCAgIZGBYD\nAwMDAwIKCQcCAgCnpqQHBwWUlJBPT0ukpKBdXVlVVVEqKig/PzwyMjF9fXl+f3z////19fUAAACw\nsLDn7O3w8PD7+/saGhm8vLj39/eoqKSUlI8yMC4fHx/d3d1eXlwVFRQpKCS1tbOPj4ttbWrf393z\n8/MLCgifn5oFBQWysq6iopwPDw39/f2+vrygoJuqqqfU1NO5ubWZmZSzs7PR0tCmpqGCgn+KiocS\nEhG0tbC2trOtra35+fmSko3///crKimMi4eXl5eVlZPh4uGsrKqbm5fY2NejpJ+NjYrr8PHOzs3D\nw8GRkZDb3Nvr7OskIyHV1dXi4uLGxsVsbGiur6ppaWVxcW3/+/b4/vtGRUPt8vNTU1B3d3Q3NjQA\nXv8eHRs1h//6+PZ9fXtMS0nn5+bk5OQBb//Z2dnu7u08Ozr///tBQD9Hlv/v9fYFaf/AwL+FhYPK\nyslbW1hlZWPIyMjh7/mbm5pyc3Eqg/+x1P7y+/ttqv99tvoAVv+ozvueyPnM5fwAd/8oPWsAS/9d\no/9wsv00TWwYef+63f4hLkmLv/wkTYwXHjKr1fsjg6RSVnMcgQcLAAAAKHRSTlMAxeFPLe6YIAf+\n51n8tdRC4WiGnfSReO8UM+mq8PF0mLKYmMej3Lm4lt09fgAAI7BJREFUeNrsmutP2lAUwIdbokZx\nPvfe91MWKZTHymCjlEcr1QLtJHUCKwEE5ZUQICSAmYYPKhr9k3fL3XtjU0ElGT9vT8895+ZU7uGc\ntgn3hsrUk8nJBzMzMytLS3q9XqebezY/MTExj5gY8yfmp00vEGxl/rtpQqfT6fVLS0sLMzMPH0w+\nmZq6N6pMPry/uPR8bmK54agfVrvTp7VmePv8A/eqyLKStG66CoHLOgOBn+wBDFLuhnQ/h+noCIsj\n07dxpDnks71PCHtexh8l+Coep7hM5rhWK3W7FavDsTw3p19ZePjg3ogxdX9hRfes4Th8fZHkgqm3\nBwerxKYRxlwC4u3e3t5+7Pfd8m+aidWs/WSdC5e7deXx3PPFmckRqfmpB4/0z0hr5eLDeuoAwG80\nm4lsbDeVPzJJb6R4nOd58cqoP+kqhSQaKkVpDgqd0cFTlIgEPxgowtXQLtiTGKTEcQykFdEU6XF0\n/u7W1Limasvw+Qu9mWktlUptbEhiHC2LF+PFIitLQVMgf5Jas7cPzGajH8C/f8ZmTivKY93iwztP\n/OTMim65Xg0Fd1cBjFn7xtF7NZGwZJxOZxSxjRASV4DB8lJ4vwpuELxXRlXVnsT0puIXByV6RaSL\nFDIjRDRX0VB7AtnREJFKqaJm6xkT0tpJKnWyEWd6USkc3cv1dkJIMJzIvwqc7OwTAP526lWtihL/\n6A5b/dTM0rNcq8numQHaGwEqse1MJi3CuVaIfDHOF9k4K0sSy7JIYCQ0sEUbWEEGTdMkAp9/Rpa/\nnWQkgzLStGpAfz3wCU9NWNG0nsQKPpA04RWjg5TK7u3v72XPpN40iJ9NgjL6v3v7UORFLiEIgpeS\nT+wE+Ildplxfvou8464+T1dC8ir4sycSF0WVLXA8i9oTalIixwiWaHT2OFS7KF9c1AqukqtUKJVc\nLnRggfVCAR3aBB9I17QCMhd+pIzWolFGMcqFgqaVtRjIXHZhkLVQ1kLgyL05Un4AL9Vi/Zkyuva/\nXeVfXVhg+YfYyPaHwGU0sKvsqh2HQs1QqIY/O9quWq0WCiczqMy9Iq9904OyKVhUGWTg2LR287fz\nBeuybuG22/zUfR1tLUhtML4NMpmkJcFRLMtTXMISQpnotjqdTqViVawOW87WaDRIkmzQSP4CjY5I\nT/YUDP2DxNBfXJGePRLBk55OI0mTX2UEx6NxULxQm6FpJNKzaqF8yEX/iubG2t9d5C9OzYXiYomV\nn4n8fjW8tBfYhwYGR6LRNqEtcyiKtVPpIKrTrnLNyYmsFAzIPIVSzxVTWfB/5LrK/OLkvdtjakZH\ntjIfAd7Kia1kAvVyidrONMunlbqiKDmSdhs8CMOYAcBb6KZJ7Stw+Bql/lxEiZd4xiKwqXdA5C/q\nyyu3knaccroqZsGc55xbFootFtVmbbp12EDJHif6ZnCjFuCodMtNiySbTLwgMHIMYG22cwtpx42d\nrPIH0GYtzm2vxKqJWrVSR03KMOaGcfto5bB16qSktCRygrpBwMfw4ePFG7+3Tz6PtEQC7PzWlpdn\n485a1arQhnGB3wa45duUTmFWTcusN8qkzRA7rk88unejLLxUZrPQ5p1JRmLF0Ou6jTSMuWV8NqVa\nFuSAxAjMmR9OXDn9Db7APdXbymuQZZNRRpKipYqVHjf1O8HjJjvdWTbNqgK3Bkaqtbxw74aYWa5Q\n4A84t7wsaynVFbdhzF3h8TSU1vGrtKxaxLeQDTl0N1LsT/RkaQd2mLBQlITSYY42jLlbaKUako6K\ngiUAsF65iWJ/Ou8QAIJhp1fmyx1l3NdHAA9trWbSAVFgUDW6yJVhP8Y/Wm6lIZYIcxLbrCiR8eP6\naOBu1KfFNMsIATBuK7rhvrMv+kptSCWdapCZro8b+wjhy3WapoAYpQ4gWJkb4o19aoVuGmF91hKX\nmxXHuMpHCg9p7fJpSmvxG1Xfw6ElXa+cwyqXZILqa4Uc53zU8OQ64SPZK6Tg7enykLI+9VyhYHV7\nSzVttxzj17QRxEPWayYTEzUB4aJnhpJzvfIeYpYoJYfqtiuVudsdIRs2Wy7nUPqSa/x/ncOXU/rj\nyOVsDZKOuD1XCql02YBqkYCo0feH0dutMnzacvJyzUpe7vqd1xehZIIP5vOpjd2Pn3Z27Huxfth3\n88mc4T/C011PfYr13ZA9+87Op92NVCqfXmec4Wapar1UpblzLTHNW+LmzWFkfSnHQ2wrWpRK1sg/\nv8GV8vartfbBph+uwn7V8N/g5uBK+In2Xvr8eNr6r47osVWYvBiNg9G1PGjWF23nEItaWHZacf/1\nmsqpkG/jZPuNm2azmbgsZiAqhv8FFaXx0pjNm0Y/9FjdZZst+q+hyfp2nrKwcNB9Ntj7+gK9BbFk\nNB7vOnx/yXinGcwCgJG4HnBm+E+oAhDXYlPb3jX1lPxr1jOow0vwsTX3ZICc3/eVgciEeamr9M+5\no3n2DgDMxLUB4tAw6ng8w/hZEAfviGvjB/C3xVb/jkvXLajDm+Ckoh/gFxPPWllgkpRc6p/zQyYL\n4DcTg2CE14bRxuPDuAd8bj8DYsCdAjgrk/1rnUl7oxtQzD269sva3GEK4mHK5LL2y3nrzTswEoNi\nhqZhlPG4fV8ZrNxtdhjCZkEs1OiX9Q6VVj/swCx53Ye5FVKF/HEi2Kz3eW5X4kbwE0MAnIYR5jM7\n5/6bNBTF8fhIdPEd4yvG38+9hsLloZ2PXootMJC6gjX4GNPABhtOEwLL4sDowg/iI9vv+8HEaPTP\n9JardHCrY4MaXfxM8PSwFbZvz+m5pwdYmHdV5+E+iuqVl6OLzmXfoL9oztVzgUL0tfLs5O6KuRNa\nAxaPprMP2zJ2Q77u45KPDjzE3qHuENc4p6qtNtXoSBk+3wI0Dixg523shjo5EVgKzcBs++Luknut\nDA9CsWAz4l6IzoKExgSsY89QNUrpj1jl/zkmwzEpf0wIZduN1YimfvpiB72sjiD6ax2NCYCEa/6l\nkxulmVAVkpXdDFWc9Wdh6X4ye7Xiuu85CYiiIMRuowMJ7BWqnzKlTPb1A9NvynxDZoYpc6fJbtxS\nNVOo4VS6uWnS/MdPKqWmhndN2KejcSHBlGuwa+F7JSN9E55fOrTz5K5uQGY6nVsNUyxSqQIgND7R\nDewVFT/tSiszNJOJy9+ZZDLkn2jcyf2aOkkF0T99/tbWtC8fI9gO+12zLEloXCgEpA3XYq6ZTEWD\nkGkf23Fy39dukYdz2dCaiUWai8CfmH2NA7iNPUJdNqls42fI3JJNbvIN7rdv3NRwON+3Bx7o39qY\nRj5/srMG3jU1IGh8KBKsU7di7lk8mY5DonJkp20ZvwHXjiaXmitY5KoFaLyiVzXsDXRNU2U71J3I\nZqafCdx1Mp259pqd8/n34OWwKPrHTRlHNpnoqinjXXMD0EiIqsf9WIDm77PVell/t8PG3PnjdVJm\nUxONvIoF3kvOax+T6K1J7BGTMrXTt/kTjSd0J71r3M38JgdX/EJ63/wYpurHr5+/qNoooj8BNFYU\nAkUTC2i1y4FCDAI7rOXO+K+BcT2WaPqxwDPQ0ZghUMMeoUVUap/THdG1n7Zsm/YGh3JT1SJiIfdl\nMyyrm18/UhboI6R3A9C4gQ9+lwR/o7qUfiVtnDy8k/7ryWeQuR/NPa1ggQkA5KCgsQAN7BVUU6lq\nQxnc7BoM2+QWd3NkVVyyqf68TCNrGpXNEd7Vo80K4eKN6mZ7PRA1oBo+u5Pl2mQAEk9iT1zar7UX\ngBzGJvpl7BlcaAd723GJfuHnTY0v9dmdXQ6MULwTgsYOgduq2O99n0qmi9A4fnj4QL/0FIqdYKwe\nEV93a8xxzpHKK9hjVPumclPlVs/P4U4RalIG7+DIowyGdkAUXWH/nA0FEcuyiONjMJ8LyMGln0mX\nQ2+ij6Vi+NQOSvc4JEK56bAqJKgMIC9EJ3AD/730+jqa309HOOwyIEoOAJbyc0sCjuNjTgtcIb3v\nsOCZuFivB7KhDGzsH7qA31cnV54YS+/E6CsAQZ4Acfz3olKtWwrK8khv7bnq0reGxctFnZsKAVi8\n22k0Gk9SZS4q9xaTyZlBLt/cojqQNbE/8TD++DFUh16rH5GDkLwXO7osnNHfgYW8Qdf/6kE5VdXs\nRi3Fo5Drn6CwN0BZw2qg61d0mO8NxlQ2rvAjRLEgOF1cmOpnYTZ3pwTOnqAqvLKVidRS+oo1sW/Y\n+dda+dFcNPZUCHT/IiCPUKC012ehm/1ZUiHAmDcxXgelq3nHVo76V7rKawkAH0IIikeVm8lYP8kA\nTHVebjmGoCN2pQqpwhIEh7ywfvDSUYgdXSrUhECPAvIOeI/3NOrbgUCHqWARyhWMDVCY5uiqXSdf\nr7Z8L+N38sx+RiwFETDe3tSwwAZEq85BpOjWMh6g8jxgrJcf1U4PNwyZL5JQKLsaEQ5VyUvR9Zd5\nvJeZhi2C25pfiWD6Uv8hOoI5jOXLAK1SruQD6brG0z4TPWNgkTUlWdpaIkBKqD7bRioUh85QvdjD\n+yYg01kKtoXjK+6l5n95LTcyTsTwzK53z2dV6IleXo7MQ7yuYSb+xDy89b9HFkIEkpkZLFIjyeKb\nkpM7dHgnNKA78cRjqZQfppS7YEZh5l52elIc3yXISyx4gvcsk70zsKIoSCo9KEKRYrzQE90nlcvO\nulW9Di2k+7jod91Et5JTyQ3JWe3BByqs2rLZ0CLUh8nvZ/Pz0tzj2EQF90OrgDxFkf7y+cgRqMyC\n0gtyCUoUr0iZPtGRT4dpW825mU6YqZ4Dy4d+IzpJLszcsCSnTBAnisNGoBCAOf+hIRbpV63i/aQ4\nXl0H5DGKvldVz7/6GedEny29hiRTtbzQLzpSoBXGQbBZxTcID+Jfp/dgJhDfWhqKoT7ZCASjUKwc\nGKJ2X4fgvWxnWRXP6F6jAKT34sKt7Sx1Ia7iJuRE0Rk+uFKFeC1/9RWUfF0fF/3Wrwo5y2mJul2p\npPVUrNDyNc9sn90jb610OvdUHnwWHyDPUQh8COM9htrwgaPMHMYVEnAVHfkkyGGGudBrtxEwilNu\nMw2QKMFWzV0uWtFaNFsIsPp9+85ME2WeGIm6hvsJea85V93X2VufadMuASj9oltZW/Qi07JIeHOm\nl+padkP1KdrSYq3eR8V0tJ90kLzqLIKCtgKv84Pj0I14NAipyIltT+mrEJiOTQ9OzJgZQH8GgNnG\nnvnsUbVmWOAoyKcB1+zCvYJaK5guQrivPavo5D1eBfD1HBJEry/MDjJfuhMYFER8n5DG+jPR8uza\nqe2GYGUDbt2Lra649BD/EATg5sP6HtBdzT9PkYG/G0FxYx6kqjGlQybxQYdXj0s6clAAZYiubHFY\nUilhBI1+Eokpfiw5uDRo5ObjbPotTFzcrh03uVCeSxg3KrifdUB/DIUAkMXbd+xPYYhE7CHV3iyr\nbXOELWaLThH+ON9p1xQeY83vrR7nIeFJhD3+2EEkkm9ebax/KANYivi76b07QL1Lq47IQHyo3+GK\neF1bImuDR93DeCgF09tddDndhPnppcQaxX3IVyRXeRTkDUQHAF1CrZvzmak/zcLUSGRm5x+VLR24\nnAIKUvrvBtRTFCEGiCVABM0Z8BT3s9JJFYJw+dzBbXqwN6A0HYuGB2t3iaA/Del+EMO/iUQIQX8c\nSArXV7PJwutX23Riz59ch2Ro5uig6KuA/vPXI7UGKiGzNpNKf2fn/n6ThqI4gGfRRI3xwd9R4/tp\nbssusIEbOmsntaMUFToypUWhFSzdNHHDl22EkYVsY2T+yUKMDzst1xlfuJXvv/Dh3t57OOe2sju3\n2Oe4eRd0WQnMry2Hoo+3olmmJ3HYw5XYBNUdeDp3ldkdt7Qf+1RQ0i/RJ92CEPEZ+rQFdjF6NScX\nocb+e/XWoWRlCokddEvvHYSgz8CnLkBw0b9dSiSy5P4VZj0uHRuWtXIPoX+ZMIo+k5+uQBfduuav\nUXs163xm1uTm2kDLyjG+sX0CITQz9OkK4O6j52m6VRX2Ny6xbmwPK7CVLH7FRVg6O7xzkaywh8oz\nOyVFt6S9e6yumTslKOjFzbfoHGfM0LlIHH7g2v9qserE0reZD0S6cKYrT9HhfakVLXSpmVo78Y9U\nVXV9x0s1JSEqgQxuhC7nqi60b7DGHDa8g2RV20TovXhWiE6kZ45L8+R3lqm/1okKOyTwoEuGynR0\nZ2Ot9F7HKn9cHaDtPR2dhS49OymRYKjRisSRFFR0GtuojS/qH1mD6re+rRg1rYKfG34aFfSDNZVM\nituIADt48+jOtktXbcjdYVzUb+/A8N3Wp97zSFbepbUcYYXyzw6dJdxHcTSeY2RVZ26cgltTanhE\n+U0k0FOU/Cl+R+A70FxA6Ke5wqu4sXidUZv5AWoI+lkE0KUhuUgMgeuswyFGLxbkg+7CdXaDXEbJ\n4KEyk3/0DiUXi98UeA4MMLqSkJud7yz0GpAg+nOXe/RGnlw0tCVwHDz7+3ag2VWreXiTgf4eEpni\nu0X0a+G+IGcEbU3b1jTNtk2Ck7cEfgNthL5XUPSG9O0e4yWxAhTKymuE/tbjvDbTtQPgJKe6vu+7\nasnU7Aipwy5uiJWLurfO6J158FiDj8H+5ycpvtEbSNW2qWGJYn0cUWw4OcSeN1MCr4Fj/HjkWUk3\nYDAZ/fLDIshJrY3Q5zsxgeO0cue3cG25W98ecf9KfbsvGgT9LErcnuYw+ovvI3QHBncno99XY7Ku\nbeKqTpNn9KaJzFWxL55Lvd9aRmud8lqMhwxGf0/1IXx5xEB316vVrdMA+rrAb9T8+b09NzLH6bfw\nWh8KfAaSCH2hQpM+fL3NQPdH6Hak0A10hjNTI/OguoHQSUPgMqAHV/oYnbXSHUGXtWsIfVHiF30f\nWWruthiSuog+/ITTDR7OMHqF6j7szk3uel88WanIiQC6EBd4zRFCt72+GJbtEy0SBVmQ8SOxFVV3\n4TUDfckJRV/hdqVbSNIkVj0c3Qvc1rk8wcMr/E1/T3WXudIXvGihr7gYPd+ZgN4wCYojcBjAj86N\n0dkrfcOTklFCb5EAujUZPQpLPRT9CI7nGENNH6Tkq0I6Muj+xdG7JsHxBP4Sik7hzf+D3sz/Ezrl\nsJEG7L9HT/09+hRPuXwg/4Ru/uTu/l+UBuM4gP8B9TdEEFQPu+o0sKhOosh2phG5+vxyYuia2Ao2\nLJaCMxlzh3UD3blaqBgH/Z3NvkBzn63N0j32hjuOu9/uxeezPZ9nz+yQrctFLj763qWrd9Px0AHa\ntKqL8dD/h/6+CfRsCpzR5TahMr1SDPQKgn5Ikk9b8ib0f/1P0VNB5m34aCgnQOXwpveC8aNzget0\nlmEovH8HTZN/jwYSCc4aKh0379r6PYlQGLXhZyzndvBU1RJS6ok/TaGZY731e/RxH352AOLPBtCz\nqYW50f0ChMZUBgzC2AxQ7zfKjC8VkmzAmU/mC+uhm9bQ/WE+GX5Xh5SF9NeV0N8Klx49uH3tLYqO\n17lhjIDO+/ca7+/uN3aqAejNA4ZjKBvKSXLLPrksW5Ylu7HkRWYTHdopcIZzpNYwdPeTsfNhY9hT\nr/fqz9hSxIkc5eZE3PWjl+KhiyTRgKNMNZDcgBvp+5emKybAyFAUXfN1eAz9/tFD/uLDc4HoZ0Q1\nU6yot65HQf/V22k1J/yNuOi03b7DSPkEy7+bKY52Yg+dVkuOhF6q1xovLl0IRs+rQm0/g6Ljvb1L\nbZ0Tclj4a/QcSS44egrGXXM2aVkwjIie74gNtXg2GP2VmjmqCS/96FtoTnLMf4resmcayFHR7wh8\nsSOGo4so+tb19gD0Qgg6tyXotvJJk9qR0W8c8JXOUQj6YzUz2M9EQF+Yd6muc7S9M5zQx82rVo1l\ntgNd+ailstHRH79w2/t+CDrfEfYFDB0zH34BSuevP8Ij6OWSWsXRBaS7MzxJNDi6YUKWREfP12uN\nvd754HX6+4POw1f5D39asqW0sf25q8tAcZ1jSzY3afzByGat7JpTt2TD0R0gMdDvi2nxYvpcMPqV\nd73TzyMMZyRLV1z1PtD8ctgijzCW0fFMdaeQdv9I23AGR1dOQIrR3p8/vlm6+CZ0Pz3iGBYW6ore\np3MA+yNCDWHkyu/62AyW5TD0dySZhKPbxwDtJyg6PobNrzh7x9VbKYrVsQ0X/MH3anWXZbCoJNHg\n6F3d1i24jKGve8MFZNprvbeHOXKcf8+l//0sM31bqzi6QT5ODBOSQM9S3+Gz9V281Ku+K/oujs5n\nSRLB0bM/vi3GsPBVMb5uBH0LO7yIUvqu6v0ay6DZJ8kGHEWHpVhDwwRw5ratawmgZ6nv8L6LOnoD\n3xQ4jqHxkk4k0CfHpifOdHIMhIA51R0gvqwFHe/wVD4446ZeQC3Ttaa3uQcUei7x9SiYLdvo/h7D\n1q0FtqRhdb4OdFzdnlI7mcP7O3vkRc+X6ezubsD6euzJbCT/xE4Rf1ZGvx+Mjnf4yVSjFV3F0QdL\n6HTeu//s8Jo3oQ+cr4r+9DaKHhRJHk9NWts7IYcR0Skcx/1K2xsSljVVOrKxrlF72IGQg0IkdGoL\nPWY2dcIlS/GxJjc8hl7se8ZxOZbiQo+VTaHTbU46iHlhacnWSCPn2Lb19SPrR6dcfJFKYUmTLWSa\nSxO5Acty1J1zWCUbQN+Oj908LHjImcFO0/9GglzZy84NyHbmG3v3+9JEHAdwPLDol08yehD1rII7\n9VwLG/7A6cJ0mcPCJcYWoxOnq2dOQbCJeyKG/dFdijW2O+3zZVCf+7xf+B+8+Xzuezd3cz7Ipeb7\n6WdaHdGL5a/VZjjaoxkeRdk7mp/oXO5EP9dxgi9+OqkeN0djNTunvbzc9pVyXe9pi+7nzpMXn9fD\nKHmS4/Aie3lV4dsIzhD9j6NydDFfbYxGm/0SYTOsn5wtecWv+Sf6b7XySKnrlbDJS17rwT3iHH0u\nhdH9mepx15QnLvk3h75iTHqHfFfz5OoK7kITEb3L31XXeqt2jujdgquTh7rH3Cd6j3yQ8jH3iR6n\necmUpyA5T+TiBQmvFFO/2H/hli1RPgy7ZjwVQx5hvSfL54MgvBAEKRnyCNFN4ppuENENYr0bxKQb\nRHSDWO8GEd0g1rtBRDeI9W4Qk24Qn7IZxKQbFBN94eo3Rq4x6Zox6Qa5RM9xetfNJXqN6LoJow8M\n3btPdO1k0W/ePmx9nt0gum7C6G9HDnYzDaLrJoz+facwP1knum7SSX9xsDvBpCsnjD5YLa0USkTX\nTRj9Tra1OUt05cTRvxBdPWl0Pzl61ocORDeI6AbJPlqNonNN1y9+0omeakQ3iOjW5PsZ3R/LSn3I\n4l/oX/R2PgiC9sVfvHaA/4BX7FP0TL2agw5bi4U+TXrWG4MO3nK/or/2oMVUv6KPedBiapjo5rhF\nXyS6Zm7R54iuWW/0BdZ72vVEr3BNTz2iG8Tp3SAOcgYx6QYJo2dbRNdPGH2r9m6e6NrJoleWpk8n\nGkRXThZ9+sf2/naOg5xywugrO+Mvj4iunCz6nudVClzTtRNFv/XgydNn+1zTtRNFj7Jfu7teI7py\nU/JXihFdO6IbRHSDiG4Q0Q0iukE90StET73e6EtXRudfoJVzWO88e9fOITqfsmnHNd0gl+hMunIx\nBzkmPe04vRvkdJBbY72r5hKdSVcu5iDHek87rukGuTyR4/SunMOkzxBdOZforHflHA5yMzyRU85h\n0uusd+V49m4Qz94NclnvHOSU4/RuEPfpBhHdoJjoPIZNO07vBhHdIGH0gaFHRFdPFv36+N63DK8f\n0U4W/eFjb6SwQXTlhJN+4+D9ZJ1n78oJow/uDq9zn66ddNJfje/zP3LaSaPXTjMNoisnje6t8BZo\n9cTRN2dLfMNFOXF0foxPP3H0j/yyg3ry6Kx39eKiL10anfWuXmx01nu6cU03iOgGxUbnmp5u8uj8\n7KZ6rHeDmHSDfrJ3Ni1tRUEYpmgtYmqLRahQkIiFS0SyiAYlEVFKi+JHTUBcaFsJSZMuzEaz6Ua7\nqlSoP7m36zNJOO7mPc/zFx5m5j1z7gczPUGQniBITxCCXIIY0itIF8eu9MJL2rswVqXnFy6v38xP\ncmRTxZZ+s96uz9PeVbHb+8OvbHWZ9q6KfZ9+v73+t0h7V8WWXtg+uSzS3lUZMtM3+r+XqHRV7Ep/\nLH/qIV0WO8jVu63vU7R3VQLpp//be31z626R9K5KIL2yX2nm0s/vFmnvqthBLq/01Smkq2JeuOTS\nq0jXZUSl81qTKiOkE+RUGS6dI5sslvQmQU4bUzqVrk24nEG6PEhPEIJcghDkEsRq7w2WM9qYlc5y\nRhuObAkSXq0y0+UJZzrtXR5meoIgPUHCmY50eQLpNYKcPOZyBunacE5PEEt6A+nacE5PkEB6O5fO\nhYs2oXQqXZ7oIPeZme6ecDkzJshdUunuiV7OtDmnuyda+iXt3T3RR7af/HbTPbHpvXNd7tHenRO2\n99FB7mKtfIt050Qe2Qp/Spsd0rtzItv7u91Bl5/meyfuanWhnV3stGjvzol7cubt7PWg22H37pyY\nSs95NTF3xkz3TqT0XPtaj3O6c+IeosiZ2PzKTHdOmN6RLk+4nEG6PNEzfYLljHueMNO3qHTnhOf0\n5mlztPTbvNKPkO4Y8z59TKXT3p3zhCC3xUbOOeYadrT0KjPdOWGQa4yb6T3au3PMIxuVrk0ofWx6\nr1LpzjGls5HTJpTeQLo6YXofL52rVec8QTrPyHmHmZ4g0dJnzqh070S295lns2cdLlycEyf9xfuj\nhxOekfNOnPSFlezbTov27py4c/pku1/qsob1TqT0Qn2n28mlM9M9Eyn9+f6gzHLGO7HSz6c39pjp\nzomVnt3zHTn3WNLHf3PmCzPdM9HSa9uHBDnnWNL5eKA4lnQ+8i+OJZ1vw4oTL52Z7h7ae4JY0vmd\nhzjM9ASxpPNnB3GY6QmC9ARhpicIlZ4gVHqCBNJru5zT1aG9JwjSEyRs7yxn5DFmOpWuDkEuQZjp\nCWLNdH6aL44hvXaQS6+ynNHFTu9XpHdl7CA3zUxXxpBeIciJY0jnaVh1DOk1Kl0cUzrpXRu7vV9R\n6coMTe93i0hXZViQO0e6LsOk3yJdFyvINbL++scfzHRZLOkH2WO5fbiEdFXs9n7z4XplieWMKpb0\ng+y4VDouck5XxW7v/XKtVeSWTRVb+vQg21um0lWx17DHpfLGHEFOlX/s3b1KA0EUhmHEQjH+gF3E\nCwg2NjZRUohaKIIiFqkMiyJa2Iks6MW7YJnZyGx3zvs+t/BxZr6ZHZKe0HdHo01Dz6oU+unkbqdL\n2NCz6pn0tS5h9/SsikXuL3Tbe1al0G+c9NxWTLrv3rMydKC+Imd7T6x4ZHPScyuE3tw66bkV93Tb\ne24WOaBS6C7vyVWHfu/LmfCqQ28MPbzq0M/c08NbEbp/0ZVVbehX35cWuehqQ7/+bN8NPbja0C/m\n7cLQg6sMffvnaD7zEUVwlaEfvny1C69hg6sLfbw1eTx/tr0HVxf6xsH0+O3VPT24mtA74739E9t7\ndHWhd9bntvfo6kOfzroi5917ZENC94NLcANC95we3ZDQ3dODc9KBhoTujVxwQ0L3Ri64QujN/6E/\n2d4jc3kHcnkHsr0DubwDeTkDZOhAfmUD8isbkEc2INs7kOd0INs7kKEDGTqQn1aBnHQgL2eABl7O\nGHpkXs4AGTqQRQ7ISQfyKxuQRzYg93Qgl3cgJx3I9g7k8g7kpAMZOpAPI4Fs70AWOSAnHcg9Hcj2\nDuSeDuSeDuTyDuTyDuTyDmToQO7pQE46kJMOZHsH8scDgdzTgQwdyOUdyPYO5PIO5KQDGTqQyzuQ\noQMZOpA/PwLkpAMth/5ge8+uMOmNoSe3HPpH4/KenEUOqDTpvpxJzmtYoEJ798iWned0IF/DArmn\nAxk6kHs6kKEDGTqQezpQ4XLGI1t2hUn37j07P60CWeSAvIYFctKBnHSgQpHzYWR2voYF8uUMkNew\nQBY5IEMH+m3nzo0AAGEgiPXfNQ04IL6VWmAw4AezbEHHTpd7Xye8BwnvQcJ7kAHGIMmZIPPpQRY9\nSHgPUk8PkpwJ0kQRJLwHucgFaYEOMtYUpOASpOASZKcH+ZQgyJMt6DrTVdnGWfQgufcgF7kgOz3I\nOz3IogcpuAT5MTJIeA+y04P0yAUZVQ6SnAnyZAs6droq2zpnepC+9yBNFEEuckGebEF/Z/oDr8cK\nnoVP/ioAAAAASUVORK5CYII=\n");

/***/ }),

/***/ "./build/scripts/infoBlock/style/fancybox.css.mjs":
/*!********************************************************!*\
  !*** ./build/scripts/infoBlock/style/fancybox.css.mjs ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body.compensate-for-scrollbar {\n  overflow: hidden;\n}\n\n.fancybox-active {\n  height: auto;\n}\n\n.fancybox-is-hidden {\n  left: -9999px;\n  margin: 0;\n  position: absolute !important;\n  top: -9999px;\n  visibility: hidden;\n}\n\n.fancybox-container {\n  -webkit-backface-visibility: hidden;\n  height: 100%;\n  left: 0;\n  outline: none;\n  position: fixed;\n  -webkit-tap-highlight-color: transparent;\n  top: 0;\n  -ms-touch-action: manipulation;\n  touch-action: manipulation;\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  width: 100%;\n  z-index: 999992;\n}\n\n.fancybox-container * {\n  box-sizing: border-box;\n}\n\n.fancybox-bg, .fancybox-inner, .fancybox-outer, .fancybox-stage {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fancybox-outer {\n  -webkit-overflow-scrolling: touch;\n  overflow-y: auto;\n}\n\n.fancybox-bg {\n  background: #1e1e1e;\n  opacity: 0;\n  transition-duration: inherit;\n  transition-property: opacity;\n  transition-timing-function: cubic-bezier(0.47, 0, 0.74, 0.71);\n}\n\n.fancybox-is-open .fancybox-bg {\n  opacity: 0.9;\n  transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);\n}\n\n.fancybox-caption, .fancybox-infobar, .fancybox-navigation .fancybox-button, .fancybox-toolbar {\n  direction: ltr;\n  opacity: 0;\n  position: absolute;\n  transition: opacity 0.25s ease, visibility 0s ease 0.25s;\n  visibility: hidden;\n  z-index: 99997;\n}\n\n.fancybox-show-caption .fancybox-caption, .fancybox-show-infobar .fancybox-infobar, .fancybox-show-nav .fancybox-navigation .fancybox-button, .fancybox-show-toolbar .fancybox-toolbar {\n  opacity: 1;\n  transition: opacity 0.25s ease 0s, visibility 0s ease 0s;\n  visibility: visible;\n}\n\n.fancybox-infobar {\n  color: #ccc;\n  font-size: 13px;\n  -webkit-font-smoothing: subpixel-antialiased;\n  height: 44px;\n  left: 0;\n  line-height: 44px;\n  min-width: 44px;\n  mix-blend-mode: difference;\n  padding: 0 10px;\n  pointer-events: none;\n  top: 0;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.fancybox-toolbar {\n  right: 0;\n  top: 0;\n}\n\n.fancybox-stage {\n  direction: ltr;\n  overflow: visible;\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  z-index: 99994;\n}\n\n.fancybox-is-open .fancybox-stage {\n  overflow: hidden;\n}\n\n.fancybox-slide {\n  -webkit-backface-visibility: hidden;\n  display: none;\n  height: 100%;\n  left: 0;\n  outline: none;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  padding: 44px;\n  position: absolute;\n  text-align: center;\n  top: 0;\n  transition-property: opacity, -webkit-transform;\n  transition-property: transform, opacity;\n  transition-property: transform, opacity, -webkit-transform;\n  white-space: normal;\n  width: 100%;\n  z-index: 99994;\n}\n\n.fancybox-slide:before {\n  content: \"\";\n  display: inline-block;\n  font-size: 0;\n  height: 100%;\n  vertical-align: middle;\n  width: 0;\n}\n\n.fancybox-is-sliding .fancybox-slide, .fancybox-slide--current, .fancybox-slide--next, .fancybox-slide--previous {\n  display: block;\n}\n\n.fancybox-slide--image {\n  overflow: hidden;\n  padding: 44px 0;\n}\n\n.fancybox-slide--image:before {\n  display: none;\n}\n\n.fancybox-slide--html {\n  padding: 6px;\n}\n\n.fancybox-content {\n  background: #fff;\n  display: inline-block;\n  margin: 0;\n  max-width: 100%;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  padding: 44px;\n  position: relative;\n  text-align: left;\n  vertical-align: middle;\n}\n\n.fancybox-slide--image .fancybox-content {\n  -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.14, 1);\n  animation-timing-function: cubic-bezier(0.5, 0, 0.14, 1);\n  -webkit-backface-visibility: hidden;\n  background: transparent;\n  background-repeat: no-repeat;\n  background-size: 100% 100%;\n  left: 0;\n  max-width: none;\n  overflow: visible;\n  padding: 0;\n  position: absolute;\n  top: 0;\n  -webkit-transform-origin: top left;\n  transform-origin: top left;\n  transition-property: opacity, -webkit-transform;\n  transition-property: transform, opacity;\n  transition-property: transform, opacity, -webkit-transform;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  z-index: 99995;\n}\n\n.fancybox-can-zoomOut .fancybox-content {\n  cursor: zoom-out;\n}\n\n.fancybox-can-zoomIn .fancybox-content {\n  cursor: zoom-in;\n}\n\n.fancybox-can-pan .fancybox-content, .fancybox-can-swipe .fancybox-content {\n  cursor: -webkit-grab;\n  cursor: grab;\n}\n\n.fancybox-is-grabbing .fancybox-content {\n  cursor: -webkit-grabbing;\n  cursor: grabbing;\n}\n\n.fancybox-container [data-selectable=true] {\n  cursor: text;\n}\n\n.fancybox-image, .fancybox-spaceball {\n  background: transparent;\n  border: 0;\n  height: 100%;\n  left: 0;\n  margin: 0;\n  max-height: none;\n  max-width: none;\n  padding: 0;\n  position: absolute;\n  top: 0;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  width: 100%;\n}\n\n.fancybox-spaceball {\n  z-index: 1;\n}\n\n.fancybox-slide--iframe .fancybox-content, .fancybox-slide--map .fancybox-content, .fancybox-slide--pdf .fancybox-content, .fancybox-slide--video .fancybox-content {\n  height: 100%;\n  overflow: visible;\n  padding: 0;\n  width: 100%;\n}\n\n.fancybox-slide--video .fancybox-content {\n  background: #000;\n}\n\n.fancybox-slide--map .fancybox-content {\n  background: #e5e3df;\n}\n\n.fancybox-slide--iframe .fancybox-content {\n  background: #fff;\n}\n\n.fancybox-iframe, .fancybox-video {\n  background: transparent;\n  border: 0;\n  display: block;\n  height: 100%;\n  margin: 0;\n  overflow: hidden;\n  padding: 0;\n  width: 100%;\n}\n\n.fancybox-iframe {\n  left: 0;\n  position: absolute;\n  top: 0;\n}\n\n.fancybox-error {\n  background: #fff;\n  cursor: default;\n  max-width: 400px;\n  padding: 40px;\n  width: 100%;\n}\n\n.fancybox-error p {\n  color: #444;\n  font-size: 16px;\n  line-height: 20px;\n  margin: 0;\n  padding: 0;\n}\n\n.fancybox-button {\n  background: rgba(30, 30, 30, 0.6);\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  cursor: pointer;\n  display: inline-block;\n  height: 44px;\n  margin: 0;\n  padding: 10px;\n  position: relative;\n  transition: color 0.2s;\n  vertical-align: top;\n  visibility: inherit;\n  width: 44px;\n}\n\n.fancybox-button, .fancybox-button:link, .fancybox-button:visited {\n  color: #ccc;\n}\n\n.fancybox-button:hover {\n  color: #fff;\n}\n\n.fancybox-button:focus {\n  outline: none;\n}\n\n.fancybox-button.fancybox-focus {\n  outline: 1px dotted;\n}\n\n.fancybox-button[disabled], .fancybox-button[disabled]:hover {\n  color: #888;\n  cursor: default;\n  outline: none;\n}\n\n.fancybox-button div {\n  height: 100%;\n}\n\n.fancybox-button svg {\n  display: block;\n  height: 100%;\n  overflow: visible;\n  position: relative;\n  width: 100%;\n}\n\n.fancybox-button svg path {\n  fill: currentColor;\n  stroke-width: 0;\n}\n\n.fancybox-button--fsenter svg:nth-child(2), .fancybox-button--fsexit svg:nth-child(1), .fancybox-button--pause svg:nth-child(1), .fancybox-button--play svg:nth-child(2) {\n  display: none;\n}\n\n.fancybox-progress {\n  background: #ff5268;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  -webkit-transform: scaleX(0);\n  transform: scaleX(0);\n  -webkit-transform-origin: 0;\n  transform-origin: 0;\n  transition-property: -webkit-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform;\n  transition-timing-function: linear;\n  z-index: 99998;\n}\n\n.fancybox-close-small {\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  color: #ccc;\n  cursor: pointer;\n  opacity: 0.8;\n  padding: 8px;\n  position: absolute;\n  right: -12px;\n  top: -44px;\n  z-index: 401;\n}\n\n.fancybox-close-small:hover {\n  color: #fff;\n  opacity: 1;\n}\n\n.fancybox-slide--html .fancybox-close-small {\n  color: currentColor;\n  padding: 10px;\n  right: 0;\n  top: 0;\n}\n\n.fancybox-slide--image.fancybox-is-scaling .fancybox-content {\n  overflow: hidden;\n}\n\n.fancybox-is-scaling .fancybox-close-small, .fancybox-is-zoomable.fancybox-can-pan .fancybox-close-small {\n  display: none;\n}\n\n.fancybox-navigation .fancybox-button {\n  background-clip: content-box;\n  height: 100px;\n  opacity: 0;\n  position: absolute;\n  top: calc(50% - 50px);\n  width: 70px;\n}\n\n.fancybox-navigation .fancybox-button div {\n  padding: 7px;\n}\n\n.fancybox-navigation .fancybox-button--arrow_left {\n  left: 0;\n  padding: 31px 26px 31px 6px;\n}\n\n.fancybox-navigation .fancybox-button--arrow_right {\n  padding: 31px 6px 31px 26px;\n  right: 0;\n}\n\n.fancybox-caption {\n  bottom: 0;\n  color: #eee;\n  font-size: 14px;\n  font-weight: 400;\n  left: 0;\n  line-height: 1.5;\n  padding: 25px 44px;\n  right: 0;\n  text-align: center;\n  z-index: 99996;\n}\n\n.fancybox-caption:before {\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAD6CAQAAADKSeXYAAAAYklEQVQoz42RwQ3AMAgDjfcfup8WoRykfBAK5mQHKSz5rbXJPis1hjiV3CIqgG0hLZPkVkA4p4x5oR1bVeDrdCLrW2Q0D5bcwY3TGMHbdw3mPRuOtaspYP1w//G1OIcW148H0DMCqI/3mMMAAAAASUVORK5CYII=);\n  background-repeat: repeat-x;\n  background-size: contain;\n  bottom: 0;\n  content: \"\";\n  display: block;\n  left: 0;\n  pointer-events: none;\n  position: absolute;\n  right: 0;\n  top: -44px;\n  z-index: -1;\n}\n\n.fancybox-caption a, .fancybox-caption a:link, .fancybox-caption a:visited {\n  color: #ccc;\n  text-decoration: none;\n}\n\n.fancybox-caption a:hover {\n  color: #fff;\n  text-decoration: underline;\n}\n\n.fancybox-loading {\n  -webkit-animation: a 1s linear infinite;\n  animation: a 1s linear infinite;\n  background: transparent;\n  border: 4px solid #888;\n  border-bottom-color: #fff;\n  border-radius: 50%;\n  height: 50px;\n  left: 50%;\n  margin: -25px 0 0 -25px;\n  opacity: 0.7;\n  padding: 0;\n  position: absolute;\n  top: 50%;\n  width: 50px;\n  z-index: 99999;\n}\n\n@-webkit-keyframes a {\n  to {\n    -webkit-transform: rotate(1turn);\n    transform: rotate(1turn);\n  }\n}\n@keyframes a {\n  to {\n    -webkit-transform: rotate(1turn);\n    transform: rotate(1turn);\n  }\n}\n.fancybox-animated {\n  transition-timing-function: cubic-bezier(0, 0, 0.25, 1);\n}\n\n.fancybox-fx-slide.fancybox-slide--previous {\n  opacity: 0;\n  -webkit-transform: translate3d(-100%, 0, 0);\n  transform: translate3d(-100%, 0, 0);\n}\n\n.fancybox-fx-slide.fancybox-slide--next {\n  opacity: 0;\n  -webkit-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n}\n\n.fancybox-fx-slide.fancybox-slide--current {\n  opacity: 1;\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n}\n\n.fancybox-fx-fade.fancybox-slide--next, .fancybox-fx-fade.fancybox-slide--previous {\n  opacity: 0;\n  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\n.fancybox-fx-fade.fancybox-slide--current {\n  opacity: 1;\n}\n\n.fancybox-fx-zoom-in-out.fancybox-slide--previous {\n  opacity: 0;\n  -webkit-transform: scale3d(1.5, 1.5, 1.5);\n  transform: scale3d(1.5, 1.5, 1.5);\n}\n\n.fancybox-fx-zoom-in-out.fancybox-slide--next {\n  opacity: 0;\n  -webkit-transform: scale3d(0.5, 0.5, 0.5);\n  transform: scale3d(0.5, 0.5, 0.5);\n}\n\n.fancybox-fx-zoom-in-out.fancybox-slide--current {\n  opacity: 1;\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n}\n\n.fancybox-fx-rotate.fancybox-slide--previous {\n  opacity: 0;\n  -webkit-transform: rotate(-1turn);\n  transform: rotate(-1turn);\n}\n\n.fancybox-fx-rotate.fancybox-slide--next {\n  opacity: 0;\n  -webkit-transform: rotate(1turn);\n  transform: rotate(1turn);\n}\n\n.fancybox-fx-rotate.fancybox-slide--current {\n  opacity: 1;\n  -webkit-transform: rotate(0deg);\n  transform: rotate(0deg);\n}\n\n.fancybox-fx-circular.fancybox-slide--previous {\n  opacity: 0;\n  -webkit-transform: scale3d(0, 0, 0) translate3d(-100%, 0, 0);\n  transform: scale3d(0, 0, 0) translate3d(-100%, 0, 0);\n}\n\n.fancybox-fx-circular.fancybox-slide--next {\n  opacity: 0;\n  -webkit-transform: scale3d(0, 0, 0) translate3d(100%, 0, 0);\n  transform: scale3d(0, 0, 0) translate3d(100%, 0, 0);\n}\n\n.fancybox-fx-circular.fancybox-slide--current {\n  opacity: 1;\n  -webkit-transform: scaleX(1) translateZ(0);\n  transform: scaleX(1) translateZ(0);\n}\n\n.fancybox-fx-tube.fancybox-slide--previous {\n  -webkit-transform: translate3d(-100%, 0, 0) scale(0.1) skew(-10deg);\n  transform: translate3d(-100%, 0, 0) scale(0.1) skew(-10deg);\n}\n\n.fancybox-fx-tube.fancybox-slide--next {\n  -webkit-transform: translate3d(100%, 0, 0) scale(0.1) skew(10deg);\n  transform: translate3d(100%, 0, 0) scale(0.1) skew(10deg);\n}\n\n.fancybox-fx-tube.fancybox-slide--current {\n  -webkit-transform: translateZ(0) scale(1);\n  transform: translateZ(0) scale(1);\n}\n\n@media (max-height: 576px) {\n  .fancybox-caption {\n    padding: 12px;\n  }\n  .fancybox-slide {\n    padding-left: 6px;\n    padding-right: 6px;\n  }\n  .fancybox-slide--image {\n    padding: 6px 0;\n  }\n  .fancybox-close-small {\n    right: -6px;\n  }\n  .fancybox-slide--image .fancybox-close-small {\n    background: #4e4e4e;\n    color: #f2f4f6;\n    height: 36px;\n    opacity: 1;\n    padding: 6px;\n    right: 0;\n    top: 0;\n    width: 36px;\n  }\n}\n.fancybox-share {\n  background: #f4f4f4;\n  border-radius: 3px;\n  max-width: 90%;\n  padding: 30px;\n  text-align: center;\n}\n\n.fancybox-share h1 {\n  color: #222;\n  font-size: 35px;\n  font-weight: 700;\n  margin: 0 0 20px;\n}\n\n.fancybox-share p {\n  margin: 0;\n  padding: 0;\n}\n\n.fancybox-share__button {\n  border: 0;\n  border-radius: 3px;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 40px;\n  margin: 0 5px 10px;\n  min-width: 130px;\n  padding: 0 15px;\n  text-decoration: none;\n  transition: all 0.2s;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  white-space: nowrap;\n}\n\n.fancybox-share__button:link, .fancybox-share__button:visited {\n  color: #fff;\n}\n\n.fancybox-share__button:hover {\n  text-decoration: none;\n}\n\n.fancybox-share__button--fb {\n  background: #3b5998;\n}\n\n.fancybox-share__button--fb:hover {\n  background: #344e86;\n}\n\n.fancybox-share__button--pt {\n  background: #bd081d;\n}\n\n.fancybox-share__button--pt:hover {\n  background: #aa0719;\n}\n\n.fancybox-share__button--tw {\n  background: #1da1f2;\n}\n\n.fancybox-share__button--tw:hover {\n  background: #0d95e8;\n}\n\n.fancybox-share__button svg {\n  height: 25px;\n  margin-right: 7px;\n  position: relative;\n  top: -1px;\n  vertical-align: middle;\n  width: 25px;\n}\n\n.fancybox-share__button svg path {\n  fill: #fff;\n}\n\n.fancybox-share__input {\n  background: transparent;\n  border: 0;\n  border-bottom: 1px solid #d7d7d7;\n  border-radius: 0;\n  color: #5d5b5b;\n  font-size: 14px;\n  margin: 10px 0 0;\n  outline: none;\n  padding: 10px 15px;\n  width: 100%;\n}\n\n.fancybox-thumbs {\n  background: #ddd;\n  bottom: 0;\n  display: none;\n  margin: 0;\n  -webkit-overflow-scrolling: touch;\n  -ms-overflow-style: -ms-autohiding-scrollbar;\n  padding: 2px 2px 4px;\n  position: absolute;\n  right: 0;\n  -webkit-tap-highlight-color: transparent;\n  top: 0;\n  width: 212px;\n  z-index: 99995;\n}\n\n.fancybox-thumbs-x {\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.fancybox-show-thumbs .fancybox-thumbs {\n  display: block;\n}\n\n.fancybox-show-thumbs .fancybox-inner {\n  right: 212px;\n}\n\n.fancybox-thumbs__list {\n  font-size: 0;\n  height: 100%;\n  list-style: none;\n  margin: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 0;\n  position: absolute;\n  position: relative;\n  white-space: nowrap;\n  width: 100%;\n}\n\n.fancybox-thumbs-x .fancybox-thumbs__list {\n  overflow: hidden;\n}\n\n.fancybox-thumbs-y .fancybox-thumbs__list::-webkit-scrollbar {\n  width: 7px;\n}\n\n.fancybox-thumbs-y .fancybox-thumbs__list::-webkit-scrollbar-track {\n  background: #fff;\n  border-radius: 10px;\n  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);\n}\n\n.fancybox-thumbs-y .fancybox-thumbs__list::-webkit-scrollbar-thumb {\n  background: #2a2a2a;\n  border-radius: 10px;\n}\n\n.fancybox-thumbs__list a {\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  background-color: rgba(0, 0, 0, 0.1);\n  background-position: 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  cursor: pointer;\n  float: left;\n  height: 75px;\n  margin: 2px;\n  max-height: calc(100% - 8px);\n  max-width: calc(50% - 4px);\n  outline: none;\n  overflow: hidden;\n  padding: 0;\n  position: relative;\n  -webkit-tap-highlight-color: transparent;\n  width: 100px;\n}\n\n.fancybox-thumbs__list a:before {\n  border: 6px solid #ff5268;\n  bottom: 0;\n  content: \"\";\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  z-index: 99991;\n}\n\n.fancybox-thumbs__list a:focus:before {\n  opacity: 0.5;\n}\n\n.fancybox-thumbs__list a.fancybox-thumbs-active:before {\n  opacity: 1;\n}\n\n@media (max-width: 576px) {\n  .fancybox-thumbs {\n    width: 110px;\n  }\n  .fancybox-show-thumbs .fancybox-inner {\n    right: 110px;\n  }\n  .fancybox-thumbs__list a {\n    max-width: calc(100% - 10px);\n  }\n}\n");

/***/ }),

/***/ "./scripts/agreementContent.mjs":
/*!**************************************!*\
  !*** ./scripts/agreementContent.mjs ***!
  \**************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "agreementsContent": function() { return /* binding */ agreementsContent; }
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "node_modules/preact/dist/preact.module.html");

var agreementsContent = function agreementsContent(ctrl, agreement) {
  if ((agreement === null || agreement === void 0 ? void 0 : agreement.offerShow) === false && (agreement === null || agreement === void 0 ? void 0 : agreement.policyShow) === false) {
    return;
  }
  var defaultTemplateOffer = "Принимаю <url-offer>оферту</url-offer> сервиса";
  var defaultTemplatePolicy = "Принимаю <url-policy>политику</url-policy> персональных данных";
  var templateOffer = (agreement === null || agreement === void 0 ? void 0 : agreement.offerTemplate) || defaultTemplateOffer;
  var templatePolicy = (agreement === null || agreement === void 0 ? void 0 : agreement.policyTemplate) || defaultTemplatePolicy;

  // Функция для проверки валидности тегов
  var isValidTag = function isValidTag(tagName, str) {
    var openingTag = "<".concat(tagName, ">");
    var closingTag = "</".concat(tagName, ">");
    return str.includes(openingTag) && str.includes(closingTag) && str.indexOf(openingTag) < str.indexOf(closingTag);
  };

  // Функция для замены тегов на ссылки
  var renderTemplate = function renderTemplate(template) {
    if (!template) return null;
    var urlOffer = (agreement === null || agreement === void 0 ? void 0 : agreement.offerUrl) || "https://mixplat.ru/offer/offer_subscriber_ek.pdf";
    var urlPolicy = (agreement === null || agreement === void 0 ? void 0 : agreement.policyUrl) || "https://mixplat.ru/offer/policy_personal_data.pdf";

    // Создаем скрытые ссылки для fancybox если их нет
    var createFancyboxLink = function createFancyboxLink(className, href, caption) {
      var _href$toLowerCase;
      if (href !== null && href !== void 0 && (_href$toLowerCase = href.toLowerCase()) !== null && _href$toLowerCase !== void 0 && _href$toLowerCase.endsWith('pdf') && !document.querySelector(".".concat(className))) {
        var link = document.createElement('a');
        link.href = href;
        link.style.cssText = 'display: none !important;';
        link.className = className;
        link.setAttribute('data-fancybox', 'mp-form-terms');
        link.setAttribute('data-caption', caption);
        document.body.appendChild(link);
      }
    };
    if (template.includes('url-offer')) {
      createFancyboxLink('mp-form-terms-offer-fancybox', urlOffer, 'Оферта сервиса');
    }
    if (template.includes('url-policy')) {
      createFancyboxLink('mp-form-terms-policy-fancybox', urlPolicy, 'Политика персональных данных');
    }
    var result = template;

    // Заменяем теги на ссылки
    var replaceTags = function replaceTags(tagName, url, className) {
      if (isValidTag(tagName, result)) {
        result = result.replace(new RegExp("<".concat(tagName, ">(.*?)</").concat(tagName, ">"), 'g'), "<a href=\"".concat(url, "\" target=\"_blank\" class=\"").concat(className, "\">$1</a>"));
      }
    };
    replaceTags('url-offer', urlOffer, 'mp-form-terms-offer-fancybox-handler');
    replaceTags('url-policy', urlPolicy, 'mp-form-terms-policy-fancybox-handler');
    return (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)("span", {
      dangerouslySetInnerHTML: {
        __html: result
      }
    });
  };
  return (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)("div", {
    className: "form-agreement"
  }, (agreement === null || agreement === void 0 ? void 0 : agreement.offerShow) !== false && (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)("div", {
    className: (agreement === null || agreement === void 0 ? void 0 : agreement.offerCheckboxShow) !== false ? 'cursor-pointer' : '',
    onClick: function onClick() {
      if ((agreement === null || agreement === void 0 ? void 0 : agreement.offerCheckboxShow) !== false) {
        ctrl.setState({
          agreementOfferIsChecked: !ctrl.state.agreementOfferIsChecked
        });
      }
    }
  }, (agreement === null || agreement === void 0 ? void 0 : agreement.offerCheckboxShow) !== false && (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)("span", {
    className: ctrl.state.agreementOfferIsChecked ? 'check checked' : 'check'
  }), renderTemplate(templateOffer)), (agreement === null || agreement === void 0 ? void 0 : agreement.policyShow) !== false && (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)("div", {
    className: (agreement === null || agreement === void 0 ? void 0 : agreement.policyCheckboxShow) !== false ? 'cursor-pointer' : '',
    onClick: function onClick() {
      if ((agreement === null || agreement === void 0 ? void 0 : agreement.policyCheckboxShow) !== false) {
        ctrl.setState({
          agreementPolicyIsChecked: !ctrl.state.agreementPolicyIsChecked
        });
      }
    }
  }, (agreement === null || agreement === void 0 ? void 0 : agreement.policyCheckboxShow) !== false && (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)("span", {
    className: ctrl.state.agreementPolicyIsChecked ? 'check checked' : 'check'
  }, " "), renderTemplate(templatePolicy)));
};

/***/ }),

/***/ "./scripts/constants.mjs":
/*!*******************************!*\
  !*** ./scripts/constants.mjs ***!
  \*******************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AgreementPlacements": function() { return /* binding */ AgreementPlacements; },
/* harmony export */   "AvailablePaymentMethods": function() { return /* binding */ AvailablePaymentMethods; },
/* harmony export */   "DntnVisitsDataIdKey": function() { return /* binding */ DntnVisitsDataIdKey; },
/* harmony export */   "FUNDRAISING_PRODUCT_BY_SOURCE": function() { return /* binding */ FUNDRAISING_PRODUCT_BY_SOURCE; },
/* harmony export */   "FailDonationInfoKey": function() { return /* binding */ FailDonationInfoKey; },
/* harmony export */   "FieldRepeatVariants": function() { return /* binding */ FieldRepeatVariants; },
/* harmony export */   "FieldStates": function() { return /* binding */ FieldStates; },
/* harmony export */   "FieldSumBadgesSortVariants": function() { return /* binding */ FieldSumBadgesSortVariants; },
/* harmony export */   "FieldSumVariants": function() { return /* binding */ FieldSumVariants; },
/* harmony export */   "FormMode": function() { return /* binding */ FormMode; },
/* harmony export */   "FormWidgetThemes": function() { return /* binding */ FormWidgetThemes; },
/* harmony export */   "FundTypes": function() { return /* binding */ FundTypes; },
/* harmony export */   "InfoBlockTypes": function() { return /* binding */ InfoBlockTypes; },
/* harmony export */   "InfoblockAlternativeContainerAttribute": function() { return /* binding */ InfoblockAlternativeContainerAttribute; },
/* harmony export */   "MobileOperators": function() { return /* binding */ MobileOperators; },
/* harmony export */   "MxRequestMerchantFields": function() { return /* binding */ MxRequestMerchantFields; },
/* harmony export */   "OnSiteParam": function() { return /* binding */ OnSiteParam; },
/* harmony export */   "PayDataParamName": function() { return /* binding */ PayDataParamName; },
/* harmony export */   "PayStatusParamName": function() { return /* binding */ PayStatusParamName; },
/* harmony export */   "PayStatusValues": function() { return /* binding */ PayStatusValues; },
/* harmony export */   "PaymentMethod": function() { return /* binding */ PaymentMethod; },
/* harmony export */   "ProjectOperators": function() { return /* binding */ ProjectOperators; },
/* harmony export */   "RejectDonationInfoKey": function() { return /* binding */ RejectDonationInfoKey; },
/* harmony export */   "ScriptUrlParams": function() { return /* binding */ ScriptUrlParams; },
/* harmony export */   "SourceConsts": function() { return /* binding */ SourceConsts; },
/* harmony export */   "SuccessDonationAmountsKey": function() { return /* binding */ SuccessDonationAmountsKey; },
/* harmony export */   "TargetType": function() { return /* binding */ TargetType; },
/* harmony export */   "TargetTypes": function() { return /* binding */ TargetTypes; },
/* harmony export */   "WidgetFundraisingProduct": function() { return /* binding */ WidgetFundraisingProduct; },
/* harmony export */   "WidgetFundraisingProductID": function() { return /* binding */ WidgetFundraisingProductID; },
/* harmony export */   "WidgetVisitDateKey": function() { return /* binding */ WidgetVisitDateKey; },
/* harmony export */   "d7domain": function() { return /* binding */ d7domain; },
/* harmony export */   "donationHost": function() { return /* binding */ donationHost; },
/* harmony export */   "fancyBoxSrc": function() { return /* binding */ fancyBoxSrc; },
/* harmony export */   "formInitialRequestTimeout": function() { return /* binding */ formInitialRequestTimeout; },
/* harmony export */   "iframeToParentCallbackType": function() { return /* binding */ iframeToParentCallbackType; },
/* harmony export */   "jquerySrc": function() { return /* binding */ jquerySrc; },
/* harmony export */   "productExportName": function() { return /* binding */ productExportName; },
/* harmony export */   "proxyMixplatEvents": function() { return /* binding */ proxyMixplatEvents; },
/* harmony export */   "yaMetrikaGoals": function() { return /* binding */ yaMetrikaGoals; }
/* harmony export */ });
var _WidgetFundraisingPro, _productExportName, _FUNDRAISING_PRODUCT_;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var d7domain = 'donation.ru';
var InfoblockAlternativeContainerAttribute = 'data-leyka-mixplat-infoblock';
var WidgetFundraisingProduct = {
  WIDGET: 'donation_widget',
  PAGE: 'donation_page',
  FORM: 'donation_form',
  NATIVE_FORM: 'donation_native',
  COMMERCIAL_FORM: 'commercial_form',
  STICKER: 'donation_sticker',
  STICKY_BUTTON: 'donation_bookmark',
  REMINDER: 'donation_reminder',
  SLIDER: 'donation_slider',
  BUTTON: 'donation_button',
  STAT_LIST: 'donation_list',
  STAT_PROGRESSBAR: 'donation_progressbar',
  INFO_BLOCK: 'donation_info_block'
};
var WidgetFundraisingProductID = (_WidgetFundraisingPro = {}, _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.WIDGET, 15), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.PAGE, 16), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.FORM, 2), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.COMMERCIAL_FORM, 18), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.NATIVE_FORM, 3), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.STICKER, 12), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.STICKY_BUTTON, 5), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.REMINDER, 9), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.SLIDER, 10), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.BUTTON, 4), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.STAT_LIST, 17), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.STAT_PROGRESSBAR, 1), _defineProperty(_WidgetFundraisingPro, WidgetFundraisingProduct.INFO_BLOCK, 6), _WidgetFundraisingPro);
var productExportName = (_productExportName = {}, _defineProperty(_productExportName, WidgetFundraisingProduct.BUTTON, WidgetFundraisingProduct.BUTTON), _defineProperty(_productExportName, WidgetFundraisingProduct.REMINDER, WidgetFundraisingProduct.REMINDER), _defineProperty(_productExportName, WidgetFundraisingProduct.SLIDER, WidgetFundraisingProduct.SLIDER), _defineProperty(_productExportName, WidgetFundraisingProduct.STAT_LIST, WidgetFundraisingProduct.STAT_LIST), _defineProperty(_productExportName, WidgetFundraisingProduct.STAT_PROGRESSBAR, WidgetFundraisingProduct.STAT_PROGRESSBAR), _defineProperty(_productExportName, WidgetFundraisingProduct.STICKER, WidgetFundraisingProduct.STICKER), _defineProperty(_productExportName, WidgetFundraisingProduct.STICKY_BUTTON, WidgetFundraisingProduct.STICKY_BUTTON), _defineProperty(_productExportName, WidgetFundraisingProduct.FORM, WidgetFundraisingProduct.FORM), _defineProperty(_productExportName, WidgetFundraisingProduct.COMMERCIAL_FORM, WidgetFundraisingProduct.COMMERCIAL_FORM), _defineProperty(_productExportName, WidgetFundraisingProduct.INFO_BLOCK, WidgetFundraisingProduct.BUTTON), _productExportName);

//Список констант JS-событий Яндекс.Метрики
var yaMetrikaGoals = {
  FORM_SUBMIT: 'MX_WIDGET_FORM_SUBMIT'
};
var FieldStates = {
  allways: 1,
  never: 0,
  ifnone: 2
};
var AgreementPlacements = {
  BEFORE_SUBMIT: 0,
  END: 1
};
var iframeToParentCallbackType = 'iframeToParentCallback';
var proxyMixplatEvents = {
  INIT: 'proxyMixplatEventInit',
  FAIL: 'proxyMixplatEventFailure',
  SUCCESS: 'proxyMixplatEventSuccess'
};
var FundTypes = {
  NON_COMMERCIAL: 1,
  COMMERCIAL: 2,
  RELIGIOUS: 3
};
var FormMode = {
  form: 'form',
  success: 'success',
  fail: 'fail',
  mobile: 'mobile',
  requisites: 'requisites',
  installPrompt: 'installPrompt',
  helpdesk: 'helpdesk'
};
var TargetTypes = {
  MAIN: 0,
  PERSON: 1,
  PROJECT: 2,
  ACTION: 3
};
var InfoBlockTypes = {
  SEND_SMS: 1,
  CUSTOMER_INFORMATION: 2,
  FOUNDING_DOCUMENTS: 3,
  //Учредительный документы
  ACTIVITY_REPORTS: 4,
  DONATION_OFFER: 5,
  CONSENT_TO_PERSONAL_DATA_PROCESSING: 6,
  MANAGEMENT_OF_REGULAR_DONATIONS: 7,
  PAYMENT_SECURITY_TEXT: 8,
  MIXPLAT_PROCESSING_TEXT: 9,
  DESCRIPTION_OF_ACTIVITIES: 10,
  PROGRAM_DESCRIPTION: 11,
  PROGRAM_CARD: 12,
  PERSON_DESCRIPTION: 13,
  PERSON_CARD: 14,
  ACTION_DESCRIPTION: 15,
  ACTION_CARD: 16
};
var MobileOperators = {
  mts: 'mts',
  megafon: 'megafon',
  beeline: 'beeline',
  tele2: 'tele2',
  yota: 'yota',
  tinkoff: 'tinkoff'
};
var FieldSumVariants = {
  slider: 0,
  badges_2: 1,
  badges_3: 2,
  badges_4: 5,
  badges_5: 6,
  badges_6: 3,
  badges_7: 7,
  only_input: 4,
  sum_effects: 8,
  fixed_badge: 9,
  forced_input: 10
};
var FormWidgetThemes = {
  platform: 'platform'
};
var FieldSumBadgesSortVariants = {
  ASC: 'asc',
  DESC: 'desc'
};
var FieldRepeatVariants = {
  radio: 0,
  checkbox: 1,
  toggle: 2,
  heart: 3
};
var PayStatusValues = {
  success: 'success',
  fail: 'fail'
};
var PaymentMethod = {
  card: 'card',
  sbp: 'sbp',
  mobile: 'mobile',
  wallet: 'wallet',
  requisites: 'requisites',
  yandex_pay: 'yandex_pay',
  mir_pay: 'mir_pay',
  sberpay: 'sberpay',
  t_pay: 't_pay'
};
var AvailablePaymentMethods = [PaymentMethod.card, PaymentMethod.sbp, PaymentMethod.sberpay, PaymentMethod.t_pay, PaymentMethod.mobile, PaymentMethod.yandex_pay, PaymentMethod.mir_pay, PaymentMethod.requisites];
var ProjectOperators = {
  SBP: 62,
  SBER_PAY: 20,
  T_PAY: 104
};
var PayStatusParamName = 'mx_status';
var PayDataParamName = 'mx_data';
var OnSiteParam = 'onsite';
var TargetType = {
  MAIN: 0,
  PERSON: 1,
  PROJECT: 2
};
var SourceConsts = {
  SOURCE_WIDGET: 'widget',
  SOURCE_QR: 'qr',
  SOURCE_FRAME: 'frame',
  SOURCE_VK: 'vk',
  SOURCE_QRSTICKER: 'qrsticker',
  SOURCE_DOBILLING: 'd',
  SOURCE_CP: 'cp',
  SOURCE_FORM: 'form',
  SOURCE_PRODUCT_LANDING: 'Страница пожертвований',
  SOURCE_PRODUCT_QR: 'QR-код',
  SOURCE_PRODUCT_WIDGET: 'Виджет благотворительности',
  SOURCE_PRODUCT_QRSTICKER: 'Стикеры "Помочь Просто"',
  SOURCE_PRODUCT_DOBILLING: 'Добиллинг картами',
  SOURCE_PRODUCT_CP: 'CP proxy',
  SOURCE_PRODUCT_FORM: 'Форма благотворительности'
};
var FUNDRAISING_PRODUCT_BY_SOURCE = (_FUNDRAISING_PRODUCT_ = {}, _defineProperty(_FUNDRAISING_PRODUCT_, SourceConsts.SOURCE_QR, SourceConsts.SOURCE_PRODUCT_QR), _defineProperty(_FUNDRAISING_PRODUCT_, SourceConsts.SOURCE_WIDGET, SourceConsts.SOURCE_PRODUCT_WIDGET), _defineProperty(_FUNDRAISING_PRODUCT_, SourceConsts.SOURCE_QRSTICKER, SourceConsts.SOURCE_PRODUCT_QRSTICKER), _defineProperty(_FUNDRAISING_PRODUCT_, SourceConsts.SOURCE_DOBILLING, SourceConsts.SOURCE_PRODUCT_DOBILLING), _defineProperty(_FUNDRAISING_PRODUCT_, SourceConsts.SOURCE_CP, SourceConsts.SOURCE_PRODUCT_CP), _FUNDRAISING_PRODUCT_);
var MxRequestMerchantFields = {
  prefix: 'user_',
  utm_medium: 'utm_medium',
  utm_source: 'utm_source',
  utm_campaign: 'utm_campaign',
  utm_term: 'utm_term',
  utm_content: 'utm_content',
  terminal_sn: 'terminal_sn',
  terminal_address: 'terminal_address',
  fundraising_product: 'fundraising_product',
  fundraising_program: 'fundraising_program',
  fundraising_program_id: 'fundraising_program_id',
  charity_page_id: 'charity_page_id',
  fundraising_sticker_id: 'fundraising_sticker_id'
};
var ScriptUrlParams = {
  tid: 'tid'
};
var WidgetVisitDateKey = 'DonationWidgetVisitDate';
var DntnVisitsDataIdKey = 'DntnVisitsDataId';
var SuccessDonationAmountsKey = 'SuccessDonationAmounts';
var FailDonationInfoKey = 'DntnFailDonationInfo';
var RejectDonationInfoKey = 'DntnRejectDonationInfo';
var fancyBoxSrc = '../file.donation.ru_4443/assets/target/js/fancybox2216.js?v=1654945513';
var jquerySrc = '../file.donation.ru_4443/assets/jquery/jquery04cf.js?v=1588632646';

//Кол-во миллисекунд для ожидания инициализационного запроса на форме, после которого UI убирает лаадер, а сам запрос продолжает ожидаться в фоне
var formInitialRequestTimeout = 3000;
var donationHost = 'https://www.donation.ru/';

/***/ }),

/***/ "./scripts/form/api.mjs":
/*!******************************!*\
  !*** ./scripts/form/api.mjs ***!
  \******************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Api": function() { return /* binding */ Api; },
/* harmony export */   "MixplatJSApiClient": function() { return /* binding */ MixplatJSApiClient; },
/* harmony export */   "ResolveStatuses": function() { return /* binding */ ResolveStatuses; },
/* harmony export */   "getApiClient": function() { return /* binding */ getApiClient; },
/* harmony export */   "mixplatJSApiClient": function() { return /* binding */ mixplatJSApiClient; }
/* harmony export */ });
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants.mjs */ "scripts/constants.mjs.html");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ResolveStatuses = {
  INIT: 'init',
  PROCESS: 'process',
  CLOSE: 'close',
  SUCCESS: 'success',
  FAIL: 'fail'
};
var Api = /*#__PURE__*/function () {
  function Api(_ref) {
    var _ref$apiHost = _ref.apiHost,
      apiHost = _ref$apiHost === void 0 ? null : _ref$apiHost,
      _ref$adminHost = _ref.adminHost,
      adminHost = _ref$adminHost === void 0 ? null : _ref$adminHost;
    _classCallCheck(this, Api);
    this.apiHost = null;
    this.adminHost = null;
    this.apiHost = apiHost;
    this.adminHost = adminHost;
    //var { apiHost = null } = config;
  }
  _createClass(Api, [{
    key: "getApiHost",
    value: function getApiHost() {
      return this.apiHost || "https://".concat(_constants_mjs__WEBPACK_IMPORTED_MODULE_0__.d7domain);
    }
  }, {
    key: "getAdminHost",
    value: function getAdminHost() {
      return this.adminHost || "https://admin.".concat(_constants_mjs__WEBPACK_IMPORTED_MODULE_0__.d7domain);
    }
  }, {
    key: "postGrant",
    value: function postGrant(form, formProps) {
      try {
        return fetch(this.getApiHost() + '/api/grant/create?sid=' + formProps.sid, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        }).then(function (response) {
          return response.json().then(function (json) {
            return [json, response];
          });
        }).catch(function (e) {
          throw e;
        });
      } catch (e) {}
    }
  }]);
  return Api;
}();
function getApiClient(config) {
  return new Api(config);
}
;
var Mixplat = null;
var MixplatLibUrl = '../cdn.mixplat.ru/widget/v3/widget.js';
var MixplatJSApiClient = /*#__PURE__*/function () {
  function MixplatJSApiClient() {
    _classCallCheck(this, MixplatJSApiClient);
    this._currentCallbacks = null;
  }
  _createClass(MixplatJSApiClient, [{
    key: "loadLib",
    value: function loadLib() {
      if (Mixplat) {
        return Promise.resolve(Mixplat);
      }
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.onload = function () {
          Mixplat = window.Mixplat;
          resolve(window.Mixplat);
        };
        script.charset = 'utf-8';
        script.src = MixplatLibUrl;
        document.head.appendChild(script);
      });
    }
  }, {
    key: "payment",
    value: function payment(options) {
      return this.loadLib().then(function (Mixplat) {
        return new Promise(function (resolve, reject) {
          var mx = new Mixplat(options);
          mx.setSuccessCallback(function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            resolve('success', args);
          });
          mx.setFailCallback(function () {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            reject(args);
          });
          mx.setProcessCallback(function () {});
          mx.setCloseCallback(function () {
            for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }
            resolve('close', args);
          });

          /*mx.setErrorCallback((...args) => {
              console.log(args);
              resolve('error', args);
          });*/

          mx.build();
        });
      }, function () {
        console.error('error');
      });
    }
  }, {
    key: "paymentWithCallbacks",
    value: function paymentWithCallbacks(options, callbacks) {
      var _this = this;
      // Удаляем старые обработчики, если они были
      this._removeMixplatCallbacks();
      this._currentCallbacks = callbacks;
      return this.loadLib().then(function (Mixplat) {
        var mx = new Mixplat(options);
        if (window) {
          window.donationJsToMixplatWidget = mx;
        }
        _this._setupMixplatCallbacks(mx);
        mx.build();
      });
    }
  }, {
    key: "_setupMixplatCallbacks",
    value: function _setupMixplatCallbacks(mixplatInstance) {
      var _this2 = this;
      this._mixplatInstance = mixplatInstance; // Пустые options, только для колбэков

      this._mixplatInstance.setInitCallback(function (data) {
        var _this2$_currentCallba, _this2$_currentCallba2;
        (_this2$_currentCallba = (_this2$_currentCallba2 = _this2._currentCallbacks).onInit) === null || _this2$_currentCallba === void 0 ? void 0 : _this2$_currentCallba.call(_this2$_currentCallba2, {
          status: ResolveStatuses.INIT,
          data: data
        });
      });
      this._mixplatInstance.setProcessCallback(function (data) {
        var _this2$_currentCallba3, _this2$_currentCallba4;
        (_this2$_currentCallba3 = (_this2$_currentCallba4 = _this2._currentCallbacks).onProcess) === null || _this2$_currentCallba3 === void 0 ? void 0 : _this2$_currentCallba3.call(_this2$_currentCallba4, {
          status: ResolveStatuses.PROCESS,
          data: data
        });
      });
      this._mixplatInstance.setSuccessCallback(function (data) {
        var _this2$_currentCallba5, _this2$_currentCallba6;
        (_this2$_currentCallba5 = (_this2$_currentCallba6 = _this2._currentCallbacks).onSuccess) === null || _this2$_currentCallba5 === void 0 ? void 0 : _this2$_currentCallba5.call(_this2$_currentCallba6, {
          status: ResolveStatuses.SUCCESS,
          data: data
        });
      });
      this._mixplatInstance.setFailCallback(function (data) {
        var _this2$_currentCallba7, _this2$_currentCallba8;
        (_this2$_currentCallba7 = (_this2$_currentCallba8 = _this2._currentCallbacks).onFail) === null || _this2$_currentCallba7 === void 0 ? void 0 : _this2$_currentCallba7.call(_this2$_currentCallba8, {
          status: ResolveStatuses.FAIL,
          data: data
        });
      });
      this._mixplatInstance.setCloseCallback(function (data) {
        var _this2$_currentCallba9, _this2$_currentCallba10;
        (_this2$_currentCallba9 = (_this2$_currentCallba10 = _this2._currentCallbacks).onClose) === null || _this2$_currentCallba9 === void 0 ? void 0 : _this2$_currentCallba9.call(_this2$_currentCallba10, {
          status: ResolveStatuses.CLOSE,
          data: data
        });
      });
    }
  }, {
    key: "_removeMixplatCallbacks",
    value: function _removeMixplatCallbacks() {
      if (this._mixplatInstance) {
        this._mixplatInstance.setInitCallback(function () {});
        this._mixplatInstance.setProcessCallback(function () {});
        this._mixplatInstance.setSuccessCallback(function () {});
        this._mixplatInstance.setFailCallback(function () {});
        this._mixplatInstance.setCloseCallback(function () {});
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._removeMixplatCallbacks();
    }
  }]);
  return MixplatJSApiClient;
}();
var mixplatJSApiClient = new MixplatJSApiClient();

/***/ }),

/***/ "./scripts/form/form-utils.mjs":
/*!*************************************!*\
  !*** ./scripts/form/form-utils.mjs ***!
  \*************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "filterMerchantFields": function() { return /* binding */ filterMerchantFields; },
/* harmony export */   "filterUtmFields": function() { return /* binding */ filterUtmFields; },
/* harmony export */   "getUtmFromLocalStorage": function() { return /* binding */ getUtmFromLocalStorage; },
/* harmony export */   "setDefaultQueryParams": function() { return /* binding */ setDefaultQueryParams; }
/* harmony export */ });
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants.mjs */ "scripts/constants.mjs.html");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
//import 'core-js/es/object/entries'; // @todo import polyfills
//import 'core-js/es/object/from-entries';



/*
export function setDefaultQueryParams(query) {
    var source = query.source || '';
    if (query[MxRequestMerchantFields.fundraising_product] ?? null) {
        return query;
    }
    var fp = FUNDRAISING_PRODUCT_BY_SOURCE[source] ?? null;
    if (!fp) {
        // check widget params
        if (query.sum) {
            fp = SourceConsts.SOURCE_WIDGET;
        }
    }
    if (!fp) {
        fp = SourceConsts.SOURCE_PRODUCT_LANDING;
    }
    if (fp) {
        query[MxRequestMerchantFields.fundraising_product] = fp;
    }
    return query;
}
*/

function setDefaultQueryParams(query) {
  var _query$MxRequestMerch, _FUNDRAISING_PRODUCT_;
  var source = query.source || '';
  if ((_query$MxRequestMerch = query[_constants_mjs__WEBPACK_IMPORTED_MODULE_0__.MxRequestMerchantFields.fundraising_product]) !== null && _query$MxRequestMerch !== void 0 ? _query$MxRequestMerch : null) {
    return query;
  }
  var fp = (_FUNDRAISING_PRODUCT_ = _constants_mjs__WEBPACK_IMPORTED_MODULE_0__.FUNDRAISING_PRODUCT_BY_SOURCE[source]) !== null && _FUNDRAISING_PRODUCT_ !== void 0 ? _FUNDRAISING_PRODUCT_ : null;
  if (!fp) {
    fp = _constants_mjs__WEBPACK_IMPORTED_MODULE_0__.SourceConsts.SOURCE_PRODUCT_WIDGET;
  }
  if (fp) {
    query[_constants_mjs__WEBPACK_IMPORTED_MODULE_0__.MxRequestMerchantFields.fundraising_product] = fp;
  }
  return query;
}

/**
 * @param {object} query 
 * @param {string} prefix 
 */
function filterMerchantFields(query) {
  var fs = _constants_mjs__WEBPACK_IMPORTED_MODULE_0__.MxRequestMerchantFields;
  var allowed = [fs.utm_medium, fs.utm_source, fs.utm_campaign, fs.utm_term, fs.utm_content, fs.terminal_sn, fs.terminal_address, fs.fundraising_product, fs.fundraising_program, fs.fundraising_sticker_id];
  var entries = Object.entries(query).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
      prop = _ref2[0];
    return allowed.indexOf(prop) >= 0;
  });
  return Object.fromEntries(entries);
}

/**
 * @param {object} query
 * @param {boolean} useWloaderData
 */
function filterUtmFields(query) {
  var useWloaderData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var fs = _constants_mjs__WEBPACK_IMPORTED_MODULE_0__.MxRequestMerchantFields;
  var allowed = [fs.utm_source, fs.utm_medium, fs.utm_campaign, fs.utm_term, fs.utm_content];

  // Фильтруем query по разрешенным полям
  var utmLabels = Object.fromEntries(Object.entries(query).filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
      prop = _ref4[0];
    return allowed.includes(prop);
  }));

  // Если utmLabels пуст, пробуем получить из localStorage
  if (Object.keys(utmLabels).length === 0 && useWloaderData) {
    utmLabels = getUtmFromLocalStorage() || {};
  }
  return utmLabels;
}

// utm-метки из данных wloader
function getUtmFromLocalStorage() {
  // Проверяем наличие данных
  if (!window.wloaderLocalStorageData || _typeof(window.wloaderLocalStorageData) !== 'object') {
    return null;
  }
  var storageData = window.wloaderLocalStorageData;
  var now = new Date();
  var fortyEightHoursAgo = now.getTime() - 48 * 60 * 60 * 1000;
  var utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var freshUtmLabels = {};
  utmFields.forEach(function (field) {
    var value = storageData[field];
    var timestamp = storageData["".concat(field, "_timestamp")];
    if (value && timestamp) {
      // Используем Date.parse() для более надежного парсинга
      var timestampDate = new Date(timestamp.replace(' ', 'T'));
      if (!isNaN(timestampDate) && timestampDate.getTime() > fortyEightHoursAgo) {
        freshUtmLabels[field] = value;
      }
    }
  });
  return Object.keys(freshUtmLabels).length > 0 ? freshUtmLabels : null;
}

/***/ }),

/***/ "./scripts/infoBlock/infoBlock-assets.mjs":
/*!************************************************!*\
  !*** ./scripts/infoBlock/infoBlock-assets.mjs ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dataUrl": function() { return /* binding */ dataUrl; },
/* harmony export */   "fancyboxCss": function() { return /* reexport safe */ _build_scripts_infoBlock_style_fancybox_css_mjs__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   "imgPhonePreview": function() { return /* reexport safe */ _build_scripts_infoBlock_assets_phonePreview_png_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   "mimePng": function() { return /* binding */ mimePng; },
/* harmony export */   "mimeSvg": function() { return /* binding */ mimeSvg; },
/* harmony export */   "reportPreviewJpg": function() { return /* reexport safe */ _build_scripts_infoBlock_assets_jpg_svg_mjs__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   "reportPreviewPdf": function() { return /* reexport safe */ _build_scripts_infoBlock_assets_pdf_svg_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]; }
/* harmony export */ });
/* harmony import */ var _build_scripts_infoBlock_assets_phonePreview_png_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../build/scripts/infoBlock/assets/phonePreview.png.mjs */ "build/scripts/infoBlock/assets/phonePreview.png.mjs.html");
/* harmony import */ var _build_scripts_infoBlock_assets_pdf_svg_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../build/scripts/infoBlock/assets/pdf.svg.mjs */ "build/scripts/infoBlock/assets/pdf.svg.mjs.html");
/* harmony import */ var _build_scripts_infoBlock_assets_jpg_svg_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../build/scripts/infoBlock/assets/jpg.svg.mjs */ "build/scripts/infoBlock/assets/jpg.svg.mjs.html");
/* harmony import */ var _build_scripts_infoBlock_style_fancybox_css_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../build/scripts/infoBlock/style/fancybox.css.mjs */ "build/scripts/infoBlock/style/fancybox.css.mjs.html");




var dataUrl = function dataUrl(data, mime) {
  var base64 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return "data:".concat(mime, ";base64,") + data;
};
var mimePng = 'image/png';
var mimeSvg = 'image/svg+xml';

/***/ }),

/***/ "./scripts/widget-utils.mjs":
/*!**********************************!*\
  !*** ./scripts/widget-utils.mjs ***!
  \**********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Loader": function() { return /* binding */ Loader; },
/* harmony export */   "addWloader": function() { return /* binding */ addWloader; },
/* harmony export */   "arrowDownIcon": function() { return /* binding */ arrowDownIcon; },
/* harmony export */   "classNames": function() { return /* binding */ classNames; },
/* harmony export */   "closeMixplatPaymentForm": function() { return /* binding */ closeMixplatPaymentForm; },
/* harmony export */   "colorAlpha": function() { return /* binding */ colorAlpha; },
/* harmony export */   "colorDark": function() { return /* binding */ colorDark; },
/* harmony export */   "consoleWrite": function() { return /* binding */ consoleWrite; },
/* harmony export */   "currentDate": function() { return /* binding */ currentDate; },
/* harmony export */   "darkenColor": function() { return /* binding */ darkenColor; },
/* harmony export */   "deleteCookie": function() { return /* binding */ deleteCookie; },
/* harmony export */   "domElem": function() { return /* binding */ domElem; },
/* harmony export */   "domReplaceChild": function() { return /* binding */ domReplaceChild; },
/* harmony export */   "findScriptHost": function() { return /* binding */ findScriptHost; },
/* harmony export */   "findScriptTag": function() { return /* binding */ findScriptTag; },
/* harmony export */   "findScriptUrl": function() { return /* binding */ findScriptUrl; },
/* harmony export */   "fixDataFileUrls": function() { return /* binding */ fixDataFileUrls; },
/* harmony export */   "getCookie": function() { return /* binding */ getCookie; },
/* harmony export */   "getMyAmountsFromLocalStorage": function() { return /* binding */ getMyAmountsFromLocalStorage; },
/* harmony export */   "getMyFailInfoFromLocalStorage": function() { return /* binding */ getMyFailInfoFromLocalStorage; },
/* harmony export */   "getMyRejectInfoFromLocalStorage": function() { return /* binding */ getMyRejectInfoFromLocalStorage; },
/* harmony export */   "getUrlParams": function() { return /* binding */ getUrlParams; },
/* harmony export */   "getUtmParams": function() { return /* binding */ getUtmParams; },
/* harmony export */   "loadTermsFancyboxDependencies": function() { return /* binding */ loadTermsFancyboxDependencies; },
/* harmony export */   "mediaDependentValue": function() { return /* binding */ mediaDependentValue; },
/* harmony export */   "removeFailAndRejectInfo": function() { return /* binding */ removeFailAndRejectInfo; },
/* harmony export */   "roubleIcon": function() { return /* binding */ roubleIcon; },
/* harmony export */   "roundStepped": function() { return /* binding */ roundStepped; },
/* harmony export */   "saveMyFailInfoToLocalStorage": function() { return /* binding */ saveMyFailInfoToLocalStorage; },
/* harmony export */   "saveMyRejectInfoToLocalStorage": function() { return /* binding */ saveMyRejectInfoToLocalStorage; },
/* harmony export */   "saveMySuccessAmountToLocalStorage": function() { return /* binding */ saveMySuccessAmountToLocalStorage; },
/* harmony export */   "saveUtmParams": function() { return /* binding */ saveUtmParams; },
/* harmony export */   "sendWidgetEvent": function() { return /* binding */ sendWidgetEvent; },
/* harmony export */   "setCookie": function() { return /* binding */ setCookie; },
/* harmony export */   "smartShorter": function() { return /* binding */ smartShorter; },
/* harmony export */   "sumStepper": function() { return /* binding */ sumStepper; }
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "node_modules/preact/dist/preact.module.html");
/* harmony import */ var htm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! htm */ "node_modules/htm/dist/htm.module.html");
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.mjs */ "scripts/constants.mjs.html");
/* harmony import */ var _infoBlock_infoBlock_assets_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./infoBlock/infoBlock-assets.mjs */ "scripts/infoBlock/infoBlock-assets.mjs.html");
var _templateObject, _templateObject2, _templateObject3;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }





// Initialize htm with Preact
var html = htm__WEBPACK_IMPORTED_MODULE_1__["default"].bind(preact__WEBPACK_IMPORTED_MODULE_0__.h);
var steps = [{
  range: [0, 50],
  step: 10
}, {
  range: [50, 1000],
  step: 50
}, {
  range: [1000, 2000],
  step: 100
}, {
  range: [2000, 10000],
  step: 500
}, {
  range: [10000, 20000],
  step: 1000
}, {
  range: [20000, 100000],
  step: 5000
}, {
  range: [100000, 123123123],
  step: 50000
}];
function sumStepper(v, dir) {
  var useStep = 0;
  var _iterator = _createForOfIteratorHelper(steps),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
        range = _step$value.range,
        step = _step$value.step;
      var _range = range,
        _range2 = _slicedToArray(_range, 2),
        min = _range2[0],
        max = _range2[1];
      if (v >= min && v <= max) {
        if (v == max && dir > 0) {
          continue;
        }
        useStep = step;
        if (dir > 0) {
          v -= v % step;
        } else {
          v += v % step ? -(v % step) + step : 0;
        }
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return v + dir * useStep;
}
function getUrlParams() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.toString();
  var vars = [],
    hash;
  var search = url.replace(/(^.*\?)|(^.*$)/, '');
  var hashes = search ? search.split('&') : [];
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    //vars.push(hash[0]);
    vars[hash[0]] = decodeURIComponent(hash[1]);
  }
  return vars;
}
function consoleWrite() {
  var _getUrlParams;
  if ((_getUrlParams = getUrlParams(location.href)) !== null && _getUrlParams !== void 0 && _getUrlParams.hasOwnProperty('debug')) {
    var _console;
    (_console = console).log.apply(_console, arguments);
  }
}
function addWloader(scriptSrc) {
  if (scriptSrc) {
    var script = document.createElement('script');
    script.src = scriptSrc;
    document.body.appendChild(script);
  }
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  });
}
function setCookie(name, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  options.path = '/';
  if (options.expires) {
    options.expires = options.expires.toUTCString();
  }
  var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (var optionKey in options) {
    updatedCookie += "; " + optionKey;
    var optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}
var utmParams = ['utm_medium', 'utm_source', 'utm_campaign', 'utm_term', 'utm_content'];
function saveUtmParams() {
  var params = getUrlParams();
  var utm = {};
  var _iterator2 = _createForOfIteratorHelper(utmParams),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var name = _step2.value;
      if (params[name]) {
        utm[name] = params[name];
      }
    }
    //setCookie('widget_utm', JSON.stringify(utm));
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  sessionStorage.setItem('widget_utm', JSON.stringify(utm));
}
function getUtmParams() {
  //var utm = getCookie('widget_utm');
  var utm = sessionStorage.getItem('widget_utm');
  try {
    utm = utm ? JSON.parse(utm) : {};
  } catch (e) {
    utm = {};
  }
  utm = _typeof(utm) == 'object' ? utm : {};
  utm = Object.fromEntries(Object.entries(utm).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
      name = _ref2[0];
    return utmParams.includes(name);
  })); // filter
  return utm;
}
function sendWidgetEvent(type, id) {
  var host = findScriptHost(id);
  if (!host) return;
  return fetch(host + '/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id,
      type: type
    })
  });
}
function colorAlpha(color) {
  var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  if (!color) return color;
  color = color.toLowerCase();
  // Если цвет уже в формате rgba
  if (color.startsWith('rgba')) {
    return color.replace(/,\s*[\d\.]+\s*\)$/, ", ".concat(alpha, ")"));
  }

  // Если цвет в формате rgb
  if (color.startsWith('rgb')) {
    return color.replace(')', ", ".concat(alpha, ")")).replace('rgb', 'rgba');
  }

  // Если цвет в hex формате
  if (color.startsWith('#')) {
    return hexToRgba(color, alpha);
  }
  return color;
}

// Вспомогательная функция для преобразования hex в rgba
function hexToRgba(hex) {
  var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var hexColor = hex.substring(1);

  // Если сокращенная форма с альфа-каналом (4 символа: #RGBA)
  if (hexColor.length === 4) {
    hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2] + hexColor[3] + hexColor[3];
  }

  // Если сокращенная форма без альфа-канала (3 символа: #RGB)
  if (hexColor.length === 3) {
    hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
  }

  // Если полная форма с альфа-каналом (8 символов: #RRGGBBAA)
  if (hexColor.length === 8) {
    // Извлекаем компоненты
    var r = parseInt(hexColor.substring(0, 2), 16);
    var g = parseInt(hexColor.substring(2, 4), 16);
    var b = parseInt(hexColor.substring(4, 6), 16);
    var existingAlpha = parseInt(hexColor.substring(6, 8), 16) / 255;

    // Используем переданный alpha, если он указан, иначе существующий
    var finalAlpha = alpha !== undefined ? alpha : existingAlpha;
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(finalAlpha, ")");
  }

  // Если полная форма без альфа-канала (6 символов: #RRGGBB)
  if (hexColor.length === 6) {
    var _r = parseInt(hexColor.substring(0, 2), 16);
    var _g = parseInt(hexColor.substring(2, 4), 16);
    var _b = parseInt(hexColor.substring(4, 6), 16);
    return "rgba(".concat(_r, ", ").concat(_g, ", ").concat(_b, ", ").concat(alpha, ")");
  }
  return hex; // Возвращаем исходное значение, если формат неверный
}

function colorDark(color, share) {
  var _color;
  if (!color) return color;
  // Если цвет в hex формате
  if (color.startsWith('#')) {
    color = hexToRgba(color);
  }
  var ms = (_color = color) === null || _color === void 0 ? void 0 : _color.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/);
  if (!ms) return color;
  var cs = ms.slice(1, 4);
  return "rgba(".concat(cs.map(function (c) {
    return Math.round(c * share);
  }).map(function (c) {
    return Math.max(0, c);
  }).map(function (c) {
    return Math.min(255, c);
  }).join(','), ", ").concat(ms[4], ")");
  //return 'rgba(' . implode(',', array_map(fn($cv) => intval($cv * $share), $cs)) . ',' . $ms[4] . ')';
}

function findScriptUrl(id) {
  var s = document.querySelector("script[src*=\"".concat(id, "\"]"));
  return s ? s.src : null;
}
function findScriptHost(id) {
  var url = findScriptUrl(id);
  if (!url) return url;
  url = url.replace(/\/\/widget\./, '//widgets.'); // fix old host
  var ms = url.match(/(https?:\/\/[^\/]+)/);
  return ms[1] || false;
}
function findScriptTag(sid) {
  //Будем возвращать последний найденный экземпляр (актуально для вызывающих виджетов-родителей)
  var scriptTags = document.querySelectorAll("script[src*=\"".concat(sid, "\"]"));
  return scriptTags.length > 0 ? scriptTags[scriptTags.length - 1] : null;
}
var dataFileProps = ['widget.style.image', 'block1.style.image', 'block1.style.backImage', 'block2.style.image', 'block2.style.backImage', 'stripe.style.image', 'stripeForm.style.image', 'stripeForm.style.backImage'];
var setProp = function setProp(o, prop, v) {
  var propPath = Array.isArray(prop) ? prop : prop.split('.');
  var _propPath = _slicedToArray(propPath, 1),
    p1 = _propPath[0];
  if (propPath.length == 1) {
    o[p1] = v;
  } else {
    var subo = o[p1];
    if (_typeof(subo) == 'object') {
      setProp(subo, propPath.slice(1), v);
    }
  }
};
var getProp = function getProp(o, prop) {
  var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var propPath = Array.isArray(prop) ? prop : prop.split('.');
  var _propPath2 = _slicedToArray(propPath, 1),
    p1 = _propPath2[0];
  var v = o[p1] || def;
  return propPath.length > 1 && v !== null ? getProp(v, propPath.slice(1)) : v;
};
var fixDataFileUrls = function fixDataFileUrls(data) {
  var scriptUrl = findScriptUrl(data.site_id);
  if (scriptUrl && scriptUrl.indexOf('//widget.') != -1) {
    // old widget host https://widget.donation.ru/js/id, convert to new
    scriptUrl = 'https://widgets.donation.ru/widgets/' + data.site_id + '/widget.js';
  }
  var urlPath = scriptUrl ? scriptUrl.replace(/[^/]+$/, '') : null; // rm file name
  if (!urlPath) {
    return;
  }
  var _iterator3 = _createForOfIteratorHelper(dataFileProps),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var prop = _step3.value;
      var fileName = getProp(data, prop);
      if (!fileName) {
        continue;
      }
      var fileFix = urlPath + fileName;
      setProp(data, prop, fileFix);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
};
function domElem(tag, props) {
  var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var e = document.createElement(tag);
  Object.entries(props).forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
      a = _ref4[0],
      v = _ref4[1];
    return e.setAttribute(a, v);
  });
  if (content instanceof Object) {
    if (Array.isArray(content)) {
      content.forEach(function (item) {
        return e.appendChild(item);
      });
    } else {
      e.appendChild(content);
    }
  }
  typeof content == "string" && (e.textContent = content);
  return e;
}

// replace or append
function domReplaceChild(container, child) {
  var oldChild = child.id ? container.ownerDocument.getElementById(child.id) : null;
  if (oldChild) {
    container.replaceChild(child, oldChild);
  } else {
    container.appendChild(child);
  }
}

/**
 * { 480: 1, 1024: 2 }
 */
var mediaDependentValue = function mediaDependentValue(mediaBreakPointsMap) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var w = window.innerWidth;
  for (var _i2 = 0, _Object$entries = Object.entries(mediaBreakPointsMap); _i2 < _Object$entries.length; _i2++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
      breakPoint = _Object$entries$_i[0],
      v = _Object$entries$_i[1];
    if (w <= breakPoint) {
      return v;
    }
  }
  return def;
};
var roundSteps = [[100, 10], [1000, 50], [10000, 100], [50000, 500], [100000000, 1000]];
function roundStepped(v) {
  var vr = v;
  for (var s = 0, step = roundSteps[0]; s < roundSteps.length; s++, step = roundSteps[s]) {
    if (v < step[0]) {
      vr = v - vr % step[1];
      break;
    }
  }
  return vr;
}
var classNames = function classNames(obj) {
  var cs = [];
  for (var c in obj) {
    if (obj[c]) {
      cs.push(c);
    }
  }
  return cs.join(' ');
};
function darkenColor(color) {
  var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.95;
  if (color.toLowerCase().startsWith('rgba')) {
    // Extract the R, G, B, and A channels from the RGBA color
    var rgbaChannels = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',');
    var r = parseInt(rgbaChannels[0]);
    var g = parseInt(rgbaChannels[1]);
    var b = parseInt(rgbaChannels[2]);
    var a = parseFloat(rgbaChannels[3]);

    // Decrease the value of each channel by the given factor k
    var newR = Math.round(r * k);
    var newG = Math.round(g * k);
    var newB = Math.round(b * k);

    // Return the new RGBA color
    return "rgba(".concat(newR, ",").concat(newG, ",").concat(newB, ",").concat(a, ")");
  } else if (color.toLowerCase().startsWith('rgb')) {
    // Extract the R, G, and B channels from the RGB color
    var rgbChannels = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',');
    var _r2 = parseInt(rgbChannels[0]);
    var _g2 = parseInt(rgbChannels[1]);
    var _b2 = parseInt(rgbChannels[2]);

    // Decrease the value of each channel by the given factor k
    var _newR = Math.round(_r2 * k);
    var _newG = Math.round(_g2 * k);
    var _newB = Math.round(_b2 * k);

    // Return the new RGB color
    return "rgb(".concat(_newR, ",").concat(_newG, ",").concat(_newB, ")");
  } else {
    // Extract the RGB channels from the HEX color
    var _r3 = parseInt(color.substring(1, 3), 16);
    var _g3 = parseInt(color.substring(3, 5), 16);
    var _b3 = parseInt(color.substring(5, 7), 16);

    // Decrease the value of each channel by the given factor k
    var _newR2 = Math.round(_r3 * k);
    var _newG2 = Math.round(_g3 * k);
    var _newB2 = Math.round(_b3 * k);

    // Convert the new RGB color back to a HEX color
    return "#".concat((_newR2 < 16 ? '0' : '') + _newR2.toString(16)).concat((_newG2 < 16 ? '0' : '') + _newG2.toString(16)).concat((_newB2 < 16 ? '0' : '') + _newB2.toString(16));
  }
}
var currentDate = function currentDate() {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = String(currentDate.getMonth() + 1).padStart(2, '0');
  var day = String(currentDate.getDate()).padStart(2, '0');
  return "".concat(year, "-").concat(month, "-").concat(day);
};
var Loader = function Loader() {
  return html(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        <div class=\"loader\">\n            <div class=\"theme_xbox_lg\">\n                <div class=\"pace_progress\"/>\n                <div class=\"pace_activity\"/>\n            </div>\n        </div>\n    "])));
};
function getMyAmountsFromLocalStorage() {
  try {
    var myAmounts = localStorage.getItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.SuccessDonationAmountsKey);
    myAmounts = myAmounts ? JSON.parse(myAmounts) : [];
    return Array.isArray(myAmounts) ? myAmounts : [];
  } catch (e) {}
  return [];
}
function saveMySuccessAmountToLocalStorage(amount) {
  try {
    removeFailAndRejectInfo();
    var myAmounts = getMyAmountsFromLocalStorage();
    myAmounts.push(amount);
    localStorage.setItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.SuccessDonationAmountsKey, JSON.stringify(myAmounts));
    return true;
  } catch (e) {}
  return false;
}
function getMyFailInfoFromLocalStorage() {
  try {
    var myFail = localStorage.getItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.FailDonationInfoKey);
    return myFail ? JSON.parse(myFail) : {};
  } catch (e) {}
  return {};
}
function saveMyFailInfoToLocalStorage(target_id, amount) {
  var form_sid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  try {
    localStorage.setItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.FailDonationInfoKey, JSON.stringify({
      target_id: target_id,
      amount: amount,
      form_sid: form_sid
    }));
    localStorage.removeItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.RejectDonationInfoKey);
    return true;
  } catch (e) {}
  return false;
}
function getMyRejectInfoFromLocalStorage() {
  try {
    var myReject = localStorage.getItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.RejectDonationInfoKey);
    return myReject ? JSON.parse(myReject) : {};
  } catch (e) {}
  return {};
}
function saveMyRejectInfoToLocalStorage(target_id, amount) {
  var form_sid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  try {
    localStorage.setItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.RejectDonationInfoKey, JSON.stringify({
      target_id: target_id,
      amount: amount,
      form_sid: form_sid
    }));
    localStorage.removeItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.FailDonationInfoKey);
    return true;
  } catch (e) {}
  return false;
}
function removeFailAndRejectInfo() {
  try {
    localStorage.removeItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.FailDonationInfoKey);
    localStorage.removeItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_2__.RejectDonationInfoKey);
    return true;
  } catch (e) {}
  return false;
}
var roubleIcon = function roubleIcon() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '10px';
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '10px';
  return html(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n        <svg width=\"", "\" height=\"", "\" viewBox=\"-1 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n            <path fill=\"currentColor\"\n                  d=\"m17.778 7.449c.002-.043.003-.093.003-.143 0-1.028-.425-1.956-1.11-2.618l-.001-.001c-.717-.658-1.678-1.061-2.732-1.061-.064 0-.128.002-.191.004h.009-5.454v7.636h5.454c.054.003.118.004.182.004 1.054 0 2.015-.403 2.735-1.064l-.003.003c.685-.663 1.111-1.591 1.111-2.619 0-.05-.001-.1-.003-.149v.007zm4.04 0c.003.076.005.164.005.253 0 2.006-.829 3.819-2.163 5.115l-.002.002c-1.371 1.292-3.224 2.086-5.262 2.086-.107 0-.213-.002-.319-.006h.015-5.795v2.011h8.608.021c.29 0 .525.235.525.525v.022-.001 2.182.021c0 .29-.235.525-.525.525-.007 0-.015 0-.022 0h.001-8.608v3.273.018c0 .147-.061.28-.16.374-.097.095-.23.154-.377.154-.002 0-.004 0-.007 0h-2.846c-.006 0-.014 0-.021 0-.29 0-.525-.235-.525-.525 0-.007 0-.015 0-.022v.001-3.273h-3.818c-.006 0-.014 0-.021 0-.29 0-.525-.235-.525-.525 0-.007 0-.015 0-.022v.001-2.182c0-.006 0-.014 0-.021 0-.29.235-.525.525-.525h.022-.001 3.818v-2.011h-3.818c-.006 0-.014 0-.021 0-.29 0-.525-.235-.525-.525 0-.007 0-.015 0-.022v.001-2.54c0-.002 0-.004 0-.006 0-.147.059-.28.154-.377.094-.099.227-.16.374-.16h.019-.001 3.818v-10.72c0-.006 0-.014 0-.021 0-.29.235-.525.525-.525h.022-.001 9.187c.091-.004.197-.006.304-.006 2.038 0 3.891.794 5.266 2.09l-.004-.004c1.334 1.297 2.162 3.109 2.162 5.114 0 .088-.002.176-.005.264v-.013z\"/>\n        </svg>"])), width, height);
};
var arrowDownIcon = function arrowDownIcon() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '10px';
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '10px';
  return html(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n        <svg fill=\"currentColor\" width=\"", "\" height=\"", "\" viewBox=\"200 200 600 600\"\n             xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M759.2 419.8L697.4 358 512 543.4 326.6 358l-61.8 61.8L512 667z\"/>\n        </svg>"])), width, height);
};

/**
 * Умно укорачивает строку до целого слова до лимитов, добавляя многоточия в конце
 * @param {string} string
 * @param {number} limit
 * @return {string|null}
 */
function smartShorter(string) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 122;
  if (!string) {
    return string;
  }
  var words = string.split(' ');
  var result = '';
  var i = 0;
  while (i < words.length && result.length + words[i].length + 1 <= limit) {
    if (i !== 0) {
      result += ' ';
    }
    result += words[i];
    i++;
  }
  if (result.length > limit) {
    result = result.substring(0, limit) + '...';
  } else if (result.length < string.length) {
    result += '...';
  }
  return result;
}
var loadTermsFancyboxDependencies = function loadTermsFancyboxDependencies(props) {
  var rootOrDocument = props.rootOrDocument;
  var isJQueryLoaded = function isJQueryLoaded() {
    return typeof window.jQuery !== 'undefined' && typeof window.jQuery === 'function' && typeof window.jQuery.fn !== 'undefined';
  };
  var loadjQuery = function loadjQuery() {
    var jquery = document.createElement('script');
    jquery.src = _constants_mjs__WEBPACK_IMPORTED_MODULE_2__.jquerySrc;
    jquery.onload = function () {
      loadFancyBox();
    };
    jquery.onerror = function () {
      console.error('Ошибка загрузки jQuery');
    };
    document.head.appendChild(jquery);
  };
  var loadFancyBox = function loadFancyBox() {
    if (typeof window.jQuery === 'undefined') {
      setTimeout(function () {
        loadFancyBox();
      }, 50);
      return;
    }
    var style = document.createElement('style');
    style.textContent = _infoBlock_infoBlock_assets_mjs__WEBPACK_IMPORTED_MODULE_3__.fancyboxCss;
    document.head.appendChild(style);
    var fancybox = document.createElement('script');
    fancybox.src = _constants_mjs__WEBPACK_IMPORTED_MODULE_2__.fancyBoxSrc;
    fancybox.onload = function () {
      initTermsOfferHandler();
    };
    fancybox.onerror = function () {
      console.error('Ошибка загрузки FancyBox');
    };
    document.head.appendChild(fancybox);
  };
  var initTermsOfferHandler = function initTermsOfferHandler() {
    if (!rootOrDocument) return;
    var initLinkHandler = function initLinkHandler(handlerClass, targetClass) {
      var handleClick = function handleClick(event) {
        var targetLink = document.querySelector(targetClass);
        if (targetLink) {
          event.preventDefault();
          event.stopPropagation();
          targetLink.click();
        }
      };
      var links = rootOrDocument.querySelectorAll(handlerClass);
      links.forEach(function (link) {
        link.removeEventListener('click', handleClick);
        link.addEventListener('click', handleClick);
      });
    };
    initLinkHandler('.mp-form-terms-offer-fancybox-handler', '.mp-form-terms-offer-fancybox');
    initLinkHandler('.mp-form-terms-policy-fancybox-handler', '.mp-form-terms-policy-fancybox');
  };

  // Основная логика
  if (isJQueryLoaded()) {
    loadFancyBox();
  } else {
    loadjQuery();
  }
};
var closeMixplatPaymentForm = function closeMixplatPaymentForm() {
  if (window.donationJsToMixplatWidget) {
    window.donationJsToMixplatWidget.close();
  }
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!****************************************!*\
  !*** ./scripts/animation/animation.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MAX_COMMENT_DEFAULT_LENGTH": function() { return /* binding */ MAX_COMMENT_DEFAULT_LENGTH; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "node_modules/core-js/modules/es.symbol.html");
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_json_to_string_tag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.json.to-string-tag.js */ "node_modules/core-js/modules/es.json.to-string-tag.html");
/* harmony import */ var core_js_modules_es_json_to_string_tag_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_json_to_string_tag_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_math_to_string_tag_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.math.to-string-tag.js */ "node_modules/core-js/modules/es.math.to-string-tag.html");
/* harmony import */ var core_js_modules_es_math_to_string_tag_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_math_to_string_tag_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.object.assign.js */ "node_modules/core-js/modules/es.object.assign.html");
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_define_getter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.object.define-getter.js */ "node_modules/core-js/modules/es.object.define-getter.html");
/* harmony import */ var core_js_modules_es_object_define_getter_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_getter_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_object_define_properties_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.object.define-properties.js */ "node_modules/core-js/modules/es.object.define-properties.html");
/* harmony import */ var core_js_modules_es_object_define_properties_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_properties_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_object_define_property_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.object.define-property.js */ "node_modules/core-js/modules/es.object.define-property.html");
/* harmony import */ var core_js_modules_es_object_define_property_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_property_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_object_define_setter_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.object.define-setter.js */ "node_modules/core-js/modules/es.object.define-setter.html");
/* harmony import */ var core_js_modules_es_object_define_setter_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_setter_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_object_entries_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.object.entries.js */ "node_modules/core-js/modules/es.object.entries.html");
/* harmony import */ var core_js_modules_es_object_entries_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_entries_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_object_freeze_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.object.freeze.js */ "node_modules/core-js/modules/es.object.freeze.html");
/* harmony import */ var core_js_modules_es_object_freeze_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_freeze_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_object_from_entries_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.object.from-entries.js */ "node_modules/core-js/modules/es.object.from-entries.html");
/* harmony import */ var core_js_modules_es_object_from_entries_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_from_entries_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.object.get-own-property-descriptor.js */ "node_modules/core-js/modules/es.object.get-own-property-descriptor.html");
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptor_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.object.get-own-property-descriptors.js */ "node_modules/core-js/modules/es.object.get-own-property-descriptors.html");
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_object_get_own_property_names_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.object.get-own-property-names.js */ "node_modules/core-js/modules/es.object.get-own-property-names.html");
/* harmony import */ var core_js_modules_es_object_get_own_property_names_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_names_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.object.get-prototype-of.js */ "node_modules/core-js/modules/es.object.get-prototype-of.html");
/* harmony import */ var core_js_modules_es_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es_object_is_extensible_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.object.is-extensible.js */ "node_modules/core-js/modules/es.object.is-extensible.html");
/* harmony import */ var core_js_modules_es_object_is_extensible_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_is_extensible_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_es_object_is_frozen_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/es.object.is-frozen.js */ "node_modules/core-js/modules/es.object.is-frozen.html");
/* harmony import */ var core_js_modules_es_object_is_frozen_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_is_frozen_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var core_js_modules_es_object_is_sealed_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! core-js/modules/es.object.is-sealed.js */ "node_modules/core-js/modules/es.object.is-sealed.html");
/* harmony import */ var core_js_modules_es_object_is_sealed_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_is_sealed_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! core-js/modules/es.object.keys.js */ "node_modules/core-js/modules/es.object.keys.html");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var core_js_modules_es_object_lookup_getter_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! core-js/modules/es.object.lookup-getter.js */ "node_modules/core-js/modules/es.object.lookup-getter.html");
/* harmony import */ var core_js_modules_es_object_lookup_getter_js__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_lookup_getter_js__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var core_js_modules_es_object_lookup_setter_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! core-js/modules/es.object.lookup-setter.js */ "node_modules/core-js/modules/es.object.lookup-setter.html");
/* harmony import */ var core_js_modules_es_object_lookup_setter_js__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_lookup_setter_js__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var core_js_modules_es_object_prevent_extensions_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! core-js/modules/es.object.prevent-extensions.js */ "node_modules/core-js/modules/es.object.prevent-extensions.html");
/* harmony import */ var core_js_modules_es_object_prevent_extensions_js__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_prevent_extensions_js__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var core_js_modules_es_object_seal_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! core-js/modules/es.object.seal.js */ "node_modules/core-js/modules/es.object.seal.html");
/* harmony import */ var core_js_modules_es_object_seal_js__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_seal_js__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var core_js_modules_es_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! core-js/modules/es.object.set-prototype-of.js */ "node_modules/core-js/modules/es.object.set-prototype-of.html");
/* harmony import */ var core_js_modules_es_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "node_modules/core-js/modules/es.object.to-string.html");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */ var core_js_modules_es_object_values_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! core-js/modules/es.object.values.js */ "node_modules/core-js/modules/es.object.values.html");
/* harmony import */ var core_js_modules_es_object_values_js__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_values_js__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "node_modules/core-js/modules/web.dom-collections.iterator.html");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var _widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../widget-utils.mjs */ "scripts/widget-utils.mjs.html");
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../constants.mjs */ "scripts/constants.mjs.html");
/* harmony import */ var _form_api_mjs__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../form/api.mjs */ "scripts/form/api.mjs.html");
/* harmony import */ var _form_form_utils_mjs__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../form/form-utils.mjs */ "scripts/form/form-utils.mjs.html");
/* harmony import */ var _agreementContent_mjs__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../agreementContent.mjs */ "scripts/agreementContent.mjs.html");
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14;
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
































var _require = __webpack_require__(/*! preact */ "node_modules/preact/dist/preact.module.html"),
  h = _require.h,
  render = _require.render,
  Component = _require.Component;
var htm = (__webpack_require__(/*! htm */ "node_modules/htm/dist/htm.module.html")["default"]);
var commonCSS = (__webpack_require__(/*! ./style.css */ "scripts/animation/style.css")["default"].toString)();
var dataDefault = __webpack_require__(/*! ./dataDefault.js */ "scripts/animation/dataDefault.html");
var _require2 = __webpack_require__(/*! ../widget-utils */ "scripts/widget-utils.mjs.html"),
  sumStepper = _require2.sumStepper,
  colorAlpha = _require2.colorAlpha,
  saveUtmParams = _require2.saveUtmParams,
  getUtmParams = _require2.getUtmParams,
  fixDataFileUrls = _require2.fixDataFileUrls,
  domElem = _require2.domElem,
  sendWidgetEvent = _require2.sendWidgetEvent,
  domReplaceChild = _require2.domReplaceChild,
  mediaDependentValue = _require2.mediaDependentValue;

// Initialize htm with Preact
var html = htm.bind(h);
var mediaBreakSM = 480;
var mediaBreakMD = 1024;
var MAX_COMMENT_DEFAULT_LENGTH = 50;
var Widget = /*#__PURE__*/function (_Component) {
  _inherits(Widget, _Component);
  var _super = _createSuper(Widget);
  function Widget(props) {
    var _this$props$data, _this$props$data$agre, _this$props$data2, _this$props$data2$agr, _this$props$data3, _this$props$data3$agr, _this$props$data4, _this$props$data4$agr, _this$props$data5, _this$props$data5$agr, _this$props$data6, _this$props$data6$agr;
    var _this;
    _classCallCheck(this, Widget);
    _this = _super.call(this, props);
    _this.state = {
      showButton: false,
      showText: false,
      showForm: false,
      step: 1,
      form: {
        sum: 0,
        repeat: 0,
        name: '',
        anonymous: 0,
        email: '',
        phone: ''
      },
      errors: {
        name: '',
        email: '',
        phone: ''
      },
      agreementOfferIsChecked: ((_this$props$data = _this.props.data) === null || _this$props$data === void 0 ? void 0 : (_this$props$data$agre = _this$props$data.agreement) === null || _this$props$data$agre === void 0 ? void 0 : _this$props$data$agre.offerShow) !== false && ((_this$props$data2 = _this.props.data) === null || _this$props$data2 === void 0 ? void 0 : (_this$props$data2$agr = _this$props$data2.agreement) === null || _this$props$data2$agr === void 0 ? void 0 : _this$props$data2$agr.offerCheckboxShow) !== false ? ((_this$props$data3 = _this.props.data) === null || _this$props$data3 === void 0 ? void 0 : (_this$props$data3$agr = _this$props$data3.agreement) === null || _this$props$data3$agr === void 0 ? void 0 : _this$props$data3$agr.offerCheckboxChecked) === true : true,
      agreementPolicyIsChecked: ((_this$props$data4 = _this.props.data) === null || _this$props$data4 === void 0 ? void 0 : (_this$props$data4$agr = _this$props$data4.agreement) === null || _this$props$data4$agr === void 0 ? void 0 : _this$props$data4$agr.policyShow) !== false && ((_this$props$data5 = _this.props.data) === null || _this$props$data5 === void 0 ? void 0 : (_this$props$data5$agr = _this$props$data5.agreement) === null || _this$props$data5$agr === void 0 ? void 0 : _this$props$data5$agr.policyCheckboxShow) !== false ? ((_this$props$data6 = _this.props.data) === null || _this$props$data6 === void 0 ? void 0 : (_this$props$data6$agr = _this$props$data6.agreement) === null || _this$props$data6$agr === void 0 ? void 0 : _this$props$data6$agr.policyCheckboxChecked) === true : true
    };
    _this.detectPlace = function () {
      var _ref, _breaks;
      var _this$props$data$widg = _this.props.data.widget,
        placeLG = _this$props$data$widg.place,
        _this$props$data$widg2 = _this$props$data$widg.deviceMD;
      _this$props$data$widg2 = _this$props$data$widg2 === void 0 ? {
        place: null
      } : _this$props$data$widg2;
      var _this$props$data$widg3 = _this$props$data$widg2.place,
        placeMD = _this$props$data$widg3 === void 0 ? null : _this$props$data$widg3,
        _this$props$data$widg4 = _this$props$data$widg.deviceSM;
      _this$props$data$widg4 = _this$props$data$widg4 === void 0 ? {
        place: null
      } : _this$props$data$widg4;
      var _this$props$data$widg5 = _this$props$data$widg4.place,
        placeSM = _this$props$data$widg5 === void 0 ? null : _this$props$data$widg5;
      var breaks = (_breaks = {}, _defineProperty(_breaks, mediaBreakSM, (_ref = placeSM !== null && placeSM !== void 0 ? placeSM : placeMD) !== null && _ref !== void 0 ? _ref : placeLG), _defineProperty(_breaks, mediaBreakMD, placeMD !== null && placeMD !== void 0 ? placeMD : placeLG), _defineProperty(_breaks, Number.MAX_VALUE, placeLG), _breaks);
      return mediaDependentValue(breaks, placeLG);
    };
    _this.detectWidth = function () {
      var _ref2, _breaks2;
      var _this$props$data$widg6 = _this.props.data.widget,
        _this$props$data$widg7 = _this$props$data$widg6.style;
      _this$props$data$widg7 = _this$props$data$widg7 === void 0 ? {
        width: null
      } : _this$props$data$widg7;
      var _this$props$data$widg8 = _this$props$data$widg7.width,
        widthLG = _this$props$data$widg8 === void 0 ? 186 : _this$props$data$widg8,
        _this$props$data$widg9 = _this$props$data$widg6.deviceMD;
      _this$props$data$widg9 = _this$props$data$widg9 === void 0 ? {
        width: null
      } : _this$props$data$widg9;
      var _this$props$data$widg10 = _this$props$data$widg9.width,
        widthMD = _this$props$data$widg10 === void 0 ? null : _this$props$data$widg10,
        _this$props$data$widg11 = _this$props$data$widg6.deviceSM;
      _this$props$data$widg11 = _this$props$data$widg11 === void 0 ? {
        width: null
      } : _this$props$data$widg11;
      var _this$props$data$widg12 = _this$props$data$widg11.width,
        widthSM = _this$props$data$widg12 === void 0 ? null : _this$props$data$widg12;
      var breaks = (_breaks2 = {}, _defineProperty(_breaks2, mediaBreakSM, (_ref2 = widthSM !== null && widthSM !== void 0 ? widthSM : widthMD) !== null && _ref2 !== void 0 ? _ref2 : widthLG), _defineProperty(_breaks2, mediaBreakMD, widthMD !== null && widthMD !== void 0 ? widthMD : widthLG), _defineProperty(_breaks2, Number.MAX_VALUE, widthLG), _breaks2);
      return mediaDependentValue(breaks, widthLG);
    };
    _this.onShowForm = function () {
      _this.setState({
        showForm: true,
        showButton: false
      });
      //sendWidgetEvent('click', this.props.data.site_id);
    };

    _this.onCloseForm = function () {
      var widget = _this.props.data.widget;
      var showButton = widget.afterClose == 'hide' ? false : true;
      var showText = widget.afterClose == 'hide' || widget.afterClose == 'hide-text' ? false : true;
      _this.setState({
        showForm: false,
        showButton: showButton,
        showText: showText
      });
      _this.setSession({
        closed: true
      });
    };
    _this.setSession = function (data) {
      var s = _this.getSession();
      s = _objectSpread(_objectSpread({}, s), data);
      sessionStorage.setItem('help-widget', JSON.stringify(s));
    };
    _this.getSession = function () {
      var str = sessionStorage.getItem('help-widget');
      try {
        return str ? JSON.parse(str) : {};
      } catch (e) {}
      return {};
    };
    _this.onInput = function (e) {
      var el = e.target;
      var prop = el.name;
      var value = el.value;
      if (el.type == 'checkbox') {
        var _ref3 = [el.getAttribute('check'), el.getAttribute('uncheck')],
          check = _ref3[0],
          uncheck = _ref3[1];
        if (check || uncheck) {
          value = _this.state.form[prop] == check ? uncheck : check;
        } else {
          value = !_this.state.form[prop];
        }
      }
      _this.setState({
        form: _objectSpread(_objectSpread({}, _this.state.form), {}, _defineProperty({}, prop, value))
      });
    };
    _this.onInputSum = function (e) {
      _this.setState({
        form: _objectSpread(_objectSpread({}, _this.state.form), {}, {
          sum: e.target.value.replace(/\D+/g, '')
        })
      });
    };
    _this.onInputSumChange = function (e) {
      var _filter = [_this.props.data.block1.fields.sum, _this.props.data.block2.fields.sum].filter(function (f) {
          return f.state;
        }),
        _filter2 = _slicedToArray(_filter, 1),
        fieldSum = _filter2[0];
      var number = parseInt(_this.state.form.sum);
      number = Math.max(fieldSum.min, number);
      number = Math.min(fieldSum.max, number);
      _this.setState({
        form: _objectSpread(_objectSpread({}, _this.state.form), {}, {
          sum: number
        })
      });
    };
    _this.onBack = function () {
      _this.setState({
        step: 1
      });
    };
    _this.onSumInc = function () {
      var _filter3 = [_this.props.data.block1.fields.sum, _this.props.data.block2.fields.sum].filter(function (f) {
          return f.state;
        }),
        _filter4 = _slicedToArray(_filter3, 1),
        fieldSum = _filter4[0];
      var number = parseInt(_this.state.form.sum);
      number = Math.min(fieldSum.max, sumStepper(number, +1));
      _this.setState({
        form: _objectSpread(_objectSpread({}, _this.state.form), {}, {
          sum: number
        })
      });
    };
    _this.onSumDec = function () {
      var _filter5 = [_this.props.data.block1.fields.sum, _this.props.data.block2.fields.sum].filter(function (f) {
          return f.state;
        }),
        _filter6 = _slicedToArray(_filter5, 1),
        fieldSum = _filter6[0];
      var number = parseInt(_this.state.form.sum);
      number = Math.max(fieldSum.min, sumStepper(number, -1));
      _this.setState({
        form: _objectSpread(_objectSpread({}, _this.state.form), {}, {
          sum: number
        })
      });
    };
    _this.onNext = function (e) {
      e.preventDefault();
      var _this$state = _this.state,
        step = _this$state.step,
        form = _this$state.form;
      if (!_this.validateForm()) {
        return;
      }
      if (step == 1 && _this.props.data.block2.state) {
        _this.setState({
          step: 2
        });
        return;
      }
      // submit
      var data = _this.props.data;
      var fieldEntries = [].concat(_toConsumableArray(Object.entries(data.block1.fields)), _toConsumableArray(Object.entries(data.block2.fields))).filter(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
          name = _ref5[0],
          field = _ref5[1];
        return field.state;
      });
      var fields = Object.fromEntries(fieldEntries); // merge duplicates if exist
      var post = _objectSpread(_objectSpread({}, data.utm), {}, {
        source: 'donation_widget'
      });
      Object.entries(fields).forEach(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
          name = _ref7[0],
          field = _ref7[1];
        post[name] = form[name];
      });
      if (_this.needPlatform()) {
        _this.goToPlatform();
      } else {
        _this.postToMixplat();
      }

      //sendWidgetEvent('payment', this.props.data.site_id);
    };

    _this.doTransitionPayment = function (fields) {
      var _this$props = _this.props,
        data = _this$props.data,
        options = _this$props.options;
      window.open(data.url, "donation", 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=750,left=600,top=200');
      //console.log('post fields', fields);
      var inputs = Object.entries(fields).map(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
          f = _ref9[0],
          v = _ref9[1];
        return domElem('input', {
          type: 'hidden',
          name: f,
          value: v
        });
      });
      var form = domElem('form', {
        method: 'get',
        action: data.url,
        target: 'donation',
        'accept-charset': 'utf8',
        style: 'display: none'
      }, inputs);
      var cont = options.container;
      cont.appendChild(form);
      form.submit();
    };
    _this.apiHost = function () {
      var _this$props2, _this$props2$data, _this$props2$data$api;
      var apiHost = (_this$props2 = _this.props) === null || _this$props2 === void 0 ? void 0 : (_this$props2$data = _this$props2.data) === null || _this$props2$data === void 0 ? void 0 : (_this$props2$data$api = _this$props2$data.api) === null || _this$props2$data$api === void 0 ? void 0 : _this$props2$data$api.apiHost;
      if (apiHost && apiHost[apiHost.length - 1] === '/') {
        apiHost = apiHost.substr(0, apiHost.length - 1);
      }
      return apiHost;
    };
    _this.formData = function () {
      var _this$props3, _this$props3$project, _this$props3$project$, _this$props4, _this$props4$project, _this$props5, _this$props5$alternat, _this$props5$alternat2, _this$props6, _this$props6$alternat, _this$props$data$targ, _this$props7, _this$props7$data, _this$props7$data$tar, _this$props8, _this$props8$data, _this$props$data7, _this$props$data7$com;
      var project_id = (_this$props3 = _this.props) !== null && _this$props3 !== void 0 && (_this$props3$project = _this$props3.project) !== null && _this$props3$project !== void 0 && (_this$props3$project$ = _this$props3$project.defaultPForm) !== null && _this$props3$project$ !== void 0 && _this$props3$project$.key ? (_this$props4 = _this.props) === null || _this$props4 === void 0 ? void 0 : (_this$props4$project = _this$props4.project) === null || _this$props4$project === void 0 ? void 0 : _this$props4$project.id : (_this$props5 = _this.props) !== null && _this$props5 !== void 0 && (_this$props5$alternat = _this$props5.alternativeProject) !== null && _this$props5$alternat !== void 0 && (_this$props5$alternat2 = _this$props5$alternat.defaultPForm) !== null && _this$props5$alternat2 !== void 0 && _this$props5$alternat2.key ? (_this$props6 = _this.props) === null || _this$props6 === void 0 ? void 0 : (_this$props6$alternat = _this$props6.alternativeProject) === null || _this$props6$alternat === void 0 ? void 0 : _this$props6$alternat.id : null;
      var target_id = (_this$props$data$targ = (_this$props7 = _this.props) === null || _this$props7 === void 0 ? void 0 : (_this$props7$data = _this$props7.data) === null || _this$props7$data === void 0 ? void 0 : (_this$props7$data$tar = _this$props7$data.target) === null || _this$props7$data$tar === void 0 ? void 0 : _this$props7$data$tar.id) !== null && _this$props$data$targ !== void 0 ? _this$props$data$targ : (_this$props8 = _this.props) !== null && _this$props8 !== void 0 && (_this$props8$data = _this$props8.data) !== null && _this$props8$data !== void 0 && _this$props8$data.company ? -1 * ((_this$props$data7 = _this.props.data) === null || _this$props$data7 === void 0 ? void 0 : (_this$props$data7$com = _this$props$data7.company) === null || _this$props$data7$com === void 0 ? void 0 : _this$props$data7$com.id) : null;
      var userSum = _this.state.form.sum;
      // Проверка, является ли значение строкой, и преобразование в число
      if (typeof userSum === 'string') {
        userSum = userSum.replace(',', '.');
        userSum = parseFloat(userSum);
      } else {
        userSum = parseInt(userSum);
      }
      return _objectSpread(_objectSpread({}, _this.state.form), {}, {
        sum: (isNaN(userSum) ? _this.state.form.userSum : userSum) || _this.state.form.sum,
        repeat: +_this.state.form.repeat,
        anonymous: +_this.state.form.anonymous,
        target_id: target_id,
        project_id: project_id
      });
    };
    _this.postToMixplat = function () {
      var _this$props9, _this$props9$data, _this$props10, _this$props10$data, _ref10, _this$props$data$proj, _this$props11, _this$props11$data$pr, _this$props11$data$pr2, _this$props12, _this$props12$data$al, _this$props12$data$al2, _collectNames$join, _form$comment;
      var form = _this.formData();
      var query = (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.getUrlParams)();
      query = (0,_form_form_utils_mjs__WEBPACK_IMPORTED_MODULE_30__.setDefaultQueryParams)(query);
      var utmLabels = (0,_form_form_utils_mjs__WEBPACK_IMPORTED_MODULE_30__.filterUtmFields)(query);
      var description = 'Благотворительное пожертвование на уставную деятельность';
      var target = (_this$props9 = _this.props) === null || _this$props9 === void 0 ? void 0 : (_this$props9$data = _this$props9.data) === null || _this$props9$data === void 0 ? void 0 : _this$props9$data.target;
      var formSid = (_this$props10 = _this.props) === null || _this$props10 === void 0 ? void 0 : (_this$props10$data = _this$props10.data) === null || _this$props10$data === void 0 ? void 0 : _this$props10$data.site_id;
      if (target) {
        if (target.type === _constants_mjs__WEBPACK_IMPORTED_MODULE_28__.TargetType.PERSON) {
          description = "".concat(target.title, ", \u0431\u043B\u0430\u0433\u043E\u0442\u0432\u043E\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u0436\u0435\u0440\u0442\u0432\u043E\u0432\u0430\u043D\u0438\u0435");
        } else if (form.target_id > 0) {
          description = target.title;
        }
      }
      var phone = form.phone;
      if (phone) {
        phone = phone.replace(/[^\d]/g, '');
      }
      var collectNames = [form.name, form.last_name];
      var key = (_ref10 = (_this$props$data$proj = (_this$props11 = _this.props) === null || _this$props11 === void 0 ? void 0 : (_this$props11$data$pr = _this$props11.data.project) === null || _this$props11$data$pr === void 0 ? void 0 : (_this$props11$data$pr2 = _this$props11$data$pr.defaultPForm) === null || _this$props11$data$pr2 === void 0 ? void 0 : _this$props11$data$pr2.key) !== null && _this$props$data$proj !== void 0 ? _this$props$data$proj : (_this$props12 = _this.props) === null || _this$props12 === void 0 ? void 0 : (_this$props12$data$al = _this$props12.data.alternativeProject) === null || _this$props12$data$al === void 0 ? void 0 : (_this$props12$data$al2 = _this$props12$data$al.defaultPForm) === null || _this$props12$data$al2 === void 0 ? void 0 : _this$props12$data$al2.key) !== null && _ref10 !== void 0 ? _ref10 : null;
      var options = _objectSpread(_objectSpread({}, {
        sid: formSid,
        payment_form_key: key,
        test: 0,
        description: (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.smartShorter)(description),
        currency: 'RUB',
        amount: form.sum * 100,
        user_name: collectNames === null || collectNames === void 0 ? void 0 : (_collectNames$join = collectNames.join(" ")) === null || _collectNames$join === void 0 ? void 0 : _collectNames$join.trim(),
        user_email: form.email,
        user_phone: phone,
        user_comment: (_form$comment = form.comment) === null || _form$comment === void 0 ? void 0 : _form$comment.substring(0, MAX_COMMENT_DEFAULT_LENGTH),
        user_anonymous: form.anonymous ? 1 : 0,
        user_fundraising_product: _constants_mjs__WEBPACK_IMPORTED_MODULE_28__.WidgetFundraisingProduct.WIDGET,
        user_fundraising_program_id: form.target_id,
        recurrent_payment: form.repeat
      }), utmLabels);
      (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.saveMyRejectInfoToLocalStorage)(options.user_fundraising_program_id, form.sum);
      (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('payment-options', options);
      var paymentCallbacks = {
        onInit: function onInit(result) {
          (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('Платеж инициализирован:', result);
          _this.sendInitData(result.data);
        },
        onProcess: function onProcess(result) {
          return (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('Платеж в процессе:', result);
        },
        onSuccess: function onSuccess(result) {
          (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('Платеж успешен:', result);
          _this.sendSuccessData(form, result.data);
        },
        onFail: function onFail(result) {
          console.error('Ошибка платежа:', result);
          _this.sendFailData(form, result.data);
          _this.onCloseForm();
        },
        onClose: function onClose(result) {
          return (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('Платеж закрыт:', result);
        }
      };
      _form_api_mjs__WEBPACK_IMPORTED_MODULE_29__.mixplatJSApiClient.paymentWithCallbacks(options, paymentCallbacks).catch(function () {
        //this.showAlert('Ошибка платежа', 'Ошибка');
        _this.sendFailData(form);
        _this.onCloseForm();
      }).finally(function () {
        //this.setState({ wait: false });
      });
    };
    return _this;
  }
  _createClass(Widget, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.resetForm();
      this.showWidget();
      window.addEventListener('resize', function () {
        _this2.forceUpdate();
      });
      var handlers = {
        mixplatEventError: function mixplatEventError(event) {
          var _event$detail, _event$detail$form_da;
          (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('mixplatEventError in form', event.detail);
          if (((_event$detail = event.detail) === null || _event$detail === void 0 ? void 0 : (_event$detail$form_da = _event$detail.form_data) === null || _event$detail$form_da === void 0 ? void 0 : _event$detail$form_da.sid) === _this2.props.data.site_id && _this2.props.data.project) {
            delete _this2.props.data.project;
            (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.closeMixplatPaymentForm)();
            _this2.postToMixplat();
          }
        }
      };
      for (var eventName in handlers) {
        document.addEventListener(eventName, handlers[eventName]);
      }
    }
  }, {
    key: "showWidget",
    value: function showWidget() {
      var _this3 = this;
      var data = this.props.data;
      var widget = data.widget;
      var _this$getSession = this.getSession(),
        _this$getSession$clos = _this$getSession.closed,
        closed = _this$getSession$clos === void 0 ? false : _this$getSession$clos; // was closed
      var timeout = widget.showDelay || 100;
      var showButton = closed && widget.afterClose == 'hide' ? false : true;
      var showText = closed && (widget.afterClose == 'hide' || widget.afterClose == 'hide-text') ? false : true;
      setTimeout(function () {
        return _this3.setState({
          showButton: showButton
        });
      }, timeout);
      setTimeout(function () {
        return _this3.setState({
          showText: showText
        });
      }, timeout + 500);
      //sendWidgetEvent('show', data.site_id);
      this.sendSetSource();
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      // set defaults
      var _this$props$data8 = this.props.data,
        id = _this$props$data8.id,
        widget = _this$props$data8.widget,
        block1 = _this$props$data8.block1,
        block2 = _this$props$data8.block2;
      var goodField = function goodField(name) {
        return [block1.fields[name]].concat(block2.state ? block2.fields[name] : []).filter(function (f) {
          return f.state;
        })[0] || null;
      };
      var sum = goodField('sum');
      var repeat = goodField('repeat');
      var anonymous = goodField('anonymous');
      sum && (this.state.form.sum = sum.default);
      repeat && (this.state.form.repeat = repeat.default);
      anonymous && (this.state.form.anonymous = anonymous.default || '0');
      this.state.form.name = '';
      this.state.form.email = '';
      this.state.form.phone = '';
    }
  }, {
    key: "sumString",
    get: function get() {
      return this.state.form.sum + ' ₽';
    }
  }, {
    key: "validateForm",
    value: function validateForm() {
      var valid = true;
      var _this$state2 = this.state,
        step = _this$state2.step,
        form = _this$state2.form,
        errors = _this$state2.errors;
      var fields = this.props.data["block".concat(step)].fields;
      var checks = {
        name: function name(v) {
          return v ? '' : fields.anonymous.state && form.anonymous != 1 ? 'Введите Ваше имя' : '';
        },
        email: function email(v) {
          if (!v) return 'Введите Ваш E-mail';
          if (!v.match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)) return 'Введите корректный E-mail';
          return '';
        },
        phone: function phone(v) {
          if (!v) return 'Введите Ваш телефон';
          if (!v.match(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/)) return 'Введите корректный телефон (10-14 цифр)';
          return '';
        }
      };
      Object.entries(fields).filter(function (_ref11) {
        var _ref12 = _slicedToArray(_ref11, 2),
          name = _ref12[0],
          field = _ref12[1];
        return field.state && field.validate && checks[field.name];
      }).forEach(function (_ref13) {
        var _ref14 = _slicedToArray(_ref13, 2),
          name = _ref14[0],
          field = _ref14[1];
        var check = checks[name];
        var error = check(form[name]);
        valid &= !error;
        errors[name] = error;
      });
      this.setState({
        errors: errors
      });
      return valid;
    }
  }, {
    key: "needPlatform",
    value: function needPlatform() {
      var _this$props13, _this$props13$data, _this$state3, _this$state3$fund, _this$state4, _this$state4$mainPage;
      return !((_this$props13 = this.props) !== null && _this$props13 !== void 0 && (_this$props13$data = _this$props13.data) !== null && _this$props13$data !== void 0 && _this$props13$data.form) && ((_this$state3 = this.state) === null || _this$state3 === void 0 ? void 0 : (_this$state3$fund = _this$state3.fund) === null || _this$state3$fund === void 0 ? void 0 : _this$state3$fund.hasDonationToggle) && ((_this$state4 = this.state) === null || _this$state4 === void 0 ? void 0 : (_this$state4$mainPage = _this$state4.mainPage) === null || _this$state4$mainPage === void 0 ? void 0 : _this$state4$mainPage.page);
    }
  }, {
    key: "goToPlatform",
    value: function goToPlatform() {
      var _Object$keys, _this$state5, _this$state5$mainPage, _this$state7, _this$state7$target;
      var sections = [];
      var params = ["source=".concat(_constants_mjs__WEBPACK_IMPORTED_MODULE_28__.WidgetFundraisingProduct.WIDGET)];
      var query = (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.getUrlParams)();
      var utmLabels = (0,_form_form_utils_mjs__WEBPACK_IMPORTED_MODULE_30__.filterUtmFields)(query);
      (_Object$keys = Object.keys(utmLabels)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.forEach(function (utmKey) {
        params.push("".concat(utmKey, "=").concat(utmLabels[utmKey]));
      });
      var form = this.formData();
      var amount = form.sum;
      if ((_this$state5 = this.state) !== null && _this$state5 !== void 0 && (_this$state5$mainPage = _this$state5.mainPage) !== null && _this$state5$mainPage !== void 0 && _this$state5$mainPage.page) {
        var _this$state6, _this$state6$mainPage;
        sections.push((_this$state6 = this.state) === null || _this$state6 === void 0 ? void 0 : (_this$state6$mainPage = _this$state6.mainPage) === null || _this$state6$mainPage === void 0 ? void 0 : _this$state6$mainPage.page);
      }
      if ((_this$state7 = this.state) !== null && _this$state7 !== void 0 && (_this$state7$target = _this$state7.target) !== null && _this$state7$target !== void 0 && _this$state7$target.page) {
        var _this$state8, _this$state8$target;
        sections.push((_this$state8 = this.state) === null || _this$state8 === void 0 ? void 0 : (_this$state8$target = _this$state8.target) === null || _this$state8$target === void 0 ? void 0 : _this$state8$target.page);
      }
      if (form.repeat) {
        params.push('recurrent=1');
      }
      if (amount) {
        params.push("amount=".concat(amount));
      }
      var url = "".concat(_constants_mjs__WEBPACK_IMPORTED_MODULE_28__.donationHost, "/").concat(sections.join('/'));

      // Добавляем параметры, если они есть
      if (params.length > 0) {
        url += "?".concat(params.join('&'));
      }
      window.open(url, '_blank');
    }
  }, {
    key: "sendInitData",
    value: function sendInitData() {
      var _this$props14,
        _this$props14$options,
        _this$props15,
        _this$props15$data,
        _localStorage,
        _this4 = this;
      var mixplatData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      //Если вызов из превью ЛК или админки - не отправляем инфо
      var from = (_this$props14 = this.props) === null || _this$props14 === void 0 ? void 0 : (_this$props14$options = _this$props14.options) === null || _this$props14$options === void 0 ? void 0 : _this$props14$options.from;
      if (['lk', 'admin'].indexOf(from) >= 0) {
        return;
      }
      var apiURL = this.apiHost() + "/wapi/set-init-data?sid=".concat((_this$props15 = this.props) === null || _this$props15 === void 0 ? void 0 : (_this$props15$data = _this$props15.data) === null || _this$props15$data === void 0 ? void 0 : _this$props15$data.site_id);
      fetch(apiURL, {
        method: 'POST',
        //mode: "no-cors",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_defineProperty({
          url: location.href,
          form: this.formData(),
          mixplatData: mixplatData
        }, _constants_mjs__WEBPACK_IMPORTED_MODULE_28__.DntnVisitsDataIdKey, (_localStorage = localStorage) === null || _localStorage === void 0 ? void 0 : _localStorage.getItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_28__.DntnVisitsDataIdKey)))
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this4.setState({
          logo: json['logo']
        });
      }, function (error) {});
    }
  }, {
    key: "sendSetSource",
    value: function sendSetSource() {
      var _this$props16,
        _this$props16$options,
        _this$props17,
        _this$props17$data,
        _localStorage2,
        _localStorage3,
        _this$props18,
        _this$props18$data,
        _this5 = this;
      //Если вызов из превью ЛК или админки - не отправляем инфо
      var from = (_this$props16 = this.props) === null || _this$props16 === void 0 ? void 0 : (_this$props16$options = _this$props16.options) === null || _this$props16$options === void 0 ? void 0 : _this$props16$options.from;
      if (['lk', 'admin'].indexOf(from) >= 0) {
        return;
      }
      var currDate = (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.currentDate)();
      var apiURL = this.apiHost() + "/wapi/set-source?sid=".concat((_this$props17 = this.props) === null || _this$props17 === void 0 ? void 0 : (_this$props17$data = _this$props17.data) === null || _this$props17$data === void 0 ? void 0 : _this$props17$data.site_id);
      fetch(apiURL, {
        method: 'POST',
        //mode: "no-cors",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: location.href,
          uniqueGlobalSession: ((_localStorage2 = localStorage) === null || _localStorage2 === void 0 ? void 0 : _localStorage2.getItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_28__.WidgetVisitDateKey)) !== currDate,
          uniqueInstanceSession: ((_localStorage3 = localStorage) === null || _localStorage3 === void 0 ? void 0 : _localStorage3.getItem("".concat((_this$props18 = this.props) === null || _this$props18 === void 0 ? void 0 : (_this$props18$data = _this$props18.data) === null || _this$props18$data === void 0 ? void 0 : _this$props18$data.site_id))) !== currDate,
          wloaderExist: !!window.donationRuWLoader
        })
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        var _this5$props, _this5$props$data;
        localStorage.setItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_28__.WidgetVisitDateKey, currDate);
        localStorage.setItem("".concat((_this5$props = _this5.props) === null || _this5$props === void 0 ? void 0 : (_this5$props$data = _this5$props.data) === null || _this5$props$data === void 0 ? void 0 : _this5$props$data.site_id), currDate);
        _this5.setState({
          fund: json['fund'],
          mainPage: json['mainPage'],
          target: json['target']
        });
        if (json['wloader']) {
          (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.addWloader)(json['wloader']);
        }
      });
    }
  }, {
    key: "sendSuccessData",
    value: function sendSuccessData() {
      var _this$props19, _this$props19$options, _this$props20, _this$props20$data, _localStorage4;
      var form = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var mixplatData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('sendSuccessData form=', form);
      //Если вызов из превью ЛК или админки - не отправляем инфо
      var from = (_this$props19 = this.props) === null || _this$props19 === void 0 ? void 0 : (_this$props19$options = _this$props19.options) === null || _this$props19$options === void 0 ? void 0 : _this$props19$options.from;
      if (['lk', 'admin'].indexOf(from) >= 0) {
        return;
      }
      var sid = (_this$props20 = this.props) === null || _this$props20 === void 0 ? void 0 : (_this$props20$data = _this$props20.data) === null || _this$props20$data === void 0 ? void 0 : _this$props20$data.site_id;
      var apiURL = this.apiHost() + "/wapi/set-success-data?sid=".concat(sid);
      fetch(apiURL, {
        method: 'POST',
        //mode: "no-cors",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_defineProperty({
          url: location.href,
          form: form,
          mixplatData: mixplatData
        }, _constants_mjs__WEBPACK_IMPORTED_MODULE_28__.DntnVisitsDataIdKey, (_localStorage4 = localStorage) === null || _localStorage4 === void 0 ? void 0 : _localStorage4.getItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_28__.DntnVisitsDataIdKey)))
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.saveMySuccessAmountToLocalStorage)(form.sum);
      }, function (error) {});
    }
  }, {
    key: "sendFailData",
    value: function sendFailData() {
      var _this$props21, _this$props21$options, _this$props22, _this$props22$data, _localStorage5;
      var form = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var mixplatData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('sendFailData form=', form);
      //Если вызов из превью ЛК или админки - не отправляем инфо
      var from = (_this$props21 = this.props) === null || _this$props21 === void 0 ? void 0 : (_this$props21$options = _this$props21.options) === null || _this$props21$options === void 0 ? void 0 : _this$props21$options.from;
      if (['lk', 'admin'].indexOf(from) >= 0) {
        return;
      }
      var sid = (_this$props22 = this.props) === null || _this$props22 === void 0 ? void 0 : (_this$props22$data = _this$props22.data) === null || _this$props22$data === void 0 ? void 0 : _this$props22$data.site_id;
      (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.saveMyFailInfoToLocalStorage)(form.target_id, form.sum);
      var apiURL = this.apiHost() + "/wapi/set-fail-data?sid=".concat(sid);
      fetch(apiURL, {
        method: 'POST',
        //mode: "no-cors",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_defineProperty({
          url: location.href,
          form: form,
          mixplatData: mixplatData
        }, _constants_mjs__WEBPACK_IMPORTED_MODULE_28__.DntnVisitsDataIdKey, (_localStorage5 = localStorage) === null || _localStorage5 === void 0 ? void 0 : _localStorage5.getItem(_constants_mjs__WEBPACK_IMPORTED_MODULE_28__.DntnVisitsDataIdKey)))
      }).then(function (response) {
        return response.json();
      }).then(function (json) {}, function (error) {});
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$data$comp,
        _this$props23,
        _this$props23$data,
        _agreement,
        _this$props24,
        _this$props24$data,
        _agreement2,
        _this$props25,
        _this$props25$data,
        _this6 = this,
        _agreement3,
        _agreement4,
        _agreement5,
        _agreement6,
        _agreement7,
        _agreement8;
      widgetData = {
        component: this
      };
      var state = this.state;
      var form = state.form,
        errors = state.errors;
      var data = this.props.data;
      var id = data.id,
        widget = data.widget,
        block1 = data.block1,
        block2 = data.block2,
        _data$utm = data.utm,
        utm = _data$utm === void 0 ? {} : _data$utm;
      var _widget$deviceMD = widget.deviceMD,
        deviceMD = _widget$deviceMD === void 0 ? {} : _widget$deviceMD,
        _widget$deviceSM = widget.deviceSM,
        deviceSM = _widget$deviceSM === void 0 ? {} : _widget$deviceSM;
      var agreement = data.agreement;
      var company = (_this$props$data$comp = (_this$props23 = this.props) === null || _this$props23 === void 0 ? void 0 : (_this$props23$data = _this$props23.data) === null || _this$props23$data === void 0 ? void 0 : _this$props23$data.company) !== null && _this$props$data$comp !== void 0 ? _this$props$data$comp : {};
      agreement = _objectSpread(_objectSpread({}, agreement), {}, {
        offerUrl: ((_agreement = agreement) === null || _agreement === void 0 ? void 0 : _agreement.offerUrl) || ((_this$props24 = this.props) === null || _this$props24 === void 0 ? void 0 : (_this$props24$data = _this$props24.data) === null || _this$props24$data === void 0 ? void 0 : _this$props24$data.offerUrl),
        policyUrl: ((_agreement2 = agreement) === null || _agreement2 === void 0 ? void 0 : _agreement2.policyUrl) || ((_this$props25 = this.props) === null || _this$props25 === void 0 ? void 0 : (_this$props25$data = _this$props25.data) === null || _this$props25$data === void 0 ? void 0 : _this$props25$data.policyUrl)
      });
      var fieldsHtml = function fieldsHtml(block) {
        return html(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n<div class=\"widget-help__fields\">\n", "\n", "\n", "\n", "\n", "\n", "\n</div>\n\n    "])), block.fields.sum.state ? html(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    <div class=\"widget-help__edit-summa\" style=\"order:", ";\">\n        <input name=\"sum\" type=\"text\" class=\"widget-help__input widget-help__input-summa\" value=\"", "\"\n               onInput=", " onchange=", "\n            id=\"widget-help-input\" autocomplete=\"off\" tabindex=", " />\n        <div class=\"widget-help__summa-dec\" onClick=", ">\n            <span></span>\n        </div>\n        <div class=\"widget-help__summa-inc\" onClick=", ">\n            <span></span><span></span>\n        </div>\n    </div>\n"])), block.fields.sum.order, _this6.sumString, _this6.onInputSum, _this6.onInputSumChange, block.fields.sum.order, _this6.onSumDec, _this6.onSumInc) : '', block.fields.repeat.state ? html(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    <label class=\"widget-help__check animate-it widget-help__check_repeat\" style=\"order:", ";\">\n        <input type=\"checkbox\" name=\"repeat\" check=\"1\" uncheck=\"0\" checked=", " onChange=", " \n            tabindex=", " />\n        <span>\n            <span></span>\n        </span>\n        ", "\n    </label>\n"])), block.fields.repeat.order, form.repeat == 1, _this6.onInput, block.fields.repeat.order, block.fields.repeat.text || 'Помогать каждый месяц') : '', block.fields.name.state && form.anonymous != "1" ? html(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    <div style=\"order:", ";\">\n        ", "\n        <input name=\"name\" value=", " onInput=", " tabindex=", "\n            type=\"text\" class=\"widget-help__input ", "\" autocomplete=\"off\" placeholder=\"\u0412\u0430\u0448\u0435 \u0438\u043C\u044F\" />\n    </div>\n"])), block.fields.name.order, errors.name ? html(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["<div class=\"widget__valid-error-text widget__valid-error-text_name\">", "</div>"])), errors.name) : '', form.name, _this6.onInput, block.fields.name.order, errors.name ? 'widget__valid-error' : '') : '', block.fields.anonymous.state ? html(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    <label class=\"widget-help__check widget-help__check_anonymous\" style=\"order:", ";\">\n        <input type=\"checkbox\" name=\"anonymous\" check=\"1\" uncheck=\"0\" checked=", " onChange=", " \n            tabindex=", " />\n        <span>\n            <span></span>\n        </span>\n        ", "\n    </label>\n"])), block.fields.anonymous.order, form.anonymous == 1, _this6.onInput, block.fields.anonymous.order, block.fields.anonymous.text || 'Помогать анонимно') : '', block.fields.email.state ? html(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    <div style=\"order:", ";\">\n        ", "\n        <input name=\"email\" type=\"email\" class=\"widget-help__input ", "\" \n            tabindex=", " autocomplete=\"off\" placeholder=\"\u0412\u0430\u0448 email\" value=", " onInput=", " />\n    </div>\n"])), block.fields.email.order, errors.email ? html(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["<div class=\"widget__valid-error-text widget__valid-error-text_name\">", "</div>"])), errors.email) : '', errors.email ? 'widget__valid-error' : '', block.fields.email.order, form.email, _this6.onInput) : '', block.fields.phone.state ? html(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    <div style=\"order:", ";\">\n        ", "\n        <input name=\"phone\" type=\"tel\" class=\"widget-help__input ", "\" \n            tabindex=", " autocomplete=\"off\" placeholder=\"\u0412\u0430\u0448 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\" value=", " onInput=", " />\n    </div>\n"])), block.fields.phone.order, errors.phone ? html(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["<div class=\"widget__valid-error-text widget__valid-error-text_name\">", "</div>"])), errors.phone) : '', errors.phone ? 'widget__valid-error' : '', block.fields.phone.order, form.phone, _this6.onInput) : '');
      };
      var r = html(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n<div id='", "' class=\"widget-help widget-help__", "\" style=\"color: ", "; \"> \n\n<div class=\"widget-help__button ", "\" onClick=", ">\n    <img width=\"", "\" src=\"", "\" alt=\"\" class=\"widget-help__animate-1\" />\n    ", "\n</div>\n\n<form method=\"get\" action=\"", "\" target=\"donation\" accept-charset=\"utf8\" class=\"widget-help__pop ", "\">\n    <div class=\"widget-help__close\" onClick=", ">\n        <svg width=\"25\" height=\"25\" viewBox=\"0 0 25 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect x=\"0.00170898\" y=\"0.00146484\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#FBF3E8\" />\n        <g opacity=\"0.3\">\n            <line x1=\"7.2122\" y1=\"7.64791\" x2=\"16.2122\" y2=\"16.6479\" stroke=\"#49160D\" />\n            <line y1=\"-0.5\" x2=\"12.7279\" y2=\"-0.5\" transform=\"matrix(-0.707107 0.707107 0.707107 0.707107 17.1444 8.00146)\" stroke=\"#49160D\" />\n        </g>\n        </svg>\n    </div>\n\n    ", "\n    \n    <div class=\"widget-help__step-1\" style=", ">\n        <img width=\"", "\" src=\"", "\" alt=\"\" class=\"widget-help__animate-2\" />\n        <div class=\"widget-help__title\" dangerouslySetInnerHTML=", "></div>\n        <div class=\"widget-help__after-title\" dangerouslySetInnerHTML=", "></div>\n\n        ", "\n\n        <div class=\"form-footer ", "\">\n            <div class=\"position-relative\">\n                <button type=\"submit\" class=\"widget-help__submit\" onClick=", " style=\"background: ", "; box-shadow: ", "; color: ", ";\"\n                disabled=", "\n        >\n                    ", "\n                </button>\n                ", "\n            </div>\n            ", "\n        </div>\n    \n    </div>\n    ", "\n\n</form>\n    <div dangerouslySetInnerHTML=", "></div>\n</div>\n    "])), id, this.detectPlace(), 'skin.colorTextAll', state.showButton ? 'widgetHelpShow' : '', this.onShowForm, widget.style.imageWidth || 60, widget.style.image, widget.text ? html(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n        <div class=\"widget-help__text ", "\" id=\"widget-help-text\" \n            style=\"width: ", "px\"\n            dangerouslySetInnerHTML=", ">\n        </div>\n    "])), state.showText ? 'widgetHelpShow' : '', this.detectWidth(), {
        __html: widget.text
      }) : '', data.url, state.showForm ? 'widgetHelpShow' : '', this.onCloseForm, Object.entries(utm).map(function (_ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
          name = _ref16[0],
          value = _ref16[1];
        return html(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["<input type=\"hidden\" name=\"", "\" value=\"", "\" />"])), name, value);
      }), {
        display: state.step == 1 ? 'block' : 'none'
      }, block2.style.imageWidth || 86, block1.style.image, {
        __html: block1.title
      }, {
        __html: block1.text
      }, fieldsHtml(block1), ((_agreement3 = agreement) === null || _agreement3 === void 0 ? void 0 : _agreement3.placement) === _constants_mjs__WEBPACK_IMPORTED_MODULE_28__.AgreementPlacements.END ? '' : 'agreement-first', this.onNext, 'skin.block1.btnColor', 'skin.block1.boxShadowButton', 'skin.block1.btnTxtColor', !state.agreementOfferIsChecked || !state.agreementPolicyIsChecked, block1.btnText, (((_agreement4 = agreement) === null || _agreement4 === void 0 ? void 0 : _agreement4.offerCheckboxShow) !== false && !this.state.agreementOfferIsChecked || ((_agreement5 = agreement) === null || _agreement5 === void 0 ? void 0 : _agreement5.policyCheckboxShow) !== false && !this.state.agreementPolicyIsChecked) && h("div", {
        className: "tooltip-alert tooltip-alert-danger"
      }, "\u0414\u043B\u044F \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0435\u043D\u0438\u044F - \u043F\u0440\u0438\u043C\u0438\u0442\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u044F"), (0,_agreementContent_mjs__WEBPACK_IMPORTED_MODULE_31__.agreementsContent)(this, agreement), block2.state ? html(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\n    <div class=\"widget-help__step-2\" style=", ">\n        <div class='widget-help__back' onClick=", ">", "</div>\n        <img width=\"", "\" src=\"", "\" alt=\"\" class=\"widget-help__animate-2\" />\n        <div class=\"widget-help__title\">", "</div>\n        <div class=\"widget-help__after-title\">", "</div>\n\n        ", "\n        <div class=\"form-footer ", "\">\n            <div class=\"position-relative\">\n                <button type=\"submit\" class=\"widget-help__submit\" onClick=", " style=\"background: ", "; box-shadow: ", "; color: ", ";\"\n                        disabled=", "\n                >\n                    ", "\n                </button>\n                ", "\n            </div>\n            ", "\n        </div>\n    \n    </div>\n    "])), {
        display: state.step == 2 ? 'block' : 'none'
      }, this.onBack, '<', block2.style.imageWidth || 86, block2.style.image, block2.title, block2.text, fieldsHtml(block2), ((_agreement6 = agreement) === null || _agreement6 === void 0 ? void 0 : _agreement6.placement) === _constants_mjs__WEBPACK_IMPORTED_MODULE_28__.AgreementPlacements.END ? '' : 'agreement-first', this.onNext, 'skin.block2.btnColor', 'skin.block2.boxShadowButton', 'skin.block2.btnTxtColor', !state.agreementOfferIsChecked || !state.agreementPolicyIsChecked, block2.btnText, (((_agreement7 = agreement) === null || _agreement7 === void 0 ? void 0 : _agreement7.offerCheckboxShow) !== false && !this.state.agreementOfferIsChecked || ((_agreement8 = agreement) === null || _agreement8 === void 0 ? void 0 : _agreement8.policyCheckboxShow) !== false && !this.state.agreementPolicyIsChecked) && h("div", {
        className: "tooltip-alert tooltip-alert-danger"
      }, "\u0414\u043B\u044F \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0435\u043D\u0438\u044F - \u043F\u0440\u0438\u043C\u0438\u0442\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u044F"), (0,_agreementContent_mjs__WEBPACK_IMPORTED_MODULE_31__.agreementsContent)(this, agreement)) : '', {
        __html: data.extraHtml
      });
      return r;
    }
  }]);
  return Widget;
}(Component);
function createWidget(data, options) {
  (0,_widget_utils_mjs__WEBPACK_IMPORTED_MODULE_27__.consoleWrite)('createWidget', 'data=', data, 'options=', options);
  data.id = options.id || 'widget-animation-x';
  fixDataFileUrls(data);
  saveUtmParams();
  data.utm = getUtmParams();
  setCSS(data, options);
  var cont = options.container || null;
  if (!options.container) {
    cont = options.container = domElem('div', {});
    document.body.appendChild(cont);
  }
  var contChild = cont.children[0] || null;
  render(h(Widget, {
    data: data,
    options: options
  }), cont, contChild);
}
function setCSS(data, options) {
  var id = data.id,
    widget = data.widget,
    block1 = data.block1,
    block2 = data.block2;
  var _widget$deviceMD2 = widget.deviceMD,
    deviceMD = _widget$deviceMD2 === void 0 ? {} : _widget$deviceMD2,
    _widget$deviceSM2 = widget.deviceSM,
    deviceSM = _widget$deviceSM2 === void 0 ? {} : _widget$deviceSM2;
  domReplaceChild(document.head, domElem('style', {
    id: id + 'style'
  }, commonCSS));
  domReplaceChild(document.head, domElem('link', {
    id: id + 'font',
    href: 'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap',
    rel: 'stylesheet'
  }));
  var css = "\n#".concat(id, ".widget-help__left-top {\n    left: ").concat(widget.marginWidth, "px;\n    top: ").concat(widget.marginHeight, "px;\n}\n#").concat(id, ".widget-help__left-bottom {\n    left: ").concat(widget.marginWidth, "px;\n    bottom: ").concat(widget.marginHeight, "px;\n}\n#").concat(id, ".widget-help__right-top {\n    right: ").concat(widget.marginWidth, "px;\n    top: ").concat(widget.marginHeight, "px;\n}\n#").concat(id, ".widget-help__right-bottom {\n    right: ").concat(widget.marginWidth, "px;\n    bottom: ").concat(widget.marginHeight, "px;\n}\n\n@media screen and (max-width: ").concat(mediaBreakMD, "px) {\n\t#").concat(id, ".widget-help__left-top {\n        ").concat(deviceMD.marginWidth ? "left: ".concat(deviceMD.marginWidth, "px;") : '', "\n        ").concat(deviceMD.marginHeight ? "top: ".concat(deviceMD.marginHeight, "px;") : '', "\n\t}\n\t#").concat(id, ".widget-help__left-bottom {\n        ").concat(deviceMD.marginWidth ? "left: ".concat(deviceMD.marginWidth, "px;") : '', "\n        ").concat(deviceMD.marginHeight ? "bottom: ".concat(deviceMD.marginHeight, "px;") : '', "\n\t}\n\t#").concat(id, ".widget-help__right-top {\n        ").concat(deviceMD.marginWidth ? "right: ".concat(deviceMD.marginWidth, "px;") : '', "\n        ").concat(deviceMD.marginHeight ? "top: ".concat(deviceMD.marginHeight, "px;") : '', "\n\t}\n\t#").concat(id, ".widget-help__right-bottom {\n        ").concat(deviceMD.marginWidth ? "right: ".concat(deviceMD.marginWidth, "px;") : '', "\n        ").concat(deviceMD.marginHeight ? "bottom: ".concat(deviceMD.marginHeight, "px;") : '', "\n\t}\n}\n\n@media screen and (max-width: ").concat(mediaBreakSM, "px) {\n    #").concat(id, ".widget-help__left-top {\n        ").concat(deviceSM.marginWidth ? "left: ".concat(deviceSM.marginWidth, "px;") : '', "\n        ").concat(deviceSM.marginHeight ? "top: ".concat(deviceSM.marginHeight, "px;") : '', "\n    }\n    #").concat(id, ".widget-help__left-bottom {\n        ").concat(deviceSM.marginWidth ? "left: ".concat(deviceSM.marginWidth, "px;") : '', "\n        ").concat(deviceSM.marginHeight ? "bottom: ".concat(deviceSM.marginHeight, "px;") : '', "\n    }\n    #").concat(id, ".widget-help__right-top {\n        ").concat(deviceSM.marginWidth ? "right: ".concat(deviceSM.marginWidth, "px;") : '', "\n        ").concat(deviceSM.marginHeight ? "top: ".concat(deviceSM.marginHeight, "px;") : '', "\n    }\n    #").concat(id, ".widget-help__right-bottom {\n        ").concat(deviceSM.marginWidth ? "right: ".concat(deviceSM.marginWidth, "px;") : '', "\n        ").concat(deviceSM.marginHeight ? "bottom: ".concat(deviceSM.marginHeight, "px;") : '', "\n    }\n}\n\n/*\n#").concat(id, " .widget-help__position {\n    ").concat(widget.style.place == 'left-bottom' || widget.style.place == 'left-top' ? "margin-left: ".concat(widget.marginWidth, "px") : '', "\n    ").concat(widget.style.place != 'left-bottom' && widget.style.place != 'left-top' ? "margin-right: ".concat(widget.marginWidth, "px") : '', "\n}\n*/\n\n#").concat(id, ".widget-help__text__left-top {\n\n}\n#").concat(id, ".widget-help__text__left-bottom {\n\n}\n\n#").concat(id, ".widget-help__right-top .widget-help__button {\n    bottom: auto;\n}\n#").concat(id, ".widget-help__left-top .widget-help__button {\n    bottom: auto;\n}\n#").concat(id, ".widget-help__left-bottom .widget-help__button, #").concat(id, ".widget-help__left-top .widget-help__button {\n    left: -500px;\n    right: auto;\n}\n#").concat(id, ".widget-help__left-bottom .widget-help__button.widgetHelpShow, #").concat(id, ".widget-help__left-top .widget-help__button.widgetHelpShow {\n    left: 0;\n    right: auto;\n}\n#").concat(id, ".widget-help__left-bottom .widget-help__text, #").concat(id, ".widget-help__left-top .widget-help__text {\n    left: -500px;\n    right: auto;\n}\n#").concat(id, ".widget-help__left-bottom .widget-help__text.widgetHelpShow, #").concat(id, ".widget-help__left-top .widget-help__text.widgetHelpShow {\n    left: ").concat(parseInt(widget.style.imageWidth || 60) / 2 + 10, "px;\n    padding-left: ").concat(parseInt(widget.style.imageWidth || 60) / 2, "px;\n    right: auto;\n}\n#").concat(id, ".widget-help__right-bottom .widget-help__text.widgetHelpShow, #").concat(id, ".widget-help__right-top .widget-help__text.widgetHelpShow {\n    padding-right: ").concat(parseInt(widget.style.imageWidth || 60) / 2, "px;\n}\n\n#").concat(id, ".widget-help__right-top .widget-help__pop {\n    bottom: auto;\n}\n#").concat(id, ".widget-help__left-top .widget-help__pop {\n    bottom: auto;\n}\n#").concat(id, ".widget-help__left-bottom .widget-help__pop, #").concat(id, ".widget-help__left-top .widget-help__pop {\n    left: 0;\n    right: auto;\n}\n#").concat(id, " .widget-help__text {\n    color: ").concat(widget.style.color, " !important;\n    background-color: ").concat(widget.style.backColor, " !important;\n}\n#").concat(id, " .widget-help__pop {\n}\n#").concat(id, " .widget-help__title {\n    color: ").concat(widget.style.color, " !important;\n}\n#").concat(id, " .widget-help__after-title {\n    color: ").concat(widget.style.color, " !important;\n}\n").concat(block1.style.backImage ? "\n\t#".concat(id, " .widget-help__step-1 {\n\t    background-image: url(").concat(block1.style.backImage, ");\n\t}\n") : '', "\n").concat(block2.style.backImage || block1.style.backImage ? "\n\t#".concat(id, " .widget-help__step-2 {\n\t    background-image: url(").concat(block2.style.backImage || block1.style.backImage, ");\n\t}\n") : '', "\n#").concat(id, " .widget-help__step-1 .widget-help__animate-2 {\n    ").concat(block1.style.imageRadius ? "border-radius: ".concat(block1.style.imageRadius, "px !important;") : '', "\n}\n#").concat(id, " .widget-help__step-2 .widget-help__animate-2 {\n    ").concat(block2.style.imageRadius ? "border-radius: ".concat(block2.style.imageRadius, "px !important;") : '', "\n}\n\n#").concat(id, " .widget-help__step-1 .widget-help__submit {\n    color: ").concat(block1.btnStyle.color, " !important;\n    background-color: ").concat(block1.btnStyle.backColor, " !important;\n    box-shadow: 0px 10px 20px ").concat(colorAlpha(block1.btnStyle.backColor, 0.3), " !important;\n    ").concat(block1.btnStyle.width ? "width: ".concat(block1.btnStyle.width, "% !important;") : '', "\n    ").concat(block1.btnStyle.height ? "height: ".concat(block1.btnStyle.height, "px !important;") : '', "\n    ").concat(block1.btnStyle.shadow === 0 ? "box-shadow: none !important;" : '', "\n    ").concat(block1.btnStyle.borderRadius ? "border-radius: ".concat(block1.btnStyle.borderRadius, "px !important;") : '', "\n}\n#").concat(id, " .widget-help__step-2 .widget-help__submit {\n    color: ").concat(block2.btnStyle.color, " !important;\n    background-color: ").concat(block2.btnStyle.backColor, " !important;\n    box-shadow: 0px 10px 20px ").concat(colorAlpha(block2.btnStyle.backColor, 0.3), " !important;\n    ").concat(block2.btnStyle.width ? "width: ".concat(block2.btnStyle.width, "% !important;") : '', "\n    ").concat(block2.btnStyle.height ? "height: ".concat(block2.btnStyle.height, "px !important;") : '', "\n    ").concat(block2.btnStyle.shadow === 0 ? "box-shadow: none !important;" : '', "\n    ").concat(block2.btnStyle.borderRadius ? "border-radius: ".concat(block2.btnStyle.borderRadius, "px !important;") : '', "\n}\n\n#").concat(id, " .widget-help__check_repeat input[type=checkbox]+span {\n    border: 1px solid ").concat(block1.fields.repeat.switchStyle.color, " !important;\n}\n#").concat(id, " .widget-help__check_repeat input[type=checkbox]+span span {\n    background: ").concat(block1.fields.repeat.switchStyle.color, " !important;\n}\n#").concat(id, " .widget-help__check_repeat input[type=checkbox]:checked+span {\n    border: 1px solid ").concat(block1.fields.repeat.switchStyle.color, " !important;\n    background: ").concat(colorAlpha(block1.fields.repeat.switchStyle.color, 0.2), ";\n}\n#").concat(id, " .widget-help__check_repeat input[type=checkbox]:checked+span span {\n    background: ").concat(block1.fields.repeat.switchStyle.color, ";\n}\n\n#").concat(id, " .widget-help__check_anonymous input[type=checkbox]+span {\n    border: 1px solid ").concat(block1.fields.anonymous.switchStyle.color, " !important;\n}\n#").concat(id, " .widget-help__check_anonymous input[type=checkbox]+span span {\n    background: ").concat(block1.fields.anonymous.switchStyle.color, ";\n}\n#").concat(id, " .widget-help__check_anonymous input[type=checkbox]:checked+span {\n    border: 1px solid ").concat(block1.fields.anonymous.switchStyle.color, " !important;\n    background: ").concat(colorAlpha(block1.fields.anonymous.switchStyle.color, 0.2), ";\n}\n#").concat(id, " .widget-help__check_anonymous input[type=checkbox]:checked+span span {\n    background: ").concat(block1.fields.anonymous.switchStyle.color, ";\n}\n\n").concat(options.embed ? "\n#".concat(id, ".widget-help {\n    position: absolute;\n}\n") : '', "\n\n    ");
  domReplaceChild(document.head, domElem('style', {
    id: id + 'style-inst'
  }, css));
}
var widgetData = null;
var donationRuAnimation = {
  /**
   * @param {object} data
   * @param {object} options - { container: domElement, embed: false || true }
   */
  create: function create(data) {
    var _data$company;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // direct expose
    if (typeof window != 'undefined') {
      if (window.donationRuAnimationInitialized) {
        return function () {};
      }
      window.donationRuAnimationInitialized = true;
    }

    //console.log('donationRuAnimation=', data);
    var is_suspicious = (_data$company = data.company) === null || _data$company === void 0 ? void 0 : _data$company.mode;
    if (!!is_suspicious) {
      // throw new Error('Operation failed# Error code: 457');
      return function () {};
    }
    return createWidget(_objectSpread(_objectSpread({}, data), {
      api: (0,_form_api_mjs__WEBPACK_IMPORTED_MODULE_29__.getApiClient)(options)
    }), options);
  },
  data: function data() {
    return widgetData;
  },
  dataDefault: dataDefault
};

// direct expose
window.donationRuAnimation = donationRuAnimation;
/* harmony default export */ __webpack_exports__["default"] = ({
  donationRuAnimation: donationRuAnimation
});
}();
/******/ })()
;
 donationRuAnimation.create( {"skin":null,"type":"widget","sites":["https:\/\/kseniya.fund"],"block1":{"text":"Выберите сумму пожертвования","state":1,"style":{"image":"d1fd25e409acec37df060c3ea964ddf9_211216.png","backImage":"d5a715a5ad87086ed618b13a900c6711_211216.png","imageRadius":15},"title":"Помогите детям СЕГОДНЯ!","fields":{"sum":{"max":100000,"min":100,"name":"sum","order":0,"state":1,"default":250,"validate":null},"name":{"name":"name","order":3,"state":1,"lastName":0,"required":0,"validate":0},"email":{"name":"email","order":4,"state":1,"required":0,"validate":1},"phone":{"name":"phone","order":5,"state":0,"required":0,"validate":0},"repeat":{"name":"repeat","text":"Помогать ежемесячно","order":0,"state":1,"textNo":"Помочь разово","default":0,"validate":null,"textStyle":{"color":"rgba(248,127,103,1)"},"switchStyle":{"color":"rgba(248,127,103,1)"}},"comment":{"name":"comment","order":6,"state":0,"required":0,"validate":null},"anonymous":{"name":"anonymous","text":"Анонимно","order":3,"state":0,"default":0,"validate":null,"textStyle":{"color":"rgba(248,127,103,1)"},"switchStyle":{"color":"rgba(248,127,103,1)"}}},"btnText":"ПОМОЧЬ","btnStyle":{"color":"rgba(255,255,255,1)","scale":null,"width":100,"height":59,"shadow":1,"backColor":"rgba(248,127,103,1)","borderRadius":15}},"block2":{"text":"КАК ВАС ЗОВУТ?","state":0,"style":{"image":null,"backImage":null,"imageRadius":15},"title":"ПОМОГИТЕ НАМ","fields":{"sum":{"max":100000,"min":100,"name":"sum","order":0,"state":0,"default":250,"validate":null},"name":{"name":"name","order":3,"state":0,"lastName":0,"required":0,"validate":0},"email":{"name":"email","order":4,"state":0,"required":0,"validate":1},"phone":{"name":"phone","order":5,"state":0,"required":0,"validate":0},"repeat":{"name":"repeat","text":"Помогать ежемесячно","order":0,"state":0,"textNo":"Помочь разово","default":0,"validate":null,"textStyle":{"color":""},"switchStyle":{"color":""}},"comment":{"name":"comment","order":6,"state":0,"required":0,"validate":null},"anonymous":{"name":"anonymous","text":"Анонимно","order":3,"state":0,"default":0,"validate":null,"textStyle":{"color":""},"switchStyle":{"color":""}}},"btnText":"ПОМОЧЬ","btnStyle":{"color":"rgba(255,255,255,1)","scale":null,"width":100,"height":59,"shadow":1,"backColor":"rgba(248,127,103,1)","borderRadius":150}},"schema":null,"stripe":{"text":"Поддержите благотворительный фонд","place":"footer","state":0,"style":{"color":"","image":null,"backColor":""},"btnText":"Помочь","btnStyle":{"color":"","scale":null,"width":100,"height":59,"shadow":1,"backColor":"","borderRadius":150},"afterClose":""},"widget":{"text":"Помогите СЕГОДНЯ!","place":"right-bottom","style":{"color":"rgba(51,51,51,1)","image":"ee1e01460dc6c99036e8be310926c75e_211216.png","width":300,"backColor":"rgba(255,245,244,1)","imageWidth":85},"deviceMD":{"place":"left-bottom","width":200,"marginWidth":51,"marginHeight":51},"deviceSM":{"place":"right-bottom","width":250,"marginWidth":51,"marginHeight":130},"showDelay":0,"afterClose":"","marginWidth":"50","marginHeight":"20"},"site_id":"dd850181-1b81-4768-83a3-9bd55c13fced","version":200,"autopost":1,"extraHtml":null,"serviceUrl":"https:\/\/mixplat.ru\/offer\/offer_subscriber.pdf","stripeForm":{"text":"Поддержите благотворительный фонд","style":{"image":null,"backImage":null,"imageRadius":0},"title":"ПОМОГИТЕ НАМ","fields":{"sum":{"max":100000,"min":100,"name":"sum","order":0,"state":0,"default":250,"validate":null},"name":{"name":"name","order":3,"state":0,"lastName":0,"required":0,"validate":0},"email":{"name":"email","order":4,"state":0,"required":0,"validate":1},"phone":{"name":"phone","order":5,"state":0,"required":0,"validate":0},"repeat":{"name":"repeat","text":"Помогать ежемесячно","order":1,"state":0,"textNo":"Помочь разово","default":0,"validate":null,"textStyle":{"color":""},"switchStyle":{"color":""}},"comment":{"name":"comment","order":6,"state":0,"required":0,"validate":null},"anonymous":{"name":"anonymous","text":"Анонимно","order":2,"state":0,"default":0,"validate":null,"textStyle":{"color":""},"switchStyle":{"color":""}}},"btnText":"Помочь","btnStyle":{"color":"","scale":null,"width":100,"height":59,"shadow":1,"backColor":"","borderRadius":150},"serviceUrl":"https:\/\/mixplat.ru\/offer\/offer_subscriber.pdf","serviceConditions":null},"serviceConditions":true,"url":"https:\/\/donation.ru\/kseniya\/","company":{"title":"БФ «Ксения спасает жизни»","id":24583,"url_offer":"https:\/\/kseniya.fund\/o-fonde\/ofitsialnye-dokumenty","url_privacy":"https:\/\/kseniya.fund\/o-fonde\/ofitsialnye-dokumenty"},"offerUrl":"https:\/\/kseniya.fund\/o-fonde\/ofitsialnye-dokumenty","policyUrl":"https:\/\/kseniya.fund\/o-fonde\/ofitsialnye-dokumenty","target":{"id":-24583,"type":0,"title":"Пожертвование в БФ Ксения спасает жизни"},"project":{"id":364934,"defaultPForm":{"key":"42929d1a-fcf7-4b89-8189-19ffd5576709"}},"alternativeProject":{"id":364253,"defaultPForm":{"key":"9650c6b5-117b-479c-b81c-1f7b24755a41"}}}, {"apiHost":"https:\/\/api.donation.ru","mainHost":"https:\/\/donation.ru","adminHost":"https:\/\/admin.donation.ru"} );