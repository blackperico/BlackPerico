'use strict'
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
        if(xmlhttp.status == 200) {
            const items = JSON.parse(this.response).adsContainer;
            items.forEach((image, index) => {
                createDots(index);
                images.push(image.attributes);
            });
            main();
        }
        else
        alert('Ads load Error: ' + xmlhttp.status);
    };
    xmlhttp.open('GET', 'https://blackperico.github.io/BlackPerico/JSON/products.json', true);
    xmlhttp.send();

    function main() {
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
    };
}

let promise1, promise2;
const fetchJSON =  new Promise((resolve, reject) => {
    fetch('https://blackperico.github.io/BlackPerico/JSON/products.json')
    .then(response => {
        if(!response.ok) {
            reject('Network problem trying to load products.json.');
        }
        return response.json();
    })
    .then(data => {
        resolve(data);
    })
    .catch(error => {
        reject(error);
    })
});
/* GAMES SIDE ELEMENTS */
const gamesLeft = document.querySelector('#games-left');
const gamesRight = document.querySelector('#games-right');

function createSideElementGames(index, game) {
    const sideElement = document.createElement('div');
    sideElement.className = 'side-element';
    const title = document.createElement('p');
    title.classList.add('side-element-title');
    const wrap = document.createElement('div');
    wrap.classList.add('side-element-wrap');
    const developer = document.createElement('p');
    developer.classList.add('side-element-developer');
    const genre = document.createElement('p');
    genre.classList.add('side-element-tags');
    const date = document.createElement('p');
    date.classList.add('side-element-release-date');
    const image = document.createElement('img');

    sideElement.setAttribute('data-id', `${index}`);
    sideElement.setAttribute('data-price', `${game.attributes.price}`);
    sideElement.setAttribute('data-text', `${game.attributes.text}`);
    title.innerText = game.title;
    developer.innerText = game.developers;
    genre.innerText = game.genre;
    date.innerText = game.date;
    image.setAttribute('src', `${game.image.src}`);
    image.setAttribute('draggable', 'false');
    image.setAttribute('alt', `${game.image.alt}`);

    const gamesTop = document.querySelector('#games-top');
    const gamesTopWrap = document.querySelector('#games-top-wrap');
    
    if(getComputedStyle(gamesTop).display == 'block')
        gamesTopWrap.append(sideElement);
    else
    if(getComputedStyle(gamesTop).display == 'none' && index < 4)
        gamesLeft.append(sideElement);
        else
        gamesRight.append(sideElement);

    sideElement.append(title);
    sideElement.append(wrap);
    wrap.append(developer);
    wrap.append(genre);
    wrap.append(date);
    sideElement.append(image);
    
    return sideElement;
};
 
