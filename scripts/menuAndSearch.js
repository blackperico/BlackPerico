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