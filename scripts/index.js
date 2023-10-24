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
    const ad = document.querySelector('#ad'), currentImage = document.querySelector('#current-image'), previousImage = document.querySelector('#previous-image');
    const selectTimer = 10000, loopTimer = 3000;
    let images = [], loopThrough;

    function createDots(index) {
        const newDot = document.createElement('div');
        newDot.className = 'dots';
        newDot.setAttribute('data-id', `${index}`);
        if(index == 0)
            newDot.setAttribute('style', 'background-color: #000;');

        ad.appendChild(newDot);
    };

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const imagesObject = JSON.parse(this.response).adsContainer;
        imagesObject.forEach((image, index) => {
            createDots(index);
            images.push(image.attributes);
        });
    };
    xmlhttp.open('GET', '../products.json', false);
    xmlhttp.send();

    currentImage.setAttribute('src', images[0].src);
    currentImage.setAttribute('alt', images[0].alt);
    previousImage.setAttribute('src', images[0].src);
    previousImage.setAttribute('alt', images[0].alt);

    const dots = document.querySelectorAll('.dots');
    let selectedDot = document.querySelector('.dots').getAttribute('data-id');

    function fadeOutPrevious() {
        previousImage.setAttribute('src', document.querySelector('#current-image').getAttribute('src'));
        previousImage.setAttribute('alt', document.querySelector('#current-image').getAttribute('alt'));
        previousImage.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                previousImage.classList.add('image-fade-out-right');
            });
        });
    };
    function slideInPrevious(id) {
        currentImage.setAttribute('src', images[`${id}`].src);
        currentImage.setAttribute('alt', images[`${id}`].alt);
        currentImage.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                currentImage.classList.add('image-slide-in-right');
            });
        });
    };
    function fadeOutNext() {
        previousImage.setAttribute('src', document.querySelector('#current-image').getAttribute('src'));
        previousImage.setAttribute('alt', document.querySelector('#current-image').getAttribute('alt'));
        previousImage.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                previousImage.classList.add('image-fade-out-left');
            });
        });
    };
    function slideInNext(id) {
        currentImage.setAttribute('src', images[`${id}`].src);
        currentImage.setAttribute('alt', images[`${id}`].alt);
        currentImage.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                currentImage.classList.add('image-slide-in-left');
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
                loopThrough = setTimeout(dotsIteration, selectTimer);
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
        loopThrough = setTimeout(dotsIteration, loopTimer);
    };
    loopThrough = setTimeout(dotsIteration, loopTimer);
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
/* Side elements JSON insertion */
{
    const catLeft = document.querySelector('#cat-left');
    const catRight = document.querySelector('#cat-right');

    function createSideElementGames(index, game) {
        const newSideElement = document.createElement('div');
        newSideElement.className = 'side-element';
        const newTitle = document.createElement('p');
        newTitle.classList.add('side-element-title');
        const newWrap = document.createElement('div');
        newWrap.classList.add('side-element-wrap');
        const newDeveloper = document.createElement('p');
        newDeveloper.classList.add('side-element-developer');
        const newGenre = document.createElement('p');
        newGenre.classList.add('side-element-tags');
        const newDate = document.createElement('p');
        newDate.classList.add('side-element-release-date');
        const newImg = document.createElement('img');

        newSideElement.setAttribute('data-id', `${index}`);
        newSideElement.setAttribute('data-price', `${game.attributes.price}`);
        newSideElement.setAttribute('data-text', `${game.attributes.text}`);
        newTitle.innerText = game.title;
        newDeveloper.innerText = game.developers;
        newGenre.innerText = game.genre;
        newDate.innerText = game.date;
        newImg.setAttribute('src', `${game.image.src}`);
        newImg.setAttribute('draggable', 'false');
        newImg.setAttribute('alt', `${game.image.alt}`);

        const gamesTop = document.querySelector('#games-top');
        const gamesTopWrap = document.querySelector('#games-top-wrap');
        
        if(getComputedStyle(gamesTop).display == 'block')
            gamesTopWrap.append(newSideElement);
        else
        if(getComputedStyle(gamesTop).display == 'none' && index < 4)
            catLeft.append(newSideElement);
            else
            catRight.append(newSideElement);

        newSideElement.append(newTitle);
        newSideElement.append(newWrap);
        newWrap.append(newDeveloper);
        newWrap.append(newGenre);
        newWrap.append(newDate);
        newSideElement.append(newImg);
    };
    function insertJSONGames() {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
            const gamesInsert = JSON.parse(this.response).gamesContainer;
            for(let index in gamesInsert)
                createSideElementGames(index, gamesInsert[index]);
        };
        xmlhttp.open("GET", "../products.json", false);
        xmlhttp.send();
    };

    insertJSONGames();
}
/* Responsiveness gamesContainer */
{
    const sides = document.querySelectorAll('.cat-side'), gamesTop = document.querySelector('#games-top'), gamesTopWrap = document.querySelector('#games-top-wrap'), sideElements = document.querySelectorAll('.side-element');
    let gamesTopWidth = Number(getComputedStyle(gamesTop).width.replace('px', '')), gamesTopWrapWidth = gamesTopWrap.clientWidth, isClicked, drag = 0;
   
    gamesTop.addEventListener('mousedown', () => {
        isClicked = 1;
    });
    window.addEventListener('mouseup', () => {
        isClicked = 0;
    });
    window.addEventListener('mousemove', (e) => {
        if(isClicked == 1)
        {
            gamesTopWrap.style.transform = `translateX(${drag}px)`;
            drag = drag + e.movementX;
            if(drag > 0)
                drag = 0;
            if(drag < -(gamesTopWrapWidth - gamesTopWidth))
                drag = -(gamesTopWrapWidth - gamesTopWidth);
        }
    });

    window.addEventListener('resize', (e) => {
        drag = 0;
        gamesTopWidth = gamesTop.clientWidth;
        gamesTopWrapWidth = gamesTopWrap.clientWidth;
        gamesTopWrap.style.transform = `translateX(${drag}px)`;

        if(getComputedStyle(gamesTop).display == 'block')
            {
                if(gamesTopWrap.children.length < 8)
                    sideElements.forEach((sideElement) => {
                        gamesTopWrap.append(sideElement);
                    });
            }
            else
            {
                if(sides[0].children.length < 4)
                for(let i = 0; i < 4; i++) {
                    sides[0].append(sideElements[i]);
                }
                if(sides[1].children.length < 4)
                for(let i = 4; i < 8; i++) {
                    sides[1].append(sideElements[i]);
                }
            }
    });
}
/* Side elements and middle element */
{
    const sideElements = document.querySelectorAll('.side-element');
    /* Title scroll */
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
            titleTimeOut = setTimeout(mouseOverSideElement, 15);
            if(increment <= (sideElementTitleOffset))
                clearTimeout(titleTimeOut);
            };
        let mouseLeaveSideElement = function() {
            clearTimeout(titleTimeOut);
            sideElementTitle.style.transform = `translateX(${increment}px)`;
            increment++;
            titleTimeOut = setTimeout(mouseLeaveSideElement, 15);
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

    const timerLoop = getComputedStyle(document.documentElement).getPropertyValue('--sideElementLoopTimer').replace('ms', '');
    const timerSelect = getComputedStyle(document.documentElement).getPropertyValue('--sideElementSelectTimer').replace('ms', '');
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
            });
        });
    };
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
}
/* Category elements */
{
    function createCategoryItem(item, index) {
        const upper = document.querySelector('#category-upper');
        const lower = document.querySelector('#category-lower');

        const newItem = document.createElement('div');
        newItem.className = 'category-item';
        newItem.setAttribute('price', `${item.price}`);
        const newImg = document.createElement('img');
        newImg.setAttribute('src', `${item.image.src}`);
        newImg.setAttribute('alt', `${item.image.alt}`);
        newImg.setAttribute('draggable', 'false');
        const newSpecs = document.createElement('div');
        newSpecs.className = 'specs';
        const newTitle = document.createElement('p');
        newTitle.className = 'specs-title';
        newTitle.innerHTML = `${item.title}`;
        const newSpecsDesc = document.createElement('ul');
        newSpecsDesc.className = 'specs-desc';
        
        if(index < 4)
            upper.append(newItem);
        else
            lower.append(newItem)

        newItem.append(newImg);
        newItem.append(newSpecs);
        newSpecs.append(newTitle);
        newSpecs.append(newSpecsDesc);
        for(let desc of item.desc) {
            const descLi = document.createElement('li');
            descLi.innerHTML = desc;
            newSpecsDesc.append(descLi);
        }
            
    };

    const myPromise = new Promise((resolve, reject) => {
        fetch('../products.json')
            .then(response => {
                if(!response.ok) {
                    reject('Network problem.');
                }
                return  response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            })
    });
    myPromise
    .then(result => {
        result.category.forEach((item, index) => {
            createCategoryItem(item, index)
        });

        const upper = Array.from(document.querySelector('#category-upper').children), lower = Array.from(document.querySelector('#category-lower').children), categoryArray = upper.concat(lower);
        const category = document.querySelector('#category');
        const specs = category.querySelector('.specs'), specsWidth = (+getComputedStyle(specs).width.replace('px', '')), specsTitles = category.querySelectorAll('.specs-title');
        let specsTitleWidth = [];
        
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
    })
    .catch(error => {
        console.error('Error', error);
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