var Swap = artifacts.require("./HashedTimelockERC721.sol");

module.exports = function(deployer) {
  deployer.deploy(Swap);
};