promise1 = fetchJSON
/* Create and insert side elements */
.then(({gamesContainer}) => {
    const sideElements = [];
    for(const index in gamesContainer)
        sideElements.push(createSideElementGames(index, gamesContainer[index]));
    return sideElements;
})
/* Title scroll on hover */
.then((sideElements) => {
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

    return sideElements;
})
/* Looping through elements */
.then((sideElements) => {
    const timerLoop = getComputedStyle(document.documentElement).getPropertyValue('--sideElementLoopTimer').replace('ms', '');
    const timerSelect = getComputedStyle(document.documentElement).getPropertyValue('--sideElementSelectTimer').replace('ms', '');
    const gamesMiddle = document.querySelector('#games-middle'), gamesMiddleImg = gamesMiddle.querySelector('img'), gamesMiddleTitle = gamesMiddle.querySelector('.cat-title'), gamesMiddlePrice = gamesMiddle.querySelector('.cat-price'), gamesMiddleText = gamesMiddle.querySelector('.cat-text');
    const animationContainer = document.querySelector('#animation-container');
    
    let loopThrough, sideElementId = 0;
    let info = {
        src: undefined,
        title: undefined,
        price: undefined,
        text: undefined,
    };

    function gamesMiddleAnimation() {
        gamesMiddleText.className = 'cat-text';
        gamesMiddlePrice.className = 'cat-price';
        animationContainer.className = '';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                animationContainer.classList.add('games-middle-animation');
                gamesMiddleText.classList.add('games-middle-children-animation');
                gamesMiddlePrice.classList.add('games-middle-children-animation');
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
    function modifyGamesMiddle (info) {
        gamesMiddleAnimation()
        gamesMiddleImg.src = info.src;
        gamesMiddleTitle.innerHTML = info.title;
        gamesMiddlePrice.innerHTML = info.price;
        gamesMiddleText.innerHTML = info.text;
    };
    function collectInfo() {
        info = {
            src: sideElements[sideElementId].querySelector('img').src,
            title: sideElements[sideElementId].querySelector('.side-element-title').innerHTML,
            price: sideElements[sideElementId].getAttribute('data-price').replace('', '&euro;'),
            text: sideElements[sideElementId].getAttribute('data-text'),
        };
        modifyGamesMiddle(info);
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

    return sideElements;
})
/* Responsiveness gamesContainer */
.then((sideElements) => {
    const sides = document.querySelectorAll('.games-side'), gamesTop = document.querySelector('#games-top'), gamesTopWrap = document.querySelector('#games-top-wrap');
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
})

/* CATEGORY ELEMENTS */
function createCategoryItem(index, product) {
    const upper = document.querySelector('#category-upper');
    const lower = document.querySelector('#category-lower');

    const newItem = document.createElement('div');
    newItem.className = 'category-item';
    newItem.setAttribute('data-price', `${product.price}`);
    const image = document.createElement('img');
    image.setAttribute('src', `${product.image.src}`);
    image.setAttribute('alt', `${product.image.alt}`);
    image.setAttribute('draggable', 'false');
    const specs = document.createElement('div');
    specs.className = 'specs';
    const title = document.createElement('p');
    title.className = 'specs-title';
    title.innerHTML = `${product.title}`;
    const specsDesc = document.createElement('ul');
    specsDesc.className = 'specs-desc';
    const button = document.createElement('button');
    button.className = 'buy-button';
    button.innerHTML = 'Buy';
    
    if(index < 4)
        upper.append(newItem);
    else
        lower.append(newItem)

    newItem.append(image);
    newItem.append(specs);
    specs.append(title);
    specs.append(specsDesc);
    specs.append(button);
    for(let desc of product.desc) {
        const descLi = document.createElement('li');
        descLi.innerHTML = desc;
        specsDesc.append(descLi);
    }
};

promise2 = fetchJSON
/* Create and insert Category elements */
.then(({category}) => {
    for(const index in category)
        createCategoryItem(index, category[index]);
})
/* Title scroll on hover */
.then(() => {
    const specs = category.querySelector('.specs');
    const specsWidth = (+getComputedStyle(specs).width.replace('px', '')), specsTitles = category.querySelectorAll('.specs-title');
    let specsTitleWidth = [];

    for(let i = 0; i < specsTitles.length; i++) {
        let enterRecall, leaveRecall, stopSlide = 0, leaveRecallDelay, n = 0;
        specsTitleWidth[i] = (+getComputedStyle(specsTitles[i]).width.replace('px', ''));

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
})
/* Shrink/Expand element on click */
.then(() => {
    const upper = Array.from(document.querySelector('#category-upper').children), lower = Array.from(document.querySelector('#category-lower').children);
    const categoryArray = upper.concat(lower);

    function shrink(element) {
        element.querySelector('.specs').style.height = '35px';
        element.querySelector('.specs').style.borderTopLeftRadius = '0px';
        element.querySelector('.specs').style.borderTopRightRadius = '0px';
        element.querySelector('img').style.filter = 'blur(0px)';
    };
    function expand(element) {
        element.querySelector('.specs').style.height = '100%';
        element.querySelector('.specs').style.borderRadius = '5px';
        element.querySelector('img').style.filter = 'blur(5px)';
    };

    for (let i = 0; i < categoryArray.length; i++) {
        categoryArray[i].querySelector('.specs').addEventListener('click', function() {
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
})
/* Container dragging for responsiveness */
.then(() => {
    const category = document.querySelector('#category'), upper = document.querySelector('#category-upper'), lower = document.querySelector('#category-lower');
    let categoryWidth = Number(getComputedStyle(category).width.replace('px', '')), upperWidth = Number(getComputedStyle(upper).width.replace('px', ''));
    let isClicked, drag = 0;

    category.addEventListener('mousedown', () => {
        isClicked = 1;
    });
    window.addEventListener('mouseup', () => {
        isClicked = 0;
    });
    window.addEventListener('mousemove', (e) => {
        if(isClicked == 1)
        {
            upper.style.transform = `translateX(${drag}px)`;
            lower.style.transform = `translateX(${drag}px)`;
            drag = drag + e.movementX;
            if(drag > 0)
                drag = 0;
            if(drag < (categoryWidth - upperWidth))
                drag = (categoryWidth - upperWidth);
        }
    });
    window.addEventListener('resize', () => {
        if(drag <= (categoryWidth - upperWidth))
        {
            drag = categoryWidth - upperWidth;
            upper.style.transform = `translateX(${drag}px)`;
            lower.style.transform = `translateX(${drag}px)`;
        }
        if(drag == 1)
            drag = 0;
        categoryWidth = Number(getComputedStyle(category).width.replace('px', ''));
        upperWidth = Number(getComputedStyle(upper).width.replace('px', ''));
    });
})

function loadScript() {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', './scripts/cart.js');

    document.body.append(script);
}

Promise.all([promise1, promise2])
/* Loads script */
.then(() => {
    loadScript();
})
/* EventListener for buy buttons and cart.js functions */
.then(() => {
    const gamesMiddle = document.querySelector('#games-middle');
    const gamesBuy = gamesMiddle.querySelector('.buy-button');
    gamesBuy.addEventListener('click', () => {
        addCart(TYPES.gamesIndex);
    });

    const category = document.querySelector('#category');
    const categoryBuy = category.querySelectorAll('.buy-button');
    categoryBuy.forEach((button) => {
        button.addEventListener('click', (e) => {
            addCart(TYPES.categoryIndex, e.target.parentElement.parentElement);
        });
    });
})

/*function loadScript(src) {
    return new Promise(function(resolve, reject) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;

        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error('Error'));

        document.body.append(script);
    });
};
/*loadScript('../scripts/test.js')
    .then(script => {
        return loadScript('../scripts/test2.js');
    })
    .then((script) => {
        testFunction();
        newFunction();
    })
let yo = fetch('../JSON/products.json');
yo.then(response => response.json())
.then(({category}) => console.log(category))*/
/*loadScript('../scripts/test.js')
.then(script => loadScript('../scripts/test2.js'))
.then(script => {
    return new Promise(function (resolve, reject) {
        setTimeout(() => resolve(console.log(n)), 1000)
})})
.then(function(script) {
    setTimeout(() => console.log(elementz), 1000)
})
.catch((error) => {
    console.log(error);
})

Promise.any([
    new Promise((resolve, reject) => {
        setTimeout(() => {resolve(1)}, 1000);
    }),
    new Promise((resolve, reject) => {
        setTimeout(() => {resolve(2)}, 2000);
    }),
    new Promise((resolve, reject) => {
        setTimeout(() => {resolve(3)}, 3000);
    }),
])
.then((yo) => {
    console.log(yo);
})
.catch((error) => console.log('Error: ' + error));

async function f(n) {
    console.log(n);
};
setTimeout(() => {f(7)}, 1000);
/*const niz = ['../JSON/products.json','../JSON/products.json','../JSON/products.json'];
let requests = niz.map(item => fetch(item));
Promise.all(requests)
.then((test) => {
    console.log(test);
})*/

/*
const prom = new Promise(function(resolve, reject) {
    setTimeout(() => reject(new Error('Whoops!')), 1000);
});
prom.then(
    function(result) {console.log(result)},
    function(error) {console.log(error)}
);
prom.finally(console.log('Finally!'));*/

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