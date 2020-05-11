import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            display: 'test'
        }
    }


    render() {
        fetch('http://localhost:8080/')
            .then((res) => {
                return res.json();
            }).then((res) => {
                this.setState({
                    display: res.value
                })
            }).catch(() => {
                console.log('ok')
            })

        return (
            <div>
                <h1> le résultat du fetch est :  </h1>
                <h1> {this.state.display} </h1>
            </div>
        );
    }



}

export default App;
