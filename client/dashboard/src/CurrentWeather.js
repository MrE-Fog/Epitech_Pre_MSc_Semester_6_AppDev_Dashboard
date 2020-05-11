import React, { Component } from 'react';
import Profile from './Profile'
import './App.css';
import axios from 'axios'
import io from 'socket.io-client';
import { Alert } from '@material-ui/lab';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.socket = io('http://localhost:8000');

    }

    componentDidMount() {

    }

    componentWillMount() {

    }

    alert() {
        if (this.state.register) {
            console.log(this.state.register);
            return (<Alert severity="success">registration succeed!</Alert>)
        } else return (null);
    }


    render() {
        var alert = this.alert();
        var t = this.props.test;
        return (
            <div>
                {alert}
                <input type="text" placeholder="City" />
                <button onClick={this.signup}> Get the weaher for this city </button>
            </div>
        )

    }
}

export default App;