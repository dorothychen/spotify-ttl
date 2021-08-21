import requests, json
import urllib.parse
from dateutil.parser import parse
from datetime import datetime, timezone


BASE_URL = 'https://api.spotify.com/v1'
GET_PLAYLISTS_URL = BASE_URL + '/me/playlists'
PLAYLIST_TRACKS_URL = BASE_URL + '/playlists/{playlist_id}/tracks'
CREATE_PLAYLIST_URL = BASE_URL + '/users/{user_id}/playlists'
ADD_REMOVE_TRACK_URL = BASE_URL + '/playlists/{playlist_id}/tracks'

class Track:
    def __init__(self, track_json):
        self.name = track_json['name']
        self.uri = track_json['uri']

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return self.name + ' - ' + self.uri


def get_all_playlists(auth_header):
    resp = requests.get(GET_PLAYLISTS_URL, headers=auth_header)
    return resp.json()


def get_expired_songs(auth_header, playlist_id, ttl_days):
    url = PLAYLIST_TRACKS_URL.format(playlist_id=playlist_id)
    fields = urllib.parse.urlencode({
        'fields': 'items(added_at,added_by,track.id,track.images,track.name,track.artists,track.uri)'
    })
    url += "?" + fields
    resp = requests.get(url, headers=auth_header)
    tracks = resp.json()
    expired = [
        Track(track['track'])
        for track in tracks['items']
        if (datetime.now(timezone.utc) - parse(track['added_at'])).days > ttl_days
    ]
    return expired


def create_playlist_impl(auth_header, user_id, playlist_name):
    payload = json.dumps({
        'name': playlist_name,
        'public': True,
        'collaborative': False,
    })
    url = CREATE_PLAYLIST_URL.format(user_id=user_id)
    resp = requests.post(url, data=payload, headers=auth_header)
    response_data = json.loads(resp.text)
    return response_data['id']


def add_tracks_impl(auth_header, playlist_id, uris):
    payload = json.dumps({
        'uris': uris
    })
    url = ADD_REMOVE_TRACK_URL.format(playlist_id=playlist_id)
    resp = requests.post(url, data=payload, headers=auth_header)
    response_data = json.loads(resp.text)
    return response_data


def remove_tracks_impl(auth_header, playlist_id, uris):
    payload = json.dumps({
        'tracks': [{'uri': uri for uri in uris}]
    })
    url = ADD_REMOVE_TRACK_URL.format(playlist_id=playlist_id)
    resp = requests.delete(url, data=payload, headers=auth_header)
    response_data = json.loads(resp.text)
    return response_data

