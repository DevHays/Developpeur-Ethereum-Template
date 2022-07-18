import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import VotingContract from "./contracts/Voting.json"
import getWeb3 from "./getWeb3";
import Address from "./Address.js";
import FlowStatus from "./FlowStatus";
import Whitelist from "./Whitelist";

import "./App.css";
import Proposition from "./Proposition";


class App extends Component {
  state = { web3: null, accounts: null, contract: null, addresses: null ,
    votingInstance:null, whiteLists:null, userBalance:0, contractOwnerAddress : null, 
    statusChanges:null, actualStatus: null, blockDates: [], voters:[],voter:null};
  
  workFlowStatus = [
    'RegisteringVoters',
    'ProposalsRegistrationStarted',
    'ProposalsRegistrationEnded',
    'VotingSessionStarted',
    'VotingSessionEnded',
    'VotesTallied'
  ]

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

      let options = {
        fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
        toBlock: 'latest'
      };

      let options1 = {
        fromBlock: 'latest',                  //Number || "earliest" || "pending" || "latest"
      };

      //Get Status Infos
      let actualStatusId = await votingContract.methods.workflowStatus().call();
      //Checking if it is a number
      if(!isNaN(actualStatusId)){
        this.setState({actualStatus:Number(actualStatusId)})
      }

      let listAddress = await instance.getPastEvents('dataStored', options);
      instance.events.dataStored(options1).on('data', event => listAddress.push(event));

      let listStatusChange = await votingContract.getPastEvents('WorkflowStatusChange', options);

      //Retrieve and store the txs timestamp
      listStatusChange.map(statusChange =>{
          let result = this.getAndStoreEventTimestamp(statusChange,web3);
          return result ;
      });

      await votingContract.events.WorkflowStatusChange(options1).on('data', event => {   
        let statusChanges = this.state.statusChanges;
        this.getAndStoreEventTimestamp(event,web3);
        statusChanges.push(event);         
        this.setState({actualStatus:Number(event.returnValues.newStatus),statusChanges:statusChanges});
      });

      //Get the owner of the wallet balance
      let balance  = await web3.eth.getBalance(accounts[0]);
      balance = web3.utils.fromWei(balance,'ether');
      balance = Math.round(balance * 100) / 100;

      //Getting owner's contract address
      let contractOwnerAddressTemp = await votingContract.methods.owner().call();
      let _voter;
      //retrieve the voter object
      try{
        //A little cheat on the caller address because onlyVoters is 
        console.log(contractOwnerAddressTemp);
        _voter = await votingContract.methods.getVoter(accounts[0]).call({from:contractOwnerAddressTemp});
        console.log("_voter",_voter);
        this.setState({voter:_voter});  
      }catch(error){
          //*** ToDo catch the error when an adress is not a voter yet */
          console.error(error);
      }

      //retrieve votes
      let _votes = await votingContract.getPastEvents('Voted', options)
      console.log("Votes", _votes);
      votingContract.events.Voted(options1).on('data', event => {   
        console.log(this.state.voter);
        let _voters = [...this.state.voter];

        _voters.push(event.returnValues.voter);         
        this.setState({voters:_voters});
          
      });


      this.setState({  web3 : web3, accounts, contract: instance, addresses:listAddress, 
        votingInstance:votingContract, userBalance:balance, contractOwnerAddress : contractOwnerAddressTemp,
        statusChanges:listStatusChange, voters:_votes,voter:_voter });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error.message,
       );
      console.error(error);
    }
  };

    
  ///@notice Retrieve and store the timeStamp of an event
  async getAndStoreEventTimestamp(event,_web3){
      //Get the tx timeStamp
      let blockInfos = await _web3.eth.getBlock(event.blockNumber);
      let blockDate = this.state.blockDates;
      const milliseconds = blockInfos.timestamp * 1000;
      let dateLabel = new Date(milliseconds).toLocaleDateString("en-GB") + " " + new Date(milliseconds).toLocaleTimeString();
      blockDate[Number(event.blockNumber)] = dateLabel;
      this.setState({blockDates:blockDate});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    console.log("this.stat",this.state);
    return (
      <div className="App">
        <Address addr={this.state.accounts} state={this.state} balance={this.state.userBalance} />        
        <h1>Voting DApp TP3!</h1>
        <h2>Actual Status :  <i>{this.workFlowStatus[Number(this.state.actualStatus)]}</i></h2>
        <button onClick={this.hideWiteList}>Hide Whitelist</button>
        <table>
          <tbody>
            <tr>
              <td><Whitelist addr={this.state.accounts} state={this.state}   /></td>
              <td><FlowStatus addr={this.state.accounts}  state={this.state} /></td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td><Proposition state={this.state} /></td>
            </tr>
          </tbody>
        </table>
        
        
      </div>
    );
  }
}

export default App;