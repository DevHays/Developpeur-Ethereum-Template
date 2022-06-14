//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;
contract Whitelist {
  struct Person { // Structure de données
      string name;
      uint age;  
  }
  Person[] public persons;
}