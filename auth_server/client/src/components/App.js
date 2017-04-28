import React from 'react';
import './App.scss';
import LoginForm from './LoginForm';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="app">
                <LoginForm />
            </div>
        );
    }
}

export default App;
