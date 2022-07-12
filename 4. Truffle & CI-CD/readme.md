  Tests effectué avec le fichier voting.sol présent sur le drive.
  Le calcul du codeCoverage n'as pas pu se faire, je n'ai pas pu faire fonctionner le npm correspondant.
  Je n'ai pas pu verifier l'adresse du gagnant mais j'ai laisser le test pour la verification du type de données recus.

  Contract: Voting
        Test des ajouts de votants, events et onlyOwners
          ✓ refuse les appels des fonctions onlyOwner par des non-Owner. (1979ms)
          
          ✓ peux enregistrer les votants en whiteliste. (148ms, 50196 gas)
          
          ✓ ajoute des votants (203ms, 100380 gas)
          
          ✓ bloque les changement interdits du workflowstatus (220ms)
          
          ✓ peux changer le workflowstatus de Register vers ProposalsRegistrationStarted (196ms, 47653 gas)
          
          ✓ bloque l ajout de votant en WorkflowStatus ProposalsRegistrationStarted (45ms)
          
          ✓ bloque l ajout de proposal pour les non votant (57ms)
          
          ✓ ajoute une proposal (580ms, 136344 gas)
          
          ✓ change le WorkFlowStatus pour endProposalsRegistrationEnded (137ms, 30575 gas)
          
          ✓ change le WorkFlowStatus pour VotingSessionStarted (268ms, 30530 gas)
          
          ✓ refuser le vote a un non votant (48ms)
          
          ✓ refuser le vote sur une proposition non existante (63ms)
          
          ✓ permet a un votant de voter (701ms, 197027 gas)
          
          ✓ change le workflowstatus pour VotingSessionEnded (62ms, 30509 gas)
          
          ✓ change le statut  pour tallied (81ms, 60637 gas)

    ·------------------------------------------|----------------------------|-------------|----------------------------·
    |   Solc version: 0.8.14+commit.80d49f37   ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
    ···········································|····························|·············|·····························
    |  Methods                                                                                                         │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Voting    ·  addProposal                ·       59604  ·      76740  ·      65316  ·           3  ·          -  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Voting    ·  addVoter                   ·       50184  ·      50196  ·      50190  ·           6  ·          -  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30575  ·           2  ·          -  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Voting    ·  endVotingSession           ·           -  ·          -  ·      30509  ·           2  ·          -  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Voting    ·  setVote                    ·       58101  ·      78013  ·      64485  ·           4  ·          -  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      47653  ·           4  ·          -  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Voting    ·  startVotingSession         ·           -  ·          -  ·      30530  ·           4  ·          -  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Voting    ·  tallyVotes                 ·           -  ·          -  ·      60637  ·           1  ·          -  │
    ·············|·····························|··············|·············|·············|··············|··············
    |  Deployments                             ·                                          ·  % of limit  ·             │
    ···········································|··············|·············|·············|··············|··············
    |  Voting                                  ·           -  ·          -  ·    2137238  ·      31.8 %  ·          -  │
    ·------------------------------------------|--------------|-------------|-------------|--------------|-------------·


