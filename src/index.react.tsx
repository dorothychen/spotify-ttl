import type {Playlist as TPlaylist} from './playlist.react';

import React from 'react';
import ReactDOM from 'react-dom';
import {createUseStyles} from "react-jss";
import {useEffect, useState} from 'react';

import Playlist from './playlist.react';


const useStyles = createUseStyles({
    root: {
        fontFamily: 'sans-serif',
        marginLeft: 36,
        marginTop: 24,
    },
    title: {
        fontFamily: 'Playfair Display, serif',
        fontSize: 56,
        marginBottom: 20,
    }
});


function App(): React.MixedElement {
    const [playlists, setPlaylists] = useState<Array>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<TPlaylist>(null);
    
    useEffect(() => {
        fetch('/api/playlists')
            .then(response => response.json())
            .then(data => setPlaylists(data.items))
            .catch(e => {
                console.log(e);
            });
        }, []);

    const styles = useStyles();

    const onPlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist);
    }

    const playlist_names = playlists.map((playlist) => {
        return <Playlist
            key={playlist.id}
            playlist={playlist}
            isSelected={selectedPlaylist?.id === playlist.id}
            onPlaylistClick={onPlaylistClick}
            />;
    });

    const onSubmit = () => {
        if (selectedPlaylist == null) {
            throw exception('playlist cannot be null');
        }

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                old_playlist_id: selectedPlaylist.id,
                new_playlist_id: '6M07JwuTXCqOt0gbO7QYIC'
            })
        };
        fetch('/api/playlist/run_ttl', requestOptions)
            .then(response => response.json())
    }

    return (
        <div className={styles.root}>
            <div className={styles.title}>Archive your old songs</div>
            <div>{playlist_names}</div>
            <div onClick={onSubmit}>SUBMIT</div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));