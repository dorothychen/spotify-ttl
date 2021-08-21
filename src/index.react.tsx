import React from 'react';
import ReactDOM from 'react-dom';

import Playlist from './playlist.react';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: [],
            selected_playlist: null,
        };
    }

    componentDidMount() {
        fetch('/api/playlists')
            .then(response => response.json())
            .then(data => this.setState({ playlists: data.items }));
    }

    render() {
        const onPlaylistClick = (playlist) => {
            this.setState({selected_playlist: playlist});
        }

        const playlist_names = this.state.playlists.map((playlist) => {
            return <Playlist
                key={playlist.id}
                playlist={playlist}
                isSelected={this.state.selected_playlist?.id === playlist.id}
                onPlaylistClick={onPlaylistClick}
                />;
        });

        const onSubmit = () => {
            const selected_playlist = this.state.selected_playlist;
            if (selected_playlist == null) {
                throw exception('playlist cannot be null');
            }

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    old_playlist_id: selected_playlist.id,
                    new_playlist_id: '6M07JwuTXCqOt0gbO7QYIC'
                })
            };
            fetch('/api/playlist/run_ttl', requestOptions)
                .then(response => response.json())
        }

        return (
            <div>
                <div>HELLOOOO</div>
                <div>{playlist_names}</div>
                <div onClick={onSubmit}>SUBMIT</div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));