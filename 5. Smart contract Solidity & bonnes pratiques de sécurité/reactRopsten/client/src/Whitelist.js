import React from 'react';
import './Whitelist.css';

///@author  chays
///@title Display and allow contract owner to submit addresses in the whitelist and show existing WL addresses
export default class Whitelist extends React.Component {

    ///@notice Add an address to the whitelist
    addWhitelist = async () => {
        try{
            // Get network provider and web3 instance.
            const { accounts, web3,votingInstance } = this.props.state;

            let whiteListAddr=document.getElementById("whiteListAddr").value;
            //Check address format
            let addressValeur = web3.utils.toChecksumAddress(whiteListAddr);
            await votingInstance.methods.addVoter(addressValeur).send({from: accounts[0]});
        }catch(error){
            alert(
                error.message,
            );
            console.error(error);
        }
    }
    
    ///@notice display whitelist form
    render(){
        //Only Accessible to Admin
        if(this.props.state.web3 && this.props.addr[0] === this.props.state.contractOwnerAddress){
            const totalVotersToRender = this.props.state.addressesWL.filter(addresse => addresse.returnValues.voterAddress);
            const numTotalVoters = totalVotersToRender.length;
            //Status 0 = registeringVoters
            const isRegisteringVoters = this.props.state.actualStatus === 0;
            return(
                <div  className="Whitelist">
                    <h2>Admin Only</h2>
                    <p>Add an adress to the whitelist</p>
                    
                    { isRegisteringVoters ?
                        (<div><input type="text" id="whiteListAddr"/><button onClick={ this.addWhitelist }>Add to the Whitelist</button></div>)
                        :("") }
                    <table>
                        <thead> 
                            <tr>
                                <th>Whitelisted Addresses ({ numTotalVoters })</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.props.state.addressesWL.map((addresse) => (
                                <tr key={ addresse.returnValues.voterAddress }><td>{ addresse.returnValues.voterAddress }</td></tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )
        }else{
            return("");
        }

    }

}