const SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract("SimpleStorage",accounts=>{
    it("....should store the value 89", async()=>{
        const simpleStorageInstance = await SimpleStorage.deployed();

        // set value
        await simpleStorageInstance.set(89,{from:accounts[0]});

        //get stored value
        const storedData = await simpleStorageInstance.get.call();

        assert.equal(storedData, 89,"The value 89 vas not stored.");

    })
});