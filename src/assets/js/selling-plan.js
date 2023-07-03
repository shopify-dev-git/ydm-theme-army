if (!customElements.get('subscription-plans')) {
    class SubscriptionPlans extends HTMLElement {
        constructor() {
            super();
            this.addEventListener('click', function(){document.querySelector('body').classList.remove('select-option')})
            this.selling_plan_el = this.querySelector('[name="selling_plan"]');
            this.plan_el = this.querySelector('.subscription-selling-plan');
            if (!this.selling_plan_el) {
                return;
            }
            this.plan_el.addEventListener('change', this.onSubscriptionChange.bind(this));
            this.querySelectorAll('[name^="subscription-"]').forEach(function(radio){
                if (radio.value == 'subscribe' && radio.checked ) {
                    this.setPlan(this.plan_el.value);
                }
                radio.addEventListener('change', this.onPlanChange.bind(this));
            }.bind(this));
        }
        onSubscriptionChange(event) {
            let select = event.currentTarget;
            this.setPlan(select.value);
            this.querySelector('[value="subscribe"]').checked = true;
        }
        onPlanChange(event){
            let radio = event.currentTarget;
            let current_price = radio.getAttribute('data-price');                                                                        
            
            console.log(current_price);
            let btn = document.querySelector('.btn__price');
            btn.innerHTML =  (current_price);
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
    }

    customElements.define('subscription-plans', SubscriptionPlans);
    
}