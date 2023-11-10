'use strict'

const cart = document.querySelector('#cart');
const cartBlock = document.querySelector('#cart-block');
const cartCount = document.querySelector('#cart-count');
cartCount.innerHTML = localStorage.length;
const cartIcon = document.querySelector('.fa-cart-shopping');

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