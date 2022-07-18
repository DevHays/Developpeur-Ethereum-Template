import React from 'react';
import './Whitelist.css';

///@author  chays
///@title Display and allow contract owner to submit addresses in the whitelist and show existing WL addresses
export default class Whitelist extends React.Component {
    state = {addressesWL:null,web3:null}

    componentDidMount = async() =>{
        const {  web3,votingInstance } = this.props.state;
        let options = {
            fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
            toBlock: 'latest'
        };
        let options1 = {
            fromBlock: 'latest',                  //Number || "earliest" || "pending" || "latest"
        };
        
        try{
            //I didn't knew if i should place this code here or in App
            let addresseList = await votingInstance.getPastEvents('VoterRegistered', options);
            
            votingInstance.events.VoterRegistered(options1).on('data', event => {addresseList.push(event); this.setState({addressesWL:addresseList})});
            this.setState({addressesWL:addresseList, web3:web3});
        }catch (error) {
            alert(error.message);
            console.error(error);
          }
    }

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
        if(this.state.web3 && this.props.addr[0] === this.props.state.contractOwnerAddress){
            const totalVotersToRender = this.state.addressesWL.filter(addresse => addresse.returnValues.voterAddress);
            const numTotalVoters = totalVotersToRender.length;
            //Status 0 = registeringVoters
            const isRegisteringVoters = this.props.state.actualStatus === 0;
            return(
                <div  className="Whitelist">
                    <h2>Admin Only</h2>
                    <p>Add an adress to the whitelist</p>
                    
                    {isRegisteringVoters?
                        (<div><input type="text" id="whiteListAddr"/><button onClick={this.addWhitelist}>Add to the Whitelist</button></div>)
                        :("")}
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