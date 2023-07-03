/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@shopify/theme-product-form/listeners.js":
/*!***************************************************************!*\
  !*** ./node_modules/@shopify/theme-product-form/listeners.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Listeners)
/* harmony export */ });
function Listeners() {
  this.entries = [];
}

Listeners.prototype.add = function(element, event, fn) {
  this.entries.push({ element: element, event: event, fn: fn });
  element.addEventListener(event, fn);
};

Listeners.prototype.removeAll = function() {
  this.entries = this.entries.filter(function(listener) {
    listener.element.removeEventListener(listener.event, listener.fn);
    return false;
  });
};


/***/ }),

/***/ "./node_modules/@shopify/theme-product-form/theme-product-form.js":
/*!************************************************************************!*\
  !*** ./node_modules/@shopify/theme-product-form/theme-product-form.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUrlWithVariant": () => (/* binding */ getUrlWithVariant),
/* harmony export */   "ProductForm": () => (/* binding */ ProductForm)
/* harmony export */ });
/* harmony import */ var _listeners__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./listeners */ "./node_modules/@shopify/theme-product-form/listeners.js");
/* harmony import */ var _shopify_theme_product__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shopify/theme-product */ "./node_modules/@shopify/theme-product/theme-product.js");



var selectors = {
  idInput: '[name="id"]',
  optionInput: '[name^="options"]',
  quantityInput: '[name="quantity"]',
  propertyInput: '[name^="properties"]'
};

// Public Methods
// -----------------------------------------------------------------------------

/**
 * Returns a URL with a variant ID query parameter. Useful for updating window.history
 * with a new URL based on the currently select product variant.
 * @param {string} url - The URL you wish to append the variant ID to
 * @param {number} id  - The variant ID you wish to append to the URL
 * @returns {string} - The new url which includes the variant ID query parameter
 */

function getUrlWithVariant(url, id) {
  if (/variant=/.test(url)) {
    return url.replace(/(variant=)[^&]+/, '$1' + id);
  } else if (/\?/.test(url)) {
    return url.concat('&variant=').concat(id);
  }

  return url.concat('?variant=').concat(id);
}

/**
 * Constructor class that creates a new instance of a product form controller.
 *
 * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
 * @param {Object} product - A product object
 * @param {Object} options - Optional options object
 * @param {Function} options.onOptionChange - Callback for whenever an option input changes
 * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
 * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
 * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
 */
function ProductForm(element, product, options) {
  this.element = element;
  this.product = _validateProductObject(product);

  options = options || {};

  this._listeners = new _listeners__WEBPACK_IMPORTED_MODULE_0__["default"]();
  this._listeners.add(
    this.element,
    'submit',
    this._onSubmit.bind(this, options)
  );

  this.optionInputs = this._initInputs(
    selectors.optionInput,
    options.onOptionChange
  );

  this.quantityInputs = this._initInputs(
    selectors.quantityInput,
    options.onQuantityChange
  );

  this.propertyInputs = this._initInputs(
    selectors.propertyInput,
    options.onPropertyChange
  );
}

/**
 * Cleans up all event handlers that were assigned when the Product Form was constructed.
 * Useful for use when a section needs to be reloaded in the theme editor.
 */
ProductForm.prototype.destroy = function() {
  this._listeners.removeAll();
};

/**
 * Getter method which returns the array of currently selected option values
 *
 * @returns {Array} An array of option values
 */
ProductForm.prototype.options = function() {
  return _serializeOptionValues(this.optionInputs, function(item) {
    var regex = /(?:^(options\[))(.*?)(?:\])/;
    item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'
    return item;
  });
};

/**
 * Getter method which returns the currently selected variant, or `null` if variant
 * doesn't exist.
 *
 * @returns {Object|null} Variant object
 */
ProductForm.prototype.variant = function() {
  return (0,_shopify_theme_product__WEBPACK_IMPORTED_MODULE_1__.getVariantFromSerializedArray)(this.product, this.options());
};

/**
 * Getter method which returns a collection of objects containing name and values
 * of property inputs
 *
 * @returns {Array} Collection of objects with name and value keys
 */
