import React, { useEffect, useState } from 'react';
import './News.css';
import noImg from '../assets/images/no-img.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import Weather from './Weather'
import NewsModal from './NewsModal'
import BookMarks from './BookMarks'
import CalenderWIdget from './CalenderWIdget';
import { NEWS_API_CONFIG, buildNewsUrl } from '../config/apiConfig';
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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                let url;
                const params = {};
    
                // If a search query exists, search for it
                if (isSearching && searchQuery) {
                    params.q = searchQuery;
                } else {
                    // Use section/category
                    const mappedCategory = NEWS_API_CONFIG.CATEGORY_MAP[selectedCategory];
                    if (mappedCategory) {
                        params.section = mappedCategory;
                    }
                }
    
                // Always get recent articles
                params['order-by'] = 'newest';
                
                url = buildNewsUrl(NEWS_API_CONFIG.ENDPOINTS.SEARCH, params);
                console.log('Fetching from:', url); // Debug log
    
                const response = await axios.get(url);
                console.log('API Response:', response.data); // Debug log
                
                const fetchedNews = response.data.response.results;
    
                // Transform Guardian API data to our format
                const validArticles = fetchedNews
                    .filter(article => article.fields && article.fields.thumbnail)
                    .map(article => ({
                        title: article.webTitle,
                        description: article.fields.headline || article.webTitle,
                        content: article.fields.bodyText || 'Full content available at source link.',
                        url: article.webUrl,
                        image: article.fields.thumbnail || noImg,
                        urlToImage: article.fields.thumbnail || noImg,
                        publishedAt: article.webPublicationDate,
                        source: {
                            name: 'The Guardian'
                        },
                        author: article.fields.byline || 'The Guardian Staff'
                    }))
                    .slice(0, 7); // Limit to 7 articles

                console.log('Processed articles:', validArticles); // Debug log
    
                setHeadline(validArticles[0] || null);
                setNews(validArticles.slice(1)); // Get the remaining articles
    
                const SavedBookmark = JSON.parse(localStorage.getItem("bookmarks")) || [];
                setBookmarks(SavedBookmark);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching news:', error);
                setError('Failed to load news. Please try again later.');
                setLoading(false);
                
                // Fallback data in case of API failure
                setHeadline(null);
                setNews([]);
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
                    {loading && (
                        <div style={{textAlign: 'center', padding: '2rem'}}>
                            <p>Loading news articles...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div style={{textAlign: 'center', padding: '2rem', color: 'red'}}>
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()} style={{marginTop: '1rem', padding: '0.5rem 1rem'}}>
                                Retry
                            </button>
                        </div>
                    )}
                    
                    {!loading && !error && headline && (
                        <div className="headline" onClick={()=>
                            handelArticleClick(headline)
                        }>
                            <img src={headline.image} alt={headline.title} />
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
                    
                    {!loading && !error && (
                        <div className="news-grid">
                            {news.map((article, index) => (
                                <div key={index} className="news-grid-items" 
                                onClick={()=> handelArticleClick(article)} >
                                    <img src={article.image} alt={article.title} />
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
                    )}

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
