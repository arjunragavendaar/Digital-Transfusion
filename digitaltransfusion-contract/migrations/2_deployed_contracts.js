// Javascript program to implement
// the above approach
var TransfusionContract = artifacts.require("./transfusioncontract.sol");
var DonTranToken1 = artifacts.require("./DonTranToken.sol");
 
module.exports = async function(deployer)
 { 
  // await deployer.deploy(DonTranToken1);
//   const DonTranToken = await DonTranToken1.deployed();

//   await deployer.deploy(TransfusionContract,DonTranToken.address);

  await deployer.deploy(TransfusionContract);
  const TransfusionContract1 = await TransfusionContract.deployed();

  await deployer.deploy(DonTranToken1,TransfusionContract1.address);
  await TransfusionContract1.settokenaddress(DonTranToken1.address)
  
};