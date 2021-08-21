from flask import Flask, request, redirect, g, render_template, session, url_for, jsonify
from auth import spotify_auth_url, spotify_auth_header, user_json
from playlists import get_all_playlists, get_expired_songs, create_playlist_impl, add_tracks_impl, remove_tracks_impl
from config import CONFIG
import database, os


# Reference: https://github.com/mari-linhares/spotify-flask

DEFAULT_TTL_DAYS = -1

app = Flask(__name__, template_folder='src')
app.config.from_mapping(
    SECRET_KEY=CONFIG['APP_SECRET_KEY'],
    DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
)
database.init_app(app)


@app.route("/")
def hello():
    return render_template('index.html')


@app.route("/auth")
def auth():
    url = spotify_auth_url()
    return redirect(url)


@app.route('/spotify/callback')
def spotify_callback():
    auth_token = request.args['code']
    auth_header = spotify_auth_header(auth_token)
    session['auth_header'] = auth_header
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
    old_playlist_id = data.get('old_playlist_id')
    new_playlist_id = data.get('new_playlist_id')

    # TODO handle when new playlist id is null
    # new_playlist_id = create_playlist_impl(
    #     session['auth_header'],
    #     user['id'],
    #     'NEW PLAYLIST TEST 2'
    # )

    expired_tracks = get_expired_songs(session['auth_header'], old_playlist_id, DEFAULT_TTL_DAYS)
    expired_uris = [track.uri for track in expired_tracks]
    user = user_json(session['auth_header'])
    try:
        add_tracks_impl(session['auth_header'], new_playlist_id, expired_uris)
        remove_tracks_impl(session['auth_header'], old_playlist_id, expired_uris)
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
    if 'auth_header' not in session:
        return redirect(url_for('auth'))
    playlists = get_all_playlists(session['auth_header'])
    if 'error' in playlists and playlists['error']['status'] == 401:
        return redirect(url_for('auth'))
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


@app.route('/api/add_track')
def add_tracks():
    if 'auth_header' not in session:
        return redirect(url_for('auth'))
    playlist_id = '2GfL3lSTN5ySuIsVoqW8Sd'
    uris = ['spotify:track:5pLpkaIRobcvPnUmclNv6o']
    return add_tracks_impl(session['auth_header'], playlist_id, uris)


@app.route('/api/remove_track')
def remove_tracks():
    if 'auth_header' not in session:
        return redirect(url_for('auth'))
    playlist_id = '2GfL3lSTN5ySuIsVoqW8Sd'
    uris = ['spotify:track:5pLpkaIRobcvPnUmclNv6o']
    return remove_tracks_impl(session['auth_header'], playlist_id, uris)


if __name__ == "__main__":
    print (app.config)
    app.run(debug=True)
