//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Apprenantmap is Ownable{
    struct Apprenant{
        string name;
        uint note;
    }

    Apprenant[] apprenants;
    mapping(address=>Apprenant) appMapping;
    Apprenant[] apprenantsArray;

    function setApprenantMapping(address _addr,  string calldata _name, uint _note) public onlyOwner  {
        appMapping[_addr] = Apprenant(_name, _note);
        apprenantsArray.push(Apprenant(_name, _note));
    }

    function delApprenantMapping(address _addr) public onlyOwner{
        appMapping[_addr] = Apprenant("",0);
    }
}