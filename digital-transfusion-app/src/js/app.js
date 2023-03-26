App={
    web3: null,
    contracts: {},
    address:'0xFCEb6C1E7bA4A9B8727De807F84D7a59311e55b8',
    addresstoken:'0xfe07ED8bC1883915d43474F80651202032Ff24d6',
    network_id:5777, // 5777 for local
    handler:null,
    value:1000000000000000000,
    index:0,
    margin:10,
    left:15,
    tokendata:[
      ['O+ve',  {v: 10, f: '10'}, {v: 10, f: '10'}],
      ['A+ve',   {v:10,   f: '10'},  {v: 10, f: '10'}],
      ['AB-ve', {v:10, f: '10'}, {v: 10, f: '10'}],
      ['B+ve',   {v:10,  f: '10'},  {v: 10, f: '10'}],
      ['AB+ve',   {v:10,  f: '10'},  {v: 10, f: '10'}],
       ['B-ve',   {v:10,  f: '10'},  {v: 10, f: '10'}],
       ['A-ve',   {v:10,  f: '10'},  {v: 10, f: '10'}]
    ],
    recpbloodgroup:[],
    init: async function() {
      return await App.initWeb3();
    },
    initWeb3: async function() {         
        if (typeof web3 !== 'undefined') {
          App.web3 = new Web3(Web3.givenProvider);
        } else {
          //App.web3 = new Web3(App.url);
          App.web3 = new Web3("https://goerli.infura.io/v3/6674b1863b9a4d9592f086d10ba43c7e");
        }
        ethereum.enable();  
           
        return await App.initContract();  
      },

      initContract: async function() { 
        App.contracts.Transfusion = new App.web3.eth.Contract(App.abi,App.address, {});
        App.contracts.DonTranToken= new App.web3.eth.Contract(App.abiToken,App.addresstoken,{});
        return await App.bindEvents();
      },  
      bindEvents: function() {
        $(document).on('click', '#initilaizeCounter', function(){
            App.populateAddress().then(r => App.handler = r[0]);
            App.handleInitialization(jQuery('#Initialize').val());
            });
            $(document).on('click', '#getCounter', function(){
            App.populateAddress().then(r => App.handler = r[0]);
            App.handleGet();
            });
            $(document).on('click', '#incrementCounter',function(){
            App.populateAddress().then(r => App.handler = r[0]);
            App.handleIncrement(jQuery('#Increment').val());
            });
            $(document).on('click', '#decrementCounter', function(){
            App.populateAddress().then(r => App.handler = r[0]);
            App.handleDecrement(jQuery('#Decrement').val());
            });

            $(document).on('click', '#donate', function(){
            App.populateAddress().then(r => App.handler = r[0]);
            let donarname=jQuery('#dname').val();
            let donarage=jQuery('#dage').val();
            let donargender=jQuery('#dgender').val();
            let donorbloodgrp=jQuery('#dbloodgrp').val();
            App.donateblood(donarname,donarage,donargender,donorbloodgrp);
            });

            $(document).on('click', '#donarsignup', function(){
                App.populateAddress().then(r => App.handler = r[0]);
                let username=jQuery('#duname').val();
                let useraddress=jQuery('#daddress').val();
                let usercontact=jQuery('#dcontact').val();
                App.donarsignup(username,useraddress,usercontact);
                });
                $(document).on('click', '#authsignup', function(){
                  App.populateAddress().then(r => App.handler = r[0]);
                  let username=jQuery('#authuname').val();
                  let useraddress=jQuery('#authaddress').val();
                  let usercontact=jQuery('#authcontact').val();
                  App.authsignup(username,useraddress,usercontact);
                  });

                $(document).on('click', '#recipientsignup', function(){
                    App.populateAddress().then(r => App.handler = r[0]);
                    let username=jQuery('#runame').val();
                    let useraddress=jQuery('#raddress').val();
                    let usercontact=jQuery('#rcontact').val();
                    App.recipientsignup(username,useraddress,usercontact);
                    });

                    $(document).on('click', '#request', function(){
                        App.populateAddress().then(r => App.handler = r[0]);
                        let recipientname=jQuery('#rname').val();
                        let recipientage=jQuery('#rage').val();
                        let recipientgender=jQuery('#rgender').val();
                        let recipientbloodgrp=jQuery('#rbloodgrp').val();
                        App.requestblood(recipientname,recipientage,recipientgender,recipientbloodgrp);
                        });

            $(document).on('click', '#getDonors', function(){
                App.populateAddress().then(r => App.handler = r[0]);
                App.getdonordetails();
                });
            $(document).on('click', '#getuser', function(){
                App.populateAddress().then(r => App.handler = r[0]);
                App.getdonoruserdetails();
                });
            $(document).on('click', '#getrecipientuser', function(){
                    App.populateAddress().then(r => App.handler = r[0]);
                    App.getrecipientdetails();
                    });
            $(document).on('click', '#getRec', function(){
                App.populateAddress().then(r => App.handler = r[0]);
                App.getrecipientrequestdetails();
                });
                $(document).on('click', '#airdropsend', function(){
                  App.populateAddress().then(r => App.handler = r[0]);
                  let useradd=jQuery('#airdropadd').val();
                  let tokens=jQuery('#tokenval').val();
                  App.airdrop(useradd,tokens);
                  });
      },
      populateAddress : async function(){
        // App.handler=App.web3.givenProvider.selectedAddress;
        return await ethereum.request({method : 'eth_requestAccounts'});
       }, 
       authsignup:function(username,authaddress,usercontact){
        if (username===''||authaddress==''||usercontact==''){
          alert("Please enter all the required details ");
          return false
        }
        var option={from:App.handler}   
        //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
        App.contracts.Transfusion.methods.signupauth(App.handler,username)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            console.log(receipt);
            //fetch('http://localhost:3010/authsignup', {
              fetch('https://digital-transfusion.herokuapp.com/authsignup',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "facility": authaddress, "contact":usercontact.toString() })
            })
            .then(response => response.json())
            .then(function(response){
              if(response){
              toastr.success("successfully signedup by Authorizer "+username);

              App.populateAddress().then(function(r){
                App.handler = r[0];
                var option={from:App.handler} ;
                App.contracts.Transfusion.methods.getbalance()
                .call(option)
                .then((r)=>{
                console.log(r);      
            })
    
            })

              setTimeout(() => {
                location.reload();
                App.getauthorizerdetails();
              }, "1000")
                        
              }
            })
            
        }})
        .on('error',(err)=>{
          toastr.error("Only organizer can enter the details.");
        })
       },
       donarsignup:function(username,useraddress,usercontact){
        if (username===''||useraddress==''||usercontact==''){
          alert("Please enter all the required details ");
          return false
        }
        var option={from:App.handler}   
        //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
        App.contracts.Transfusion.methods.signupdonor(App.handler,username)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            console.log(receipt);
            //fetch('http://localhost:3010/donorsignup', {
              fetch('https://digital-transfusion.herokuapp.com/donorsignup',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "facility": useraddress, "contact":usercontact.toString() })
            })
            .then(response => response.json())
            .then(function(response){
              if(response){
              toastr.success("successfully signedup by "+username);

                      App.populateAddress().then(function(r){
                        App.handler = r[0];
                        var option={from:App.handler} ;
                        App.contracts.Transfusion.methods.getbalance()
                        .call(option)
                        .then((r)=>{
                          jQuery('#donbalance').text(App.web3.utils.fromWei(r.toString(), "ether")); 
                        })
            
                    })
              }
            })
            
        }})
        .on('error',(err)=>{
          toastr.error("Only organizer can enter the details.");
        })
      },
      recipientsignup:function(username,useraddress,usercontact){
        if (username===''||useraddress==''||usercontact==''){
          alert("Please enter all the required details ");
          return false
        }
        var option={from:App.handler}   
        //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
        App.contracts.Transfusion.methods.signuprecipient(App.handler,username)
        .send(option)
        .on('receipt',(receipt)=>{
          console.log(receipt);
          if(receipt.status){
            // fetch('http://localhost:3010/recipientsignup', {
              fetch('https://digital-transfusion.herokuapp.com/recipientsignup',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "facility": useraddress, "contact":usercontact.toString() })
            })
            .then(response => response.json())
            .then(function(response){
              if(response){
              toastr.success("successfully signedup by recipient "+username);
              location.reload();

            //   App.populateAddress().then(function(r){
            //     App.handler = r[0];
            //     var option={from:App.handler} ;
            //     App.contracts.Transfusion.methods.fetchtransactiondata(App.handler)
            //     .call(option)
            //     .then((r)=>{
            //       jQuery('#recpbalance').text(App.web3.utils.fromWei(r.toString(), "ether"));    
            // })
    
            // })

              }
            })
            
        }})
        .on('error',(err)=>{
          toastr.error("Only organizer can enter the details.");
        })
      },
       donateblood:function(donarname,donarage,donargender,donorbloodgrp){
        if (donarname===''||donarage==''||donargender==''||donorbloodgrp==''){
          alert("Please enter all the required details ");
          return false
        }
        var option={from:App.handler}   
        //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
        App.contracts.Transfusion.methods.adddonors(App.handler,donarname,donarage,donargender,donorbloodgrp,0)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            console.log(receipt);
            toastr.success("blood has been successfully donated by "+donarname);
        }})
        .on('error',(err)=>{
          toastr.error("Only organizer can enter the details.");
        })
      },
      requestblood:function(recipientname,recipientage,recipientgender,recipientbloodgrp){
        if (recipientname===''||recipientage==''||recipientgender==''||recipientbloodgrp==''){
          alert("Please enter all the required details ");
          return false
        }
        var option={from:App.handler}   
        //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
        App.contracts.Transfusion.methods.addrecipients(App.handler,recipientname,recipientage,recipientgender,recipientbloodgrp,0)
        .send(option)
        .on('receipt',(receipt)=>{
          if(receipt.status){
            console.log(receipt);
            toastr.success("Request has been successfully sent by "+recipientname);
            location.reload();
        }})
        .on('error',(err)=>{
          toastr.error("Only organizer can enter the details.");
        })
      },
      getdonoruserdetails:function(){
        App.populateAddress().then(function(r){
            App.handler = r[0];
            var option={from:App.handler} ;
            App.contracts.Transfusion.methods.fetchdonoruser()
            .call(option)
            .then((r)=>{
            jQuery('#user_value').text(r);       
        })

        })
            
        
      },

      getrecipientdetails:function(){
        App.populateAddress().then(function(r){
            App.handler = r[0];
            var option={from:App.handler} ;
            App.contracts.Transfusion.methods.fetchrecipientuser()
            .call(option)
            .then((r)=>{
            jQuery('#ruser_value').text(r);       
        })

        })
            
        
      },
      getauthorizerdetails:function(){
        App.populateAddress().then(function(r){
            App.handler = r[0];
            var option={from:App.handler} ;
            App.contracts.Transfusion.methods.getauthuser()
            .call(option)
            .then((r)=>{
              if(r.authuserid!=0){
                document.getElementById("authcheck").style.display = "none";
                document.getElementById("authcheck1").style.visibility = "visible";    
              }   else{
                document.getElementById("authcheck").style.visibility = "visible";
                document.getElementById("authcheck1").style.display = "none";
              }             
              
        })

        })
            
        
      },
      claimdonation:function(value){
        App.populateAddress().then(function(r){
          App.handler = r[0];
          if (value===''){
              alert("Cannot be claimed");
              return false
            }
            var option={from:App.handler}   
            //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
            App.contracts.Transfusion.methods.claimdonor(value)
            .send(option)
            .on('receipt',(receipt)=>{
              if(receipt.status){
                console.log(receipt);
                toastr.success("You have successfully submitted your claim ");
                location.reload();
              }})
            .on('error',(err)=>{
              toastr.error("Only Authorizer can authorize it .");
            })
      } );
      },
      downloadpdf:function(param1,param2){
        // fetch('http://localhost:3010/getsummarydata', {
          fetch('https://digital-transfusion.herokuapp.com/getsummarydata',{
          
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "userid": param1})
            })
            .then(response => response.json())
            .then(function(response){
              if(response){
              // toastr.success("successfully signedup by recipient "+username);
      //         }
      //       })
      App.populateAddress().then(function(r1){
        App.handler = r1[0];
        var option={from:App.handler} 
        let amount=10;
        for(let k=0;k<App.tokendata.length;k++){
           if(App.tokendata[k][0]==App.recpbloodgroup[param1]){
            amount=App.tokendata[k][2].v;
           }
        }
        
       //App.contracts.DonTranToken.methods.approve('0xB0B234Ef728C67Cbd2B424e3a2C18C0af04A256f',App.web3.utils.toWei(amount.toString(), "ether")).send(option).on('receipt',(receipt)=>{  
        App.contracts.Transfusion.methods.performtransaction(param1,App.web3.utils.toWei(amount.toString(), "ether"))
        .send(option)
        .then((r)=>{
          location.reload();
          var doc = new jsPDF();
          let count=0;
          doc.text(20, 10 + ((count++) * 10), "--------------------------------Transfusion Summary-------------------------------------- " );
          doc.text(20, 10 + ((count++) * 10), "");
          doc.text(20, 10 + ((count++) * 10), "Recipient Details " );
          doc.text(20, 10 + ((count++) * 10), "------------------------ " );
          doc.text(20, 10 + ((count++) * 10), "Recipient Address/ID: " + App.handler) ;
          doc.text(20, 10 + ((count++) * 10), "");
          doc.text(20, 10 + ((count++) * 10), "Donor Details " );
          doc.text(20, 10 + ((count++) * 10), "------------------------ " );
          //doc.text(20, 10 + ((count++) * 10),"Donor Name:" +r.username )
          doc.text(20, 10 + ((count++) * 10),"Donar ID:"+response.donaruserid )
          doc.text(20, 10 + ((count++) * 10),"Transfusion Location:"+response.address)
          doc.text(20, 10 + ((count++) * 10), "Reference Contact:"+response.contact);
          doc.save('Transfusion_'+App.handler+'.pdf');
         })
        //})
      
         }) 
        }
        })
      
      },
      getdonordetails:function(){
        App.populateAddress().then(function(r){
          App.handler = r[0];
          var option={from:App.handler} ;
          App.contracts.Transfusion.methods.getbalance()
          .call(option)
          .then((r)=>{
            jQuery('#donbalance').text(App.web3.utils.fromWei(r.toString(), "ether"));    
      })

      })
        App.contracts.Transfusion.methods.fetchdonors()
        .call()
        .then((r)=>{
        //jQuery('#counter_value').text(r);
        App.recpbloodgroup=[];
        for(let i=0;i<r.length;i++){
            let array=[],array2=[];
            App.recpbloodgroup[r[i].userid]=r[i].bloodgrp;
            array.push('<div class="card" style="width: 18rem;">');
            array.push('<img src="https://microbiology.ucr.edu/sites/default/files/styles/form_preview/public/blank-profile-pic.png?itok=4teBBoet" class="card-img-top" alt="">');
            array.push('<div class="card-body">');
            array.push('<h5 class="card-title">'+r[i].donarname+'</h5>')
            array.push('<p class="card-text" id="uid"> Donation ID:'+r[i].donorid+'</p>');
            array.push('<p class="card-text"> Age:'+r[i].donorage+'</p>');
            array.push('<p class="card-text"> Gender:'+r[i].gender+'</p>')
            if(r[i].status==1){
                array.push('<p class="card-text"> Status: Approved</p>');
            }else if(r[i].status==2){
                array.push('<p class="card-text"> Status: Denied</p>')
            }else{
              array.push('<p class="card-text"> Status: --</p>')
            }
            
            array.push('<a href="#" class="btn">'+r[i].bloodgrp+'</a>')
            if(r[i].status==0){
                array.push('<br><button type="button" class="btn btn-default" style="border-radius:150px;background-color:green" onclick=\'App.approve(' + r[i].donorid +',event)\'><span class="glyphicon glyphicon-search"></span> Approve</button>');
                array.push('<br><button type="button" class="btn btn-default" style="border-radius:150px;background-color:red" onclick=\'App.deny(' + r[i].donorid +',event)\'><span class="glyphicon glyphicon-search"></span> Deny</button>');
            }
            array.push('</div>');
            array.push('</div>');
           
            $("#displaycards").append(array.join(''))

              if(r[i].status==1){
            array2.push('<tr>');
            array2.push('<td>'+r[i].donarname+'</td>');
            array2.push('<td>'+r[i].donorid+'</td>');
            array2.push('<td>'+r[i].donorage+'</td>');
            array2.push('<td>'+r[i].gender+'</td>');
            array2.push('<td>'+r[i].bloodgrp+'</td>');
            if(r[i].claimstatus==1){
              array2.push('<td><button type="button" class="btn btn-primary " style="border-radius:150px; color:yellow "><span class="glyphicon glyphicon-search"></span>Pending....</button></td>');

            }else if(r[i].claimstatus==2){
              array2.push('<td><button type="button" class="btn btn-primary " style="border-radius:150px; color:yellow "  onclick=\'App.downloadpdf(' + r[i].userid +',event)\'><span class="glyphicon glyphicon-search"></span>Ready for Transfusion....</button></td>');

            }else if(r[i].claimstatus==3){
              array2.push('<td><button type="button" class="btn btn-primary " style="border-radius:150px; color:yellow "  ><span class="glyphicon glyphicon-search"></span>Denied</button></td>');

            }else{
              array2.push('<td><button type="button" class="btn btn-primary " style="border-radius:150px;" onclick=\'App.claimdonation(' + r[i].donorid +',event)\'><span class="glyphicon glyphicon-search"></span>Claim</button></td>');

            }
            array2.push('</tr>');
            $("#myTable").append(array2.join(''))
          }
        }
        App.getrecipientrequestdetails();
        
        })
      },
      approveclaim:function(value,e){
        App.populateAddress().then(function(r){
            App.handler = r[0];
            if (value===''){
                alert("Cannot be approved");
                return false
              }
              var option={from:App.handler}   
              //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
              App.contracts.Transfusion.methods.approveclaim(value)
              .send(option)
              .on('receipt',(receipt)=>{
                if(receipt.status){
                  console.log(receipt);
                  toastr.success("successfully Approved ");
                  location.reload();
                }})
              .on('error',(err)=>{
                toastr.error("Only Authorizer can approve it .");
              })
        } );
        
      },
      denyclaim:function(value,e){
        App.populateAddress().then(function(r){
          App.handler = r[0];
          if (value===''){
              alert("Cannot be approved");
              return false
            }
            var option={from:App.handler}   
            //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
            App.contracts.Transfusion.methods.denyclaim(value)
            .send(option)
            .on('receipt',(receipt)=>{
              if(receipt.status){
                console.log(receipt);
                toastr.success("successfully Denied ");
                location.reload();
              }})
            .on('error',(err)=>{
              toastr.error("Only Authorizer can deny it .");
            })
      } );
      },
      getapproveclaimdetails:function(){

        App.contracts.Transfusion.methods.fetchdonors()
        .call()
        .then((r)=>{
          App.populateAddress().then(function(r){
            App.handler = r[0];
            var option={from:App.handler} ;
            App.contracts.Transfusion.methods.fetchtransactiondata(App.handler)
            .call(option)
            .then((r)=>{
              jQuery('#recpbalance').text(App.web3.utils.fromWei(r.toString(), "ether"));
            //console.log(r);      
        })

        })
        //jQuery('#counter_value').text(r);
        for(let i=0;i<r.length;i++){
          if(r[i].recpId!="0"){
            let array3=[];
            

            
            array3.push('<tr>');
            array3.push('<td>'+r[i].recpId+'</td>');
            array3.push('<td>'+r[i].donarname+'</td>');
            array3.push('<td>'+r[i].donorid+'</td>');
            array3.push('<td>'+r[i].donorage+'</td>');
            array3.push('<td>'+r[i].gender+'</td>');
            array3.push('<td>'+r[i].bloodgrp+'</td>');
            if(r[i].claimstatus==1){
              array3.push('<td><button type="button" class="btn btn-primary " style="border-radius:150px;" onclick=\'App.approveclaim(' + r[i].donorid +',event)\'><span class="glyphicon glyphicon-search"></span>Approve</button> &nbsp;<button type="button" class="btn btn-primary " style="border-radius:150px;" onclick=\'App.denyclaim(' + r[i].donorid +',event)\'><span class="glyphicon glyphicon-search"></span>Deny</button></td>');

            }else if(r[i].claimstatus==2){
              array3.push('<td><button type="button" class="btn btn-primary " style="border-radius:150px; color:yellow "><span class="glyphicon glyphicon-search"></span>Approval given....</button></td>');

            }else if(r[i].claimstatus==3){
              array3.push('<td><button type="button" class="btn btn-primary " style="border-radius:150px; color:yellow "><span class="glyphicon glyphicon-search"></span>Denied....</button></td>');

            }else{
              array3.push('<td><button type="button" class="btn btn-primary " style="border-radius:150px;"><span class="glyphicon glyphicon-search"></span>Not yet started....</button></td>');

            }
            array3.push('</tr>');
            $("#myTable1").append(array3.join(''));
          }
        }
        
        })

      },
    
      
      getrecipientrequestdetails:function(){
        App.contracts.Transfusion.methods.fetchrecipients()
        .call()
        .then((r)=>{
        jQuery('#rcounter_value').text(r);
        for(let i=0;i<r.length;i++){
            let array=[];
            array.push('<div class="card" style="width: 18rem;">');
            array.push('<img src="https://microbiology.ucr.edu/sites/default/files/styles/form_preview/public/blank-profile-pic.png?itok=4teBBoet" class="card-img-top" alt="">');
            array.push('<div class="card-body">');
            array.push('<h5 class="card-title">'+r[i].recipientname+'</h5>')
            array.push('<p class="card-text" id="uid"> Recipient ID:'+r[i].recipientid+'</p>');
            array.push('<p class="card-text"> Age:'+r[i].recipientage+'</p>');
            array.push('<p class="card-text"> Gender:'+r[i].gender+'</p>')
            if(r[i].status==1){
                array.push('<p class="card-text"> Status: Approved</p>');
            }else if(r[i].status==2){
              array.push('<p class="card-text"> Status: Denied</p>')
            }else{
                array.push('<p class="card-text"> Status: --</p>')
            }
            
            array.push('<a href="#" class="btn"> Requested for'+r[i].reqbloodgrp+'</a>')
            if(r[i].status==0){
                array.push('<br><button type="button" class="btn btn-default" style="border-radius:150px;background-color:green" onclick=\'App.approverecp(' + r[i].recipientid +',event)\'><span class="glyphicon glyphicon-search"></span> Approve</button>');
                array.push('<br><button type="button" class="btn btn-default" style="border-radius:150px;background-color:red" onclick=\'App.denyrecp(' + r[i].recipientid +',event)\'><span class="glyphicon glyphicon-search"></span> Deny</button>'); 
              }   
            array.push('</div>');
            array.push('</div>');
           
            $("#displaycards2").append(array.join(''))
        }
        
        
        })
      },

      approve:function(value,e){
        App.populateAddress().then(function(r){
            App.handler = r[0];
            if (value===''){
                alert("Cannot be approved");
                return false
              }
              var option={from:App.handler}   
              //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
              App.contracts.Transfusion.methods.approvebyauthorizer(value)
              .send(option)
              .on('receipt',(receipt)=>{
                if(receipt.status){
                  toastr.success("successfully Approved ");
                 
                  setTimeout(() => {
                    location.reload();
                    App.getauthorizerdetails();
                  }, "1000")
                }})
              .on('error',(err)=>{
                toastr.error("Only Authorizer can approve it .");
              })
        } );
        
      },
      deny:function(value,e){
        App.populateAddress().then(function(r){
          App.handler = r[0];
          if (value===''){
              alert("Cannot be approved");
              return false
            }
            var option={from:App.handler}   
            //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
            App.contracts.Transfusion.methods.denybyauthorizer(value)
            .send(option)
            .on('receipt',(receipt)=>{
              if(receipt.status){
                toastr.success("successfully Denied ");
                location.reload();
              }})
            .on('error',(err)=>{
              toastr.error("Only Authorizer can deny it .");
            })
      } );
      },
      approverecp:function(value,e){
        App.populateAddress().then(function(r){
            App.handler = r[0];
            if (value===''){
                alert("Cannot be approved");
                return false
              }
              var option={from:App.handler}   
              //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
              App.contracts.Transfusion.methods.approvebyauthorizerforrecp(value)
              .send(option)
              .on('receipt',(receipt)=>{
                if(receipt.status){
                  console.log(receipt);
                  toastr.success("successfully Approved ");
                  setTimeout(() => {
                    location.reload();
                    App.getauthorizerdetails();
                  }, "1000")

                }})
              .on('error',(err)=>{
                toastr.error("Only Authorizer can approve it .");
              })
        } );
        
      },
      denyrecp:function(value,e){
        App.populateAddress().then(function(r){
          App.handler = r[0];
          if (value===''){
              alert("Cannot be approved");
              return false
            }
            var option={from:App.handler}   
            //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
            App.contracts.Transfusion.methods.denybyauthorizerforrecp(value)
            .send(option)
            .on('receipt',(receipt)=>{
              if(receipt.status){
                console.log(receipt);
                toastr.success("successfully Denied ");
                location.reload();
              }})
            .on('error',(err)=>{
              toastr.error("Only Authorizer can deny it .");
            })
      } );
      },
      airdrop:function(param1,param2){
        App.populateAddress().then(function(r){
          App.handler = r[0];
          if (param1===''||param2==''){
              alert("Please Fill all the fields");
              return false
            }
            var option={from:App.handler}   
            let amt1=App.web3.utils.toWei(param2.toString(), "ether")
            //let acc2="0xC381314d98D06552F3a39F8d8e4e3A4bF4e05495"; 
            App.contracts.Transfusion.methods.performairdrop(param1,amt1)
            .send(option)
            .on('receipt',(receipt)=>{
              if(receipt.status){
                console.log(receipt);
                toastr.success("successfully Sent ");}})
            .on('error',(err)=>{
              toastr.error("Only Authorizer can send it .");
            })
      } );
      },
      drawChart:function() {
        App.contracts.Transfusion.methods.getdonrec()
        .call()
        .then((r)=>{
            console.log(r);
            var data = google.visualization.arrayToDataTable([
                ['Users', 'Numbers'],
                ['Donors',r[0]],
                ['Recipients',r[1]]
              ]);
      
              var options = {
                title: 'Ratio between Donors to Recipients for Monetary estimation of tokens',
                is3D:true,
                width:700,
                height:250
              };
      
              var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      
              chart.draw(data, options);
        })
        
      },

      drawbarchart:function(){
        App.contracts.Transfusion.methods.fetchdonarrecpdata()
        .call()
        .then((r)=>{
          let intermediate_datamerge=r[0]&&r[1]?r[0].concat(r[1]):[];
          let dataset1 = intermediate_datamerge.reduce(function (r1, a) {
            let temp=a.bloodgrp?a.bloodgrp:a.reqbloodgrp;
            r1[temp] = r1[temp] || [];
            r1[temp].push(a);
            return r1;
        }, Object.create(null));
        let finaldata=[];
        let int_array=[];
        let dataobj={};
        finaldata.push(["Bloog Group","Donor","Recipient"]);
        for (const [key, value] of Object.entries(dataset1)) {
          dataobj={};
          int_array=[];
          let bloodgrp=key.toString();
          let donor=0;
          let recipient=0;
          if(value && value.length>0){
            for(let i=0;i<value.length;i++){
              if(value[i].donorid && value[i].donorid>0){
                donor=donor+1;
              }else{
                recipient=recipient+1;
              }
            }
            int_array.push(bloodgrp);int_array.push(donor);int_array.push(recipient);
            finaldata.push(int_array);
          }
        }
          
        for(let i=0;i<App.tokendata.length;i++){
          for(let j=1;j<finaldata.length;j++){
            if(App.tokendata[i][0]==finaldata[j][0]){
              let newval=Math.ceil((finaldata[j][2]/finaldata[j][1]));
              App.tokendata[i][2].v=newval>1?(10+(10*newval)):10;
              App.tokendata[i][2].f=App.tokendata[i][2].v.toString();
            }
          }
        }

        google.charts.load('current', {'packages':['table']});
        google.charts.setOnLoadCallback(App.drawTable);
          var data = google.visualization.arrayToDataTable(finaldata);
    
          var options = {
            title: 'Blood Group Analysis',
            is3D:true,
            chartArea: {width: '50%'},
            hAxis: {
              title: 'Number of People',
              minValue: 0,
              textStyle: {
                bold: true,
                fontSize: 12,
                color: '#4d4d4d'
              },
              titleTextStyle: {
                bold: true,
                fontSize: 18,
                color: '#4d4d4d'
              }
            },
            vAxis: {
              title: 'Blood Group',
              textStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
              },
              titleTextStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
              }
            },
            width:700,
            height:250
          };
          var chart = new google.visualization.BarChart(document.getElementById('chart_div1'));
          chart.draw(data, options);
        })
      },
      drawTable:function () {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Blood Group');
        data.addColumn('number', 'Dontran Token Base Rate');
        data.addColumn('number', 'Dontran Token Current Rate');
        data.addRows(App.tokendata);

        var table = new google.visualization.Table(document.getElementById('chart_div2'));

        table.draw(data, {showRowNumber: true, width: '50%', height: '100%'});
      },

      abi: [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "alladdress",
          "outputs": [
            {
              "internalType": "address payable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "alladdressrecp",
          "outputs": [
            {
              "internalType": "address payable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "authaddress",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "authusers",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "authuserid",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "donors",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "userid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "donorid",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "donarname",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "donorage",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "gender",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "bloodgrp",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "status",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "recpId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "req",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "claimstatus",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "donorusers",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "donaruserid",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "recipients",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "userid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "recipientid",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "recipientname",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "recipientage",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "gender",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "reqbloodgrp",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "status",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "recipientusers",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "recipientuserid",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "trxndata",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "data",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_tokenadd",
              "type": "address"
            }
          ],
          "name": "settokenaddress",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getbalance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getauthuser",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "authuserid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                }
              ],
              "internalType": "struct transfusioncontract.Authreg",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "authuseraddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_username",
              "type": "string"
            }
          ],
          "name": "signupauth",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address payable",
              "name": "donaruseraddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_username",
              "type": "string"
            }
          ],
          "name": "signupdonor",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address payable",
              "name": "recipientuseraddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_username",
              "type": "string"
            }
          ],
          "name": "signuprecipient",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "donaraddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_donorname",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_donorage",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_gender",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_bloodgrp",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_status",
              "type": "uint256"
            }
          ],
          "name": "adddonors",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "fetchdonors",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "userid",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "donorid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "donarname",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "donorage",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "gender",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "bloodgrp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "status",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "recpId",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "req",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "claimstatus",
                  "type": "uint256"
                }
              ],
              "internalType": "struct transfusioncontract.Donorsprofile[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "fetchdonoruser",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "donaruserid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "uint256[]",
                  "name": "donoridlist",
                  "type": "uint256[]"
                }
              ],
              "internalType": "struct transfusioncontract.Donorreg",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipientaddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_recipientname",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_recipientage",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_gender",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_reqbloodgrp",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_status",
              "type": "uint256"
            }
          ],
          "name": "addrecipients",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "fetchrecipients",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "userid",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "recipientid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "recipientname",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "recipientage",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "gender",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "reqbloodgrp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "status",
                  "type": "uint256"
                }
              ],
              "internalType": "struct transfusioncontract.RecipientProfile[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "fetchrecipientuser",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "recipientuserid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "uint256[]",
                  "name": "recipientidlist",
                  "type": "uint256[]"
                }
              ],
              "internalType": "struct transfusioncontract.Recipientreg",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "approvebyauthorizer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "denybyauthorizer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "approvebyauthorizerforrecp",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "denybyauthorizerforrecp",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getdonrec",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "donorindex",
              "type": "uint256"
            }
          ],
          "name": "claimdonor",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "donorindex",
              "type": "uint256"
            }
          ],
          "name": "approveclaim",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "donorindex",
              "type": "uint256"
            }
          ],
          "name": "denyclaim",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "fetchdonarrecpdata",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "userid",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "donorid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "donarname",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "donorage",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "gender",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "bloodgrp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "status",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "recpId",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "req",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "claimstatus",
                  "type": "uint256"
                }
              ],
              "internalType": "struct transfusioncontract.Donorsprofile[]",
              "name": "",
              "type": "tuple[]"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "userid",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "recipientid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "recipientname",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "recipientage",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "gender",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "reqbloodgrp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "status",
                  "type": "uint256"
                }
              ],
              "internalType": "struct transfusioncontract.RecipientProfile[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "fetchtransactiondata",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "userid",
              "type": "uint256"
            }
          ],
          "name": "gettransfusionsummarydata",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "donaruserid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "uint256[]",
                  "name": "donoridlist",
                  "type": "uint256[]"
                }
              ],
              "internalType": "struct transfusioncontract.Donorreg",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "userid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "performtransaction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "performairdrop",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      abiToken:[
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "tokenOwner",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "loadtokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    }


$(function() {
    $(window).load(async function() {
      await App.init();
      await App.getdonordetails();
      await App.drawbarchart();
      await App.getapproveclaimdetails();
      await App.getauthorizerdetails();
      //google.charts.load('current', {packages: ['corechart', 'line']});
      //google.charts.setOnLoadCallback(App.drawAxisTickColors);
      google.charts.load('current', {packages: ['corechart']});
      google.charts.setOnLoadCallback(App.drawChart);
      google.charts.load('current', {packages: ['corechart', 'bar']});
      google.charts.setOnLoadCallback(App.drawbarchart);
      document.getElementById("authcheck").style.visibility = 'visible';
      document.getElementById("authcheck1").style.visibility = 'hidden';
      // google.charts.load('current', {'packages':['line']});
      // google.charts.setOnLoadCallback(App.drawlinechart);
      toastr.options = {
        // toastr.options = {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-full-width",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        // }
      };
    });
  });