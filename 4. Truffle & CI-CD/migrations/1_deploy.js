const Voting = artifacts.require("Voting");

module.exports = async(deployer) =>{
  await deployer.deploy(Voting);
  const instance = await Voting.deployed();
  console.log("Contrat deployé");

}