import React from 'react';
import './Address.css';


export default class Address extends React.Component {

    render(){
        return(
            <div className='header'>
                <p>Your Address: {this.props.addr}</p>
                <p>Balance : {this.props.balance} rEth</p>
                </div>
            
        )
    }

}