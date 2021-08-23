import type {Playlist as TPlaylist} from './Playlist.react';

import React from 'react';
import {createUseStyles} from "react-jss";
import PlaylistSelector from './PlaylistSelector.react';

import {COLOR_PINK} from './colors';


type Props = Array<{
    header: string,
    playlists: Array<TPlaylist>
    onPlaylistClick: (TPlaylist) => void,
    selectedPlaylist: TPlaylist,
}>;

const useStyles = createUseStyles({
    container: {
        paddingRight: 30,
        paddingBottom: 30,
    },
    playlistHeader: {
        fontWeight: "bold",
        paddingBottom: 8,
    }
});

export default function PlaylistList({
    header,
    playlists,
    selectedPlaylist,
    onPlaylistClick,
}: Props): React.MixedElement {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <div className={styles.playlistHeader}>
                <span style={{backgroundColor: COLOR_PINK}}>{header}</span>
            </div>
            <PlaylistSelector 
                playlists={playlists} 
                selectedPlaylist={selectedPlaylist}
                onPlaylistClick={onPlaylistClick} 
                />
        </div>
    );
}
