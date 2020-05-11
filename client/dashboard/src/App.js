import React, { Component } from 'react';
//import Profile from './Profile'
import Number from './Number'
import Profile from './Profile'
import CurrentWeather from './CurrentWeather'
import './App.css';
import './sign.css';
import io from 'socket.io-client';
import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { Cookies } from 'react-cookie';
import Cinema from "./TMDB/Cinema";

class App extends Component {
    constructor(props) {

        super(props)
        this.state = {
            discordToken: '',
            connected: false,

            email: '',
            username: '',
            password: '',

            info: {},

            addClass: false,
            register: false,
        }
        this.socket = io('http://localhost:8000');

    }

    componentDidMount() {

    }

    componentWillMount() {
        this.getDiscordToken();
    }

    getDiscordToken() {
        const urlParams = new URLSearchParams(window.location.search);
        var code = urlParams.get('code')
        if (null != code) {

            this.socket.emit('getAuthToken', code);
            this.socket.on('getAuthTokenResponse', () => {
                this.getDiscordInfo()
            })
        }
    }

    getDiscordInfo() {

        this.socket.emit('getUserInfo');
        this.socket.on('getUserInfoResponse', (info) => {
            console.log(info)
            localStorage.setItem('user', {
                email: info.email,
                username: info.username,
            });
            window.location.replace('http://localhost:3000/');
        })
    }

    discordLogin(e) {
        window.location.replace('https://discordapp.com/api/oauth2/authorize?client_id=700728181765832815&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=identify%20email');
    }

    signup = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                username: this.state.username,
                password: this.state.password,
            })
        };
        fetch('http://localhost:8080/users', requestOptions)
            .catch(err => { console.log(err) });
        // .then(res => console.log(res.status));
        this.setState({ register: true })
    }

    signin = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        };
        fetch('http://localhost:8080/users/login', requestOptions)
            .catch(err => { console.log(err) })
            .then(res => {
                if (200 === res.status) {
                    console.log('ok')
                    localStorage.setItem('user', {
                        email: this.state.email,
                        username: this.state.username,
                    });
                    const cookies = new Cookies();
                    cookies.set('email', this.state.email, { path: '/' });
                    this.forceUpdate();
                    // this.setState({ connected: true })
                }
            })
    }

    logOut() {
        localStorage.removeItem('user');
        this.forceUpdate();
    }

    debug() {
        console.log(localStorage.getItem('user'));
        // const requestOptions = {
        //     method: 'GET',
        // };
        // fetch('http://localhost:8080/users', requestOptions)
        //     .then(response => response.json())
        //     .then(res => console.log(res));
    }



    // renderRegistration() {
    //     if (this.state.registration) {
    //         return (
    //             <div className="registration">
    //                 <h1> Sign up </h1>
    //                 <form onSubmit={this.signup}>
    //                     <input type='text' onChange={this.emailChangeHandler.bind(this)} />
    //                     <input type='text' onChange={this.usernameChangeHandler.bind(this)} />
    //                     <input type='password' onChange={this.passwordChangeHandler.bind(this)} />
    //                     <input type='submit' />
    //                 </form>
    //             </div>
    //         )
    //     }
    // }

    changeSignState() {
        this.setState({ addClass: !this.state.addClass });
    }

    // alert(){
    //     if (this.state.register){

    alert() {
        if (this.state.register) {
            console.log(this.state.register);
            return (<Alert severity="success">registration succeed!</Alert>)
        } else return (null);
    }

    render() {

        if (null != localStorage.getItem('user')) {

            return (
                <div>
                    <div className='logout'>


                        <Button onClick={this.logOut.bind(this)} color="inherit"> Log out</Button>
                    </div>
                    <div className='welcome'>
                        <h1> Welcome </h1>
                        {/* <Profile username=''>
                        <h1> connected </h1>
                    </Profile> */}
                        <div>
                            <h1> connected </h1>
                            <Profile username='' email=''>
                            </Profile>

                            <CurrentWeather test='salut'>

                            </CurrentWeather>

                            <Cinema/>

                            <button onClick={this.logOut.bind(this)}>Log out</button>
                        </div>
                        <div className='grid'>
                            <Number email={this.state.email} />
                        </div>
                        {/* <div className = 'grid'>                  
                    <Number/>
                </div>
                <div className = 'grid'>                  
                    <Number/>
                </div> */}
                </div>

                    </div>
            );
        } else {
            var a = this.alert();
            let boxClass = ["container"];
            if (this.state.addClass) {
                        boxClass.push('right-panel-active');
            }

            return (

                    <div>
                        {a}
                        <div className={boxClass.join(' ')} id="container">
                            <div className="form-container sign-up-container">
                                <form action="#">
                                    <h1>Create Account</h1>
                                    <div className="social-container">

                                    </div>
                                    <span>or use your email for registration</span>
                                    <input type="text" placeholder="Name" onChange={this.emailChangeHandler.bind(this)} />
                                    <input type="text" placeholder="Email" onChange={this.emailChangeHandler.bind(this)} />
                                    <input type="password" placeholder="Password" onChange={this.passwordChangeHandler.bind(this)} />
                                    <button onClick={this.signup}>Sign Up</button>

                                </form>
                            </div>
                            <div className="form-container sign-in-container">
                                <form >
                                    <h1>Sign in</h1>
                                    <div className="social-container">
                                        <span onClick={this.discordLogin.bind(this)} className='login-button'> Login through Discord </span>
                                    </div>
                                    <span>or use your account</span>
                                    <input type="text" placeholder="Email" onChange={this.emailChangeHandler.bind(this)} />
                                    <input type="password" placeholder="Password" onChange={this.passwordChangeHandler.bind(this)} />

                                    <button onClick={this.signin}>Sign In</button>
                                </form>
                            </div>
                            <div className="overlay-container">
                                <div className="overlay">
                                    <div className="overlay-panel overlay-left">
                                        <h1>Welcome Back!</h1>
                                        <p>To keep connected with us please login with your personal info</p>
                                        <button className="ghost" id="signIn" onClick={this.changeSignState.bind(this)}>Sign In</button>
                                    </div>
                                    <div className="overlay-panel overlay-right">
                                        <h1>Hello, Friend!</h1>
                                        <p>Enter your personal details and start journey with us</p>
                                        <button className="ghost" id="signUp" onClick={this.changeSignState.bind(this)}>Sign Up</button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div>
                            <button onClick={this.debug.bind(this)}> debug </button>
                        </div>
                    </div>
            );
        }


    }

    changeSignState() {
                        this.setState({ addClass: !this.state.addClass });
    }

    emailChangeHandler(event) {
                        this.setState({
                            email: event.target.value
                        })
                    }

    usernameChangeHandler(event) {
                        this.setState({ username: event.target.value });
    }

    passwordChangeHandler(event) {
                        this.setState({ password: event.target.value });
    }

    toggleRegistration() {
                        this.setState({ registration: !this.state.registration });
    }
}

export default App;
