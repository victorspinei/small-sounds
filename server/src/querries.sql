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

CREATE TABLE post (
    user_id INTEGER NOT NULL,
    post_id INTEGER PRIMARY KEY NOT NULL,
    file_name TEXT NOT NULL,
    post_type TEXT NOT NULL CHECK (post_type IN ('cover', 'original')),
    genre TEXT CHECK (genre IN ('rock', 'pop', 'hip-hop', 'jazz', 'blues', 'country', 'classical', 'electronic', 'reggae', 'folk', 'metal', 'punk', 'indie', '')),
    instrument TEXT CHECK (instrument IN ('guitar', 'piano', 'drums', 'bass', 'violin', 'saxophone', 'trumpet', 'flute', 'clarinet', 'keyboard', 'ukulele', 'banjo', 'harmonica', 'accordion', '')),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);