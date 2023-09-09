import React from 'react';
import {Outlet, Link} from 'react-router-dom';

export default function Navigation() {
return (
    <>
        <nav className='navi'>
            <ul>
                <li>
                    <Link to=''>Home</Link>
                </li>
                <li>
                    <Link to='blog'>Blogs</Link>
                </li>
                <li>
                    <Link to='contact'>Contact</Link>
                </li>
                <li>
                    <Link to='wrong'>Test</Link>
                </li>
            </ul>
        </nav>
        <Outlet />
    </>
)
}