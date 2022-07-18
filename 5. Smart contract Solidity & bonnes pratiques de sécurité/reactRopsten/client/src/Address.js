import React from 'react';
import './Address.css';


export default class Address extends React.Component {

    render(){
        return(
            <div className='header'>
                <p>Your Address: <strong>{this.props.addr}</strong></p>
                <p>Balance : <strong>{this.props.balance}</strong> rEth</p>
                <p>Whitelisted : <strong>{this.props.voter.isRegistered?"Yes":"No"}</strong></p>
                <p>Voted : <strong>{this.props.voter.hasVoted ?"Yes":"No"}</strong></p>
                </div>
        )
    }

}