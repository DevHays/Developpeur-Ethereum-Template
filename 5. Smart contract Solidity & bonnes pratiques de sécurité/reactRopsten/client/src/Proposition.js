import { resolve } from 'path';
import React from 'react';
import './Proposition.css';

///@title Display and allow users to submit proposal and vote for it
export default class Proposition extends React.Component{
    state = { proposalList:[], blockDates:[],updateProposalList:[]}

    ///@notice subscribe and listen ProposalRegistered events, gather data from it and make it accessible in the state
    componentDidMount = async() =>{
        const {  web3,votingInstance, accounts } = this.props.state;
        let options = {
            fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
            toBlock: 'latest'
        };
        let options1 = {
            fromBlock: 'latest',                  //Number || "earliest" || "pending" || "latest"
        };
        
        try{
            let updatedProposalList =this.state.updateProposalList ;
            let proposalList = await votingInstance.getPastEvents('ProposalRegistered', options);
            let proposalIdTemp;
            //Retrieve and store the txs timestamp
            proposalList.map(proposal =>{
                proposalIdTemp = proposal.proposalId;
                let proposalObject = votingInstance.methods.getOneProposal(Number(proposal.returnValues.proposalId)).call({from: accounts[0]});
                proposalObject.then( result => {
                    //Add the proposalId
                    const results = [...result,proposal.returnValues.proposalId];
                    updatedProposalList.push(results);
                    this.setState({updateProposalList : updatedProposalList})
                }); 
            });
            
            votingInstance.events.ProposalRegistered(options1).on('data', event => {
                proposalIdTemp = event.proposalId;
                let proposalObject = votingInstance.methods.getOneProposal(Number(event.returnValues.proposalId)).call({from: accounts[0]});
                proposalObject.then( result => {
                    //Add the proposalId
                    const results = [...result,event.returnValues.proposalId];
                    updatedProposalList.push(results);
                    this.setState({updateProposalList : updatedProposalList})
                });
            });

            this.setState({ web3:web3,updateProposalList:updatedProposalList});
        }catch (error) {
            alert(error.message);
            console.error(error);
          }
    }

    ///@dev send proposal to the smart contract thats is listened by this component.
    addProposal = async() => {
        try{
            // Get network provider and web3 instance.
            const { accounts,votingInstance } = this.props.state;

            let proposalDescription=document.getElementById("proposalText").value;
            await votingInstance.methods.addProposal(proposalDescription).send({from: accounts[0]});
        }catch(error){
            alert(
                error.message,
            );
            console.error(error);
        }
    }

    render(){
        if(this.props.state.web3 && this.state.updateProposalList){
            return(
                <div  className="Proposition">
                    <h2>Proposal</h2>
                    <p>Submit your proposal :</p>
                    <input type="textarea" id="proposalText"/>
                    <button onClick={this.addProposal}>Add to the Whitelist</button>
                    <table>
                        <thead> 
                            <tr>
                                <th>Description</th>
                                <th>Votes</th>
                                <th>Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.updateProposalList.map((proposal) => (
                                <tr key={proposal[2]}><td>{proposal[0]}</td>
                                <td>{proposal[1]}</td>
                                <td>{proposal[2]}</td></tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )
        }else{
            return("...Loading in progress.");
        }
    } 
}
