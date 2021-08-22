from flask import Flask, request, redirect, g, render_template, session, url_for, jsonify
from auth import spotify_auth_url, spotify_auth_header, spotify_refresh_token, user_json
from playlists import get_all_playlists, get_expired_songs, create_playlist_impl, add_tracks_impl, remove_tracks_impl
from config import CONFIG
import database, os


# Reference: https://github.com/mari-linhares/spotify-flask

app = Flask(__name__, template_folder='src')
app.config.from_mapping(
    SECRET_KEY=CONFIG['APP_SECRET_KEY'],
    DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
)
database.init_app(app)


@app.route("/")
def hello():
    # TODO make an actual homepage
    return redirect(url_for('playlists'))


@app.route("/auth")
def auth():
    url = spotify_auth_url()
    return redirect(url)


@app.route('/spotify/callback')
def spotify_callback():
    auth_token = request.args['code']
    auth_header, refresh_token = spotify_auth_header(auth_token)
    session['auth_header'] = auth_header
    session['refresh_token'] = refresh_token
    return redirect(url_for('playlists'))


@app.route('/playlists')
def playlists():
    if 'auth_header' not in session:
        return redirect(url_for('auth'))
    return render_template('index.html')


############ API ############

@app.route('/api/playlist/run_ttl', methods=['POST'])
def selected_playlist():
    if 'auth_header' not in session:
        return redirect(url_for('auth'))

    data = request.get_json(force=True)
    source_playlist_id = data.get('source_playlist_id')
    archive_playlist_id = data.get('archive_playlist_id')
    ttl_days = int(data.get('ttl_days'))
    print(source_playlist_id, archive_playlist_id, ttl_days)

    expired_tracks = get_expired_songs(session['auth_header'], source_playlist_id, ttl_days)
    expired_uris = [track.uri for track in expired_tracks]
    user = user_json(session['auth_header'])
    try:
        add_tracks_impl(session['auth_header'], archive_playlist_id, expired_uris)
        remove_tracks_impl(session['auth_header'], source_playlist_id, expired_uris)
        return jsonify({'data': 
            [
                {'name': track.name, 'uri': track.uri} 
                for track in expired_tracks
            ]
        })
    except Error as err:
        return jsonify([])


@app.route('/api/playlists')
def api_playlists():
    if 'auth_header' not in session or 'refresh_token' not in session:
        return redirect(url_for('auth'))
    playlists = get_all_playlists(session['auth_header'])
    if 'refresh_token' in session:#and 'error' in playlists and playlists['error']['status'] == 401:
        auth_header, _ = spotify_refresh_token(session['refresh_token'])
        session['auth_header'] = auth_header
        playlists = get_all_playlists(auth_header)
    return playlists


@app.route('/api/create_playlist')
def api_create_playlist():
    if 'auth_header' not in session:
        return redirect(url_for('auth'))
    user = user_json(session['auth_header'])
    new_playlist = create_playlist_impl(
        session['auth_header'],
        user['id'],
        'NEW PLAYLIST TEST 2'
    )
    return new_playlist


if __name__ == "__main__":
    app.run(debug=True)
