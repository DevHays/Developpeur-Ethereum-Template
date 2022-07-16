import React from 'react';
import './FlowStatus.css';

export default class FlowStatus extends React.Component {
    state = {statuschanges:null,web3:null,actualStatus:null,actualStatusLabel:"", contractOwnerAddress:null}

    workFlowStatus = [
        'RegisteringVoters',
        'ProposalsRegistrationStarted',
        'ProposalsRegistrationEnded',
        'VotingSessionStarted',
        'VotingSessionEnded',
        'VotesTallied'
    ]

    componentDidMount = async() =>{
        try{
            const {  web3,votingInstance, contractOwnerAddress } = this.props.state;
            let options = {
                fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
                toBlock: 'latest'
            };
            let options1 = {
                fromBlock: 'latest',                  //Number || "earliest" || "pending" || "latest"
            };
            
            let listStatusChange = await votingInstance.getPastEvents('WorkflowStatusChange', options);
            let actualStatusId = await votingInstance.methods.workflowStatus().call();
            let actualStatusLabel = "";
            //Checking if it is a number
            if(!isNaN(actualStatusId)){
                actualStatusLabel = this.workFlowStatus[Number(this.state.actualStatus)];
                this.setState({actualStatus:actualStatusId,actualStatusLabel:actualStatusLabel})
            }

            votingInstance.events.WorkflowStatusChange(options1).on('data', event => {
                listStatusChange.push(event);
                console.log(event);
                this.setState({actualStatus:event.newStatus});
            });

            this.setState({web3:web3,statuschanges:listStatusChange,contractOwnerAddress:contractOwnerAddress});
        }catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }
    }



    goNextStatus = async () => {
        // Get network provider and web3 instance.
        const { accounts,votingInstance } = this.props.state;
        //Suivant le statut ou l'on est on fait appel à l'appel vers le status suivant
        console.log(this.state.actualStatusLabel);
        try{
            switch(this.state.actualStatusLabel){
                case 'RegisteringVoters' :
                    votingInstance.methods.startProposalsRegistering().send({ from: accounts[0]});
                    break;
                case 'ProposalsRegistrationStarted' :
                    await votingInstance.methods.endProposalsRegistering({ from: accounts[0]}).call();
                case 'ProposalsRegistrationEnded' : 
                    await votingInstance.methods.startVotingSession({ from: accounts[0]}).call();
                case 'VotingSessionStarted':
                    await votingInstance.methods.endVotingSession({ from: accounts[0]}).call();
                case 'VotingSessionEnded':
                    await votingInstance.methods.tallyVotes({ from: accounts[0]}).call();
                case 'VotesTallied' :
                    alert('The vote is over');
                default :
                    alert('Please, reinitiate your FlowStatus');
            }
        }catch(error){
            alert(error.message);
            console.error(error);
        }
        //const transac = await votingInstance.methods.addVoter(addressValeur).send({from: accounts[0]});
    }
    
    render(){

        //Only Accessible to Admin

        if(this.state.web3 && this.props.addr[0] === this.state.contractOwnerAddress){
            console.log("ON sapprete a faire le retrun");
            return(

            <div className="FlowStatus">
                <h2>Admin Only</h2>
                <p>Manage FlowStatus</p>
                <p>We are currently in <i>{this.state.actualStatusLabel}</i> status.</p>
                <button onClick={this.goNextStatus}>Go to next Status</button>
                <table>
                    <thead> 
                        <tr>
                            <th>Test</th>
                        </tr>
                    </thead>
                    <tbody>
                       {/* {this.state.statuschange.map((addresse) => (
                            <tr key={addresse.returnValues.voterAddress}><td>{addresse.returnValues.voterAddress}</td></tr>
                       ))}*/}
                    </tbody>
                </table>
            </div>
            )
        }else{
            return("");
        }

    }

}