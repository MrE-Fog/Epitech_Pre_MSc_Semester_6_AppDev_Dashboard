import React, { Component } from 'react';
import './sign.css';
class Sign extends Component{

    constructor(props) {
        super(props);
        this.state = {addClass: false}
    }


    signin() {
        this.setState({addClass: false});
    }

    signup(){
        this.setState({addClass: true});
    }





    

    render(){
        let boxClass = ["container"];
        if(this.state.addClass) {
          boxClass.push('right-panel-active');
        }
        return (
            <div className={boxClass.join(' ')} id="container">
                <div className="form-container sign-up-container">
                    <form action="#">
                        <h1>Create Account</h1>
                        <div className="social-container">

                        </div>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button >Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form action="#">
                        <h1>Sign in</h1>
                        <div className="social-container">
                            <span className='login-button'> Login through Discord </span>
                        </div>
                        <span>or use your account</span>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        
                        <button >Sign In</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn" onClick={this.signin.bind(this)}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" id="signUp" onClick={this.signup.bind(this)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Sign;