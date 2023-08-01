const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database('./twitter_clone.db');

// テーブルの作成
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    name TEXT,
    profile TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tweets (
    tweet_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    messages TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS favorites (
    favolite_id INTEGER PRIMARY KEY,
    tweet_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS retweets (
    retweet_id INTEGER PRIMARY KEY,
    tweet_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`);
});

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '')));

// ルートパスに対するGETリクエストを処理
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ユーザー登録
app.post('/api/users', (req, res) => {
  const { name, profile } = req.body;
  const stmt = db.prepare('INSERT INTO users (name, profile) VALUES (?, ?)');
  stmt.run(name, profile, function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to create user' });
    } else {
      const user_id = this.lastID;
      res.json({ user_id, name, profile });
    }
  });
  stmt.finalize();
});

// ツイート作成
app.post('/api/tweets', (req, res) => {
  const { user_id, messages } = req.body;
  const stmt = db.prepare('INSERT INTO tweets (user_id, messages) VALUES (?, ?)');
  stmt.run(user_id, messages, function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to create tweet' });
    } else {
      const tweet_id = this.lastID;
      res.json({ tweet_id, user_id, messages });
    }
  });
  stmt.finalize();
});

// いいね
app.post('/api/favorites', (req, res) => {
  const { user_id, tweet_id } = req.body;
  const stmt = db.prepare('INSERT INTO favorites (tweet_id, user_id) VALUES (?, ?)');
  stmt.run(tweet_id, user_id, function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to add favorite' });
    } else {
      const favolite_id = this.lastID;
      res.json({ favolite_id, tweet_id, user_id });
    }
  });
  stmt.finalize();
});

// リツイート
app.post('/api/retweets', (req, res) => {
  const { user_id, tweet_id } = req.body;
  const stmt = db.prepare('INSERT INTO retweets (tweet_id, user_id) VALUES (?, ?)');
  stmt.run(tweet_id, user_id, function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to retweet' });
    } else {
      const retweet_id = this.lastID;
      res.json({ retweet_id, tweet_id, user_id });
    }
  });
  stmt.finalize();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
