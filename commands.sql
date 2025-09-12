CREATE TABLE IF NOT EXISTS blogs(
id SERIAL PRIMARY KEY,
author TEXT,
url TEXT NOT NULL,
title TEXT NOT NULL,
likes INTEGER DEFAULT 0 
);

INSERT INTO blogs (author, url, title, likes) VALUES (
'Edsger W. Dijkstra',
'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
'Go To Statement Considered Harmful',
5
);

INSERT INTO blogs(author, url, title, likes) VALUES (
'Matti',
'https://fullstackopen.com/en',
'fullstackopen',
14
);