import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import VotingContract from "./contracts/Voting.json"
import getWeb3 from "./getWeb3";
import Address from "./Address.js";
import FlowStatus from "./FlowStatus";
import Whitelist from "./Whitelist";

import "./App.css";


class App extends Component {
  state = { web3: null, accounts: null, contract: null, addresses: null ,
    votingInstance:null, whiteLists:null, userBalance:0, contractOwnerAddress : null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );


      const deployedVotingContractNetWork = VotingContract.networks[networkId];
      const votingContract = new web3.eth.Contract(
        VotingContract.abi,
        deployedVotingContractNetWork && deployedVotingContractNetWork.address,
      );

      //Get the owner of the wallet balance
      let balance  = await web3.eth.getBalance(accounts[0]);
      balance = web3.utils.fromWei(balance,'ether');
      balance = Math.round(balance * 100) / 100;

      let options = {
        fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
        toBlock: 'latest'
      };

      let options1 = {
        fromBlock: 'latest',                  //Number || "earliest" || "pending" || "latest"
      };

      let listAddress = await instance.getPastEvents('dataStored', options);

      instance.events.dataStored(options1).on('data', event => listAddress.push(event));

      let contractOwnerAddressTemp = await votingContract.methods.owner().call();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({  web3 : web3, accounts, contract: instance, addresses:listAddress, votingInstance:votingContract, userBalance:balance, contractOwnerAddress : contractOwnerAddressTemp });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error.message,
       );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const status = "En cours";

    return (
      <div className="App">
        <Address addr={this.state.accounts} balance={this.state.userBalance} />        
        <h1>Voting DApp TP3!</h1>
        <h2>We are currently in <i>{status}</i> status.</h2>

        {/*I would have like to do it in a cleaner way, letting my component have access
        to the state of App */}
        <table>
          <tbody>
            <tr>
              <td><Whitelist addr={this.state.accounts} state={this.state} /></td>
              <td><FlowStatus addr={this.state.accounts}  state={this.state} /></td>
            </tr>
          </tbody>
        </table>
        
        
      </div>
    );
  }
}

export default App;