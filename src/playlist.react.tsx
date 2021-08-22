import React from 'react';
import {createUseStyles} from "react-jss";
import {COLOR_BLUE} from './colors';

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
        marginBottom: 4,
    },
    playlistName: {
        display: 'inline',
        paddingTop: 2,
        paddingBottom: 2,
        cursor: 'default',
        '&:hover': {
            backgroundColor: 'rgba(' + COLOR_BLUE + ', 0.4)',
        }
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
        <div className={styles.container}>
            <div className={styles.playlistName}
                onClick={onClick}
                style={isSelected ? {backgroundColor: "rgb("+COLOR_BLUE+")"} : null}>
                {playlist.name}
            </div>
        </div>
    );
}

export default Playlist;