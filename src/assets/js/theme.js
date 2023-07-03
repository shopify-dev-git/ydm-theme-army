import lazySizes from 'lazysizes';
import Alpine from 'alpinejs'
 
window.Alpine = Alpine

lazySizes.cfg.loadHidden = false;

(function(){
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
    function debounce(fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    }
    /*
    class LocalizationForm extends HTMLElement {
      constructor() {
        super();
        this.elements = {
          input: this.querySelector('input[name="locale_code"], input[name="country_code"]'),
          button: this.querySelector('button'),
          panel: this.querySelector('.currency-list-item'),
        };
        this.elements.button.addEventListener('click', this.openSelector.bind(this));
        this.elements.button.addEventListener('focusout', this.closeSelector.bind(this));
        this.addEventListener('keyup', this.onContainerKeyUp.bind(this));
  
        this.querySelectorAll('a').forEach(item => item.addEventListener('click', this.onItemClick.bind(this)));
      }
  
      hidePanel() {
        this.elements.button.setAttribute('aria-expanded', 'false');
        this.elements.panel.setAttribute('hidden', true);
      }
  
      onContainerKeyUp(event) {
        if (event.code.toUpperCase() !== 'ESCAPE') return;
  
        this.hidePanel();
        this.elements.button.focus();
      }
  
      onItemClick(event) {
        event.preventDefault();
        const form = this.querySelector('form');
        this.elements.input.value = event.currentTarget.dataset.value;
        if (form) form.submit();
      }
  
      openSelector() {
        this.elements.button.focus();
        this.elements.panel.toggleAttribute('hidden');
        this.elements.button.setAttribute('aria-expanded', (this.elements.button.getAttribute('aria-expanded') === 'false').toString());
      }
  
      closeSelector(event) {
        const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON';
        if (event.relatedTarget === null || shouldClose) {
          this.hidePanel();
        }
      }
    }
  
    customElements.define('localization-form', LocalizationForm);
    */

    class QuantityInput extends HTMLElement {
      constructor() {
        super();
        this.input = this.querySelector('input');
        this.changeEvent = new Event('change', { bubbles: true })

        this.querySelectorAll('button').forEach(
          (button) => button.addEventListener('click', this.onButtonClick.bind(this))
        );
      }

      onButtonClick(event) {
        event.preventDefault();
        const previousValue = this.input.value;

        event.currentTarget.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
        
        if (this.input.value < 10) { this.input.value = '0' + this.input.value }
        if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
      }
    }

    customElements.define('quantity-input', QuantityInput);

    class CartDrawer extends HTMLElement {
      constructor() {
        super();

        this.drawer = this.querySelector('#cart-drawer');
        this.checkoutButton = this.querySelector('[name="checkout"]');
        this.reserveTimer = this.querySelectorAll('reserve-timer');
        this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
        this.querySelectorAll('[data-close-cart]').forEach(el => el.addEventListener('click', this.close.bind(this)));
        // this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
        // this.setHeaderCartIconAccessibility();

        this.animating = false;
        this.canOpen = true;
      }
    
      // setHeaderCartIconAccessibility() {
      //   const cartLink = document.querySelector('#cart-icon-bubble');
      //   cartLink.setAttribute('role', 'button');
      //   cartLink.setAttribute('aria-haspopup', 'dialog');
      //   cartLink.addEventListener('click', (event) => {
      //     event.preventDefault();
      //     this.open(cartLink)
      //   });
      //   cartLink.addEventListener('keydown', (event) => {
      //     if (event.code.toUpperCase() === 'SPACE') {
      //       event.preventDefault();
      //       this.open(cartLink);
      //     }
      //   });
      // }
      preventOpen( stop ) {
        if (stop == undefined) {
          stop = true;
        }
        this.canOpen = !stop;
      }
      open(triggeredBy) {
        if (this.animating || !this.canOpen) {
          return;
        }
        this.animating = true
        if (triggeredBy) this.setActiveElement(triggeredBy);
        // setTimeout(() => {
        //   this.classList.remove('hidden');
        //   setTimeout(() => {
        //     this.drawer.classList.add('translate-x-0');
        //     this.drawer.classList.remove('translate-x-full');
        //     this.animating = false;
        //   },20);
        // });
    
        // document.body.classList.add('overflow-hidden', 'cart-open');
      }
    
      close() {
        if (this.animating) {
          return;
        }
        // document.body.classList.remove('overflow-hidden', 'cart-open');
        // setTimeout(() => {
        //   this.drawer.classList.add('translate-x-full'); 
        //   this.drawer.classList.remove('translate-x-0'); 
        //   setTimeout(()=>{
        //     this.classList.add('hidden');
        //   },500);
        // });
      }
    
      renderContents(parsedState) {
        this.checkoutButton.disabled = !( parsedState.id || parsedState.item_count > 0 || ( parsedState.items && (parsedState.items.length > 0) ) );
        this.getSectionsToRender().forEach((section => {
          if (section.selectors) {
            section.selectors.forEach((selector)=>{
              let sectionElement = document.querySelector(selector);
              sectionElement.innerHTML =
                  this.getSectionInnerHTML(parsedState.sections[section.id], selector);
            })
          } else {
            const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
              sectionElement.innerHTML =
                  this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
            if (section.id == 'cart-icon-bubble') {
              if (sectionElement.querySelector('#item_count').innerText > 0) {
                this.reserveTimer.forEach(el=>el.run());
              } else {
                this.reserveTimer.forEach(el=>el.stop());
              }
            }
          }
        }));
        
        if (window.conversionBundlesBear && typeof window.conversionBundlesBear.updateSubtotal == 'function' ) {
          window.conversionBundlesBear.updateSubtotal(true);
        }
        setTimeout(() => {
          this.open();
        });
      }
    
      getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser()
          .parseFromString(html, 'text/html')
          .querySelector(selector).innerHTML;
      }

      getSectionsToRender() {
        return [
          {
            id: 'cart-drawer',
            selectors: ['#cart-drawer .cart-content']
          },
          {
            id: 'header',
            selectors: ['#header #cart-icon-bubble']
          }
        ];
      }
    
      getSectionDOM(html, selector = '.shopify-section') {
        return new DOMParser()
          .parseFromString(html, 'text/html')
          .querySelector(selector);
      }
    
      setActiveElement(element) {
        this.activeElement = element;
      }
    }
    
    customElements.define('cart-drawer', CartDrawer);
    
    class CartDrawerSubscription extends HTMLElement {
      constructor() {
        super();
        this.addEventListener('click', function(){document.querySelector('body').classList.remove('select-option')})
        this.selling_plan_el = this.querySelector('[name="selling_plans"]');
        this.plan_el = this.querySelector('.subscription-selling-plan');
        if (!this.selling_plan_el) {
            return;
        }
        this.plan_el.addEventListener('change', this.onSubscriptionChange.bind(this));
        this.querySelectorAll('[name^="subscriptions-"]').forEach(function(radio){
            if (radio.value == 'subscribe' && radio.checked ) {
                this.setPlan(this.plan_el.value);
            }
            radio.addEventListener('change', this.onPlanChange.bind(this));
        }.bind(this));
        this.cart = document.querySelector('cart-drawer');
        if (this.querySelector('[data-subscribe-submit]')) {
          this.querySelector('[data-subscribe-submit]').addEventListener('change', this.onOptionChange.bind(this));
        }
        this.loading = false;
      }
      onSubscriptionChange(event) {
        let select = event.currentTarget;
        this.setPlan(select.value);
        // this.querySelector('[value="subscribe"]').checked = true;
    }
    onPlanChange(event){
        let radio = event.currentTarget;
        let plan_id = '';
        if (radio.value == 'subscribe' && radio.checked ) {
            plan_id = this.plan_el.value
        }
        this.setPlan(plan_id);
    }
    setPlan(id) {
        if (!this.selling_plan_el) {
            return;
        }
        this.selling_plan_el.value = id;
    }
      onOptionChange(event) {
        event.preventDefault();
        var checkoutButton = this.cart.querySelector('[name="checkout"]');
        if (checkoutButton) {
          checkoutButton.disabled = true;
        }
        var quantity = event.currentTarget.dataset.quantity;
        var selling_plan = this.querySelector('[name="selling_plans"]').value;
        console.log(event.currentTarget.dataset.index)
        console.log(quantity)
        this.updateQuantity(event.currentTarget.dataset.index, quantity, selling_plan)
      }
      updateQuantity(line, quantity,selling_plan, render) {
        if (render == null) {
          render = true;
        }
        const body = JSON.stringify({
          line,
          quantity,
          selling_plan,
          sections: this.cart.getSectionsToRender().map((section) => section.id),
          sections_url: window.routes.cart_url
        });
        
        const config = {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body
        };
        
        fetch(`${routes.cart_change_url}`, config )
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              alert(response.description);
              return;
            }
            if (render) {
              if (typeof render == 'function') {
                render();
              } else {
                this.cart.renderContents(response);
              }
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
    customElements.define('cart-subscription', CartDrawerSubscription);
    class CartDrawerItem extends HTMLElement {
      constructor() {
        super();
        
        this.cart = document.querySelector('cart-drawer');
        this.debouncedOnChange = debounce((event) => {
          this.onQuantityChange(event);
        }, 300);
        this.querySelector('[name^="updates"]').addEventListener('change', this.debouncedOnChange.bind(this));
        this.querySelector('.cart-item-remove').addEventListener('click', this.onItemRemove.bind(this));
        if (this.querySelector('select[name="id"]')) {
          this.querySelector('select[name="id"]').addEventListener('change', this.onOptionChange.bind(this));
        }
        this.loading = false;
      }
      onOptionChange(event) {
        var checkoutButton = this.cart.querySelector('[name="checkout"]');
        if (checkoutButton) {
          checkoutButton.disabled = true;
        }
        var id = event.currentTarget.value;
        var quantity = event.currentTarget.dataset.quantity;
        const body = JSON.stringify({
          items: [
            {id, quantity}
          ],
          sections: this.cart.getSectionsToRender().map((section) => section.id),
          sections_url: window.routes.cart_url
        });
        const config = {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body
        };
        this.updateQuantity(event.currentTarget.dataset.index, 0, ()=>{
          fetch(`${routes.cart_add_url}`, config )
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              alert(response.description);
              return;
            }
            this.cart.renderContents(response);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.loading = false;
            if (checkoutButton) {
              checkoutButton.disabled = false;
            }
          });
        });

      }
      onItemRemove(event){
        event.preventDefault();
        this.querySelectorAll('.cart-item-remove, button').forEach(button => {button.classList.add('pointer-events-none'); button.disabled = true;});
        this.updateQuantity(event.currentTarget.dataset.index, 0)
      }
      onQuantityChange(event) {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.querySelectorAll('.cart-item-remove, button').forEach(button => {button.classList.add('pointer-events-none'); button.disabled = true;});
        this.updateQuantity(event.target.dataset.index, event.target.value)
      }
      updateQuantity(line, quantity, render) {
        if (render == null) {
          render = true;
        }
        const body = JSON.stringify({
          line,
          quantity,
          sections: this.cart.getSectionsToRender().map((section) => section.id),
          sections_url: window.routes.cart_url
        });
        
        const config = {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body
        };
        
        fetch(`${routes.cart_change_url}`, config )
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              alert(response.description);
              return;
            }
            if (render) {
              if (typeof render == 'function') {
                render();
              } else {
                this.cart.renderContents(response);
              }
            }
          })
          .catch((e) => {
            // console.error(e);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }

    customElements.define('cart-drawer-item', CartDrawerItem);
    
    class RandomWatching extends HTMLElement {
      constructor() {
        super();
        this.removeAttribute('hidden');
        this.wrapper = this.closest('.checkout-message') || this.closest('.pdp-stock-message');
        this.loadContent();
        this.animate();
      }
      animate() {
        let seed = this.randomIntFromInterval(8, 15) * 1000;
        setTimeout(() => {
          this.loadContent();
          this.wrapper.classList.remove('opacity-0');
        }, 500);
        setTimeout(() => {
          this.wrapper.classList.add('opacity-0');
          this.animate();
        }, 500 + seed);
      }
      // animate2() {
      //   let seed = this.randomIntFromInterval(30, 55) * 100;
      //   this.wrapper.classList.add('ease-in-out', 'duration-500');
      //   this.wrapper.addEventListener('transitionend', () => {
      //     this.wrapper.classList.remove('ease-in-out', 'duration-500');
      //     setTimeout(() => {
      //       this.wrapper.classList.remove('opacity-0');
      //       this.loadContent(()=>{
      //         this.animate();
      //       });
      //     }, 20);
      //   }, { once: true });
      //   console.log(seed);
      //   setTimeout(()=>{
      //     this.wrapper.classList.add('opacity-0');
      //   }, seed)
      // }
      loadContent(callback) {
        let number = this.getNumber(this.dataset.number.split("-"));
        this.innerHTML = this.dataset.text.replace('RANDOM', number );
        if (callback && (typeof callback == 'function')) {
          callback();
        }
      }
      run(){
        if (this.wrapper) {
          this.wrapper.classList.add('ease-in-out', 'duration-500');
          setTimeout(() => {
            this.animate();
          }, 20);
        } else {
          this.loadContent();
        }
      }
      getNumber( randomN ){
        if (randomN.length == 2) {
          return this.randomIntFromInterval(+randomN[0],+randomN[1])
        } else if (!isNaN(randomN)) {
          return this.randomIntFromInterval(+randomN - 10,+randomN + 10)
        } else {
          return randomN
        }

      }
      randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
    }

    customElements.define('random-watching', RandomWatching);

    (function(){
      Alpine.start();
      var links = document.links;
      for (let i = 0, linksLength = links.length ; i < linksLength ; i++) {
        if ( ( links[i].hostname !== "" ) && ( links[i].hostname !== window.location.hostname )) {
          links[i].target = '_blank';
          links[i].rel = 'noreferrer noopener';
        }
      }
    })();
  }
  
  var docReady = function(fn){
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive"){
        // call on next available tick
      setTimeout(fn, 1);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
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
})()


 



