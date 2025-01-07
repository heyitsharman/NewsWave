import React, { useEffect, useState } from 'react';
import Weather from './Weather';
import Calender from './Calender';
import './News.css';
import userImg from '../assets/images/user.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const News = () => {
    const [headline, setHeadline] = useState(null);
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=62e58585f8919515667384329a3c4f12`;
                const response = await axios.get(url);
                const fetchedNews = response.data.articles;

                setHeadline(fetchedNews[0]);
                setNews(fetchedNews.slice(1, 7)); // Get the next 6 articles
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="news">
            <header className="news-header">
                <h1 className="logo">News and Blogs</h1>
                <div className="search-bar">
                    <form>
                        <input type="text" placeholder="Search news" />
                        <button>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
                </div>
            </header>
            <div className="news-content">
                <div className="navbar">
                    <div className="user">
                        <img src={userImg} alt="User" />
                        <p>Your Blog</p>
                    </div>
                    <nav className="categories">
                        <h1 className="nav-heading">Categories</h1>
                        <div className="nav-links">
                            <a href="#" className="nav-link">General</a>
                            <a href="#" className="nav-link">World</a>
                            <a href="#" className="nav-link">Business</a>
                            <a href="#" className="nav-link">Technology</a>
                            <a href="#" className="nav-link">Entertainment</a>
                            <a href="#" className="nav-link">Sports</a>
                            <a href="#" className="nav-link">Science</a>
                            <a href="#" className="nav-link">Nation</a>
                            <a href="#" className="nav-link">
                                Bookmarks <i className="fa-regular fa-bookmark"></i>
                            </a>
                        </div>
                    </nav>
                </div>
                <div className="news-section">
                    {headline && (
                        <div className="headline">
                            <img src={headline.image} alt={headline.title} />
                            <h2 className="headline-title">
                                {headline.title} <i className="fa-regular fa-bookmark bookmark"></i>
                            </h2>
                        </div>
                    )}

                    <div className="news-grid">
                        {news.map((article, index) => (
                            <div key={index} className="news-grid-items">
                                <img src={article.image} alt={article.title} />
                                <h3>
                                    {article.title}
                                    <i className="fa-regular fa-bookmark bookmark"></i>
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="myblogs">My Blogs</div>
                <div className="weather-calender">
                    <Weather />
                    <Calender />
                </div>
            </div>
            <footer className="news-footer">Footer</footer>
        </div>
    );
};

export default News;
