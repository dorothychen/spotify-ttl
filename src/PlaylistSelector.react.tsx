import type {Playlist as TPlaylist} from './Playlist.react';

import React from 'react';
import Select from 'react-select';

type Props = Array<{
    playlists: Array<TPlaylist>;
    onPlaylistClick: (TPlaylist) => void,
    selectedPlaylist: TPlaylist,    
}>;

export default function PlaylistSelector({
    playlists,
    selectedPlaylist,
    onPlaylistClick,
}: Props): React.MixedElement {
    const playlistOptions = playlists.map(p => {
        return {value: p, label: p.name};
    });

    return <Select 
        options={playlistOptions} 
        value={selectedPlaylist} 
        onChange={onPlaylistClick} 
        />;
}