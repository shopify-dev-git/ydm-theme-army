import * as sections from '@shopify/theme-sections';

(function(){
  window.Shopify = window.Shopify || {};
  window.Shopify.theme = window.Shopify.theme || {};
  var docReady = function(fn){
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive"){
        // call on next available tick
      setTimeout(fn, 1);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }
  var bootTheme = function() {
      // Some polyfills not provided yet by polyfills.io
    if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, this);
        }
      };
    }
    
    sections.register('account-section', {
        onLoad: function() {
            
            this._setupAddressForm();

            this.container.querySelectorAll('.address-delete-form').forEach(deleteForm => {
                deleteForm.addEventListener('submit', event => {
                    const confirmMessage = event.target.getAttribute('data-confirm-message');              
                    if (
                    !window.confirm(
                        confirmMessage || 'Are you sure you wish to delete this address?'
                    )
                    ) {
                    event.preventDefault();
                    }
                });
            });

            this.container.querySelectorAll('[data-target="AddressForm"]').forEach(el => el.addEventListener('click', this._toggleNewAddressForm.bind(this)));
            this.container.querySelectorAll('.btn-edit-address').forEach(el => el.addEventListener('click', this._toggleEditAddressForm.bind(this)));
        },
        _setupAddressForm: function() {
            if (Shopify && Shopify.CountryProvinceSelector ) {                
                new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
                    hideElement: 'AddressProvinceNewWrapper'
                });
            }
            this.container.querySelector('#AddressCountryNew').addEventListener('change', () => {
              this.container.querySelector('#AddressProvinceNew').dispatchEvent(new Event('blur'));
            })
        },
        _toggleNewAddressForm: function() {
            this.container.querySelector('#AddressForm').classList.toggle('hidden');
            this.container.querySelector('#AddressNewButton').classList.toggle('hidden');
            this.container.querySelectorAll('.edit-form').forEach(el => el.classList.add('hidden'));
            this.container.querySelector('#new_address_form').classList.remove('hidden');
            event.preventDefault();
        },
        _toggleEditAddressForm: function( event ) {

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
              this.container.querySelectorAll('.edit-form').forEach(el => el.classList.add('hidden'));
              this.container.querySelector('#new_address_form').classList.add('hidden');
              addressForm.appendChild(form);
              form.classList.remove('hidden');
              if (Shopify && Shopify.CountryProvinceSelector ) {
                  var addressId = form.getAttribute('data-address-id');
                  new Shopify.CountryProvinceSelector('AddressCountryNew'.concat(addressId), 'AddressProvinceNew'.concat(addressId), {
                      hideElement: 'AddressProvinceNewWrapper'.concat(addressId)
                  });
              }
            }
            event.preventDefault();
        }
    });
    sections.register('login-section', {
      onLoad: function() {
        console.log(this.container)
        this.formLogin = this.container.querySelector('div.form-login');
        this.formReset = this.container.querySelector('div.form-reset');

        if(this.container.querySelector('.sign-in')){
            this.container.querySelector('.sign-in').addEventListener('click', this._back_to_login.bind(this));
        }
        if(this.container.querySelector('.forgt-password')){
            this.container.querySelector('.forgt-password').addEventListener('click', this._recover_password.bind(this));
        }
      },
      _recover_password: function(event) {
        this.formLogin.classList.add('hidden');
        this.formReset.classList.remove('hidden');
        this.container.querySelector('.welcome-wrapper').classList.toggle('hidden');
        event.preventDefault();
      },
      _back_to_login: function() {
        this.formLogin.classList.remove('hidden');
        this.formReset.classList.add('hidden');
        this.container.querySelector('.welcome-wrapper').classList.toggle('hidden');
        event.preventDefault();
      }
    })
    sections.load('account-section',  document.querySelector('[data-section-type="account-section"]'));
    sections.load('login-section',    document.querySelector('[data-section-type="login-section"]'));

  }
  docReady(function(){
    if ('fetch' in window && 'assign' in Object){
      bootTheme();
    } else {
      var scriptEl = document.createElement('script');
      scriptEl.src = '//cdn.polyfill.io/v3/polyfill.min.js?unknown=polyfill&features=fetch,Element.prototype.closest,Element.prototype.matches,Element.prototype.remove,Element.prototype.classList,Array.prototype.includes,String.prototype.includes,Object.assign,CustomEvent,URL,DOMTokenList';
      scriptEl.async = false;

      scriptEl.onload = function(){
        bootTheme();
      };

      document.head.appendChild(scriptEl);
    }
  })
})();




/* Production theme.js notice */
/*! DO NOT EDIT THIS FILE. LOOK FOR custom.js AND ADD YOUR JS CODE IN THERE. */





