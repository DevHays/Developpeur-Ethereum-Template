//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


contract Voting is Ownable{

    struct Voter{
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal{
        string description;
        uint voteCount;
    }

    struct voteResult{
        address voterAddress;
        Proposal proposal;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus,WorkflowStatus NewStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    uint winningProposalId;

    WorkflowStatus workflowStatus = WorkflowStatus.RegisteringVoters;

    Proposal[] proposalArray;
    mapping(address=>Voter) votersMap;

    constructor() {
        //Prise en compte du vote blanc 
        proposalArray.push(Proposal("Vote Blanc",0));
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }

    function setWhitelistWithListe(address[] calldata whitelistArray) public onlyOwner{
        //Verification du workflowstatus et de la liste envoyee
        require(whitelistArray.length > 0,"La liste est vide ou incorrecte.");
        require(workflowStatus == WorkflowStatus.RegisteringVoters,unicode"Le workflow n'est pas à l'état d'enregistrement des votants.");
        for(uint i = 0; i< whitelistArray.length; i++  ){
            votersMap[whitelistArray[i]].isRegistered = true;
            emit VoterRegistered(whitelistArray[i]);
        }
    }

    function addWhitelist(address _addr) public onlyOwner{
        //Verification du workflowstatus
        require(workflowStatus == WorkflowStatus.RegisteringVoters,unicode"Le workflow n'est pas à l'état d'enregistrement des votants.");
        votersMap[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    function startProposaleRegistration() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters,unicode"Le workflow n'est pas à l'état d'enregistrement des votants.");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters,WorkflowStatus.ProposalsRegistrationStarted);
    }

    function endProposalRegistration() public onlyOwner{
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,unicode"Le workflow n'est pas à l'état d'enregistrement des propositions.");
        require(proposalArray.length >0,unicode"Il n'y à pas de proposition disponible.");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted,WorkflowStatus.ProposalsRegistrationEnded);
    }

    function startVoting() public onlyOwner{
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,unicode"Les inscriptions ne sont pas terminés");
        require(proposalArray.length >0,unicode"Il n'y à pas de proposition disponible.");
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded,WorkflowStatus.VotingSessionStarted);
    }

    function endVoting() public onlyOwner{
        require(workflowStatus == WorkflowStatus.VotingSessionStarted,unicode"Les votes n'ont pas commencés.");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted,WorkflowStatus.VotingSessionEnded);
    }
    
    function computeVote() public onlyOwner returns(  Proposal memory bestProposal)  {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, unicode"Le Vote n'est pas terminé!");
        for(uint i=0; i< proposalArray.length;i++){
            if(proposalArray[i].voteCount> 0 && proposalArray[i].voteCount>bestProposal.voteCount){
                bestProposal = proposalArray[i];
                winningProposalId = i;
            }
        }
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotesTallied,WorkflowStatus.VotingSessionEnded);
        return bestProposal;
    }
    
    function getWinner() public view returns(Proposal memory bestProposal) {
        require(workflowStatus == WorkflowStatus.VotesTallied, unicode"Le calcul du vote n'à pas été effectué!");        
        return proposalArray[winningProposalId];
    }

    function submitProposal(string calldata _description) public{
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,"L'envoi de proposition n'est pas ouvert.");
        proposalArray.push(Proposal(_description,0));
        emit ProposalRegistered(proposalArray.length-1);
    }

    function voteProposal(uint _proposalId) public {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted,"Les inscriptions ne sont pas ouvertes.");
        require(proposalArray.length > _proposalId -1,unicode"La proposal n'existe pas.");

        //Verification si le votant est bien autorisé
        require(votersMap[msg.sender].isRegistered, unicode"Vous n'êtes pas autorisé à voter.");
        require(votersMap[msg.sender].hasVoted, unicode"Vous avez déjà voté.");
        //Enregistrement du vote
        proposalArray[_proposalId].voteCount = proposalArray[_proposalId].voteCount +1 ;
        votersMap[msg.sender].hasVoted = true;
        votersMap[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender,_proposalId);        
    }

    //Renvoie le vote effectué par les votants pour une proposition donnée
    function getVotesByVoterAddress(address _addr) view public returns(Voter memory){
        //On garde le vote confidentiel, jusqu'a la fermeture des votes
        require(workflowStatus == WorkflowStatus.VotesTallied, unicode"Le calcul du vote n'à pas été effectué!");
        require(votersMap[_addr].isRegistered,unicode"L'adresse n'est pas whitelisté");
        return votersMap[_addr];
    }

    function getProposalList() view public returns(Proposal[] memory ){
        return proposalArray;
    }

}