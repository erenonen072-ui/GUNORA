-- =========================================
-- GÜNORA PRO DATABASE
-- =========================================

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,

    title VARCHAR(300) NOT NULL,

    slug VARCHAR(350) UNIQUE NOT NULL,

    summary TEXT,

    content TEXT NOT NULL,

    image TEXT,

    category VARCHAR(50) NOT NULL,

    author VARCHAR(100) DEFAULT 'GÜNORA',

    featured BOOLEAN DEFAULT FALSE,

    breaking BOOLEAN DEFAULT FALSE,

    published BOOLEAN DEFAULT TRUE,

    views INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_news_category
ON news(category);


CREATE INDEX IF NOT EXISTS idx_news_created
ON news(created_at DESC);


CREATE INDEX IF NOT EXISTS idx_news_published
ON news(published);


CREATE INDEX IF NOT EXISTS idx_news_breaking
ON news(breaking);


CREATE INDEX IF NOT EXISTS idx_news_featured
ON news(featured);
