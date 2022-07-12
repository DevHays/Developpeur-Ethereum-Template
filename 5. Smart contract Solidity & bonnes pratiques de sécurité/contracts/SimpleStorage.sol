// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.14;

contract SimpleStorage {
    uint  storageData;

    constructor(uint _val) payable {
        set(_val);
    }

    function get() public view returns(uint) {
        return storageData;        
    }
    
    function set(uint n) public {
        storageData = n;
    }

}
