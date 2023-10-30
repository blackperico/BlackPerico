'use strict'
{
    /* Products creation and JSON insertion */
    function createElements(item) {
        /* Declare const for elements creation */
        const shopContainer = document.querySelector('#shop-container');
        const newProduct = document.createElement('div');
        newProduct.className = 'product';
        const newImg = document.createElement('img');
        newImg.setAttribute('src', `${item.image.src}`);
        newImg.setAttribute('alt', `${item.image.alt}`);
        const newProductInfo = document.createElement('div');
        newProductInfo.className = 'product-info';
        const newProductName = document.createElement('p');
        newProductName.className = 'product-name';
        const newProductPrice = document.createElement('p');
        newProductPrice.className = 'product-price';
        const newDescContainer = document.createElement('div');
        newDescContainer.className = 'desc-container';
/*
        const newScrollPath = document.createElement('div');
        newScrollPath.className = 'scroll-path';
        const newScroll = document.createElement('div');
        newScroll.className = 'scroll';
*/
        const newProductDesc = document.createElement('p');
        newProductDesc.className = 'product-desc';
        const newButtonContainer = document.createElement('div');
        newButtonContainer.className = 'button-container';
        const newButton = document.createElement('button');
        newButton.innerHTML = 'Order';

        /* Insert attributes and HTML text into elements */
        for(const [attribute, value] of Object.entries(item.attributes)) {
            newProduct.setAttribute(`${attribute}`, `${value}`);
        };
        newProductName.innerHTML = item.name;
        newProductPrice.innerHTML = item.price;
        newProductDesc.innerHTML = item.desc;

        /* Creation */
        newProduct.append(newImg);
        newProductInfo.append(newProductName);
        newProductInfo.append(newProductPrice);
        newProduct.append(newProductInfo);
        newDescContainer.append(newProductDesc);
        newProduct.append(newDescContainer);
        newButtonContainer.append(newButton);
        newProduct.append(newButtonContainer);
        shopContainer.append(newProduct);

        return newProduct;
    };

    const searchFor = document.querySelector('.nav-path + h2').innerHTML.toLowerCase();
    const loadAndCreate = new Promise((resolve, reject) => {
        fetch('../../products.json')
        .then(response => {
            if(!response.ok)
                reject('Network problem.');
            return response.json();
        })
        .then(data => resolve(data[searchFor]))
        .catch(error => console.log('Error: ' + error));
    });
    loadAndCreate
    .then(data => {
        const elementsCreated = [];
        data.forEach((value, index, array) => {
            const element = createElements(value);
            elementsCreated.push(element);
        });
        return elementsCreated;
    })
    .then(elements => {
        console.log(elements[0].querySelector('.product-desc').clientHeight);
        console.log(elements[0].querySelector('.desc-container').clientHeight);
        return elements;
    })
    .then(o => {
        window.addEventListener('resize', (e) => {
            console.log(1);
        })
    })
    /* !!!FOR TOMORROW!!!: 
        MAKE CSS VARIABLE FOR DESC-CONTAINER > IN NEXT .THEN ADD SCROLLS*/
    
    /* Products creation and JSON insertion */
}
/*  Array of shop items  */   
{
    const products = document.querySelectorAll('.product'), isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    products.forEach(function (product) {
        const descContainer = product.querySelector('.desc-container'), desc = product.querySelector('.product-desc'), containerHeight = Number(getComputedStyle(descContainer).height.replace('px', ''));
        let descHeight = Number(getComputedStyle(desc).height.replace('px', ''));
        const createDiv = document.createElement('div'), createScroll = document.createElement('div');
        createDiv.className = 'scroll-path'; 
        createScroll.className = 'scroll';

        if(descHeight > containerHeight) 
        {
            descContainer.append(createDiv);
            createDiv.append(createScroll);
        }

        let drag = 0, mouseDownCheck = 0, textRecall, textRecalls, dragScroll = 0;
        const scroll = descContainer.querySelector('.scroll'), scrollPercent = 100/(containerHeight - descHeight);

        let dragText = function() {
            desc.style.transform = `translateY(${drag}px)`;
            if(scroll)
                scroll.style.top = `${dragScroll}%`;
        };

        if(isMobile)
        {
            descContainer.addEventListener('touchstart', function(e) {
                if(descHeight > containerHeight) 
                {
                    mouseDownCheck = 1;
                    clearTimeout(textRecall);
                    clearTimeout(textRecalls);
                }
            });
            window.addEventListener('touchmove', function(e) {
                if (mouseDownCheck == 1) 
                {
                    if((drag + e.movementY) >= (containerHeight - descHeight) && (drag + e.movementY) <= (0)) 
                    {
                        drag = drag + e.movementY;
                        dragScroll = dragScroll + e.movementY * scrollPercent;
                    }
                    dragText();
                }
            });
            window.addEventListener('touchend', function(e) {
                textRecall = setTimeout(function recallText() {
                    textRecalls = setTimeout(recallText, 70); 
                    if(drag < 0) 
                    {
                        drag++;
                        dragScroll = dragScroll + scrollPercent;
                        dragText();
                    }
                    else 
                    {
                        clearTimeout(textRecalls);
                    }
                }, 3000);
                mouseDownCheck = 0;
            });
        }
        else
        {
            descContainer.addEventListener('mousedown', function(e) {
                if(e.button == 0 && descHeight > containerHeight) 
                {
                    mouseDownCheck = 1;
                    clearTimeout(textRecall);
                    clearTimeout(textRecalls);
                }
            });
            window.addEventListener('mousemove', function(e) {
                if (mouseDownCheck == 1) 
                {
                    if((drag + e.movementY) >= (containerHeight - descHeight) && (drag + e.movementY) <= (0)) 
                    {
                        drag = drag + e.movementY;
                        dragScroll = dragScroll + e.movementY * scrollPercent;
                    }
                    dragText();
                }
            });
            window.addEventListener('mouseup', function(e) {
                textRecall = setTimeout(function recallText() {
                    textRecalls = setTimeout(recallText, 70); 
                    if(drag < 0) 
                    {
                        drag++;
                        dragScroll = dragScroll + scrollPercent;
                        dragText();
                    }
                    else 
                    {
                        clearTimeout(textRecalls);
                    }
                }, 3000);
                mouseDownCheck = 0;
            });
        }
    })
}
/* Filters */
{
    const shopContainer = document.querySelector('#shop-container'), shopItems = shopContainer.querySelectorAll('.product'), filterContainer = document.querySelector('#filter-container'), shopContainerFilter = document.querySelector('#shop-container-filter'), removeFilters = document.querySelector('.remove-filters'), closeFilter = document.querySelector('#close-filter .fa'), overlay = document.querySelector('#overlay');
    let sortingArray = Array.from(shopItems);
/* Display/Hide filterBlock */
    filterContainer.addEventListener('click', (e) => {
        if(getComputedStyle(shopContainerFilter).display == 'none')
            {
                shopContainerFilter.style.display = 'block';
                overlay.style.display = 'block';
            }
        });
    closeFilter.addEventListener('click', () => {
        shopContainerFilter.style.display = '';
        overlay.style.display = '';
    });
/* Sort by price */
    function sortDesc() {
        sortingArray.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').innerHTML.replace('&euro;', ''));
            const priceB = parseFloat(b.querySelector('.product-price').innerHTML.replace('&euro;', ''));
            return priceB - priceA;
        })
        sortingArray.forEach(item => shopContainer.appendChild(item));
    };
    function sortAsc() {
        sortingArray.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').innerHTML.replace('&euro', ''));
            const priceB = parseFloat(b.querySelector('.product-price').innerHTML.replace('&euro', ''));
            return priceA - priceB;
        })
        sortingArray.forEach(item => shopContainer.appendChild(item));
    };
    const sortOut = document.querySelector('#sort');
    sortOut.addEventListener('change', (e) => {
        removeFilters.style.display = 'inline';
        if(e.target.value == 'price-descending')
            sortDesc();
        else
            sortAsc();
    })
