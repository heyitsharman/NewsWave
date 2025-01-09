import React, { useEffect, useState } from 'react';
import './News.css';
import noImg from '../assets/images/no-img.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import Weather from './Weather'
import NewsModal from './NewsModal'
import BookMarks from './BookMarks'
import CalenderWIdget from './CalenderWIdget';
const categories = [
    'general',
    'world',
    'business',
    'technology',
    'entertainment',
    'sports',
    'science',
    'health',
    'nation',
];

const News = () => {
    const [headline, setHeadline] = useState(null);
    const [news, setNews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState(null) 
    const [bookmarks,setBookmarks] = useState([])
    const [showBookmarks, setShowBookmarks]=useState(false)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiKey = 'aa411c35ab3c49fd85d7343fe19b7474'; // Replace with your NewsAPI key
                let url = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&country=us&apiKey=${apiKey}`;

                // If a search query exists, use the search endpoint
                if (isSearching && searchQuery) {
                    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
                        searchQuery
                    )}&language=en&apiKey=${apiKey}`;
                }

                const response = await axios.get(url);
                const fetchedNews = response.data.articles;

                // Fallback for articles without images
                fetchedNews.forEach((article) => {
                    if (!article.urlToImage) {
                        article.urlToImage = noImg;
                    }
                });

                setHeadline(fetchedNews[0] || null);
                setNews(fetchedNews.slice(1, 7)); // Get the next 6 articles

                const SavedBookmark = JSON.parse(localStorage.getItem("bookmarks")) || []
                setBookmarks(SavedBookmark)
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, [selectedCategory, searchQuery, isSearching]);

    const handleCategoryClick = (e, category) => {
        e.preventDefault();
        setIsSearching(false); // Reset searching state
        setSelectedCategory(category);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
    };

    const handelArticleClick = ((article)=>{
        setSelectedArticle(article);
        setShowModal(true);
    })

    const handelBookmarkClick = ((article)=>{
        setBookmarks((prevBookmarks)=>{
            const updatedBookmarks = prevBookmarks.find((bookmark)=> bookmark.title === article.title) ?
            prevBookmarks.filter((bookmark)=> bookmark.title !== article.title) : [...prevBookmarks, article]
            localStorage.setItem("bookmarks",JSON.stringify(updatedBookmarks))
            return updatedBookmarks
        })
    })

    return (
        <div className="news">
            <header className="news-header">
                <h1 className="logo">News Wave</h1>
                <div className="search-bar">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search news"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
                </div>
            </header>
            <div className="news-content">
                <div className="navbar">
                    
                    <nav className="categories">
                        <h1 className="nav-heading">Categories</h1>
                        <div className="nav-links">
                            {categories.map((category) => (
                                <a
                                    href="#"
                                    key={category}
                                    className="nav-link"
                                    onClick={(e) => handleCategoryClick(e, category)}
                                >
                                    {category}
                                </a>
                            ))}
                            <a href="#" className="nav-link" onClick={()=>{setShowBookmarks(true)}}>
                                Bookmarks <i className="fa-solid fa-bookmark"></i>
                            </a>
                        </div>
                    </nav>
                </div>
                <div className="news-section">
                    {headline && (
                        <div className="headline" onClick={()=>
                            handelArticleClick(headline)
                        }>
                            <img src={headline.urlToImage} alt={headline.title} />
                            <h2 className="headline-title">
                                <a href={headline.url} target="_blank" rel="noopener noreferrer">
                                    {headline.title}
                                </a>
                                <i className={`${bookmarks.some((bookmark)=>bookmark.title===headline.title)?"fa-solid": "fa-regular"} fa-bookmark bookmark`} onClick={(e)=>{
                                    e.stopPropagation()
                                    handelBookmarkClick(headline)
                                }}></i>
                            </h2>
                        </div>
                    )}
                    <div className="news-grid">
                        {news.map((article, index) => (
                            <div key={index} className="news-grid-items" 
                            onClick={()=> handelArticleClick(article)} >
                                <img src={article.urlToImage} alt={article.title} />
                                <h3>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {article.title}
                                    </a>
                                    <i className={`${bookmarks.some((bookmark)=>bookmark.title===article.title)?"fa-solid": "fa-regular"} fa-bookmark bookmark`} onClick={(e)=>{
                                    e.stopPropagation()
                                    handelBookmarkClick(article)
                                }}></i>
                                </h3>
                            </div>
                        ))}
                    </div>

                </div>
                <NewsModal show={showModal} article={selectedArticle} onClose={()=>setShowModal(false)}/>
                <BookMarks show={showBookmarks} bookmarks={bookmarks} onClose={()=>setShowBookmarks(false)} onSelectedArticle={handelArticleClick} onDeleteBookmark={handelBookmarkClick} />
                <div className="weather-calender">
                <Weather />
                <CalenderWIdget/>
                </div>
                
            </div>
            <footer className="news-footer">
                    <p>Stay updated with the latest news</p>
                <div className="contact-info">
                    <p><i class="fa-brands fa-github"></i><a href="https://github.com/heyitsharman" target="_blank" rel="noopener noreferrer">heyitsharman</a></p>
                </div>
                <small>&copy; 2025 NewsWave. All rights reserved.</small>
            </footer>


        </div>
    );
};

export default News;
