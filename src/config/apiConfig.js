// News API Configuration
// Using The Guardian API which has a generous free tier

export const NEWS_API_CONFIG = {
    // The Guardian API - free with no key required for basic use
    API_KEY: 'test', // Guardian API accepts 'test' for development
    BASE_URL: 'https://content.guardianapis.com',
    ENDPOINTS: {
        SEARCH: '/search'
    },
    DEFAULT_PARAMS: {
        'api-key': 'test',
        'show-fields': 'thumbnail,headline,bodyText,byline',
        'show-tags': 'contributor',
        'page-size': 10,
        format: 'json'
    },
    CATEGORY_MAP: {
        'general': '',
        'world': 'world',
        'nation': 'us-news',
        'business': 'business',
        'technology': 'technology',
        'entertainment': 'culture',
        'sports': 'sport',
        'science': 'science',
        'health': 'society'
    }
};

// Helper function to build API URLs
export const buildNewsUrl = (endpoint, params = {}) => {
    const url = new URL(`${NEWS_API_CONFIG.BASE_URL}${endpoint}`);
    
    // Add default params
    Object.entries(NEWS_API_CONFIG.DEFAULT_PARAMS).forEach(([key, value]) => {
        if (!params[key]) {
            url.searchParams.append(key, value);
        }
    });
    
    // Add custom params
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, value);
        }
    });
    
    return url.toString();
};