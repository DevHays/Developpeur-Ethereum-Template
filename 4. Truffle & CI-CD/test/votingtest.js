
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const constants = require('@openzeppelin/test-helpers/src/constants');
const truffleAssert = require('truffle-assertions');
const Voting = artifacts.require("./Voting.sol");

contract("Voting",accounts=>{
    const owner = accounts[0];
    const second = accounts[1];
    const third = accounts[2];
    const forth = accounts[3];
    const fifth = accounts[4];
    const nonVoter = accounts[8];

    let VotingInstance;



    describe("Test des ajouts de votants, events et onlyOwners",function(){
        var ownerError = 'Ownable: caller is not the owner';
        let VotingInstance;
        before(async function(){
            
            VotingInstance = await Voting.deployed();
        })



        it("refuse les appels des fonctions onlyOwner par des non-Owner.", async()=>{
            await expectRevert(VotingInstance.addVoter(second,{from:second}), ownerError);
            await expectRevert(VotingInstance.startProposalsRegistering({from:second}), ownerError);
            await expectRevert(VotingInstance.endProposalsRegistering({from:second}), ownerError);
            await expectRevert(VotingInstance.startVotingSession({from:second}), ownerError);
            await expectRevert(VotingInstance.endVotingSession({from:second}), ownerError);
            await expectRevert(VotingInstance.tallyVotes({from:second}), ownerError);
        })

        it("peux enregistrer les votants en whiteliste.", async()=>{

            // Ajout des votants
            const storedDataEvent = await VotingInstance.addVoter(second);


            //Renvoie un event lors de l'ajout
            it('renvoie un event lors de l ajout',async()=>{
                await expectRevert(VotingInstance.addVoter(second), "test");
            });

            it('a deja ajouté le votant.', async ()=> {
                await expectRevert( VotingInstance.addVoter(second), 'Already registered');
            });
        })

        it("ajoute des votants", async()=>{
            await VotingInstance.addVoter(third);
            await VotingInstance.addVoter(forth);
        })


        it('bloque les changement interdits du workflowstatus',async ()=>{
            await expectRevert( VotingInstance.endProposalsRegistering(),'Registering proposals havent started yet');
            await expectRevert( VotingInstance.startVotingSession(),'Registering proposals phase is not finished');
            await expectRevert( VotingInstance.endVotingSession(),'Voting session havent started yet');
            await expectRevert( VotingInstance.tallyVotes(),'Current status is not voting session ended');
        })

        it('peux changer le workflowstatus de Register vers ProposalsRegistrationStarted', async()=>{
            const expectEventResult = await VotingInstance.startProposalsRegistering();
            expectEvent( expectEventResult,'WorkflowStatusChange',{
                previousStatus : new BN(0),
                newStatus: new BN(1)
            }   );
        })

        it('bloque l ajout de votant en WorkflowStatus ProposalsRegistrationStarted', async()=>{
            await expectRevert( VotingInstance.addVoter(second), 'Voters registration is not open yet');
        })

        it('bloque l ajout de proposal pour les non votant', async()=>{
            await expectRevert(VotingInstance.addProposal('MyProposal'), "You're not a voter");
        })

        it('ajoute une proposal', async()=>{
            let resultAddVote = await VotingInstance.addProposal("Francois est genial",{from:second});
            expectEvent( resultAddVote,'ProposalRegistered',{
                proposalId : new BN(0)
            });
            
            let resultVote = await VotingInstance.getOneProposal.call(0,{from:second});
            expect(resultVote.description).to.equal("Francois est genial");

            //Ajout d'une deuxieme proposal 
            let resultProposal2 = await VotingInstance.addProposal("Cyril est genial",{from:third});
            expectEvent( resultProposal2,'ProposalRegistered',{
                proposalId : new BN(1)
            });

            let resultVote2 = await VotingInstance.getOneProposal.call(1,{from:second});
            expect(resultVote2.description).to.equal("Cyril est genial");


        })

        it('change le WorkFlowStatus pour endProposalsRegistrationEnded', async()=>{
            const expectEventResult = await VotingInstance.endProposalsRegistering();
            expectEvent( expectEventResult,'WorkflowStatusChange',{
                previousStatus : new BN(1),
                newStatus: new BN(2)
            }   );
        })

        it('change le WorkFlowStatus pour VotingSessionStarted', async()=>{
            const expectEventResult = await VotingInstance.startVotingSession();
            expectEvent( expectEventResult,'WorkflowStatusChange',{
                previousStatus : new BN(2 ),
                newStatus: new BN(3)
            }   );
        })

        it('refuser le vote a un non votant',async()=>{
            await expectRevert( VotingInstance.setVote(0,{from:nonVoter}),"You're not a voter");
        })

        
        it('refuser le vote sur une proposition non existante',async()=>{
            await expectRevert( VotingInstance.setVote(9,{from:second}),'Proposal not found');
        })

        it('permet a un votant de voter',async()=>{
            let result = await VotingInstance.setVote(0,{from:second});
            expectEvent(result,'Voted',{
                voter:second,
                proposalId:BN(0)
            });

            //Ajout des autres votants afin d'avoir plusieurs resultats
            await VotingInstance.setVote(1,{from:third});
            await VotingInstance.setVote(1,{from:forth});
        })

        it('change le workflowstatus pour VotingSessionEnded', async()=>{
            const expectEventResult = await VotingInstance.endVotingSession();
            expectEvent( expectEventResult,'WorkflowStatusChange',{
                previousStatus : new BN(3),
                newStatus: new BN(4)
            }   );
        })
        
        it('change le statut  pour tallied',async()=>{
            const voteResult = await VotingInstance.tallyVotes();
            expectEvent( voteResult,'WorkflowStatusChange',{
                previousStatus : new BN(4),
                newStatus: new BN(5)
            }   );
        })

        //Je n'ai pas reussi a recuperer l'adresse du gagnant
        //Je laisse le test pour montrer le test de typage de données
        it('recupere l addresse du gagnant',async()=>{
            expect(await VotingInstance.winningProposalID()).to.be.a('number');
            expect(BN(await VotingInstance.winningProposalID())).to.be.equal(BN(third));
        })
    });
});