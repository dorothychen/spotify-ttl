import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './MainView.react';

type Props = Array<{
    needsAuth: boolean
}>;

function App({needsAuth}: Props): React.MixedElement {
    return <MainView needsAuth={needsAuth} />;
}

ReactDOM.render(
    <App needsAuth={document.getElementById('app').getAttribute('data-needs-auth')} />, 
    document.getElementById('app')
);