ProductForm.prototype.properties = function() {
  var properties = _serializePropertyValues(this.propertyInputs, function(
    propertyName
  ) {
    var regex = /(?:^(properties\[))(.*?)(?:\])/;
    var name = regex.exec(propertyName)[2]; // Use just the value between 'properties[' and ']'
    return name;
  });

  return Object.entries(properties).length === 0 ? null : properties;
};

/**
 * Getter method which returns the current quantity or 1 if no quantity input is
 * included in the form
 *
 * @returns {Array} Collection of objects with name and value keys
 */
ProductForm.prototype.quantity = function() {
  return this.quantityInputs[0]
    ? Number.parseInt(this.quantityInputs[0].value, 10)
    : 1;
};

// Private Methods
// -----------------------------------------------------------------------------
ProductForm.prototype._setIdInputValue = function(value) {
  var idInputElement = this.element.querySelector(selectors.idInput);

  if (!idInputElement) {
    idInputElement = document.createElement('input');
    idInputElement.type = 'hidden';
    idInputElement.name = 'id';
    this.element.appendChild(idInputElement);
  }

  idInputElement.value = value.toString();
};

ProductForm.prototype._onSubmit = function(options, event) {
  event.dataset = this._getProductFormEventData();

  if (event.dataset.variant) {
    this._setIdInputValue(event.dataset.variant.id);
  }

  if (options.onFormSubmit) {
    options.onFormSubmit(event);
  }
};

ProductForm.prototype._onFormEvent = function(cb) {
  if (typeof cb === 'undefined') {
    return Function.prototype;
  }

  return function(event) {
    event.dataset = this._getProductFormEventData();
    cb(event);
  }.bind(this);
};

ProductForm.prototype._initInputs = function(selector, cb) {
  var elements = Array.prototype.slice.call(
    this.element.querySelectorAll(selector)
  );

  return elements.map(
    function(element) {
      this._listeners.add(element, 'change', this._onFormEvent(cb));
      return element;
    }.bind(this)
  );
};

ProductForm.prototype._getProductFormEventData = function() {
  return {
    options: this.options(),
    variant: this.variant(),
    properties: this.properties(),
    quantity: this.quantity()
  };
};

function _serializeOptionValues(inputs, transform) {
  return inputs.reduce(function(options, input) {
    if (
      input.checked || // If input is a checked (means type radio or checkbox)
      (input.type !== 'radio' && input.type !== 'checkbox') // Or if its any other type of input
    ) {
      options.push(transform({ name: input.name, value: input.value }));
    }

    return options;
  }, []);
}

function _serializePropertyValues(inputs, transform) {
  return inputs.reduce(function(properties, input) {
    if (
      input.checked || // If input is a checked (means type radio or checkbox)
      (input.type !== 'radio' && input.type !== 'checkbox') // Or if its any other type of input
    ) {
      properties[transform(input.name)] = input.value;
    }

    return properties;
  }, {});
}

function _validateProductObject(product) {
  if (typeof product !== 'object') {
    throw new TypeError(product + ' is not an object.');
  }

  if (typeof product.variants[0].options === 'undefined') {
    throw new TypeError(
      'Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route'
    );
  }

  return product;
}


/***/ }),

/***/ "./node_modules/@shopify/theme-product/theme-product.js":
/*!**************************************************************!*\
  !*** ./node_modules/@shopify/theme-product/theme-product.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getProductJson": () => (/* binding */ getProductJson),
/* harmony export */   "getVariantFromId": () => (/* binding */ getVariantFromId),
/* harmony export */   "getVariantFromSerializedArray": () => (/* binding */ getVariantFromSerializedArray),
/* harmony export */   "getVariantFromOptionArray": () => (/* binding */ getVariantFromOptionArray)
/* harmony export */ });
/**
 * Returns a product JSON object when passed a product URL
 * @param {*} url
 */
function getProductJson(handle) {
  return fetch('/products/' + handle + '.js').then(function(response) {
    return response.json();
  });
}

