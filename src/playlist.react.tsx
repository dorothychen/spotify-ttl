import React from 'react';
import {createUseStyles} from "react-jss";


export type Playlist = Array<{
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

const useStyles = createUseStyles({
    container: {
        marginTop: 2,
        marginBottom: 2,
    },
    playlistName: {
        display: 'inline',
        paddingTop: 2,
        paddingBottom: 2,
        cursor: 'default',
    }
});


function Playlist({
    onPlaylistClick,
    playlist,
    key,
    isSelected,
}: Props): React.MixedElement {
    const styles = useStyles();

    const onClick = () => {
        onPlaylistClick(playlist);
    }

    return (
        <div key={key}
            className={styles.container}>
            <div className={styles.playlistName}
                onClick={onClick}
                style={isSelected ? {backgroundColor: "lightblue"} : null}>
                {playlist.name}
            </div>
        </div>
    );
}

export default Playlist;