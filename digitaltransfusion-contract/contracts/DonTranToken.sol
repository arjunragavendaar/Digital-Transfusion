// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20.sol";

contract DonTranToken is ERC20{

constructor(address tokenOwner) ERC20("The DonTran Token","DonTranToken"){  
    _mint(tokenOwner, 1000 * 10 ** 18); 
}

function loadtokens(address user,uint amount)public{
    _mint(user, amount);
}
// function approve(address spender,uint256 amount) public virtual override returns  (bool){
//    _approve(spender,msg.sender,amount);
//      return true;
// }


 
}