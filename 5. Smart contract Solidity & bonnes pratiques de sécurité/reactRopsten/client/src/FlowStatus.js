import React from 'react';
import './FlowStatus.css';

export default class FlowStatus extends React.Component {
    state = { }
    
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

            this.setState({web3:web3});
        }catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }
    }



    ///
    goNextStatus = async () => {
        // Get network provider and web3 instance.
        const { accounts,votingInstance, actualStatus  } = this.props.state;
        
        //Suivant le statut ou l'on est on fait appel à l'appel vers le status suivant
        try{
            switch(actualStatus){
                case 0 :
                    votingInstance.methods.startProposalsRegistering().send({ from: accounts[0]});
                    break;
                case 1 :
                    await votingInstance.methods.endProposalsRegistering().send({ from: accounts[0]});
                    break;
                case 2 : 
                    await votingInstance.methods.startVotingSession().send({ from: accounts[0]});
                    break;
                case 3:
                    await votingInstance.methods.endVotingSession().send({ from: accounts[0]});
                    break
                case 4:
                    await votingInstance.methods.tallyVotes().send({ from: accounts[0]});
                    break;
                case 5 :
                    alert('The vote is over');
                    break;
                default :
                    alert('Please, reinitiate your FlowStatus');
                    break;
            }

        }catch(error){
            alert(error.message);
            console.error(error);
        }
        //const transac = await votingInstance.methods.addVoter(addressValeur).send({from: accounts[0]});
    }
    
    render(){

        //Only Accessible to Admin
        console.log("props Status",this.props);
        if(this.props.state.web3 &&  this.props.state.statusChanges && this.props.addr[0] === this.props.state.contractOwnerAddress){
            return(

            <div className="FlowStatus">
                <h2>Admin Only</h2>
                <p>Manage FlowStatus</p>
                <button onClick={this.goNextStatus}>Change Status For {this.workFlowStatus[Number(this.props.state.actualStatus)+1]  }</button>
                <table>
                    <thead> 
                        <tr>
                            <th>From</th>
                            <th>To</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                       {
                       this.props.state.statusChanges.map((statusChange) => (
                            <tr key={statusChange.transactionHash}>
                                <td><i>{this.workFlowStatus[Number(statusChange.returnValues.previousStatus)]}</i></td>
                                <td><i>{this.workFlowStatus[Number(statusChange.returnValues.newStatus)] }</i></td>
                                <td>{this.props.state.blockDates[statusChange.blockNumber]}</td>
                            </tr>
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