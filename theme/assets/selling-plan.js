/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************************!*\
  !*** ./src/assets/js/selling-plan.js ***!
  \***************************************/
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

if (!customElements.get('subscription-plans')) {
  var SubscriptionPlans = /*#__PURE__*/function (_HTMLElement) {
    _inherits(SubscriptionPlans, _HTMLElement);

    var _super = _createSuper(SubscriptionPlans);

    function SubscriptionPlans() {
      var _this;

      _classCallCheck(this, SubscriptionPlans);

      _this = _super.call(this);

      _this.addEventListener('click', function () {
        document.querySelector('body').classList.remove('select-option');
      });

      _this.selling_plan_el = _this.querySelector('[name="selling_plan"]');
      _this.plan_el = _this.querySelector('.subscription-selling-plan');

      if (!_this.selling_plan_el) {
        return _possibleConstructorReturn(_this);
      }

      _this.plan_el.addEventListener('change', _this.onSubscriptionChange.bind(_assertThisInitialized(_this)));

      _this.querySelectorAll('[name^="subscription-"]').forEach(function (radio) {
        if (radio.value == 'subscribe' && radio.checked) {
          this.setPlan(this.plan_el.value);
        }

        radio.addEventListener('change', this.onPlanChange.bind(this));
      }.bind(_assertThisInitialized(_this)));

      return _this;
    }

    _createClass(SubscriptionPlans, [{
      key: "onSubscriptionChange",
      value: function onSubscriptionChange(event) {
        var select = event.currentTarget;
        this.setPlan(select.value);
        this.querySelector('[value="subscribe"]').checked = true;
      }
    }, {
      key: "onPlanChange",
      value: function onPlanChange(event) {
        var radio = event.currentTarget;
        var current_price = radio.getAttribute('data-price');
        console.log(current_price);
        var btn = document.querySelector('.btn__price');
        btn.innerHTML = current_price;
        var plan_id = '';

        if (radio.value == 'subscribe' && radio.checked) {
          plan_id = this.plan_el.value;
        }

        this.setPlan(plan_id);
      }
    }, {
      key: "setPlan",
      value: function setPlan(id) {
        if (!this.selling_plan_el) {
          return;
        }

        this.selling_plan_el.value = id;
      }
    }]);

    return SubscriptionPlans;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  customElements.define('subscription-plans', SubscriptionPlans);
}
/******/ })()
;