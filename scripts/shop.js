'use strict'

/* Checks wether user is using phone or pc, use touchstart/mousedown */
const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const eventStart = isMobile ? 'touchstart' : 'mousedown';
const eventMove = isMobile ? 'touchmove' : 'mousemove';
const eventEnd = isMobile ? 'touchend' : 'mouseup';

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
/* HTML Element for removing filters, used later in both Price filter and Attributes filters */
const removeFilters = document.querySelector('.remove-filters');
/* Height for products' desc containers */
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
            const possibleSorts = document.createElement('div');
            possibleSorts.className = 'possible-sorts';

            collapsibleContent.append(collapsibleItem);
            collapsibleItem.append(input);
            collapsibleItem.append(label);
            collapsibleItem.append(possibleSorts);
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
function removeNumber(word) {
    return word.replace(/\d+$/, '');
};
function sort(products, filters) {
    const filtersEntries = Object.entries(filters);

    if(filtersEntries.length === 0) {
        products.forEach((product) => {
            product.style.display = 'block';
        });
    }
    else {
        products.forEach((product) => {
            for(let n = 0; n < filtersEntries.length; n++) {
                if(product.getAttribute(filtersEntries[n][0]) === filtersEntries[n][1]) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                    return;
                }
            }
        })
    }
    updatePossibleSorts(products);
};
function updatePossibleSorts(products) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach((checkbox) => {
        const possibleSort = checkbox.parentElement.querySelector('.possible-sorts');
        const collapsibleItem = checkbox.parentElement;
        let num = 0;

        products.forEach((product) => {
            if(getComputedStyle(product).display == 'block') {
                if(product.getAttribute(removeNumber(checkbox.id)) === checkbox.name) {
                    num++;
                }
            }
            possibleSort.innerHTML = `(${num})`;
        })
        if(num == 0) {
            checkbox.disabled = true;
            collapsibleItem.style.color = 'rgb(180, 180, 180)';
        } else {
            checkbox.disabled = false;
            collapsibleItem.style.color = '';
        }
    });
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
    data.forEach((value) => {
        const element = createProducts(value);
        elementsCreated.push(element);
    });
    return [elementsCreated, data];
})
/* Add scrolls on created products + it's functionality */
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
        let recallText, recallTextInner;

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
/* Checks each product for it's attributes, of those attributes CREATES FILTERS
    + Shrinking/Expanding filter's content on click
    + Checkboxes, only 1 of a group can be selected, onchange it calls sort() */
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
    /* filtersContainer's picked and display style twice changed for smaller screens so it wouldn't be 'none' so we can pick up heights for items */
    const collapsibleContents = document.querySelectorAll('.collapsible-content');
    const collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
    const arrows = document.querySelectorAll('.fa-caret-up');
    const filtersContainer = document.querySelector('#shop-container-filter');

    /* Shrinking/Expanding content on clicks */        
    filtersContainer.style.display = 'block';
    for(let n = 0; n < collapsibleTriggers.length; n++) {
        const height = getComputedStyle(collapsibleContents[n]).height;
        collapsibleContents[n].style.height = '0px';

        collapsibleTriggers[n].addEventListener('click', () => {
            if(getComputedStyle(collapsibleContents[n]).height == '0px') {
                collapsibleContents[n].style.height = height;
                arrows[n].style.transform = 'rotate(180deg)';
            }
            else {
                collapsibleContents[n].style.height = '0px';
                arrows[n].style.transform = 'rotate(0deg)';
            }
        });
    };
    filtersContainer.style.display = '';

    /* Can select only 1 checkbox in group(collapsibleContents)
        On checkbox change sort() is called and filter is passed */
    function anyCheck() {
        const allChecks = document.querySelectorAll('input[type="checkbox"]');
        const isChecked = Array.from(allChecks).some(checkbox => checkbox.checked);
        return isChecked;
    };
    let sendFilter = {};
    collapsibleContents.forEach((group) => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', (e) => {
                if(e.target.checked) {
                    checkboxes.forEach((checkbox) => {
                        if(checkbox !== e.target && checkbox.checked === true) {
                            checkbox.checked = false;
                            delete sendFilter[removeNumber(checkbox.id)];
                        }
                    });
                    sendFilter[removeNumber(e.target.id)] = e.target.name;
                }
                else {
                    delete sendFilter[removeNumber(e.target.id)];
                }
                sort(products, sendFilter);
                if(anyCheck() == false && document.querySelector('#sort').selectedIndex == 0)
                    removeFilters.style.display = 'none';
                else if(anyCheck() == true) {
                    removeFilters.style.display = 'inline';
                }
            });
        });
    });
    /* When removeFilters HTML element is clicked  */
    removeFilters.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
        sendFilter = {};
        sort(products, sendFilter);
    });
    /* Show number of products that satisfy  */
    updatePossibleSorts(products);
    return [products, data];
})
/* Sort by price, RESET button for filters */
.then(([products, data]) => {
    const productsOrder = [];
    products.forEach((product) => {
        productsOrder.push(product);
    });
    const sortPrice = document.querySelector('#sort');
    const shopContainer = document.querySelector('#shop-container');
    
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
        }
    };

    sortPrice.addEventListener('change', (e) => {
        const selectedIndex = e.target.selectedIndex;
        ACTIONS[selectedIndex](products);
        removeFilters.style.display = 'inline';
    });
    removeFilters.addEventListener('click', () => {
        ACTIONS[3](productsOrder);
        removeFilters.style.display = '';
        sortPrice.selectedIndex = 0;
    });
    
    return [products, data];
})
/* Buy buttons and cart */
.then(([products, data]) => {
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
            cart.style.borderBottomLeftRadius = '23px';
        }
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

products.forEach(function(product) {
    product.querySelector('button').addEventListener('click', (e) => addCart(e.target.parentElement.parentElement))
});
})

/* Filter container toggle show/hide */
{
    const filterContainer = document.querySelector('#shop-container-filter');
    const openFilters = document.querySelector('#filter-container'), closeFilters = document.querySelector('.fa-xmark');
    const overlay = document.querySelector('#overlay');
    
    function removeFilters() {
        filterContainer.style.display = '';
        overlay.style.display = '';
    };
    openFilters.addEventListener('click', () => {
        if(getComputedStyle(filterContainer).display == 'none') {
            filterContainer.style.display = 'block';
            overlay.style.display = 'block';
        }
    });
    closeFilters.addEventListener('click', removeFilters);
    overlay.addEventListener('click', removeFilters);
}
/* !!!FOR TOMORROW!!!: 
            0. MAKE MULTIPLE PAGES OF PRODUCTS
            1. FIGURE PRODUCTS' BUY BUTTONS AND CART */