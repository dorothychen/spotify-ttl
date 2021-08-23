import type {Playlist as TPlaylist} from './playlist.react';


import React from 'react';
import {createUseStyles} from "react-jss";

type Props = Array<{
    tracksToMove: Array<string>,
    sourcePlaylist: TPlaylist,
    archivePlaylist: TPlaylist,
}>;

export default function ConfirmTracksContainer({
    sourcePlaylist,
    archivePlaylist,
    tracksToMove
}: Props): React.MixedElement {
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
        <div>
            {TOTAL_TRACKS_TO_MOVE_DESC}
            {trackNames}
        </div>
    );
}