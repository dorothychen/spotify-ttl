DROP TABLE IF EXISTS user_playlists;
DROP TABLE IF EXISTS track_events;

CREATE TABLE user_playlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  current_playlist_id TEXT NOT NULL,
  current_playlist_name TEXT NOT NULL,
  archive_playlist_id TEXT NOT NULL,
  archive_playlist_name TEXT NOT NULL
);

CREATE TABLE track_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  from_playlist_id TEXT NOT NULL,
  to_playlist_id TEXT NOT NULL,
  track_uris TEXT NOT NULL
);