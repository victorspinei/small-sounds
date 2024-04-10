-- schema
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL,
    joined DATETIME NOT NULL,
    email TEXT NOT NULL
);

CREATE TABLE posts (
    post_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    media_type TEXT NOT NULL,
    posted DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE media_mp3 (
    media_id INTEGER PRIMARY KEY NOT NULL,
    post_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
);

CREATE TABLE media_mp4 (
    media_id INTEGER PRIMARY KEY NOT NULL,
    post_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
);

CREATE TABLE likes (
    like_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
);