/* Remove filters */
    removeFilters.addEventListener('click', function() {
        removeFilters.style.display = 'none';
        sortOut.selectedIndex = 0;
        shopItems.forEach((item) => {
            shopContainer.appendChild(item);
            item.style.display = 'block';
        });
    });
}
/* Filter-block */
{
    const shopContainerFilter = document.querySelector('#shop-container-filter'), collapsibleTrigger = document.querySelectorAll('.collapsible-trigger'), collapsibleContent = document.querySelectorAll('.collapsible-content'), collapsibleCaret = document.querySelectorAll('.fa-caret-up'), shopItems = document.querySelectorAll('.product'), removeFilters = document.querySelector('.remove-filters'), checkBoxes = document.querySelectorAll('input');
    
    shopContainerFilter.style.display = 'block';
/* Expand/Shrink Content */
    for(let i = 0; i < collapsibleTrigger.length; i++) {
        let height = getComputedStyle(collapsibleContent[i]).height.replace('px', '');
        collapsibleContent[i].style.height = '0px';
        collapsibleTrigger[i].addEventListener('click', () => {
            if(getComputedStyle(collapsibleContent[i]).height == '0px')
                {
                collapsibleCaret[i].style.transform = 'rotate(180deg)';
                collapsibleContent[i].style.height = `${height}px`;
                }
            else
                {
                collapsibleCaret[i].style.transform = 'rotate(0deg)';
                collapsibleContent[i].style.height = '0px';
                }
        });
    };
    shopContainerFilter.style.display = '';
/* Select filter */
    const collapsibleItems = document.querySelectorAll('.collapsible-item input');
    collapsibleItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            let inputs = e.target.parentElement.parentElement.children;
            for(let i = 0; i < inputs.length; i++)
            {
                if(e.target.parentElement != inputs[i])
                    inputs[i].firstChild.checked = false;
            }
        })
    });

    let sortObject = {}, isFulfilled;
    function sortCheck() {
        if(Object.keys(sortObject).length > 0)
            {
                shopItems.forEach((item) => {
                    for(let i = 0; i < Object.keys(sortObject).length; i++)
                    {
                        if(item.getAttribute('data-' + Object.keys(sortObject)[i]) == Object.values(sortObject)[i])
                            isFulfilled = true;
                        else
                            {
                                isFulfilled = false;
                                break;
                            }
                    }
                    if(isFulfilled == true)
                        item.style.display = '';
                    else
                        item.style.display = 'none';
                })
            }
        else
            {
                shopItems.forEach((item) => {
                    item.style.display = '';})
            }
    }
    const inputs = document.querySelectorAll('.collapsible-item input');
    inputs.forEach((input) => {
        input.addEventListener('change', (e) => {
            removeFilters.style.display = 'block';
            if(e.target.checked == true)
                {
                    let newType = e.target.parentElement.parentElement.parentElement.querySelector('.collapsible-trigger').innerHTML.replace('<i class="fa fa-caret-up" style="transform: rotate(180deg);"></i>', '').toLowerCase().replace(' ', '-');
                    let newData = e.target.name.toLowerCase();
                    sortObject[newType] = newData;
                    sortCheck();
                }
            else 
                {
                    let oldType = e.target.parentElement.parentElement.parentElement.querySelector('.collapsible-trigger').innerHTML.replace('<i class="fa fa-caret-up" style="transform: rotate(180deg);"></i>', '').toLowerCase().replace(' ', '-');
                    delete sortObject[oldType];
                    sortCheck();
                }
        });
    });

    removeFilters.addEventListener('click', () => {
        checkBoxes.forEach((item) => {
            item.checked = false;
        });
        sortObject = {};
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
    function addCart(product) {
        cartItem.name = product.querySelector('.product-name').innerHTML;
        cartItem.price = product.querySelector('.product-price').innerHTML;
        localStorage.setItem(key, JSON.stringify(cartItem));
        cartModify(key, cartItem.name, cartItem.price);
        key++;
        cartCount.innerHTML = key;
        wiggleAnimation();
        isCartCountOne();
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
    
    const products = document.querySelectorAll('.product');
    products.forEach(function(product) {
        product.querySelector('button').addEventListener('click', (e) => addCart(e.target.parentElement.parentElement))
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