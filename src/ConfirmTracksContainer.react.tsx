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
    const TOTAL_TRACKS_TO_MOVE_DESC = 
        sourcePlaylist != null && 
        archivePlaylist != null && 
        tracksToMove != null 
        ? "Submitting will move "
            + tracksToMove.length
            + " tracks from "
            + sourcePlaylist.name
            + " to "
            + archivePlaylist.name
        : "Select your source and archive playlists."

    return (
        <div>
            {TOTAL_TRACKS_TO_MOVE_DESC}
        </div>
    );
}