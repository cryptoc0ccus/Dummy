document.getElementById("submit").disabled = true;

stripeElements();

function stripeElements() {
  stripe = Stripe('pk_test_51JR01OJJBXKsbxPkPwpPtbUyxf9k394RCe8glAcLPNtbqvcFW23DERkkTJMNQy6bCVpNyD29rQThQDCtYv8eiLjW00LwbbBC29');

  if (document.getElementById('card-element')) {
    let elements = stripe.elements();

    // Card Element styles
    let style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };


    card = elements.create('card', { style: style });

    card.mount('#card-element');

    card.on('focus', function () {
      let el = document.getElementById('card-errors');
      el.classList.add('focused');
    });

    card.on('blur', function () {
      let el = document.getElementById('card-errors');
      el.classList.remove('focused');
    });

    card.on('change', function (event) {
      displayError(event);
    });
  }
  //we'll add payment form handling here
    let paymentForm = document.getElementById('subscription-form');
        if (paymentForm) {

        paymentForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        changeLoadingState(true);


        // create new payment method & create subscription
        createPaymentMethod({ card });
    });
  }

}

function displayError(event) {
 
  let displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
}


function createPaymentMethod({ card }) {

// Set up payment method for recurring usage
let billingName = '{{user.username}}';

stripe
  .createPaymentMethod({
    type: 'card',
    card: card,
    billing_details: {
      name: billingName,
    },
  })
  .then((result) => {
    if (result.error) {
      displayError(result);
    } else {
     const paymentParams = {
        price_id: document.getElementById("priceId").innerHTML,
        payment_method: result.paymentMethod.id,
    };
    fetch("/create-sub", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken':'{{ csrf_token }}',
      },
      credentials: 'same-origin',
      body: JSON.stringify(paymentParams),
    }).then((response) => {
      return response.json(); 
    }).then((result) => {
      if (result.error) {
        // The card had an error when trying to attach it to a customer
        throw result;
      }
      return result;
    }).then((result) => {
      if (result && result.status === 'active') {

       window.location.href = '/complete';
      };
    }).catch(function (error) {
        displayError(result.error.message);

    });
    }
  });
}


var changeLoadingState = function(isLoading) {
if (isLoading) {
  document.getElementById("submit").disabled = true;
  document.querySelector("#spinner").classList.remove("hidden");
  document.querySelector("#button-text").classList.add("hidden");
} else {
  document.getElementById("submit").disabled = false;
  document.querySelector("#spinner").classList.add("hidden");
  document.querySelector("#button-text").classList.remove("hidden");
}
};