import React from 'react';
import './Address.css';


export default class Address extends React.Component {

    render(){
        console.log("THis.state",this.props);
        const isRegistered = this.props.state.voter !== undefined;
        return(
            <div className='header'>
                <p>Your Address: <strong>{this.props.addr}</strong></p>
                <p>Balance : <strong>{this.props.balance}</strong> rEth</p>
                <p>Whitelisted : <strong>{isRegistered&&this.props.state.voter.isRegistered?"Yes":"No"}</strong></p>
                {isRegistered?(<p>Voted : <strong>{this.props.state.voter.hasVoted ?"Yes":"No"}</strong></p>):""}
                </div>
        )
    }
}