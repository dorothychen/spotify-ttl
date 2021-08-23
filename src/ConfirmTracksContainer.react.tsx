import type {Playlist as TPlaylist} from './playlist.react';


import React from 'react';
import {createUseStyles} from "react-jss";

type Props = Array<{
    tracksToMove: Array<string>,
    sourcePlaylist: TPlaylist,
    archivePlaylist: TPlaylist,
}>;

const useStyles = createUseStyles({
    container: {
        marginTop: 14,
    },
    tracks: {
        color: 'darkgrey',
        fontSize: 14,
        marginTop: 12,
    }
});

export default function ConfirmTracksContainer({
    sourcePlaylist,
    archivePlaylist,
    tracksToMove
}: Props): React.MixedElement {
    const styles = useStyles();

    if (sourcePlaylist == null || 
        archivePlaylist == null ||
        tracksToMove == null) {
        return null;
    }

    const TOTAL_TRACKS_TO_MOVE_DESC = "Submitting will move "
            + tracksToMove.length
            + " tracks from "
            + sourcePlaylist.name
            + " to "
            + archivePlaylist.name
            + ".";

    const trackNames = tracksToMove.map(track => 
        <div key={track.uri}>{track.name}</div>
    );

    return (
        <div className={styles.container}>
            {TOTAL_TRACKS_TO_MOVE_DESC}
            <div className={styles.tracks}>
                {trackNames}
            </div>
        </div>
    );
}