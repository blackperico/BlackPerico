'use strict'

const cart = document.querySelector('#cart');
const cartBlock = document.querySelector('#cart-block');
const cartCount = document.querySelector('#cart-count');
cartCount.innerHTML = localStorage.length;
const cartIcon = document.querySelector('.fa-cart-shopping');
let cartItem = {name: undefined,
    price: undefined};

const cartModify = function(cartNumber, cartDesc, cartPrice) {
    const createCartContainer = document.createElement('div'), createCartNumber = document.createElement('div'), createCartDesc = document.createElement('div'), createCartPrice = document.createElement('div'), createCartButton = document.createElement('button');
    createCartContainer.className = 'cart-container', createCartNumber.className = 'cart-number', createCartDesc.className = 'cart-description', createCartPrice.className = 'cart-price', createCartButton.className = 'cart-remove-item';
    createCartNumber.innerHTML = cartNumber, createCartDesc.innerHTML = cartDesc, createCartPrice.innerHTML = cartPrice;
    cartBlock.append(createCartContainer);
    createCartContainer.append(createCartNumber), createCartContainer.append(createCartDesc), createCartContainer.append(createCartPrice), createCartContainer.append(createCartButton);
    createCartButton.addEventListener('click', (e) => {storageModify(e); cartDropAnimation()});
};
function displayCartBlock() {
    cartBlock.style.display = 'block';
    cart.style.borderTopLeftRadius = '0px';
    cart.style.borderBottomLeftRadius = '0px';
    sessionStorage.setItem('cart', 'block');
};
function hideCartBlock() {
    cartBlock.style.display = 'none';
    cart.style.borderRadius = '23px';
    sessionStorage.setItem('cart', 'none');
};

if(cartCount.innerHTML == 0)
    cartBlock.style.display = 'none';
    else
    cartBlock.style.display = sessionStorage.getItem('cart');
if(cartCount.innerHTML == 1)
    cartBlock.style.borderBottomRightRadius = '0px';

const currentTop = +(getComputedStyle(cart).top.replace('px', ''));
window.addEventListener('scroll', function(e) {
    if(scrollY <= 180)
        cart.style.top = currentTop - scrollY + 'px';
});

if(scrollY > 180)
    cart.style.top = '70px';

if(getComputedStyle(cartBlock).display == 'block') 
{
    cart.style.borderBottomLeftRadius = '0px';
    cart.style.borderTopLeftRadius = '0px';
} 
else 
    cart.borderRadius = '23px';

cart.addEventListener('click', function(e) {
    if(getComputedStyle(cartBlock).display == 'block' && (e.target == cart || e.target == cartCount || e.target == cartIcon)) 
    {
        hideCartBlock();
    }
    else if(cartBlock.children.length > 0 && (e.target == cart || e.target == cartCount || e.target == cartIcon))
    {
        displayCartBlock();
    }
});

if(localStorage.length) {
    for(let i = 0; i < localStorage.length; i++) {
        cartItem.name = JSON.parse(localStorage.getItem(i)).name;
        cartItem.price = JSON.parse(localStorage.getItem(i)).price;
        cartModify(i, cartItem.name, cartItem.price);
    }
}