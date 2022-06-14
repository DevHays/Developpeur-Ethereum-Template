//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;
 
contract SimpleStorage {
    

    struct Person {//Structure de données
        string : name,
        uint: age
    }

    Person[] public persons;

    function add(string _name, uint _age) public {
        Person memory person;
        person.name  = _name;
        person.age = _age;
        persons.add(person);
    }

    function remove() public{
        persons.pop();
    }

} 






