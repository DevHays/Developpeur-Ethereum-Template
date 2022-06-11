//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract courStructure is Ownable{
    struct Apprenant{
        string name;
        uint note;
    }

    mapping(address=>Apprenant) appMapping;
    Apprenant[] apprenantsArray;

    function setApprenantMapping(address _addr,  string calldata _name, uint _note) public onlyOwner  {
        appMapping[_addr] = Apprenant(_name, _note);
        apprenantsArray.push(Apprenant(_name, _note));
    }

    function delApprenantMapping(address _addr) public onlyOwner{
        delete appMapping[_addr];
    }

    function addAppArray(string calldata _name, uint _note) public onlyOwner{
        apprenantsArray.push(Apprenant(_name,_note));
    }

    function setAppArray(uint _id, string calldata _name, uint _note)  public onlyOwner{
        require(apprenantsArray.length > _id ,"L'apprenant n'existe pas.");
        apprenantsArray[_id] = Apprenant(_name,_note);
    }

    function delLastAppArray()  public onlyOwner{
        apprenantsArray.pop();
    }

    function deleteAllAppArray()  public onlyOwner{
        delete apprenantsArray;
    }
}