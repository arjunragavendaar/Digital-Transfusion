// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;
import "./DonTranToken.sol";

contract transfusioncontract {
  uint value; 
  address payable[]  public alladdress;
  address payable[] public alladdressrecp;
  address public authaddress;
  address payable _auth;
  DonTranToken donTranToken;

  constructor (){
    _auth=payable(msg.sender);
    //donTranToken=DonTranToken(_token);
  }

  struct Authreg{
    uint authuserid;
    string username;

  }
  uint numberofauthsreg=0;
  mapping(address => Authreg) public authusers;  
  
  struct Donorreg{
    uint donaruserid;
    string username;
    uint [] donoridlist;
  }
  uint numberofdonorsreg=0;
  mapping(address => Donorreg) public donorusers;
    
    

   struct Recipientreg{
    uint recipientuserid;
    string username;
    uint [] recipientidlist;
  }
  uint numberofrecipientsreg=0;
  mapping(address => Recipientreg) public recipientusers;

  struct Donorsprofile{
     uint userid;
     uint donorid;
     string donarname;
     uint donorage;
     string gender;
     string bloodgrp;
      uint status;
      uint recpId;
      bool req;
      uint claimstatus;
  }

  
  int initialvalue=0;
  uint numberofdonors=0;
  mapping(uint => Donorsprofile) public donors;

  struct recptransdata{
    uint data;
  }
  mapping(address => recptransdata) public trxndata;

  modifier onlyDonor{
       require(donorusers[msg.sender].donaruserid!=0);
       _;
    }

    modifier onlyRecipient{
       require(recipientusers[msg.sender].recipientuserid!=0);
       _;
    }

    modifier onlyAuthorizer{
       require(authusers[msg.sender].authuserid!=0);
       _;
    }

  function settokenaddress(address _tokenadd) public{
        donTranToken=DonTranToken(_tokenadd);

  }
  function getbalance() public view returns(uint){
    return donTranToken.balanceOf(msg.sender);
  }
  
  function getauthuser()public view returns(Authreg memory){

     Authreg memory authuser=authusers[msg.sender];
      return authuser;
  }

  function signupauth(address authuseraddress,string memory _username) public{
    numberofauthsreg=numberofauthsreg+1;
    authusers[authuseraddress]=Authreg(numberofauthsreg,_username);
    authaddress=authuseraddress;
    //donTranToken.loadtokens(authuseraddress, 50);
  }

  

  function signupdonor(address payable donaruseraddress,string memory _username) public{
    numberofdonorsreg=numberofdonorsreg+1;
    uint [] memory donoridlist;
   // donorusers[donaruseraddress]=Donorreg(numberofdonorsreg,_username,_contact,_daddress,donoridlist);
       donorusers[donaruseraddress]=Donorreg(numberofdonorsreg,_username,donoridlist);
    alladdress.push(donaruseraddress);
    // donTranToken.approve(_auth, 200000000000000000000);
    // donTranToken.allowance(_auth,donaruseraddress);
    donTranToken.transfer(donaruseraddress, 50000000000000000000);
  }

  function signuprecipient(address payable recipientuseraddress,string memory _username) public{
    numberofrecipientsreg=numberofrecipientsreg+1;
    uint [] memory recipientidlist;
    recipientusers[recipientuseraddress]=Recipientreg(numberofrecipientsreg,_username,recipientidlist);
    alladdressrecp.push(recipientuseraddress);
    // donTranToken.approve(_auth, 200000000000000000000);
    // donTranToken.allowance(_auth,recipientuseraddress);
    // donTranToken.transferFrom(_auth, recipientuseraddress, 200000000000000000000);
    donTranToken.transfer(recipientuseraddress, 50000000000000000000);
  }

  function adddonors(address donaraddress,string memory _donorname,uint _donorage,string memory _gender,string memory _bloodgrp,uint _status) public onlyDonor{
        numberofdonors=numberofdonors+1;
        uint userid=donorusers[msg.sender].donaruserid;
        string memory donarname=donorusers[msg.sender].username;
        donorusers[donaraddress].donoridlist.push(numberofdonors);
        donors[numberofdonors]=Donorsprofile(userid,numberofdonors,donarname,_donorage, _gender,_bloodgrp,_status,0,false,0);
  }

  function fetchdonors() public view returns(Donorsprofile[] memory) {
    Donorsprofile [] memory currentdonor= new Donorsprofile [] (numberofdonors);
    uint m=0;
    
    // temp=donorusers[alladdress[k]].donoridlist.length
       for(uint k=0;k<alladdress.length;k++){
      for(uint i=0;i<donorusers[alladdress[k]].donoridlist.length;i++){
            currentdonor[m]= donors[donorusers[alladdress[k]].donoridlist[i]];
            m++;
         }
       }
      
      
      return currentdonor;
  }

  function fetchdonoruser() public view returns(Donorreg memory) {
       
      Donorreg memory currentdonorusers=donorusers[msg.sender];
      return currentdonorusers;
  }

  struct RecipientProfile{
    uint userid;
    uint recipientid;
     string recipientname;
     uint recipientage;
     string gender;
     string reqbloodgrp;
     uint status;
  }

  uint numberofrecipients=0;
  mapping(uint => RecipientProfile) public recipients;

  function addrecipients(address recipientaddress,string memory _recipientname,uint _recipientage,string memory _gender,string memory _reqbloodgrp,uint _status) public onlyRecipient{
        numberofrecipients=numberofrecipients+1;
        uint userid=recipientusers[msg.sender].recipientuserid;
        string memory recipientname=recipientusers[msg.sender].username;
         recipientusers[recipientaddress].recipientidlist.push(numberofrecipients);
        recipients[numberofrecipients]=RecipientProfile(userid,numberofrecipients,recipientname,_recipientage, _gender,_reqbloodgrp,_status);
  }

  function fetchrecipients() public view returns(RecipientProfile[] memory) {
       
      RecipientProfile[] memory currentrecipients=new RecipientProfile[](numberofrecipients);
      uint m=0;
      for(uint k=0;k<alladdressrecp.length;k++){
      for(uint i=0;i<recipientusers[alladdressrecp[k]].recipientidlist.length;i++){
            currentrecipients[m]= recipients[recipientusers[alladdressrecp[k]].recipientidlist[i]];
            m++;
         }
       }
      return currentrecipients;
  }

  function fetchrecipientuser() public view returns(Recipientreg memory) {
       
      Recipientreg memory currentrecipientusers=recipientusers[msg.sender];
      return currentrecipientusers;
  }

  function approvebyauthorizer(uint index)public onlyAuthorizer{
    donors[index].status=1;

    // if(donTranToken.balanceOf(msg.sender)==0){
    //   address payable donaddress;
    //    for(uint i=0;i<alladdress.length;i++){
    //      if(donorusers[alladdress[i]].donaruserid==donors[index].userid){
    //       donaddress=alladdress[i];
    //       break;
    //      }
    //    }

      // donTranToken.approve(msg.sender,20* 10 ** 18);
      // donTranToken.transferFrom(msg.sender, donaddress, 20* 10 ** 18);
    // }
          
  } 

  function denybyauthorizer(uint index)public onlyAuthorizer{
    donors[index].status=2;
          
  } 

  function approvebyauthorizerforrecp(uint index)public onlyAuthorizer{
    recipients[index].status=1;
          
  }  

  function denybyauthorizerforrecp(uint index)public onlyAuthorizer{
    recipients[index].status=2;
          
  }     

  function getdonrec() public view returns(uint, uint){
        
        return (numberofdonors,numberofrecipients);
    }

    function claimdonor(uint donorindex)public{
      donors[donorindex].recpId=recipientusers[msg.sender].recipientuserid;
      donors[donorindex].req=true;
      donors[donorindex].claimstatus=1;
    }

    function approveclaim(uint donorindex)public onlyAuthorizer{
      donors[donorindex].claimstatus=2;
    }

    function denyclaim(uint donorindex)public onlyAuthorizer{
      donors[donorindex].claimstatus=3;
    }

    function fetchdonarrecpdata()public view returns(Donorsprofile[] memory,RecipientProfile[] memory){
       Donorsprofile [] memory donordata= new Donorsprofile [] (numberofdonors);
       RecipientProfile[] memory recipientdata=new RecipientProfile[](numberofrecipients);
        uint x=0;
    
       for(uint k=0;k<alladdress.length;k++){
      for(uint i=0;i<donorusers[alladdress[k]].donoridlist.length;i++){
            donordata[x]= donors[donorusers[alladdress[k]].donoridlist[i]];
            x++;
         }
       }  

       uint y=0;
      for(uint k=0;k<alladdressrecp.length;k++){
      for(uint i=0;i<recipientusers[alladdressrecp[k]].recipientidlist.length;i++){
            recipientdata[y]= recipients[recipientusers[alladdressrecp[k]].recipientidlist[i]];
            y++;
         }
       }   

       return (donordata,recipientdata);
    }
    
    function fetchtransactiondata(address user) public view returns(uint){
     uint trxnval=donTranToken.balanceOf(user);
     uint fintrxanval=trxnval-trxndata[user].data;
     return fintrxanval;

    }

    function gettransfusionsummarydata(uint userid) public view returns(Donorreg memory){
      address add;
       for(uint i=0;i<alladdress.length;i++){
         if(donorusers[alladdress[i]].donaruserid==userid){
          add=alladdress[i];
          break;
         }
       }
        Donorreg memory duserdata=donorusers[add];
      return duserdata;

    }

    function performtransaction(uint userid,uint amount) public{
     address payable donaddress;
       for(uint i=0;i<alladdress.length;i++){
         if(donorusers[alladdress[i]].donaruserid==userid){
          donaddress=alladdress[i];
          break;
         }
       }
       require(donTranToken.balanceOf(msg.sender)>=amount,"Insufficient balance");
       trxndata[msg.sender].data=trxndata[msg.sender].data+amount;
        donTranToken.transfer(donaddress, amount);
    }

    function performairdrop(address user,uint amount) public{
       donTranToken.transfer(user, amount);
    }

    


}

