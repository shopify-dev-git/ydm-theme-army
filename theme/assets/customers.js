/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@shopify/theme-sections/section.js":
/*!*********************************************************!*\
  !*** ./node_modules/@shopify/theme-sections/section.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Section)
/* harmony export */ });
var SECTION_ID_ATTR = 'data-section-id';

function Section(container, properties) {
  this.container = validateContainerElement(container);
  this.id = container.getAttribute(SECTION_ID_ATTR);
  this.extensions = [];

  // eslint-disable-next-line es5/no-es6-static-methods
  Object.assign(this, validatePropertiesObject(properties));

  this.onLoad();
}

Section.prototype = {
  onLoad: Function.prototype,
  onUnload: Function.prototype,
  onSelect: Function.prototype,
  onDeselect: Function.prototype,
  onBlockSelect: Function.prototype,
  onBlockDeselect: Function.prototype,

  extend: function extend(extension) {
    this.extensions.push(extension); // Save original extension

    // eslint-disable-next-line es5/no-es6-static-methods
    var extensionClone = Object.assign({}, extension);
    delete extensionClone.init; // Remove init function before assigning extension properties

    // eslint-disable-next-line es5/no-es6-static-methods
    Object.assign(this, extensionClone);

    if (typeof extension.init === 'function') {
      extension.init.apply(this);
    }
  }
};

function validateContainerElement(container) {
  if (!(container instanceof Element)) {
    throw new TypeError(
      'Theme Sections: Attempted to load section. The section container provided is not a DOM element.'
    );
  }
  if (container.getAttribute(SECTION_ID_ATTR) === null) {
    throw new Error(
      'Theme Sections: The section container provided does not have an id assigned to the ' +
        SECTION_ID_ATTR +
        ' attribute.'
    );
  }

  return container;
}

function validatePropertiesObject(value) {
  if (
    (typeof value !== 'undefined' && typeof value !== 'object') ||
    value === null
  ) {
    throw new TypeError(
      'Theme Sections: The properties object provided is not a valid'
    );
  }

  return value;
}

// Object.assign() polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target) {
      // .length of function is 2
      'use strict';
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}


/***/ }),

/***/ "./node_modules/@shopify/theme-sections/theme-sections.js":
/*!****************************************************************!*\
  !*** ./node_modules/@shopify/theme-sections/theme-sections.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registered": () => (/* binding */ registered),
/* harmony export */   "instances": () => (/* binding */ instances),
/* harmony export */   "register": () => (/* binding */ register),
/* harmony export */   "unregister": () => (/* binding */ unregister),
/* harmony export */   "load": () => (/* binding */ load),
/* harmony export */   "unload": () => (/* binding */ unload),
/* harmony export */   "extend": () => (/* binding */ extend),
/* harmony export */   "getInstances": () => (/* binding */ getInstances),
/* harmony export */   "getInstanceById": () => (/* binding */ getInstanceById),
/* harmony export */   "isInstance": () => (/* binding */ isInstance)
/* harmony export */ });
/* harmony import */ var _section__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section */ "./node_modules/@shopify/theme-sections/section.js");
/*
 * @shopify/theme-sections
 * -----------------------------------------------------------------------------
 *
 * A framework to provide structure to your Shopify sections and a load and unload
 * lifecycle. The lifecycle is automatically connected to theme editor events so
 * that your sections load and unload as the editor changes the content and
 * settings of your sections.
 */



var SECTION_TYPE_ATTR = 'data-section-type';
var SECTION_ID_ATTR = 'data-section-id';

window.Shopify = window.Shopify || {};
window.Shopify.theme = window.Shopify.theme || {};
window.Shopify.theme.sections = window.Shopify.theme.sections || {};

var registered = (window.Shopify.theme.sections.registered =
  window.Shopify.theme.sections.registered || {});
var instances = (window.Shopify.theme.sections.instances =
  window.Shopify.theme.sections.instances || []);

function register(type, properties) {
  if (typeof type !== 'string') {
    throw new TypeError(
      'Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered'
    );
  }

  if (typeof registered[type] !== 'undefined') {
    throw new Error(
      'Theme Sections: A section of type "' +
        type +
        '" has already been registered. You cannot register the same section type twice'
    );
  }

  function TypedSection(container) {
    _section__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, container, properties);
  }

  TypedSection.constructor = _section__WEBPACK_IMPORTED_MODULE_0__["default"];
  TypedSection.prototype = Object.create(_section__WEBPACK_IMPORTED_MODULE_0__["default"].prototype);
  TypedSection.prototype.type = type;

  return (registered[type] = TypedSection);
}

function unregister(types) {
  types = normalizeType(types);

  types.forEach(function(type) {
    delete registered[type];
  });
}

