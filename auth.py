from urllib.parse import urlencode
from config import CONFIG
import sys, base64, json
import requests

CLIENT_SECRET = CONFIG['CLIENT_SECRET']
CLIENT_ID = CONFIG['CLIENT_ID']

SPOTIFY_AUTH_BASE_URL = 'https://accounts.spotify.com'
SPOTIFY_AUTH_URL = SPOTIFY_AUTH_BASE_URL + '/authorize'
SPOTIFY_TOKEN_URL = SPOTIFY_AUTH_BASE_URL + '/api/token'
SPOTIFY_USER_URL = 'https://api.spotify.com/v1/me'

HOST = 'http://127.0.0.1:5000'
REDIRECT_URI = HOST + '/spotify/callback'

def spotify_auth_url():
    params = urlencode({
        'client_id': CLIENT_ID,
        'scope': 'playlist-modify-public',
        'redirect_uri': REDIRECT_URI,
        'response_type': 'code'
    })
    return SPOTIFY_AUTH_URL + '?' + params


def spotify_auth_header(auth_token):
    code_payload = {
        "grant_type": "authorization_code",
        "code": str(auth_token),
        "redirect_uri": REDIRECT_URI
    }

    return spotify_token_request(code_payload)


def spotify_refresh_token(refresh_token):
    code_payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token
    }

    return spotify_token_request(code_payload)


def spotify_token_request(code_payload):
    # Python 3 or above
    if sys.version_info[0] >= 3:
        base64encoded = base64.b64encode(("{}:{}".format(CLIENT_ID, CLIENT_SECRET)).encode())
        headers = {"Authorization": "Basic {}".format(base64encoded.decode())}
    else:
        base64encoded = base64.b64encode("{}:{}".format(CLIENT_ID, CLIENT_SECRET))
        headers = {"Authorization": "Basic {}".format(base64encoded)}

    post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload, headers=headers)
    response_data = json.loads(post_request.text)
    access_token = response_data["access_token"]
    refresh_token = response_data.get("refresh_token")

    # use the access token to access Spotify API
    auth_header = {
        "Authorization": "Bearer {}".format(access_token),
        "Content-Type": 'application/json'
    }
    return auth_header, refresh_token


def user_json(auth_header):
    resp = requests.get(SPOTIFY_USER_URL, headers=auth_header)
    return resp.json()