/**
 * Find a match in the project JSON (using a ID number) and return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Number} value Accepts Number (e.g. 6908023078973)
 * @returns {Object} The variant object once a match has been successful. Otherwise null will be return
 */
function getVariantFromId(product, value) {
  _validateProductStructure(product);

  if (typeof value !== 'number') {
    throw new TypeError(value + ' is not a Number.');
  }

  var result = product.variants.filter(function(variant) {
    return variant.id === value;
  });

  return result[0] || null;
}

/**
 * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
 */
function getVariantFromSerializedArray(product, collection) {
  _validateProductStructure(product);

  // If value is an array of options
  var optionArray = _createOptionArrayFromOptionCollection(product, collection);
  return getVariantFromOptionArray(product, optionArray);
}

/**
 * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
 * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
 */
function getVariantFromOptionArray(product, options) {
  _validateProductStructure(product);
  _validateOptionsArray(options);

  var result = product.variants.filter(function(variant) {
    return options.every(function(option, index) {
      return variant.options[index] === option;
    });
  });

  return result[0] || null;
}

/**
 * Creates an array of selected options from the object
 * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
 * @param {Object} product Product JSON object
 * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
 */
function _createOptionArrayFromOptionCollection(product, collection) {
  _validateProductStructure(product);
  _validateSerializedArray(collection);

  var optionArray = [];

  collection.forEach(function(option) {
    for (var i = 0; i < product.options.length; i++) {
      if (product.options[i].name.toLowerCase() === option.name.toLowerCase()) {
        optionArray[i] = option.value;
        break;
      }
    }
  });

  return optionArray;
}

/**
 * Check if the product data is a valid JS object
 * Error will be thrown if type is invalid
 * @param {object} product Product JSON object
 */
function _validateProductStructure(product) {
  if (typeof product !== 'object') {
    throw new TypeError(product + ' is not an object.');
  }

  if (Object.keys(product).length === 0 && product.constructor === Object) {
    throw new Error(product + ' is empty.');
  }
}

/**
 * Validate the structure of the array
 * It must be formatted like jQuery's serializeArray()
 * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
 */
function _validateSerializedArray(collection) {
  if (!Array.isArray(collection)) {
    throw new TypeError(collection + ' is not an array.');
  }

  if (collection.length === 0) {
    return [];
  }

  if (collection[0].hasOwnProperty('name')) {
    if (typeof collection[0].name !== 'string') {
      throw new TypeError(
        'Invalid value type passed for name of option ' +
          collection[0].name +
          '. Value should be string.'
      );
    }
  } else {
    throw new Error(collection[0] + 'does not contain name key.');
  }
}

/**
 * Validate the structure of the array
 * It must be formatted as list of values
 * @param {Array} collection Array of object (e.g. ['36', 'Black'])
 */
function _validateOptionsArray(options) {
  if (Array.isArray(options) && typeof options[0] === 'object') {
    throw new Error(options + 'is not a valid array of options.');
  }
}


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
/******/ 			// no module.id needed
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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************************!*\
  !*** ./src/assets/js/product-form.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shopify_theme_product_form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shopify/theme-product-form */ "./node_modules/@shopify/theme-product-form/theme-product-form.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


window.Shopify = window.Shopify || {};
window.Shopify.ProductForm = _shopify_theme_product_form__WEBPACK_IMPORTED_MODULE_0__.ProductForm;