function load(types, containers) {
  types = normalizeType(types);

  if (typeof containers === 'undefined') {
    containers = document.querySelectorAll('[' + SECTION_TYPE_ATTR + ']');
  }

  containers = normalizeContainers(containers);

  types.forEach(function(type) {
    var TypedSection = registered[type];

    if (typeof TypedSection === 'undefined') {
      return;
    }

    containers = containers.filter(function(container) {
      // Filter from list of containers because container already has an instance loaded
      if (isInstance(container)) {
        return false;
      }

      // Filter from list of containers because container doesn't have data-section-type attribute
      if (container.getAttribute(SECTION_TYPE_ATTR) === null) {
        return false;
      }

      // Keep in list of containers because current type doesn't match
      if (container.getAttribute(SECTION_TYPE_ATTR) !== type) {
        return true;
      }

      instances.push(new TypedSection(container));

      // Filter from list of containers because container now has an instance loaded
      return false;
    });
  });
}

function unload(selector) {
  var instancesToUnload = getInstances(selector);

  instancesToUnload.forEach(function(instance) {
    var index = instances
      .map(function(e) {
        return e.id;
      })
      .indexOf(instance.id);
    instances.splice(index, 1);
    instance.onUnload();
  });
}

function extend(selector, extension) {
  var instancesToExtend = getInstances(selector);

  instancesToExtend.forEach(function(instance) {
    instance.extend(extension);
  });
}

function getInstances(selector) {
  var filteredInstances = [];

  // Fetch first element if its an array
  if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
    var firstElement = selector[0];
  }

  // If selector element is DOM element
  if (selector instanceof Element || firstElement instanceof Element) {
    var containers = normalizeContainers(selector);

    containers.forEach(function(container) {
      filteredInstances = filteredInstances.concat(
        instances.filter(function(instance) {
          return instance.container === container;
        })
      );
    });

    // If select is type string
  } else if (typeof selector === 'string' || typeof firstElement === 'string') {
    var types = normalizeType(selector);

    types.forEach(function(type) {
      filteredInstances = filteredInstances.concat(
        instances.filter(function(instance) {
          return instance.type === type;
        })
      );
    });
  }

  return filteredInstances;
}

function getInstanceById(id) {
  var instance;

  for (var i = 0; i < instances.length; i++) {
    if (instances[i].id === id) {
      instance = instances[i];
      break;
    }
  }
  return instance;
}

function isInstance(selector) {
  return getInstances(selector).length > 0;
}

function normalizeType(types) {
  // If '*' then fetch all registered section types
  if (types === '*') {
    types = Object.keys(registered);

    // If a single section type string is passed, put it in an array
  } else if (typeof types === 'string') {
    types = [types];

    // If single section constructor is passed, transform to array with section
    // type string
  } else if (types.constructor === _section__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    types = [types.prototype.type];

    // If array of typed section constructors is passed, transform the array to
    // type strings
  } else if (Array.isArray(types) && types[0].constructor === _section__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    types = types.map(function(TypedSection) {
      return TypedSection.prototype.type;
    });
  }

  types = types.map(function(type) {
    return type.toLowerCase();
  });

  return types;
}

function normalizeContainers(containers) {
  // Nodelist with entries
  if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
    containers = Array.prototype.slice.call(containers);

    // Empty Nodelist
  } else if (
    NodeList.prototype.isPrototypeOf(containers) &&
    containers.length === 0
  ) {
    containers = [];

    // Handle null (document.querySelector() returns null with no match)
  } else if (containers === null) {
    containers = [];

    // Single DOM element
  } else if (!Array.isArray(containers) && containers instanceof Element) {
    containers = [containers];
  }

  return containers;
}

if (window.Shopify.designMode) {
  document.addEventListener('shopify:section:load', function(event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector(
      '[' + SECTION_ID_ATTR + '="' + id + '"]'
    );

    if (container !== null) {
      load(container.getAttribute(SECTION_TYPE_ATTR), container);
    }
  });

  document.addEventListener('shopify:section:unload', function(event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector(
      '[' + SECTION_ID_ATTR + '="' + id + '"]'
    );
    var instance = getInstances(container)[0];

    if (typeof instance === 'object') {
      unload(container);
    }
  });

  document.addEventListener('shopify:section:select', function(event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onSelect(event);
    }
  });

  document.addEventListener('shopify:section:deselect', function(event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onDeselect(event);
    }
  });

  document.addEventListener('shopify:block:select', function(event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onBlockSelect(event);
    }
  });

  document.addEventListener('shopify:block:deselect', function(event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onBlockDeselect(event);
    }
  });
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
/*!************************************!*\
  !*** ./src/assets/js/customers.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shopify/theme-sections */ "./node_modules/@shopify/theme-sections/theme-sections.js");


