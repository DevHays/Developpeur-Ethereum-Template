//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;
 
contract SimpleStorage {
    mapping (address => bool) whitelist;

    struct Person {//Structure de données
        string : name,
        uint: age
    }
} 



