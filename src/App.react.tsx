import type {Playlist as TPlaylist} from './playlist.react';

import React from 'react';
import ReactDOM from 'react-dom';
import {createUseStyles} from "react-jss";
import {useEffect, useState} from 'react';

import PlaylistList from './PlaylistList.react';
import SubmitButton from './SubmitButton.react';


const useStyles = createUseStyles({
    desc: {
        marginBottom: 16,
    },
    root: {
        fontFamily: 'sans-serif',
        marginLeft: 36,
        marginTop: 24,
    },
    playlistsContainer: {
        display: 'flex',
    },
    title: {
        fontFamily: 'Playfair Display, serif',
        fontSize: 56,
        marginBottom: 12,
    },
    ttlInput: {
        borderTop: 'None',
        borderLeft: 'None',
        borderRight: 'None',
        width: 30,
    }
});


function App(): React.MixedElement {
    const [playlists, setPlaylists] = useState<Array>([]);
    const [selectedSourcePlaylist, setSelectedSourcePlaylist] = useState<TPlaylist>(null);
    const [selectedArchivePlaylist, setSelectedArchivePlaylist] = useState<TPlaylist>(null);
    const [ttlDays, setTtlDays] = useState<number>(30);

    useEffect(() => {
        fetch('/api/playlists')
            .then(response => response.json())
            .then(data => setPlaylists(data.items))
            .catch(e => {
                console.log(e);
            });
        }, []);

    const styles = useStyles();

    const onSubmit = () => {
        if (selectedSourcePlaylist == null || setSelectedArchivePlaylist == null) {
            throw exception('source and archive playlists cannot be null');
        }

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                source_playlist_id: selectedSourcePlaylist.id,
                archive_playlist_id: selectedArchivePlaylist.id,
                ttl_days: ttlDays,
            })
        };
        fetch('/api/playlist/run_ttl', requestOptions)
            .then(response => response.json())
    };

    const onChangeTTL = (event) => {
        setTtlDays(event.target.value);
        console.log(event.target.value);
    };

    return (
        <div className={styles.root}>
            <div className={styles.title}>Archive your old songs</div>
            <div className={styles.desc}>
                Remove songs that have been added to your selected <u>source playlist</u> over 
                {' '}<input type="text" 
                    value={ttlDays}
                    onChange={onChangeTTL}
                    className={styles.ttlInput} /> 
                {' '}
                days ago, and move them to your selected <u>archive playlist</u>.
            </div>
            <div className={styles.playlistsContainer}>
                <PlaylistList 
                    header="source playlist"
                    playlists={playlists} 
                    onPlaylistClick={(pl) => {setSelectedSourcePlaylist(pl);}} 
                    selectedPlaylist={selectedSourcePlaylist}
                    />
                <PlaylistList 
                    header="archive playlist"
                    playlists={playlists} 
                    onPlaylistClick={(pl) => {setSelectedArchivePlaylist(pl);}}
                    selectedPlaylist={selectedArchivePlaylist} 
                    />
            </div>
            {playlists.length > 0 && <SubmitButton onClick={onSubmit} />}

        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));