(function () {
  window.Shopify = window.Shopify || {};
  window.Shopify.theme = window.Shopify.theme || {};

  var docReady = function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
      // call on next available tick
      setTimeout(fn, 1);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  };

  var bootTheme = function bootTheme() {
    // Some polyfills not provided yet by polyfills.io
    if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;

        for (var i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, this);
        }
      };
    }

    _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.register('account-section', {
      onLoad: function onLoad() {
        var _this = this;

        this._setupAddressForm();

        this.container.querySelectorAll('.address-delete-form').forEach(function (deleteForm) {
          deleteForm.addEventListener('submit', function (event) {
            var confirmMessage = event.target.getAttribute('data-confirm-message');

            if (!window.confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
              event.preventDefault();
            }
          });
        });
        this.container.querySelectorAll('[data-target="AddressForm"]').forEach(function (el) {
          return el.addEventListener('click', _this._toggleNewAddressForm.bind(_this));
        });
        this.container.querySelectorAll('.btn-edit-address').forEach(function (el) {
          return el.addEventListener('click', _this._toggleEditAddressForm.bind(_this));
        });
      },
      _setupAddressForm: function _setupAddressForm() {
        var _this2 = this;

        if (Shopify && Shopify.CountryProvinceSelector) {
          new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
            hideElement: 'AddressProvinceNewWrapper'
          });
        }

        this.container.querySelector('#AddressCountryNew').addEventListener('change', function () {
          _this2.container.querySelector('#AddressProvinceNew').dispatchEvent(new Event('blur'));
        });
      },
      _toggleNewAddressForm: function _toggleNewAddressForm() {
        this.container.querySelector('#AddressForm').classList.toggle('hidden');
        this.container.querySelector('#AddressNewButton').classList.toggle('hidden');
        this.container.querySelectorAll('.edit-form').forEach(function (el) {
          return el.classList.add('hidden');
        });
        this.container.querySelector('#new_address_form').classList.remove('hidden');
        event.preventDefault();
      },
      _toggleEditAddressForm: function _toggleEditAddressForm(event) {
        var target = event.target.getAttribute('data-target');
        var form = null;

        try {
          form = document.querySelector('#'.concat(target));
        } catch (error) {}

        console.log(form);

        if (form) {
          var addressForm = this.container.querySelector('#AddressForm');
          addressForm.classList.remove('hidden');
          addressForm.scrollIntoView();
          this.container.querySelector('#AddressNewButton').classList.add('hidden');
          this.container.querySelectorAll('.edit-form').forEach(function (el) {
            return el.classList.add('hidden');
          });
          this.container.querySelector('#new_address_form').classList.add('hidden');
          addressForm.appendChild(form);
          form.classList.remove('hidden');

          if (Shopify && Shopify.CountryProvinceSelector) {
            var addressId = form.getAttribute('data-address-id');
            new Shopify.CountryProvinceSelector('AddressCountryNew'.concat(addressId), 'AddressProvinceNew'.concat(addressId), {
              hideElement: 'AddressProvinceNewWrapper'.concat(addressId)
            });
          }
        }

        event.preventDefault();
      }
    });
    _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.register('login-section', {
      onLoad: function onLoad() {
        console.log(this.container);
        this.formLogin = this.container.querySelector('div.form-login');
        this.formReset = this.container.querySelector('div.form-reset');

        if (this.container.querySelector('.sign-in')) {
          this.container.querySelector('.sign-in').addEventListener('click', this._back_to_login.bind(this));
        }

        if (this.container.querySelector('.forgt-password')) {
          this.container.querySelector('.forgt-password').addEventListener('click', this._recover_password.bind(this));
        }
      },
      _recover_password: function _recover_password(event) {
        this.formLogin.classList.add('hidden');
        this.formReset.classList.remove('hidden');
        this.container.querySelector('.welcome-wrapper').classList.toggle('hidden');
        event.preventDefault();
      },
      _back_to_login: function _back_to_login() {
        this.formLogin.classList.remove('hidden');
        this.formReset.classList.add('hidden');
        this.container.querySelector('.welcome-wrapper').classList.toggle('hidden');
        event.preventDefault();
      }
    });
    _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.load('account-section', document.querySelector('[data-section-type="account-section"]'));
    _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.load('login-section', document.querySelector('[data-section-type="login-section"]'));
  };

  docReady(function () {
    if ('fetch' in window && 'assign' in Object) {
      bootTheme();
    } else {
      var scriptEl = document.createElement('script');
      scriptEl.src = '//cdn.polyfill.io/v3/polyfill.min.js?unknown=polyfill&features=fetch,Element.prototype.closest,Element.prototype.matches,Element.prototype.remove,Element.prototype.classList,Array.prototype.includes,String.prototype.includes,Object.assign,CustomEvent,URL,DOMTokenList';
      scriptEl.async = false;

      scriptEl.onload = function () {
        bootTheme();
      };

      document.head.appendChild(scriptEl);
    }
  });
})();
/* Production theme.js notice */

/*! DO NOT EDIT THIS FILE. LOOK FOR custom.js AND ADD YOUR JS CODE IN THERE. */
})();

/******/ })()
;