import React from 'react';
import './Whitelist.css';

export default class Whitelist extends React.Component {
    state = {addressesWL:null,web3:null,contactOwnerAddress:null}

    componentDidMount = async() =>{
        try{
            const {  web3,votingInstance,contractOwnerAddress } = this.props.state;
            let options = {
                fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
                toBlock: 'latest'
            };
            let options1 = {
                fromBlock: 'latest',                  //Number || "earliest" || "pending" || "latest"
            };
            
            let listAddress = await votingInstance.getPastEvents('VoterRegistered', options);
            
            votingInstance.events.VoterRegistered(options1).on('data', event => {listAddress.push(event); this.setState({addressesWL:listAddress})});
            this.setState({addressesWL:listAddress, web3:web3, contractOwnerAddress:contractOwnerAddress});
        }catch (error) {
            alert(error.message);
            console.error(error);
          }
    }

    addWhitelist = async () => {
        try{
            // Get network provider and web3 instance.
            const { accounts, web3,votingInstance } = this.props.state;

            let whiteListAddr=document.getElementById("whiteListAddr").value;
            //Check address format
            let addressValeur = web3.utils.toChecksumAddress(whiteListAddr);
            const transac = await votingInstance.methods.addVoter(addressValeur).send({from: accounts[0]});
        }catch(error){
            alert(
                error.message,
            );
            console.error(error);
        }
    }
    
    render(){
        //Only Accessible to Admin
        if(this.state.web3 && this.props.addr[0] === this.state.contractOwnerAddress){
            const totalVotersToRender = this.state.addressesWL.filter(addresse => addresse.returnValues.voterAddress);
            const numTotalVoters = totalVotersToRender.length;
            return(
                <div  className="Whitelist">
                    <h2>Admin Only</h2>
                    <p>Add an adress to the whitelist</p>
                    <input type="text" id="whiteListAddr"/>
                    <button onClick={this.addWhitelist}>Add to the Whitelist</button>
                    <table>
                        <thead> 
                            <tr>
                                <th>Whitelisted Addresses ({numTotalVoters})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.addressesWL.map((addresse) => (
                                <tr key={addresse.returnValues.voterAddress}><td>{addresse.returnValues.voterAddress}</td></tr>
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