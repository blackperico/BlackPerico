'use strict'
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
/* Search box */
{
    const displayAt = document.querySelector('#search').parentElement;
    const searchBox = document.querySelector('#search');
    let serverResponse;
    let answerBlock = [], container;

    searchBox.addEventListener('focus', (e) => {
        if(e.target.value == 'Search...')
            e.target.value = '';
    });
    searchBox.addEventListener('blur', (e) => {
        if(e.target.value == '')
            e.target.value = 'Search...';
    });
    searchBox.addEventListener('input', function(e) {
        let searchValue = e.target.value.trim();
        const searchFor = {
            title: 'title',
            name: 'name'
        };
    
        if(answerBlock.length > 0) {
            answerBlock.forEach((block) => {
                block.remove();
            });
            answerBlock = [];
        }
        if(searchValue.length > 1)
        for (const key in serverResponse) {
            const category = serverResponse[key];
            for (const product of category) {
                if(product.title) {
                    const title = product.title;
                    if((title.toLowerCase()).includes(searchValue.toLowerCase()) && answerBlock.length < 5) {
                        answerBlock.push(outputSearch(product, searchFor.title));
                    }
                } else
                if(product.name) {
                    const name = product.name;
                    if((name.toLowerCase()).includes(searchValue.toLowerCase()) && answerBlock.length < 5) {
                        answerBlock.push(outputSearch(product, searchFor.name));
                    }
                }
            }
        }
    });
    function outputSearch(product, searchFor) {
        const searchResponse = document.createElement('div');
        searchResponse.className = 'search-response';
        const img = document.createElement('img');
        img.setAttribute('src', `${product.image.src}`);
        img.setAttribute('alt', `${product.image.alt}`);
        img.setAttribute('draggable', 'false');
        searchResponse.append(img);
        const name = document.createElement('span');
        name.className = 'search-name';
        name.innerHTML = product[searchFor];
        searchResponse.append(name);
        const price = document.createElement('span');
        price.className = 'search-price';
        if(product.price)
            price.innerHTML = product.price;
        else
            price.innerHTML = product.attributes.price;
        searchResponse.append(price);

        if(!container) {
            container = createContainer();
            container.append(searchResponse);
        } else {
            container.append(searchResponse);
        }
        return searchResponse;
    };
    function createContainer() {
        const newContainer = document.createElement('div');
        newContainer.className = 'search-container';
        displayAt.prepend(newContainer);

        return newContainer;
    };

    const request = new Promise((resolve, reject) => {
        fetch("../JSON/products.json")
        .then((response) => {
            if(!response.ok) {
                reject('Network problem: ' );
            } else 
            return response.json();
        })
        .then(data => resolve(data))
        .catch(error => console.log('Error: ' + error))
    });
    request
    .then((data) => {
        serverResponse = data;
    })
}