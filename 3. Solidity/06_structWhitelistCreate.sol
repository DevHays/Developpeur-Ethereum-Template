//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;
 
contract SimpleStorage {
    mapping (address => bool) whitelist;

    struct Person {//Structure de données
        string : name,
        uint: age
    }

    function addPerson(string _name, uint _age) public {
        Person memory person;
        person.name  = _name;
        person.age = _age;
    }
} 