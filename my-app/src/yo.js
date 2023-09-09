import ReactDOM from 'react-dom/client';
import React from 'react';
import css from './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './pages/navigation';
import Home from './pages/home';
import Blog from './pages/blog';
import Contact from './pages/contact';
import NoPage from './pages/noPage';
function App() {
    
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route path='a' element={<Navigation />}>
                    <Route index element={<Home />} />
                    <Route path='blog' element={<Blog />} />
                    <Route path='contact' element={<Contact />} />
                    <Route path='*' element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
        <h1>Hello</h1>
        </>
    );
}

ReactDOM.createRoot(document.querySelector('#target')).render(<App />);