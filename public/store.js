if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    const removeCartItemButtons = document.getElementsByClassName('btn-danger');
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        const button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem)
    }

    const quantityInputs = document.getElementsByClassName('purchase-amount-input');
    for (let i = 0; i < quantityInputs.length; i++) {
        const input = quantityInputs[i];
        input.addEventListener('change', quantityChanged)
    }

    const addToCartButtons = document.getElementsByClassName('store-product-btn');
    for (let i = 0; i < addToCartButtons.length; i++) {
        const button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: function (token) {
        var items = [];
        var cartItemContainer = document.getElementsByClassName('products-purchase')[0];
        var cartRows = cartItemContainer.getElementsByClassName('cart-row');
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var quantityElement = cartRow.getElementsByClassName('purchase-amount-input')[0];
            var quantity = quantityElement.value; //gets the value of the input
            var id = cartRow.dataset.itemId;
            items.push({//adds an item to the array
                id: id,
                quantity: quantity //all this info gets sent to server
            })
        }

        fetch('/purchase', { //route on the server
            //sending JSON information to server
            method: 'POST', //posting to server
            headers: {
                'Content-Type': 'application/json',//this is telling the server it will be recieing json
                'Accept': 'application/json' //allows the reciept of json on this end
            },
            body: JSON.stringify({ //these are the items fetching to the server
                stripeTokenId: token.id,
                items: items
            })
        }).then(function (res) { //must be converted to JSON
            return res.json()
        }).then(function (data) {
            alert(data.message); //message that the server sends
            const cartItems = document.getElementsByClassName('products-purchase')[0];
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild)
            }
            updateCartTotal();
        }).catch(function (error) {
            console.error(error)
        })
    }
});

function purchaseClicked() {
    var priceElement = document.getElementsByClassName('purchase-total-price')[0];
    var price = parseFloat(priceElement.innerText.replace('$', '')) * 100;
    stripeHandler.open({
        amount: price
    })
}

function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal()
}

function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement.parentElement;
    const title = shopItem.getElementsByClassName('store-product-name')[0].innerText;
    const price = shopItem.getElementsByClassName('store-product-price')[0].innerText;
    const id = shopItem.dataset.itemId;
    addItemToCart(title, price, id);
    updateCartTotal()
}

function addItemToCart(title, price, id) {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    cartRow.dataset.itemId = id; //the item of the id is saved to the cart.  This way when rows are accessed, each one will have ids
    const cartItems = document.getElementsByClassName('products-purchase')[0];
    const cartItemNames = cartItems.getElementsByClassName('product-purchase-name');
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('This item is already added to the cart');
            return
        }
    }
    cartRow.innerHTML = `
    <div class="product-purchase purchase-column">
            <span class="product-purchase-name">${title}</span>
        </div>
        <span class="purchase-price purchase-column">${price}</span>
        <div class="purchase-amount purchase-column">
            <label>
                <input class="purchase-amount-input" type="number" value="1">
            </label>
            <button class="btn btn-danger coolshadow">Remove</button>
        </div>`;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('purchase-amount-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName('products-purchase')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
        const cartRow = cartRows[i];
        const priceElement = cartRow.getElementsByClassName('purchase-price')[0];
        const quantityElement = cartRow.getElementsByClassName('purchase-amount-input')[0];
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('purchase-total-price')[0].innerText = '$' + total;
}