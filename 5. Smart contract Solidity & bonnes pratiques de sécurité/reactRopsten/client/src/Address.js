import React from 'react';
import './Address.css';


export default class Address extends React.Component {

    ///@notice Check if a user is registered
    ///@return boolean
    isRegistered = () => {
        const result = this.props.state.addressesWL.find(
            addr => addr.returnValues.voterAddress === this.props.state.accounts[0]);
        return (typeof(result) != "undefined" );
    }

    ///@notice Check if a user has voted
    ///@return boolean
    hasVoted = () =>{
        if(this.props.state.voters){
                const result = this.props.state.voters.find(
                    voter => voter.returnValues.voter === this.props.state.accounts[0]
                );
                return typeof(result) != "undefined" ; 
        }
        else{
            return false;
        }
    }

    render(){
        return(
            <div className='header'>
                <p>Your Address: <strong>{this.props.addr}</strong></p>
                <p>Balance : <strong>{this.props.balance}</strong> rEth</p>
                <p>Whitelisted : <strong>{this.isRegistered()?"Yes":"No"}</strong></p>
                <p>Voted : <strong>{this.hasVoted() ?"Yes":"No"}</strong></p>
                </div>
        )
    }
}