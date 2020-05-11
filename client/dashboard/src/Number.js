import React, { Component } from 'react';
import io from 'socket.io-client';
import { Grid } from '@material-ui/core';
import { Cookies } from 'react-cookie';
class Number extends Component{

    constructor(props) {
        super(props)
        this.state = {
            nb_trivia:0,
            nb_Math:0,
            month:0,
            day:0,
            tpye:'',
            textTrivia:'',
            textMath:'',
            textDate:'',
            registered:false,
            service:'Number'
        };
        this.handleChangeTrivia = this.handleChangeTrivia.bind(this);
        this.handleChangeMonth = this.handleChangeMonth.bind(this);
        this.handleChangeDay = this.handleChangeDay.bind(this);
        this.handleChangeMath = this.handleChangeMath.bind(this);
        this.handleSubmitTrivia = this.handleSubmitTrivia.bind(this);
        this.handleSubmitMath = this.handleSubmitMath.bind(this);
        this.handleSubmitDate = this.handleSubmitDate.bind(this);
        this.register = this.register.bind(this);
        this.socket = io('http://localhost:8000');
    }

    componentWillMount(){
        const cookies = new Cookies();
        var email = cookies.get('email')
        console.log(email)
        this.socket.emit("isRegistered",email, this.state.service );
        this.socket.on("registered",(registered) =>{
            console.log(registered);
            if (registered){
                this.setState({registered: true})
            }
        })
    }
    register(){
        this.socket.emit("register", this.props.email, this.state.service);
        this.socket.on("registered", (msg)=>{
            if(msg){
                this.setState({registered:true})
            }
        })
        console.log(this.state.registered);
    }

    handleChangeTrivia(event) {
        this.setState({nb_trivia: event.target.value});
        
    }

    handleChangeMath(event) {
        this.setState({nb_Math: event.target.value});
        
    }

    handleChangeMonth(event) {
        this.setState({month: event.target.value});
        
    }
    handleChangeDay(event) {
        this.setState({day: event.target.value});
        
    }
    
    handleSubmitTrivia(event) {
        this.socket.emit('getNumberTrivia',this.state.nb_trivia);
        this.socket.on('NumberTrivia',async (body)=>{
            await this.setState({textTrivia: body});
        })
        event.preventDefault();
    }

    handleSubmitMath(event) {
        this.socket.emit('getNumberMath',this.state.nb_Math);
        this.socket.on('NumberMath',async (body)=>{
            await this.setState({textMath: body});
        })
        event.preventDefault();
    }

    handleSubmitDate(event) {
        this.socket.emit('getNumberDate',this.state.month, this.state.day);
        this.socket.on('NumberDate',async (body)=>{
            await this.setState({textDate: body});
        })
        event.preventDefault();
    }

    render(){
        console.log(this.state.registered)
        if(this.state.registered){
            return(
            <div>
    
                <Grid container spacing={3}>
                
                    <Grid item xs>
                        <h1>Trivia of the Number</h1>
                            
                            <form onSubmit={this.handleSubmitTrivia}>
                            
                                <label>
                                Number:
                                <input type="text"  placeholder="Number" value={this.state.nb_trivia} onChange={this.handleChangeTrivia} />
                                </label>
                                <p>{this.state.textTrivia}</p>
                                <button type="submit"> choose </button>
                                
                            </form>
                    
                    </Grid>
                    <Grid item xs>
                        <h1>Tips in Math </h1>
                            <form onSubmit={this.handleSubmitMath}>
                                <label>
                                    Number:
                                    <input type="text" placeholder="Number" value={this.state.nb_Math} onChange={this.handleChangeMath} />
                                </label>
                                <p>{this.state.textMath}</p>
                                <button type="submit"> choose </button>
                                
                            </form>
                        
                    </Grid>
                    <Grid item xs>
                        <h1>This day in History</h1>
                        <form onSubmit={this.handleSubmitDate} >
                            <label>
                            <Grid container spacing={2}>
                                <Grid item xs>
                                    Month in Number
                                    <input type="text" placeholder="month" value={this.state.month} onChange={this.handleChangeMonth} />
                                </Grid>
                                <Grid item xs>  
                                    Day in Number  
                                    <input type="text" placeholder="day" value={this.state.day} onChange={this.handleChangeDay} />
                                </Grid>
                            </Grid>
                            </label>
                            <p>{this.state.textDate}</p>
                            <button type="submit"> choose </button>
                            
                        </form>
                        
                    </Grid>
                </Grid>
        
            </div>
            )
        }
        else{
            return (
                <div>
                    Service Number <button onClick ={this.register}> choose </button>
                </div>
            )
        }
    }
}
export default Number;