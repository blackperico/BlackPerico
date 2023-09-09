'use strict'
/* Search box */
{
    const searchBox = document.querySelector('#search');
    let searchValue;
    searchBox.addEventListener('focus', (e) => {
        if(e.target.value == 'Search...')
            e.target.value = '';
    });
    searchBox.addEventListener('keydown', function(e) {
        if(e.key == 'Enter'){
            searchValue = e.target.value;
            console.log(searchValue);
        }
    });
    searchBox.addEventListener('blur', (e) => {
        if(e.target.value == '')
            e.target.value = 'Search...';
    });
}
/* Ads */
{
    const images = ['images/ads/ad0.jpg', 'images/ads/ad1.jpg', 'images/ads/ad2.jpg'];
    const image = document.querySelector('#ad-image'), previousImage = document.querySelector('#previous-image'), dots = document.querySelectorAll('.dots');
    let loopThrough, selectedDot = document.querySelector('.dots').getAttribute('data-id');
    function fadeOutPrevious() {
        previousImage.setAttribute('src', document.querySelector('#ad-image').getAttribute('src'));
        previousImage.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                previousImage.classList.add('image-fade-out-right');
            });
        });
    };
    function slideInPrevious(id) {
        image.setAttribute('src', images[`${id}`]);
        image.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                image.classList.add('image-slide-in-right');
            });
        });
    };
    function fadeOutNext() {
        previousImage.setAttribute('src', document.querySelector('#ad-image').getAttribute('src'));
        previousImage.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                previousImage.classList.add('image-fade-out-left');
            });
        });
    };
    function slideInNext(id) {
        image.setAttribute('src', images[`${id}`]);
        image.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                image.classList.add('image-slide-in-left');
            });
        });
    };
    function dotRecolor(id) {
        for(let i = 0; i < dots.length; i++)
            if(id != i)
                dots[i].style.backgroundColor = 'transparent';
            else
                dots[i].style.backgroundColor = '#000';
    };
    for(let dot of dots) {
        dot.addEventListener('click', (e) => {
            if(e.target.style.backgroundColor != 'rgb(0, 0, 0)') 
            {
                clearTimeout(loopThrough);
                loopThrough = setTimeout(dotsIteration, 10000);
                if(e.target.getAttribute('data-id') < selectedDot) 
                {
                    fadeOutPrevious();
                    slideInPrevious(e.target.getAttribute('data-id'));
                    dotRecolor(e.target.getAttribute('data-id'));
                }
                else 
                {
                    fadeOutNext();
                    slideInNext(e.target.getAttribute('data-id'));
                    dotRecolor(e.target.getAttribute('data-id'));
                }
                selectedDot = e.target.getAttribute('data-id');
            }
        });
    };
    function dotsIteration() {
        if(selectedDot < dots.length - 1)
            selectedDot++;
        else
            selectedDot = '0';
        fadeOutNext();
        slideInNext(selectedDot);
        dotRecolor(selectedDot);
        loopThrough = setTimeout(dotsIteration, 3000);
    };
    loopThrough = setTimeout(dotsIteration, 3000);
}
/*  Menu  */ 
{ 
    localStorage.removeItem('menuFilter');
    const navMenu = document.querySelector("nav ul li:first-of-type"), menu = document.querySelector('#menu');
    let check;
    navMenu.addEventListener('click', function(e) {
        check = Number(getComputedStyle(menu).left.replace('-', '').replace('px', ''));
        if(check > 0)
        {
            menu.style.left = '0px';
        }
        else
        {
            menu.style.left = '-300px';
        }
    });
    const headerHeight = Number(getComputedStyle(document.querySelector('header')).height.replace('px', '')), navHeight = Number(getComputedStyle(document.querySelector('nav')).height.replace('px', ''));
    let scrollValue;
    window.addEventListener('scroll', function(e) {
        scrollValue = window.scrollY;
        if (scrollValue < headerHeight) {
            menu.style.top = (headerHeight + navHeight) - scrollValue + 'px';
        } 
        else 
        {
            menu.style.top = navHeight + 'px';
        }
    });
}
/* Side elements and middle element */
{
    const sideElements = document.querySelectorAll('.side-element');
    sideElements.forEach(function(sideElement) {
        let increment = 0, titleTimeOut;
        let sideElementWidth = Number(getComputedStyle(sideElement).width.replace('px', ''));
        let sideElementTitle = sideElement.querySelector('.side-element-title');
        let sideElementTitleWidth = Number(getComputedStyle(sideElementTitle).width.replace('px', ''));
        let sideElementTitleOffset = sideElementWidth - sideElementTitleWidth;
        let mouseOverSideElement = function(e) {
            clearTimeout(titleTimeOut);
            sideElementTitle.style.transform = `translateX(${increment}px)`;
            increment--;
            titleTimeOut = setTimeout(mouseOverSideElement, 20);
            if(increment <= (sideElementTitleOffset))
                clearTimeout(titleTimeOut);
        };
        let mouseLeaveSideElement = function() {
            clearTimeout(titleTimeOut);
            sideElementTitle.style.transform = `translateX(${increment}px)`;
            increment++;
            titleTimeOut = setTimeout(mouseLeaveSideElement, 20);
                if(increment >= 0)
                    clearTimeout(titleTimeOut);
        };
        if(sideElementTitleOffset < 0) 
        {
            sideElement.addEventListener('mouseenter', mouseOverSideElement)
            sideElement.addEventListener('mouseleave', mouseLeaveSideElement)
        }

        window.addEventListener('resize', function(e) {
            sideElementWidth = Number(getComputedStyle(sideElement).width.replace('px', ''));
            sideElementTitleWidth = Number(getComputedStyle(sideElementTitle).width.replace('px', ''));
            sideElementTitleOffset = sideElementWidth - sideElementTitleWidth;
            if(sideElementTitleOffset < 0) {
                sideElement.addEventListener('mouseenter', mouseOverSideElement)
                sideElement.addEventListener('mouseleave', mouseLeaveSideElement)
            }
            else 
            {
                sideElement.removeEventListener('mouseenter', mouseOverSideElement)
                sideElement.removeEventListener('mouseleave', mouseLeaveSideElement)
            }
        });
    });

    /* Need to change only .cat-middle-children-animation transition duration in CSS if subject to change */
    document.querySelector('.side-element').classList.add('side-element-loading');
    let timerLoop = getComputedStyle(document.querySelector('.side-element')).animationDuration;
    timerLoop = timerLoop.replace('s', '') * 1000;
    document.querySelector('.side-element').classList.replace('side-element-loading', 'side-element-selected-loading');
    let timerSelect = getComputedStyle(document.querySelector('.side-element')).animationDuration;
    timerSelect = timerSelect.replace('s', '') * 1000;
    document.querySelector('.side-element').className = 'side-element';
    
    const catMiddle = document.querySelector('#cat-middle'), catMiddleImg = catMiddle.querySelector('img'), catMiddleTitle = catMiddle.querySelector('.cat-title'), catMiddlePrice = catMiddle.querySelector('.cat-price'), catMiddleText = catMiddle.querySelector('.cat-text');
    const animationContainer = document.querySelector('#animation-container');
    let loopThrough, sideElementId = 0;
    let info = {
        src: undefined,
        title: undefined,
        price: undefined,
        text: undefined,
    };
    function catMiddleAnimation() {
        catMiddleText.className = 'cat-text';
        catMiddlePrice.className = 'cat-price';
        animationContainer.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                animationContainer.classList.add('cat-middle-animation');
                catMiddleText.classList.add('cat-middle-children-animation');
                catMiddlePrice.classList.add('cat-middle-children-animation');
            })
        })
    }
    function loopSelect(sideElementId) {
        sideElements.forEach(sideElement => sideElement.className = 'side-element');
        requestAnimationFrame(() => {
            sideElements[sideElementId].classList.add('side-element-loading');
        });
    };
    function userSelect() {
        sideElements.forEach((sideElement) => sideElement.className = 'side-element')
        requestAnimationFrame(() => {
            sideElements[sideElementId].classList.add('side-element-selected-loading');
        });
    };
    function modifyCatMiddle (info) {
        catMiddleAnimation()
        catMiddleImg.src = info.src;
        catMiddleTitle.innerHTML = info.title;
        catMiddlePrice.innerHTML = info.price;
        catMiddleText.innerHTML = info.text;
    };
    function collectInfo() {
        info = {
            src: sideElements[sideElementId].querySelector('img').src,
            title: sideElements[sideElementId].querySelector('.side-element-title').innerHTML,
            price: sideElements[sideElementId].getAttribute('data-price').replace('', '&euro;'),
            text: sideElements[sideElementId].getAttribute('data-text'),
        };
        modifyCatMiddle(info);
    };
    function iterateOver() {
        collectInfo();
        loopSelect(sideElementId);
        if(sideElementId < sideElements.length - 1)
            sideElementId++;
        else
            sideElementId = 0;
        loopThrough = setTimeout(() => iterateOver(), timerLoop);
    };
    iterateOver();

    sideElements.forEach(function(sideElement) {
        sideElement.addEventListener('click', (e) => {
            sideElementId = sideElement.getAttribute('data-id');
            collectInfo();
            userSelect();
            clearTimeout(loopThrough);
            loopThrough = setTimeout(() => {
                if(sideElementId < sideElements.length - 1)
                    sideElementId++;
                else
                    sideElementId = 0;
                iterateOver();
            }, timerSelect);
        });
    });
    /* Responsiveness */
    const sides = document.querySelectorAll('.cat-side'), catTopWrap = document.querySelector('#cat-top-wrap'), catTop = document.querySelector('#cat-top');
    const catTopWrapWidth = Number(getComputedStyle(catTopWrap).width.replace('px', ''));
    let catTopWidth = Number(getComputedStyle(catTop).width.replace('px', '')), isClicked, drag = 0;
    
    catTop.addEventListener('mousedown', () => {
        isClicked = 1;
    });
    window.addEventListener('mouseup', () => {
        isClicked = 0;
    });
    window.addEventListener('mousemove', (e) => {
        if(isClicked == 1 && drag >= -(1795 - catTopWidth) && drag <= 0)
        {
            catTopWrap.style.transform = `translateX(${drag}px)`;
            drag = drag + e.movementX;
            if(drag > 0)
                drag = 0;
            if(drag < -(1795 - catTopWidth))
                drag = -(1795 - catTopWidth);
        }
    });

    window.addEventListener('DOMContentLoaded', (e) => {
        if(window.innerWidth < 894)
            {
                sideElements.forEach((sideElement) => {
                catTopWrap.append(sideElement);
                });
            }
    });
    window.addEventListener('resize', (e) => {
        if(drag <= -(1795 - catTopWidth))
            drag = -(1795 - catTopWidth - 1);
        catTopWrap.style.transform = `translateX(${drag}px)`;
        catTopWidth = Number(getComputedStyle(catTop).width.replace('px', ''));
        if(window.innerWidth <= 894 && getComputedStyle(catTop).display == 'block')
            {
                sideElements.forEach((sideElement) => {
                catTopWrap.append(sideElement);
                });
            }
            else
            {
                for(let i = 0; i < 4; i++) {
                    sides[0].append(sideElements[i]);
                }
                for(let i = 4; i < 8; i++) {
                    sides[1].append(sideElements[i]);
                }
            }
    });
}
/* Category elements */
{
let upper = Array.from(document.querySelector('#category-upper').children), lower = Array.from(document.querySelector('#category-lower').children);
let categoryArray = upper.concat(lower);
const category = document.querySelector('#category');
let specs = category.querySelector('.specs'), specsWidth = (+getComputedStyle(specs).width.replace('px', '')), specsTitles = category.querySelectorAll('.specs-title'), specsTitleWidth = [];
for(let i = 0; i < specsTitles.length; i++) {
    let enterRecall, leaveRecall, stopSlide = 0, leaveRecallDelay, n = 0;
    function mouseEnter(widthDiff, div) {
        mouseEnterSlide(widthDiff, div);
    };
    function mouseEnterSlide(widthDiff, div) {
        if(n > widthDiff) {
            div.style.transform = `translateX(${n}px)`;
            n = n + (100/widthDiff);
        }
        enterRecall = setTimeout(mouseEnterSlide, (1200/(-widthDiff)),widthDiff, div);
        if(n <= widthDiff || stopSlide == 1)
            clearTimeout(enterRecall);
    };
    function mouseLeave(div, widthDiff) {
        leaveRecallDelay = setTimeout(mouseLeaveSlide, 2000, div, widthDiff);
    };
    function mouseLeaveSlide(div, widthDiff) {
        div.style.transform = `translateX(${n}px)`;
        n = n + (100/widthDiff);
        leaveRecall = setTimeout(mouseLeaveSlide, (1200/(widthDiff)), div, widthDiff);
        if(n >= 0 || stopSlide == 0)
            clearTimeout(leaveRecall);
    };
    specsTitleWidth[i] = (+getComputedStyle(specsTitles[i]).width.replace('px', ''));
    if(specsTitleWidth[i] > specsWidth) {
        specsTitles[i].addEventListener('mouseenter', function(e) {
            clearTimeout(leaveRecallDelay);
            stopSlide = 0
            mouseEnter(-(specsTitleWidth[i] - specsWidth), specsTitles[i]);
        });
        specsTitles[i].addEventListener('mouseleave', function(e) {
            stopSlide = 1;
            mouseLeave(specsTitles[i], (specsTitleWidth[i] - specsWidth));
        });
    }
}

function shrink(categoryItem) {
    categoryItem.querySelector('.specs').style.height = '35px';
    categoryItem.querySelector('.specs').style.borderTopLeftRadius = '0px';
    categoryItem.querySelector('.specs').style.borderTopRightRadius = '0px';
    categoryItem.querySelector('img').style.filter = 'blur(0px)';
};
function expand(categoryItem) {
    categoryItem.querySelector('.specs').style.height = '100%';
    categoryItem.querySelector('.specs').style.borderRadius = '5px';
    categoryItem.querySelector('img').style.filter = 'blur(5px)';
};

for (let i = 0; i < categoryArray.length; i++) {
    categoryArray[i].querySelector('.specs').addEventListener('click', function(e) {
        if(categoryArray[i].querySelector('.specs').style.height == '100%')
            shrink(categoryArray[i])
        else 
            expand(categoryArray[i]);
        
        for(let n = 0; n < categoryArray.length; n++) {
            if(n != i) 
                shrink(categoryArray[n]);
        }
    })
};

let isClicked, drag = 0;
const categoryUpper = document.querySelector('#category-upper'), categoryLower = document.querySelector('#category-lower');
let categoryWidth = Number(getComputedStyle(category).width.replace('px', '')), categoryUpperWidth = Number(getComputedStyle(categoryUpper).width.replace('px', ''));

category.addEventListener('mousedown', () => {
    isClicked = 1;
});
window.addEventListener('mouseup', () => {
    isClicked = 0;
});
window.addEventListener('mousemove', (e) => {
    if(isClicked == 1 && categoryWidth < categoryUpperWidth && drag >= (categoryWidth - categoryUpperWidth) && drag <= 0)
    {
        categoryUpper.style.transform = `translateX(${drag}px)`;
        categoryLower.style.transform = `translateX(${drag}px)`;
        drag = drag + e.movementX;
        if(drag > 0)
            drag = 0;
        if(drag < (categoryWidth - categoryUpperWidth))
            drag = (categoryWidth - categoryUpperWidth);
    }
});
window.addEventListener('resize', (e) => {
    if(drag <= (categoryWidth - categoryUpperWidth))
    {
        drag = categoryWidth - categoryUpperWidth + 1;
        categoryUpper.style.transform = `translateX(${drag}px)`;
        categoryLower.style.transform = `translateX(${drag}px)`;
    }
    if(drag == 1)
        drag = 0;
    categoryWidth = Number(getComputedStyle(category).width.replace('px', ''));
    categoryUpperWidth = Number(getComputedStyle(categoryUpper).width.replace('px', ''));
});
}
/* Buy buttons and cart */
{   
    const cart = document.querySelector('#cart'), cartBlock = document.querySelector('#cart-block'), cartCount = document.querySelector('#cart-count'), cartIcon = document.querySelector('.fa-cart-shopping');
    let cartItem = {name: undefined,
        price: undefined};
    let key = localStorage.length;
    cartCount.innerHTML = key;
     
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
    function isCartCountOne() {
        if(cartCount.innerHTML != 0 && cartCount.innerHTML < 2)
            cartBlock.style.borderBottomRightRadius = '0px';
        else
            cartBlock.style.borderRadius = '10px 0 10px 10px';
        if(cartCount.innerHTML == 0) {
            cartBlock.style.display = 'none';
            cart.style.borderTopLeftRadius = '23px';
            cart.style.borderBottomLeftRadius = '23px';}
    };
    function addCart(type, item) {
        switch(type){
            case 1: { 
                cartItem.name = catMiddle.querySelector('.cat-title').innerHTML;
                cartItem.price = catMiddle.querySelector('.cat-price').innerHTML;
                window.localStorage.setItem(key, JSON.stringify(cartItem));
                cartModify(key, cartItem.name, cartItem.price);
                key++;
                cartCount.innerHTML = key;
                wiggleAnimation();
                isCartCountOne();
                break;}
            case 2: {
                cartItem.name = item.querySelector('.specs-title').innerHTML;
                cartItem.price = item.getAttribute('data-price');
                window.localStorage.setItem(key, JSON.stringify(cartItem));
                cartModify(key, cartItem.name, cartItem.price);
                key++;
                cartCount.innerHTML = key;
                wiggleAnimation();
                isCartCountOne();
                break;}
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
        createCartButton.addEventListener('click', (e) => {storageModify(e); cartDropAnimation()});
    };
    
    const catMiddle = document.querySelector('#cat-middle'), catMiddleBuy = catMiddle.querySelector('.buy-button');
    catMiddleBuy.addEventListener('click', () => addCart(1));
    
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(function(item) {
        const button = item.querySelector('.buy-button');
        button.addEventListener('click', () => addCart(2, item));
    });

    window.addEventListener('DOMContentLoaded', function(e) {
        if(localStorage.length) {
            for(let i = 0; i < localStorage.length; i++) {
                cartItem.name = JSON.parse(localStorage.getItem(i)).name;
                cartItem.price = JSON.parse(localStorage.getItem(i)).price;
                cartModify(i, cartItem.name, cartItem.price);
            }
        }
    });
}

/* Cart design */
{
    const cart = document.querySelector('#cart');
    const cartBlock = document.querySelector('#cart-block');
    const cartCount = document.querySelector('#cart-count');
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
}
/*
function myIterator(start, finish) {
    let index = start;
    let count = 0;

    return {
        next() {
            let result;
            if (index < finish) {
                result = {
                    value: index,
                    done: false
                };
                index = index + 1;
                return result;
            } 
            return {
                value: count,
                done: true
            };
        }
    }
}



let it = myIterator(0, 10);
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());



let niz = [1, 2 ,3 ,4 ,5];
let i = niz[Symbol.iterator]();
console.log(i.next());
console.log(i.next());
console.log(i.next());
console.log(i.next());
console.log(i.next());
console.log(i.next());
let map = new Map();
map.set('key1', 'value 1');
map.set('key2', 'value 2');
let mapI = map[Symbol.iterator]();
console.log(mapI.next());
console.log(mapI.next());
*/