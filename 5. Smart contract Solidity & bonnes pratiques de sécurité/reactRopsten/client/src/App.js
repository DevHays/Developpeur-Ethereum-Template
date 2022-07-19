import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json"
import getWeb3 from "./getWeb3";
import Address from "./Address.js";
import FlowStatus from "./FlowStatus";
import Whitelist from "./Whitelist";
import Proposition from "./Proposition";
import "./App.css";


///@author chays
///@title Master component of the App, his jobs is to retrieve, and listen to the smartcontract. He is also in charge of displaying others components and providing them an updated state
class App extends Component {
  state = { web3: null,
    accounts: null, 
    contract: null, 
    addresses: null,
    votingInstance:null, 
    whiteLists:null, 
    userBalance:0, 
    contractOwnerAddress : null, 
    statusChanges:null, 
    actualStatus: null, 
    blockDates: [], 
    voters:null,
    voter:null,
    addressesWL:[],
    winningProposal:null};
  
  
  
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
      let actualStatusId = parseInt(await votingContract.methods.workflowStatus().call());
      //Checking if it is a number
      if(!isNaN(actualStatusId)){
        if(parseInt(actualStatusId) === parseInt(5)){
          const winningID = await votingContract.methods.winningProposalID().call();
          let winningProposal = await votingContract.methods.getOneProposal(winningID).call({from: accounts[0]});
          this.setState({winningProposal:winningProposal});
        }
        this.setState({actualStatus:Number(actualStatusId)})
      }


      let listStatusChange = await votingContract.getPastEvents('WorkflowStatusChange', options);
      
      
      listStatusChange.map(statusChange =>{
          let result = this.getAndStoreEventTimestamp(statusChange,web3);
          //We update the winner if the voteTallied status is active.
          return result ;
      });

      await votingContract.events.WorkflowStatusChange(options1).on('data',  async event => {   
        let statusChanges = this.state.statusChanges;
        this.getAndStoreEventTimestamp(event,web3);
        statusChanges.push(event);
        
        //Update winner info if workflow status is votetallied
        //Get Status Infos
        let actualStatusId = parseInt( await votingContract.methods.workflowStatus().call());
        //Checking if it is a number
        if(!isNaN(actualStatusId)){
          if(parseInt(actualStatusId) === parseInt(5)){
            const winningID = await votingContract.methods.winningProposalID().call();
            let winningProposal = await votingContract.methods.getOneProposal(winningID).call({from: accounts[0]});
            this.setState({winningProposal:winningProposal});
          }
        }
        
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
        _voter = await votingContract.methods.getVoter(accounts[0]).call({from:contractOwnerAddressTemp});
        this.setState({voter:_voter});  
      }catch(error){
          //*** ToDo catch the error when an adress is not a voter yet */
          console.error(error);
      }

      // Retrieve adding whistlists addresses
      let addresseList= [];
      try{
        addresseList = await votingContract.getPastEvents('VoterRegistered', options);
        votingContract.events.VoterRegistered(options1).on('data', event => {addresseList.push(event); this.setState({addressesWL:addresseList})});
        this.setState({addressesWL:addresseList});
      }catch (error) {
          alert(error.message);
          console.error(error);
      }

      //retrieve votes
      let _votes = await votingContract.getPastEvents('Voted', options)     
      votingContract.events.Voted(options1).on('data', event => {   
        let _voters = this.state.voters;
        _voters.push(event);         
        this.setState({voters:_voters});
      });

      this.setState({  web3 : web3, accounts, 
        votingInstance:votingContract, userBalance:balance, contractOwnerAddress : contractOwnerAddressTemp,
        statusChanges:listStatusChange, voters:_votes,voter:_voter,addressesWL:addresseList });
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
      return <div>Loading Web3, accounts, and contract... Maybe your wallet is not connected ?</div>;
    }
    return (
      <div className="App">
        <Address addr={ this.state.accounts } state={ this.state } balance={ this.state.userBalance } />        
        <h1>Voting DApp TP3!</h1>
        <h2>Actual Status :  <i>{ this.workFlowStatus[ Number( this.state.actualStatus ) ]}</i></h2>
        <button onClick={ this.hideWiteList }>Hide Whitelist</button>
        <table>
          <tbody>
            <tr>
              <td><Whitelist addr={ this.state.accounts } state={ this.state }   /></td>
              <td><FlowStatus addr={ this.state.accounts }  state={ this.state } /></td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td><Proposition state={ this.state } /></td>
            </tr>
          </tbody>
        </table>
        
        
      </div>
    );
  }
}

export default App;