(function () {
  if (!customElements.get('custom-dropdown')) {
    var CustomDropdown = /*#__PURE__*/function (_HTMLElement) {
      _inherits(CustomDropdown, _HTMLElement);

      var _super = _createSuper(CustomDropdown);

      function CustomDropdown() {
        var _this;

        _classCallCheck(this, CustomDropdown);

        _this = _super.call(this);
        _this.selectedEl = _this.querySelector('.selected-value');

        if (!_this.selectedEl) {
          return _possibleConstructorReturn(_this);
        }

        _this.button = _this.querySelector('button');

        _this.querySelectorAll('input').forEach(function (button) {
          return button.addEventListener('change', _this.onChange.bind(_assertThisInitialized(_this)));
        });

        _this.button.addEventListener('click', _this.onButtonClick.bind(_assertThisInitialized(_this)));

        window.addEventListener('click', function (event) {
          if (event.target.closest('button') == _this.button || event.target == _this.button) {
            return;
          }

          _this.querySelector('.selectDropdown').classList.remove('active');
        });
        return _this;
      }

      _createClass(CustomDropdown, [{
        key: "onChange",
        value: function onChange(event) {
          this.selectedEl.querySelector('span.value').innerHTML = event.currentTarget.value;

          if (event.currentTarget.dataset.color != 'transparent') {
            var new_bg = event.currentTarget.dataset.color;
            this.selectedEl.querySelector('span.circle').style.background = new_bg;
          }
        }
      }, {
        key: "onButtonClick",
        value: function onButtonClick(event) {
          this.querySelector('.selectDropdown').classList.toggle('active');
        }
      }]);

      return CustomDropdown;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

    customElements.define('custom-dropdown', CustomDropdown);
  }

  if (!customElements.get('color-option')) {
    var ColorOption = /*#__PURE__*/function (_HTMLElement2) {
      _inherits(ColorOption, _HTMLElement2);

      var _super2 = _createSuper(ColorOption);

      function ColorOption() {
        var _this2;

        _classCallCheck(this, ColorOption);

        _this2 = _super2.call(this);
        _this2.selectedEl = _this2.querySelector('span.selected');

        if (!_this2.selectedEl) {
          return _possibleConstructorReturn(_this2);
        }

        _this2.querySelectorAll('input').forEach(function (button) {
          return button.addEventListener('change', _this2.onChange.bind(_assertThisInitialized(_this2)));
        });

        return _this2;
      }

      _createClass(ColorOption, [{
        key: "onChange",
        value: function onChange(event) {
          this.selectedEl.innerHTML = event.currentTarget.value;
        }
      }]);

      return ColorOption;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

    customElements.define('color-option', ColorOption);
  }

  if (!customElements.get('product-form')) {
    customElements.define('product-form', /*#__PURE__*/function (_HTMLElement3) {
      _inherits(ProductForm, _HTMLElement3);

      var _super3 = _createSuper(ProductForm);

      function ProductForm() {
        var _this3;

        _classCallCheck(this, ProductForm);

        _this3 = _super3.call(this);
        _this3.productForm = null;
        _this3.main_product = _this3.hasAttribute('main-product');
        _this3.bundle_product = _this3.hasAttribute('bundle-product');
        _this3.form_type = _this3.dataset.type;
        _this3.form = _this3.querySelector('form');
        _this3.cart = document.querySelector('cart-drawer');
        _this3.submitButton = _this3.querySelector('[type="submit"]');

        if (_this3.querySelector('[data-price]')) {
          _this3.price = _this3.querySelector('[data-price]');
        }

        if (_this3.cart && _this3.submitButton) _this3.submitButton.setAttribute('aria-haspopup', 'dialog');
        var productHandle = _this3.form.dataset.productHandle;

        if (productHandle.trim() != '' && _this3.form_type != 'select') {
          fetch("/products/".concat(productHandle, ".js")).then(function (response) {
            return response.json();
          }).then(function (productJSON) {
            _this3.productForm = new _shopify_theme_product_form__WEBPACK_IMPORTED_MODULE_0__.ProductForm(_this3.form, productJSON, {
              onOptionChange: _this3.onOptionChange.bind(_assertThisInitialized(_this3)),
              onFormSubmit: _this3.onFormSubmit.bind(_assertThisInitialized(_this3))
            });
          });
        } else if (_this3.form_type == 'select') {
          _this3.form.addEventListener('submit', _this3.onFormSubmit.bind(_assertThisInitialized(_this3)));
        }

        _this3.loading = false;

        if (_this3.form_type == 'select') {
          var select = _this3.querySelector('select[name="id"]');

          if (select) {
            select.addEventListener('change', function () {
              if (select.value.trim() != '') {
                _this3.form.dispatchEvent(new Event('submit'));
              }
            });
          }
        }

        return _this3;
      }

      _createClass(ProductForm, [{
        key: "onFormSubmit",
        value: function onFormSubmit(event) {
          var _this4 = this;

          if (this.loading) {
            return;
          }

          this.loading = true;
          event.preventDefault();
          var config = {
            method: 'POST',
            headers: {
              'Accept': 'application/javascript',
              'X-Requested-With': 'XMLHttpRequest'
            }
          };
          var formData = new FormData(this.form);
          formData.append('sections', this.cart.getSectionsToRender().map(function (section) {
            return section.id;
          }));
          formData.append('sections_url', window.location.pathname);
          config.body = formData;
          this.submitButton.classList.add('loading');
          fetch("".concat(routes.cart_add_url), config).then(function (response) {
            return response.json();
          }).then(function (response) {
            if (response.status) {
              alert(response.description);

              _this4.cart.open();

              return;
            }

            if (_this4.bundle_product && document.querySelector('[main-product]')) {
              _this4.mainProductForm = document.querySelector('[main-product] form');
              var _config = {
                method: 'POST',
                headers: {
                  'Accept': 'application/javascript',
                  'X-Requested-With': 'XMLHttpRequest'
                }
              };

              var _formData = new FormData(_this4.mainProductForm);

              _formData.append('sections', _this4.cart.getSectionsToRender().map(function (section) {
                return section.id;
              }));

              _formData.append('sections_url', window.location.pathname);

              _config.body = _formData;
              fetch("".concat(routes.cart_add_url), _config).then(function (response) {
                return response.json();
              }).then(function (response) {
                if (response.status) {
                  alert(response.description);

                  _this4.cart.open();

                  return;
                }

                _this4.cart.renderContents(response);
              })["catch"](function (e) {
                _this4.cart.open(); // console.error(e);

              })["finally"](function () {});
            } else {
              _this4.cart.renderContents(response);
            }
          })["catch"](function (e) {
            _this4.cart.open(); // console.error(e);

          })["finally"](function () {
            _this4.loading = false;

            _this4.submitButton.classList.remove('loading');

            var select = _this4.querySelector('select[name="id"]');

            if (select) {
              select.value = '';
            }
          });
        }
      }, {
        key: "addedToCart",
        value: function addedToCart() {
          fetch("".concat(window.location.origin, "/cart.js")).then(function (res) {
            return res.clone().json().then(function (data) {
              var cart = {
                total_price: data.total_price / 100,
                $value: data.total_price / 100,
                total_discount: data.total_discount,
                original_total_price: data.original_total_price / 100,
                items: data.items
              };

              if (item !== 'undefined') {
                cart = Object.assign(cart, item);
              }
            });
          });
        }
      }, {
        key: "onOptionChange",
        value: function onOptionChange(event) {
          var variant = event.dataset.variant;
          var buttonspan = this.submitButton.querySelector('span.btn-text');

          if (this.price) {
            this.price.innerHTML = window.variantStrings.moneyFormat.replace('{{amount}}', (variant.price / 100).toFixed(2));
          }

          if (variant === null) {
            this.submitButton.disabled = false;

            if (buttonspan) {
              buttonspan.innerHTML = window.variantStrings.unavailable;
            }
          } else if (variant && !variant.available) {
            this.submitButton.disabled = true;

            if (buttonspan) {
              buttonspan.innerHTML = window.variantStrings.sold_out;
            }
          } else if (variant && variant.available) {
            this.submitButton.disabled = false;

            if (buttonspan) {
              buttonspan.innerHTML = window.variantStrings.add_to_cart;
            }
          }

          if (!variant) {
            return;
          }

          this.form.querySelector('[name=id]').value = variant.id;

          if (this.main_product) {
            var url = _shopify_theme_product_form__WEBPACK_IMPORTED_MODULE_0__.getUrlWithVariant(window.location.href, variant.id);
            window.history.replaceState({
              path: url
            }, '', url);
          }
        }
      }]);

      return ProductForm;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));
  }
})();
})();

/******/ })()
;