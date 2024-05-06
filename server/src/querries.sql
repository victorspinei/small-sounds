-- schema
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL,
    joined DATETIME NOT NULL,
    email TEXT NOT NULL
);

CREATE TABLE profile (
    profile_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    markdown TEXT NOT NULL,
    song TEXT,
    picture TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE posts (
    user_id INTEGER NOT NULL,
    post_id INTEGER PRIMARY KEY NOT NULL,
    file_name TEXT NOT NULL,
    post_type TEXT NOT NULL CHECK (post_type IN ('cover', 'original')),
    genre TEXT CHECK (genre IN ('rock', 'pop', 'hip-hop', 'jazz', 'blues', 'country', 'classical', 'electronic', 'reggae', 'folk', 'metal', 'punk', 'indie', 'other')),
    instrument TEXT CHECK (instrument IN ('guitar', 'piano', 'drums', 'bass', 'violin', 'saxophone', 'trumpet', 'flute', 'clarinet', 'keyboard', 'ukulele', 'banjo', 'harmonica', 'accordion', 'other')),
    description TEXT,
    posted_date TEXT,
    title TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE notifications (
    notification_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    notification_type TEXT NOT NULL,
    target_id INTEGER,
    is_read BOOLEAN DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (sender_id) REFERENCES users (user_id),
    FOREIGN KEY (target_id) REFERENCES posts (post_id) 
);

CREATE TABLE comments (
    comment_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
);

CREATE TABLE history (
    history_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL, -- e.g., 'posts', 'users', etc.
    target_id INTEGER NOT NULL, -- ID of the target entity
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);


CREATE TABLE likes (
    like_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
);

CREATE TABLE streams (
    stream_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
);

CREATE TABLE followers (
    follower_id INTEGER PRIMARY KEY NOT NULL,
    follower_user_id INTEGER NOT NULL,
    following_user_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_user_id) REFERENCES users (user_id),
    FOREIGN KEY (following_user_id) REFERENCES users (user_id)
);