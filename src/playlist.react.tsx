import React from 'react';

type Playlist = Array<{
    collaborative: boolean,
    description: string,
    href: string,
    id: string,
    name: string,
    public: boolean,
}>;

type Props = Array<{
    playlist: Playlist,
    onPlaylistClick: () => void,
    key: number,
    isSelected: boolean,
}>;

function Playlist({
    onPlaylistClick,
    playlist,
    isSelected,
}: Props): React.MixedElement {
    const onClick = () => {
        onPlaylistClick(playlist);
    }

    return (
        <div onClick={onClick} style={isSelected ? {backgroundColor: "lightblue"} : null}>
            {playlist.name} {playlist.id}
        </div>
    );
}

export default Playlist;