import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './MainView.react';

function App(): React.MixedElement {
    return <MainView />
}

ReactDOM.render(<App />, document.getElementById('app'));