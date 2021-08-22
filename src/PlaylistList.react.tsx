import type {Playlist as TPlaylist} from './Playlist.react';

import React from 'react';
import {createUseStyles} from "react-jss";
import Playlist from './Playlist.react';

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

    const playlist_names = playlists.map((playlist) => {
        return <Playlist
            key={playlist.id}
            playlist={playlist}
            isSelected={selectedPlaylist?.id === playlist.id}
            onPlaylistClick={onPlaylistClick}
            />;
    });

    return (
        <div className={styles.container}>
            <div className={styles.playlistHeader}>
                <span style={{backgroundColor: COLOR_PINK}}>{header}</span>
            </div>
            {playlist_names}
        </div>
    );
}
