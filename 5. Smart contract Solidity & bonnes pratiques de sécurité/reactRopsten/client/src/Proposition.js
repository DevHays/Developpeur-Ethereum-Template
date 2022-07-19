
import React from 'react';
import './Proposition.css';

///@author  chays
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

            //Retrieve and store the txs timestamp
            proposalList.forEach(proposal =>{
                let proposalObject = votingInstance.methods.getOneProposal(Number(proposal.returnValues.proposalId)).call({from: accounts[0]});
                proposalObject.then( result => {
                    //Add the proposalId
                    const results = [...result,proposal.returnValues.proposalId];
                    updatedProposalList.push(results);
                    this.setState({updateProposalList : updatedProposalList})
                }); 
            });
            
            votingInstance.events.ProposalRegistered(options1).on('data', event => {
                let proposalObject = votingInstance.methods.getOneProposal(Number(event.returnValues.proposalId)).call({from: accounts[0]});
                proposalObject.then( result => {
                    //Add the proposalId
                    const results = [...result,event.proposalId];
                    updatedProposalList.push(results);
                    this.setState({updateProposalList : updatedProposalList})
                });
            });

            
            //When a vote happened we update the vote in proposal lists
            votingInstance.events.Voted(options1).on('data', async event => {   
                let proposalObject = await votingInstance.methods.getOneProposal(Number(event.returnValues.proposalId)).call({from: accounts[0]});
                //update of the proposals
                let proposals = this.state.updateProposalList;
                
                proposals.map(proposal => {
                    if(proposal.proposalId === proposalObject.proposalId){
                        return proposalObject;
                    }else{
                        return proposal;
                    }
                });
                let _voters = this.props.state.voters;
                _voters.push(event);
                this.setState({updateProposalList:proposals});
                this.setState({voters:_voters});    
            });

            this.setState({ web3:web3,updateProposalList:updatedProposalList});
        }catch (error) {
            alert(error.message);
            console.error(error);
        }
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

    ///@notice send proposal to the smart contract thats is listened by this component.
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

    ///@notice Retrieve and store the timeStamp of an event
    async vote(proposalId){
        // Get network provider and web3 instance.
        const { accounts,votingInstance } = this.props.state;
        try{
           await votingInstance.methods.setVote(Number(proposalId)).send({from:accounts[0]});
        }catch(error){
            
        }
    }

    render(){
        if(this.props.state.web3 && this.state.updateProposalList){
            const isProposalsRegistrationStarted = this.props.state.actualStatus === 1;
            const isVotingSessionStarted = this.props.state.actualStatus === 3;
            const isVotingSessionHappened = this.props.state.actualStatus >=2;
            const voteIsOver = this.props.state.actualStatus === 5;

            return(
                <div  className="Proposition">
                    <h2>Proposal</h2>
                    { isProposalsRegistrationStarted?
                        (<div>
                            <p>Submit your proposal :</p>
                            <input type="textarea" id="proposalText"/>
                            <button onClick={ this.addProposal }>Submit proposal</button>
                        </div>):
                        ""
                    }
                    { voteIsOver?
                        (<div>
                            <p>The vote is over</p>
                            <p>The winning proposal is : <strong>{this.props.state.winningProposal.description}</strong></p>
                            <p>With <strong>{this.props.state.winningProposal.voteCount}</strong> votes.</p>
                        </div>):
                        ""
                    }
                    <table>
                        <thead> 
                            <tr>
                                <th>Description</th>
                                {isVotingSessionHappened? ( <th>Votes</th> ): ""}
                                {isVotingSessionStarted?( <th>Vote</th> ):""}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.updateProposalList.map((proposal) => (
                                <tr key={ proposal[2] }><td>{ proposal[0] }</td>
                                { isVotingSessionHappened? ( <td>{ proposal[1] }</td> ) : "" }
                                { isVotingSessionStarted?(<td><button onClick={()=>this.vote(proposal[2])} disabled={this.hasVoted()}>Vote</button></td>) : "" }
                                </tr>
                            )) }
                        </tbody>

                    </table>
                </div>
            )
        }else{
            return("...Loading in progress.");
        }
    } 
}
