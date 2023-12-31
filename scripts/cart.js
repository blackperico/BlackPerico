'use strict'

const cart = document.querySelector('#cart');
const cartBlock = document.querySelector('#cart-block');
const cartCount = document.querySelector('#cart-count');
const cartIcon = document.querySelector('.fa-cart-shopping');
let key = localStorage.length;
cartCount.innerHTML = key;
let cartItem = {name: undefined,
    price: undefined};
const TYPES = {
    gamesIndex: 'gamesindex',
    categoryIndex: 'categoryindex',
    productShop: 'productshop'
};

function addCart(type, targetProduct) {
    switch(type){
        case TYPES.gamesIndex: { 
            cartItem.name = document.querySelector('#games-middle').querySelector('.cat-title').innerHTML;
            cartItem.price = document.querySelector('#games-middle').querySelector('.cat-price').innerHTML;
            window.localStorage.setItem(key, JSON.stringify(cartItem));
            cartModify(key, cartItem.name, cartItem.price);
            key++;
            cartCount.innerHTML = key;
            wiggleAnimation();
            isCartCountOne();
            break;
        }
        case TYPES.categoryIndex: {
            cartItem.name = targetProduct.querySelector('.specs-title').innerHTML;
            cartItem.price = targetProduct.getAttribute('data-price');
            window.localStorage.setItem(key, JSON.stringify(cartItem));
            cartModify(key, cartItem.name, cartItem.price);
            key++;
            cartCount.innerHTML = key;
            wiggleAnimation();
            isCartCountOne();
            break;
        }
        case TYPES.productShop: {
            cartItem.name = targetProduct.querySelector('.product-name').innerHTML;
            cartItem.price = targetProduct.querySelector('.product-price').innerHTML;
            window.localStorage.setItem(key, JSON.stringify(cartItem));
            cartModify(key, cartItem.name, cartItem.price);
            key++;
            cartCount.innerHTML = key;
            wiggleAnimation();
            isCartCountOne();
            break;
        }
        default:
            return;
    }
};
const storageModify = function(e) {
    let selectDelete = +(e.target.parentElement.querySelector('.cart-number').innerHTML);
    if(e.target.parentElement.nextSibling != null) {
        e.target.parentElement.replaceWith(e.target.parentElement.nextSibling);
        localStorage.removeItem(selectDelete);
        for(let i = selectDelete; i < cartBlock.children.length; i++) {
            if(cartBlock.children[i].querySelector('.cart-number').innerHTML != i) 
            {
                cartBlock.children[i].querySelector('.cart-number').innerHTML = i;
                localStorage.setItem(i, localStorage.getItem(i + 1));
                localStorage.removeItem(i + 1);
            }
        }
        }
        else 
        {
            e.target.parentElement.remove();
            localStorage.removeItem(selectDelete);
        }
        key = localStorage.length;
        cartCount.innerHTML = localStorage.length;
        isCartCountOne();
};
const cartModify = function(cartNumber, cartDesc, cartPrice) {
    const createCartContainer = document.createElement('div'), createCartNumber = document.createElement('div'), createCartDesc = document.createElement('div'), createCartPrice = document.createElement('div'), createCartButton = document.createElement('button');
    createCartContainer.className = 'cart-container', createCartNumber.className = 'cart-number', createCartDesc.className = 'cart-description', createCartPrice.className = 'cart-price', createCartButton.className = 'cart-remove-item';
    createCartNumber.innerHTML = cartNumber, createCartDesc.innerHTML = cartDesc, createCartPrice.innerHTML = cartPrice;
    cartBlock.append(createCartContainer);
    createCartContainer.append(createCartNumber), createCartContainer.append(createCartDesc), createCartContainer.append(createCartPrice), createCartContainer.append(createCartButton);
    createCartButton.addEventListener('click', (e) => {
        storageModify(e);
        cartDropAnimation()
    });
};
function isCartCountOne() {
    if(cartCount.innerHTML != 0 && cartCount.innerHTML < 2)
        cartBlock.style.borderBottomRightRadius = '0px';
    else
        cartBlock.style.borderRadius = '10px 0 10px 10px';
    if(cartCount.innerHTML == 0) {
        cartBlock.style.display = 'none';
        cart.style.borderTopLeftRadius = '23px';
        cart.style.borderBottomLeftRadius = '23px';
    }
};
function wiggleAnimation() {
    cartIcon.className = 'fa fa-cart-shopping';
        requestAnimationFrame(() => {
            cartIcon.classList.add('cart-wiggle');
        });
}; 
function cartDropAnimation() {
    cartIcon.className = 'fa fa-cart-shopping';
    requestAnimationFrame(() => {
        cartIcon.classList.add('cart-drop');
    });
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

if(localStorage.length) {
    for(let i = 0; i < localStorage.length; i++) {
        cartItem.name = JSON.parse(localStorage.getItem(i)).name;
        cartItem.price = JSON.parse(localStorage.getItem(i)).price;
        cartModify(i, cartItem.name, cartItem.price);
    }
}

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