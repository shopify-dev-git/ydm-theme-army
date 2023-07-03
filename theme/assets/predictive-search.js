/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************************************!*\
  !*** ./src/assets/js/predictive-search.js ***!
  \********************************************/
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

var PredictiveSearch = /*#__PURE__*/function (_HTMLElement) {
  _inherits(PredictiveSearch, _HTMLElement);

  var _super = _createSuper(PredictiveSearch);

  function PredictiveSearch() {
    var _this;

    _classCallCheck(this, PredictiveSearch);

    _this = _super.call(this);
    _this.input = _this.querySelector('input[type="search"]');
    _this.predictiveSearchResults = _this.querySelector('#predictive-search');

    _this.input.addEventListener('input', _this.debounce(function (event) {
      _this.onChange(event);
    }, 300).bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(PredictiveSearch, [{
    key: "onChange",
    value: function onChange() {
      var searchTerm = this.input.value.trim();

      if (!searchTerm.length) {
        this.close();
        return;
      }

      this.getSearchResults(searchTerm);
    }
  }, {
    key: "getSearchResults",
    value: function getSearchResults(searchTerm) {
      var _this2 = this;

      fetch("/search/suggest?q=".concat(searchTerm, "&resources[type]=product&resources[limit]=4&section_id=predictive-search")).then(function (response) {
        if (!response.ok) {
          var error = new Error(response.status);

          _this2.close();

          throw error;
        }

        return response.text();
      }).then(function (text) {
        var resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        _this2.predictiveSearchResults.innerHTML = resultsMarkup;

        _this2.open();
      })["catch"](function (error) {
        _this2.close();

        throw error;
      });
    }
  }, {
    key: "open",
    value: function open() {
      this.predictiveSearchResults.style.display = 'block';
    }
  }, {
    key: "close",
    value: function close() {
      this.predictiveSearchResults.style.display = 'none';
    }
  }, {
    key: "debounce",
    value: function debounce(fn, wait) {
      var _this3 = this;

      var t;
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        clearTimeout(t);
        t = setTimeout(function () {
          return fn.apply(_this3, args);
        }, wait);
      };
    }
  }]);

  return PredictiveSearch;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

customElements.define('predictive-search', PredictiveSearch);
/******/ })()
;