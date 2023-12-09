'use strict'
/* Checks wether user is using phone or pc, use touchstart/mousedown */
const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const eventStart = isMobile ? 'touchstart' : 'mousedown';
const eventMove = isMobile ? 'touchmove' : 'mousemove';
const eventEnd = isMobile ? 'touchend' : 'mouseup';

/* Products creation and JSON insertion from fetch */
function createProducts(item) {
    const shopContainer = document.querySelector('#shop-container');
    /* Declare const for elements creation */
    const product = document.createElement('div');
    product.className = 'product';
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
        product.setAttribute(`${attribute}`, `${value}`);
    };
    newProductName.innerHTML = item.name;
    newProductPrice.innerHTML = item.price;
    newProductDesc.innerHTML = item.desc;

    /* Creation */
    product.append(newImg);
    newProductInfo.append(newProductName);
    newProductInfo.append(newProductPrice);
    product.append(newProductInfo);
    newDescContainer.append(newProductDesc);
    product.append(newDescContainer);
    newButtonContainer.append(newButton);
    product.append(newButtonContainer);
    shopContainer.append(product);

    return product;
};
/* HTML Element for removing filters, used later in both Price filter and Attributes filters */
const removeFilters = document.querySelector('.remove-filters');
function insertSorted(sortingArray) {
    const shopContainer = document.querySelector('#shop-container');

    sortingArray.forEach((product) => {
        shopContainer.append(product);
    })
}
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
function loadScript() {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', '../scripts/cart.js');

    document.body.append(script);
};

/* Fetch request */
const searchFor = document.querySelector('.nav-path + h2').innerHTML.toLowerCase();
const loadAndCreate = new Promise((resolve, reject) => {
    fetch('../JSON/products.json')
    .then(response => {
        if(!response.ok)
            reject('Network problem.');
        return response.json();
    })
    .then(data => resolve(data[searchFor]))
    .catch(error => console.log('Error: ' + error));
});

loadAndCreate
/* Creates PRODUCTS in certain pages */
.then(data => {
    const elements = [];
    data.forEach((value) => {            
        const element = createProducts(value);
        elements.push(element);
    });

    return [elements, data];
})
/* Add SCROLLS on created products + it's functionality */
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

        product.addEventListener(eventStart, eventStartHandler);
        window.addEventListener(eventMove, eventMoveHandler);
        window.addEventListener(eventEnd, eventEndHandler);
        /* Checks for new text height, adds/removes scrolls */
        window.addEventListener('resize', () => {
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
/* FILTERS
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
    const filtersContainer = document.querySelector('#shop-container-filter');
    
    /* Shrinking/Expanding content on clicks */        
    filtersContainer.style.display = 'block';
    for(let n = 0; n < collapsibleTriggers.length; n++) {
        const height = getComputedStyle(collapsibleContents[n]).height;
        collapsibleContents[n].style.height = '0px';
        const arrow = collapsibleTriggers[n].querySelector('.fa-caret-up');

        collapsibleTriggers[n].addEventListener('click', () => {
            if(getComputedStyle(collapsibleContents[n]).height == '0px') {
                collapsibleContents[n].style.height = height;
                arrow.style.transform = 'rotate(180deg)';
            }
            else {
                collapsibleContents[n].style.height = '0px';
                arrow.style.transform = 'rotate(0deg)';
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
/* SORT by PRICE, RESET button */
.then(([products, data]) => {
    const productsOrder = [];
    products.forEach((product) => {
        productsOrder.push(product);
    });

    const sortPrice = document.querySelector('#sort');
    
    const ACTIONS = {
        1: function descending() {
            products.sort((a, b) => {
                a = parseFloat(a.querySelector('.product-price').innerHTML);
                b = parseFloat(b.querySelector('.product-price').innerHTML);
                return b - a;
            });
            insertSorted(products);
        },
        2: function ascending() {
            products.sort((a, b) => {
                a = parseFloat(a.querySelector('.product-price').innerHTML);
                b = parseFloat(b.querySelector('.product-price').innerHTML);
                return a - b;
            });
            insertSorted(products);
        },
        3: function reset() {
            insertSorted(productsOrder);            
        }
    };

    sortPrice.addEventListener('change', (e) => {
        const selectedIndex = e.target.selectedIndex;
        ACTIONS[selectedIndex](products);
        removeFilters.style.display = 'inline';
    });
    removeFilters.addEventListener('click', () => {
        ACTIONS[3]();
        removeFilters.style.display = '';
        sortPrice.selectedIndex = 0;
    });
    
    return [products, data];
})
/* Buy buttons and cart */
.then(([products, data]) => {
    loadScript();
    products.forEach((product) => {
        const button = product.querySelector('button');
        button.addEventListener('click', (e) => {
            addCart(TYPES.productShop, e.target.parentElement.parentElement);
        })
    })
})

/* Filter container TOGGLE show/hide */
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