const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = async(deployer) =>{
  await deployer.deploy(SimpleStorage, {value: 3});
  const instance =await SimpleStorage.deployed();
  const valeur = await  instance.get();
  console.log("Premiere instance : " + valeur);
  await instance.set(18);
  const value2 =  await instance.get();
  console.log("Deuxieme instance : " + value2); 
}