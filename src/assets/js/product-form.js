
import * as PForm from '@shopify/theme-product-form';
window.Shopify = window.Shopify || {};
window.Shopify.ProductForm = PForm.ProductForm;
(function(){
  if (!customElements.get('custom-dropdown')) {
    class CustomDropdown extends HTMLElement {
        constructor() {
          super();
          this.selectedEl = this.querySelector('.selected-value');
          if (!this.selectedEl) {
              return;
          }
          this.button = this.querySelector('button');
          this.querySelectorAll('input').forEach(
              (button) => button.addEventListener('change', this.onChange.bind(this))
          );
          this.button.addEventListener('click', this.onButtonClick.bind(this));
          window.addEventListener('click', (event)=>{
            if ( (event.target.closest('button') == this.button) || ( event.target == this.button ) ) {
              return;
            }
            this.querySelector('.selectDropdown').classList.remove('active');
          })
        }
  
        onChange(event) {
          this.selectedEl.querySelector('span.value').innerHTML = event.currentTarget.value;
          if (event.currentTarget.dataset.color != 'transparent' ) {
            let new_bg = event.currentTarget.dataset.color; 
            this.selectedEl.querySelector('span.circle').style.background = new_bg;
          }
        }
        onButtonClick(event) {
          this.querySelector('.selectDropdown').classList.toggle('active');
        }
    }
  
    customElements.define('custom-dropdown', CustomDropdown);
}
if (!customElements.get('color-option')) {
    class ColorOption extends HTMLElement {
        constructor() {
            super();
            this.selectedEl = this.querySelector('span.selected');
            if (!this.selectedEl) {
                return;
            }
            this.querySelectorAll('input').forEach(
                (button) => button.addEventListener('change', this.onChange.bind(this))
            );
        }
  
        onChange(event) {
            this.selectedEl.innerHTML = event.currentTarget.value;
        }
    }
  
    customElements.define('color-option', ColorOption);
}    
if (!customElements.get('product-form')) {
    customElements.define('product-form', class ProductForm extends HTMLElement {
      constructor() {
        super();
  
        this.productForm = null;
        this.main_product = this.hasAttribute('main-product');
        this.bundle_product = this.hasAttribute('bundle-product');
        this.form_type = this.dataset.type;
        this.form = this.querySelector('form');
        this.cart = document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        if(this.querySelector('[data-price]')){
          this.price = this.querySelector('[data-price]');
        }
        if (this.cart && this.submitButton) this.submitButton.setAttribute('aria-haspopup', 'dialog');
  
        const productHandle = this.form.dataset.productHandle;
        if ((productHandle.trim() != '') && ( this.form_type != 'select' ) ) {
          fetch(`/products/${productHandle}.js`)
          .then(response => {
            return response.json();
          })
          .then(productJSON => {
            this.productForm = new PForm.ProductForm(this.form, productJSON, {
              onOptionChange: this.onOptionChange.bind(this),
              onFormSubmit: this.onFormSubmit.bind(this)
            });
          });
        } else if( this.form_type == 'select' ) {
          this.form.addEventListener('submit', this.onFormSubmit.bind(this))
        }
        this.loading = false;
        if (this.form_type == 'select') {
          var select = this.querySelector('select[name="id"]');
          if (select) {
            select.addEventListener('change', ()=> {
              if (select.value.trim() != '') {
                this.form.dispatchEvent(new Event('submit'));
              }
            })
          }
        }
      }
      
      onFormSubmit(event) {
        if (this.loading) {
          return;
        }
        this.loading = true;
        event.preventDefault();
        const config = {
          method: 'POST',
          headers: { 'Accept': 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' }
        };
        const formData = new FormData(this.form);
        formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
        formData.append('sections_url', window.location.pathname);
        config.body = formData;
        
        this.submitButton.classList.add('loading');
        
        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              alert(response.description);
              this.cart.open();
              return;
            }
            if (this.bundle_product && document.querySelector('[main-product]') ) {
              this.mainProductForm = document.querySelector('[main-product] form')
              const config = {
                method: 'POST',
                headers: { 'Accept': 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' }
              };
              const formData = new FormData(this.mainProductForm);
              formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
              formData.append('sections_url', window.location.pathname);
              config.body = formData;
              fetch(`${routes.cart_add_url}`, config)
              .then((response) => response.json())
              .then((response) => {
                if (response.status) {
                  alert(response.description);
                  this.cart.open();
                  return;
                }
                this.cart.renderContents(response);
              })
              .catch((e) => {
                this.cart.open();
                // console.error(e);
              })
              .finally(() => {
              });
            } else {
            this.cart.renderContents(response);
            }
          })
          .catch((e) => {
            this.cart.open();
            // console.error(e);
          })
          .finally(() => {
            this.loading = false;
            this.submitButton.classList.remove('loading');
            var select = this.querySelector('select[name="id"]');
            if (select) {
              select.value = '';
            }
          });
      }
      addedToCart() {
        fetch(`${window.location.origin}/cart.js`)
        .then(res => res.clone().json().then(data => {
          var cart = {
            total_price: data.total_price/100,
            $value: data.total_price/100,
            total_discount: data.total_discount,
            original_total_price: data.original_total_price/100,
            items: data.items
          }
          if (item !== 'undefined') {
            cart = Object.assign(cart, item)
          }
        }))
      }
      onOptionChange(event) {
        const variant = event.dataset.variant;
        var buttonspan = this.submitButton.querySelector('span.btn-text');
        if(this.price){
          this.price.innerHTML = window.variantStrings.moneyFormat.replace('{{amount}}', (variant.price / 100).toFixed(2));
        }
        if (variant === null) {
          this.submitButton.disabled = false;
          if (buttonspan) {
            buttonspan.innerHTML = window.variantStrings.unavailable
          }
        } else if (variant && !variant.available) {
          this.submitButton.disabled = true;
          if (buttonspan) {
            buttonspan.innerHTML = window.variantStrings.sold_out
          }
        } else if (variant && variant.available) {
          this.submitButton.disabled = false;
          if (buttonspan) {
            buttonspan.innerHTML = window.variantStrings.add_to_cart
          }
        }
        if (!variant) {
            return;
        }
        this.form.querySelector('[name=id]').value = variant.id;
        if (this.main_product) {
          const url = PForm.getUrlWithVariant(window.location.href, variant.id);
          window.history.replaceState({ path: url }, '', url);
        }
      }
  
    });
  }
  
})();
