'use strict'
{
    /* Products creation and JSON insertion from fetch */
    function createProducts(item) {
        /* Declare const for elements creation */
        const shopContainer = document.querySelector('#shop-container');
        const newProduct = document.createElement('div');
        newProduct.className = 'product';
        const newImg = document.createElement('img');
        newImg.setAttribute('src', `${item.image.src}`);
        newImg.setAttribute('alt', `${item.image.alt}`);
        newImg.setAttribute('draggable', 'false');
        const newProductInfo = document.createElement('div');
        newProductInfo.className = 'product-info';
        const newProductName = document.createElement('p');
        newProductName.className = 'product-name';
        const newProductPrice = document.createElement('p');
        newProductPrice.className = 'product-price';
        const newDescContainer = document.createElement('div');
        newDescContainer.className = 'desc-container';
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
    /* Checks wether user is using phone or pc, use touchstart/mousedown */
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const eventStart = isMobile ? 'touchstart' : 'mousedown';
    const eventMove = isMobile ? 'touchmove' : 'mousemove';
    const eventEnd = isMobile ? 'touchend' : 'mouseup';

    const containerHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--descContainerHeight').replace('px', ''));
    /* Checks if products need scrolls to be added or removed */
    function scrollCheck(products) {
        products.forEach((product) => {
            const newScrollPath = document.createElement('div');
            newScrollPath.className = 'scroll-path';
            const newScroll = document.createElement('div');
            newScroll.className = 'scroll';
            const productText = product.querySelector('.product-desc');
            const textHeight = Number(getComputedStyle(productText).height.replace('px', ''));
            const scroll = product.querySelector('.scroll');
            
            if(textHeight > containerHeight && scroll == null) {
                const productContainer = product.querySelector('.desc-container');
                productContainer.append(newScrollPath);
                newScrollPath.append(newScroll);
            } else
            if(textHeight < containerHeight && scroll) {
                scroll.remove();
            }
        });
    };
    /* Takes 'filters' object containing keys(title what to be sorted by) and values(exact product's attribute to sort by for) and creates sorting table on page */
    function createFilters(filters) {
        const filterContainer = document.querySelector('#shop-container-filter');
        const filtersNoDuplicates = {};
        /* Making array('filtersNoDuplicates') of possible choices to sort by without duplicates */
        for(const key in filters)
            filtersNoDuplicates[key] = noDuplicates(filters[key]);
        /* Loop for removing 'data-' from sort titles we got from JSON that's inserted in html before, and adds UpperCase for each word */
        for(const filter in filtersNoDuplicates) {
            const filterBy = beautyWords(filter);
            
            const collapsible = document.createElement('div');
            collapsible.className = 'collapsible';
            const collapsibleTrigger = document.createElement('span');
            collapsibleTrigger.className = 'collapsible-trigger';
            collapsibleTrigger.innerHTML = `${filterBy}`;
            const arrow = document.createElement('i');
            arrow.className = 'fa fa-caret-up';
            const collapsibleContent = document.createElement('div');
            collapsibleContent.className = 'collapsible-content';
            

            filterContainer.append(collapsible);
            collapsible.append(collapsibleTrigger);
            collapsibleTrigger.append(arrow);
            collapsible.append(collapsibleContent);

            filtersNoDuplicates[filter].forEach((item, i) => {
                const nameUpperCase = item[0].toUpperCase() + item.substring(1);

                const collapsibleItem = document.createElement('div');
                collapsibleItem.className = 'collapsible-item';
                const input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                input.setAttribute('id', `${filter + i}`);
                input.setAttribute('name', `${item}`);
                const label = document.createElement('label');
                label.setAttribute('for', `${filter + i}`);
                label.innerHTML = `${nameUpperCase}`;
                const availableSorts = document.createElement('div');
                availableSorts.className = 'available-sorts';
                /* WARNING: ADD METHOD FOR AVAILABLE-SORTS CHANGES */

                collapsibleContent.append(collapsibleItem);
                collapsibleItem.append(input);
                collapsibleItem.append(label);
                collapsibleItem.append(availableSorts);
            });
        }
    };
    /* Makes set out of an array so there are no repeated values then returns it as array. Also sort it out for better look. */
    function noDuplicates(arrayAttributes) {
        const setAttributes = new Set();

        arrayAttributes.forEach((attribute) => {
            setAttributes.add(attribute);
        });

        const arrayNoDuplicates = Array.from(setAttributes);

        arrayNoDuplicates.sort((a, b) => {
            const stringA = String(a);
            const stringB = String(b);

            return stringA.localeCompare(stringB, undefined, {
                numeric: true,
                sensitivity: 'base',
            });
        });
        return arrayNoDuplicates;
    };
    /* remove 'data-' that came from JSON which was inserted into HTML, adds UpperCases for each new word */
    function beautyWords(filterBy) {
        if(filterBy.length > 0) {
            filterBy = filterBy.replace(/data-/g, '');
            filterBy = filterBy[0].toUpperCase() + filterBy.slice(1);
            filterBy = filterBy.replace(/-/g, ' ');
            
            for(let n = 1; n < filterBy.length; n++) {
                if(filterBy[n] === ' ')
                    filterBy = filterBy.substring(0, n + 1) + filterBy[n + 1].toUpperCase() + filterBy.substring(n + 2);
            };
        }
        return filterBy;
    };
    /* Fetch request */
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
    /* Create products on page and return array of elements*/
    .then(data => {
        const elementsCreated = [];
        data.forEach((value, index, array) => {
            const element = createProducts(value);
            elementsCreated.push(element);
        });
        return [elementsCreated, data];
    })
    /* Add scroll on created products if necessary + functionality for scroll */
    .then(([products, data]) => {
        scrollCheck(products);
        products.forEach((product) => {
            const text = product.querySelector('.product-desc');
            let textHeight = Number(getComputedStyle(text).height.replace('px', ''));
            let heightDiff = containerHeight - textHeight;
            let scroll = product.querySelector('.scroll');
            const scrollHeight = getComputedStyle(document.documentElement).getPropertyValue('--scrollHeight').replace('px', '');
            const scrollPercent = 100 - (scrollHeight / containerHeight) * 100;
            let mouseDown = 0, mouseUp = 0, drag = 0, scrollDrag = 0;
            let recallText, recallTextInner, recallFunction;

            /* Event functions for scrolling */
            function moveScroll() {
                scrollDrag = (drag / heightDiff) * scrollPercent;
                if(scrollDrag <= 72.72)
                scroll.style.top = `${scrollDrag}%`;
            };
            function moveText() {
                if(drag <= 0 && drag >= heightDiff && scroll !== null)
                    text.style.transform = `translateY(${drag}px)`;
                if(drag > 0)
                    drag = 0;
                if(drag < heightDiff)
                    drag = heightDiff;
                moveScroll();
            };
            function eventStartHandler(e) {
                if(e.button == 0) {
                    mouseDown = 1;
                    mouseUp = 0;
                    clearTimeout(recallText);
                    clearTimeout(recallTextInner);
                }
            };
            function eventMoveHandler(e) {
                if(mouseDown == 1) {
                    drag = drag + e.movementY;
                    moveText();
                }
            };
            function eventEndHandler() {
                mouseDown = 0;
                mouseUp = 1;
                recallText = setTimeout(function recallFunction() {
                    recallTextInner = setTimeout(recallFunction, 80);
                    if(drag < 0) {
                        drag = drag + 1;
                        scrollDrag = scrollDrag + scrollPercent;
                        moveText();
                    }
                    else {
                        clearTimeout(recallTextInner);
                    }
                }, 3000);
            };

            /* Add event functions to product */
            product.addEventListener(eventStart, eventStartHandler);
            window.addEventListener(eventMove, eventMoveHandler);
            window.addEventListener(eventEnd, eventEndHandler);
            /* Checks for new text height, adds/removes scrolls */
            window.addEventListener('resize', (e) => {
                product.removeEventListener(eventStart, eventStartHandler);
                window.removeEventListener(eventMove, eventMoveHandler);
                window.removeEventListener(eventEnd, eventEndHandler);

                scrollCheck(products);
                scroll = product.querySelector('.scroll');
                textHeight = Number(getComputedStyle(text).height.replace('px', ''));
                heightDiff = containerHeight - textHeight;
                mouseDown = 0, mouseUp = 0, drag = 0, scrollDrag = 0;
                moveText();
                
                product.addEventListener(eventStart, eventStartHandler);
                window.addEventListener(eventMove, eventMoveHandler);
                window.addEventListener(eventEnd, eventEndHandler);
            });
            });
        return [products, data];
    })
    /* Add and create filters for products' attributes */
    .then(([products, data]) => {
        const filters = {};
        
        function addFilters(key, value) {
            if(filters.hasOwnProperty(key)) {
                if(!Array.isArray(filters[key])) {
                    filters[key] = [filters[key]];
                }
                filters[key].push(value);
            } else {
                filters[key] = [value];
            }
        };
        
        data.forEach((product) => {
            const attributes = product.attributes;
            const attributeEntries = Object.entries(attributes);

            attributeEntries.forEach((itemAttributes) => {
                const key = itemAttributes[0];
                const value = itemAttributes[1];
                addFilters(key, value);
            });
        });

        createFilters(filters);
        return [products, data];
    })
    /* Sort by price */
    .then(([products, data]) => {
        const productsOrder = [];
        products.forEach((product) => {
            productsOrder.push(product);
        });
        const sortPrice = document.querySelector('#sort');
        const shopContainer = document.querySelector('#shop-container');
        const removeFilters = document.querySelector('.remove-filters');
       
        const ACTIONS = {
            1: function descending(sortingArray) {
                sortingArray.sort((a, b) => {
                    a = parseFloat(a.querySelector('.product-price').innerHTML);
                    b = parseFloat(b.querySelector('.product-price').innerHTML);
                    return a - b;
                });
                sortingArray.forEach((product) => {
                    shopContainer.append(product);
                });
            },
            2: function ascending(sortingArray) {
                sortingArray.sort((a, b) => {
                    a = parseFloat(a.querySelector('.product-price').innerHTML);
                    b = parseFloat(b.querySelector('.product-price').innerHTML);
                    return b - a;
                });
                sortingArray.forEach((product) => {
                    shopContainer.append(product);
                });
            },
            3: function reset(sortingArray) {
                sortingArray.forEach((product) => {
                    shopContainer.append(product);
                });
                products = productsOrder;
            }
        };
    
        sortPrice.addEventListener('change', (e) => {
            const selectedIndex = e.target.selectedIndex;
            ACTIONS[selectedIndex](products);
        });
        removeFilters.addEventListener('click', () => {
            ACTIONS[3](productsOrder);
        });
        
        return [products, data];
    })
    /*  */
    .then(([products, data]) => {
        const collapsibles = document.querySelectorAll('.collapsible');
        console.log(collapsibles);
    })

    /* !!!FOR TOMORROW!!!: 
            -1. LINE 118
            -0. PASS CHECKBOXES TO NEXT '.THEN' AND MAKE <RESET> FUNCTION UNCHECK THEM ALL
            0. MAKE MULTIPLE PAGES OF PRODUCTS
            1. ADD INDICATOR HOW MANY POSSIBLE CHOICES THERE ARE FOR FILTERS > CHANGES ON EACH CHECK
            2. FIGURE PRODUCTS' BUY BUTTONS AND CART */
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