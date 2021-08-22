import type {Playlist as TPlaylist} from './Playlist.react';

import React from 'react';
import {createUseStyles} from "react-jss";
import Playlist from './Playlist.react';


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
        textDecoration: 'underline',
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
            <div className={styles.playlistHeader}>{header}</div>
            {playlist_names}
        </div>
    );
}
