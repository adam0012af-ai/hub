CREATE TABLE IF NOT EXISTS items(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 type TEXT NOT NULL CHECK(type IN ('movie','series')),
 poster TEXT DEFAULT '',
 description TEXT DEFAULT '',
 year INTEGER,
 category TEXT DEFAULT '',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS episodes(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 item_id INTEGER NOT NULL,
 season_no INTEGER DEFAULT 1,
 episode_no INTEGER DEFAULT 1,
 title TEXT DEFAULT '',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sources(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 item_id INTEGER,
 episode_id INTEGER,
 label TEXT DEFAULT 'Primary',
 url TEXT NOT NULL,
 priority INTEGER DEFAULT 1,
 enabled INTEGER DEFAULT 1,
 last_status INTEGER,
 last_checked TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE,
 FOREIGN KEY(episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_title ON items(title);
CREATE INDEX IF NOT EXISTS idx_sources_item ON sources(item_id,priority);
CREATE INDEX IF NOT EXISTS idx_sources_episode ON sources(episode_id,priority);
