import type {Playlist as TPlaylist} from './playlist.react';

import React from 'react';
import {createUseStyles} from "react-jss";
import {useEffect, useState} from 'react';

import PlaylistList from './PlaylistList.react';
import Button from './Button.react';
import LogoutButton from './LogoutButton.react';
import ConfirmTracksContainer from './ConfirmTracksContainer.react';

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
        maxWidth: 300,
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

type Props = Array<{
    needsAuth: boolean
}>;


export default function MainView({needsAuth}: Props): React.MixedElement {
    const [playlists, setPlaylists] = useState<Array>([]);
    const [selectedSourcePlaylist, setSelectedSourcePlaylist] = useState<TPlaylist>(null);
    const [selectedArchivePlaylist, setSelectedArchivePlaylist] = useState<TPlaylist>(null);
    const [ttlDays, setTtlDays] = useState<number>(30);
    const [tracksToMove, setTracksToMove] = useState<Array<string>>(null);

    const runTTL = (isDryRun: boolean): Promise | void => {
        const sourcePlaylist = selectedSourcePlaylist?.value;
        const archivePlaylist = selectedArchivePlaylist?.value;
        if (sourcePlaylist == null || archivePlaylist == null) {
            return;
        }        

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                source_playlist_id: sourcePlaylist.id,
                archive_playlist_id: archivePlaylist.id,
                ttl_days: ttlDays,
                is_dry_run: isDryRun,
            })
        };

        return fetch('/api/playlist/run_ttl', requestOptions)
            .then(response => response.json());
    }

    // Fetch initial playlists
    useEffect(() => {
        fetch('/api/playlists')
            .then(response => response.json())
            .then(data => setPlaylists(data.items))
            .catch(e => {
                console.log(e);
            });
        }, []);

    // Update tracks to be migrated when playlist selection changes
    useEffect(() => {
        const fetchPromise = runTTL(true);
        if (fetchPromise == null) {
            return;
        }

        fetchPromise.then(response => {
            setTracksToMove(response.data);
        });
    }, [selectedSourcePlaylist, selectedArchivePlaylist, ttlDays]);

    const styles = useStyles();

    const onSubmit = () => {
        const sourcePlaylist = selectedSourcePlaylist?.value;
        const archivePlaylist = selectedArchivePlaylist?.value;
        if (sourcePlaylist == null || archivePlaylist == null) {
            throw Exception('source and archive playlists cannot be null');
        }

        runTTL(false);
    };

    const onLogin = () => {
        window.location.href = '/auth';
    };

    const onLogout = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                logout: true,
            })
        };

        fetch('/api/logout', requestOptions)
            .then(response => response.json())
            .then(response => {
                if (response?.success === 1) {
                    window.location.href = '/';
                } else {
                    // TODO error handling
                }
            });
    };

    const onChangeTTL = (event) => {
        setTtlDays(event.target.value);
        console.log(event.target.value);
    };

    const loggedInContainer = (
        <div>
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
            {playlists.length > 0 && <Button label="SUBMIT" onClick={onSubmit} />}

            <ConfirmTracksContainer 
                sourcePlaylist={selectedSourcePlaylist?.value}
                archivePlaylist={selectedArchivePlaylist?.value}
                tracksToMove={tracksToMove}
                />
        </div>
    );

    const loggedOutContainer = (
        <div>
            Log into your Spotify account to continue.
            <Button label="LOG IN" onClick={onLogin} />
        </div>
    );

    return (
        <div className={styles.root}>
            <div className={styles.title}>Archive your old songs</div>
            {needsAuth === 'False' ? <LogoutButton onClick={onLogout} /> : null}
            <div className={styles.desc}>
                Remove songs that were added to your selected 
                {' '}
                <b>source playlist</b> 
                {' '}
                over 
                {' '}<input type="text" 
                    value={ttlDays}
                    onChange={onChangeTTL}
                    className={styles.ttlInput} /> 
                {' '}
                days ago, and move them to your selected 
                {' '}
                <b>archive playlist</b>.
            </div>
            {needsAuth === 'True' ? loggedOutContainer : loggedInContainer}
        </div>
    );
}