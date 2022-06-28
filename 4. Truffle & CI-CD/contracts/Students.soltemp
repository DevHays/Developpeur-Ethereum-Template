// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.14;

contract Etudiants {

    struct Etudiant{
        string nom;
        uint note;
    }

    mapping(address=>Etudiant) etudiants;
    Etudiants[] etudiantsArray;

    enum Classe {
    sixieme,
    cinquieme,
    quatrieme
    }


    Classe public classe;

    function getEtudiant(address _addr) public view returns(Etudiant memory){
        return etudiants[_addr];
    }

    function getClasse() public view returns( Classe ){
        return classe;
    }

    function deleteEtudiant(address _addr) public{
        etudiants[_addr] = Etudiant("",0);
        for(uint i=0;i<etudiantsArray.length;i++){
            //if(keccak256(abi.encodePacked(etudiantsArray[i].name)) == keccak256(abi.encodePacked(Etudiants[_addr].name))){

            //}
        }
    }

    function setEtudiant(address _addr,string memory nom, uint note) public{
        etudiants[_addr] = Etudiant(nom,note);
    }

    function setClasse(Classe _classe) public{
        classe = _classe;
        
    }

}