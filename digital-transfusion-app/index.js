require("dotenv").config()
var express = require('./node_modules/express');
var app = express();
app.use(express.json());

// const {Client } = require("pg");
 const pg = require("pg");

app.use(express.static('src'));
const connectionstring = "postgres://xjerxkym:2B1cIimRsf7p6z_AvGmxlCOMDNLu-eKS@raja.db.elephantsql.com/xjerxkym";
// const client = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "DigitalTransfusion",
//   password: "arjunragav016",
//   port: 5432,
// });
const client = new pg.Client(connectionstring);
client.connect();



app.post('/donorsignup',(req,res)=>{
  console.log(req);
  let addressfaciity=req.body.facility;
  let donarcontact=req.body.contact;
  const savedonarreg = async (addressfacility,donarcontact) => {
    try {
    
    
    const query = `INSERT INTO donorreg(address,contact)  VALUES ($1,$2) RETURNING *`;
    try {
    
    await client.query(query, [addressfacility, donarcontact]);
    
    return res.send(req.body);
    }
    
    catch(error){
    console.error(error.stack);
    return res.status(400).send('Some Error');
    }
    
    
    }
    catch (error) {
    console.error(error.stack);
    return res.status(400).send('Some SQL Error');
    }
    };
    savedonarreg(addressfaciity,donarcontact);
})

app.post('/recipientsignup',(req,res)=>{
  console.log(req);
  let addressfaciity=req.body.facility;
  let recipientcontact=req.body.contact;
  const saverecipientreg = async (addressfacility,recipientcontact) => {
    try {
    
    
    const query = `INSERT INTO recipientreg(address,contact)  VALUES ($1,$2) RETURNING *`;
    try {
    
    await client.query(query, [addressfacility, recipientcontact]);
    
    return res.send(req.body);
    }
    
    catch(error){
    console.error(error.stack);
    return res.status(400).send('Some Error');
    }
    
    
    }
    catch (error) {
    console.error(error.stack);
    return res.status(400).send('Some SQL Error');
    }
    };
    saverecipientreg(addressfaciity,recipientcontact);
})

app.post('/authsignup',(req,res)=>{
  console.log(req);
  let addressfaciity=req.body.facility;
  let authcontact=req.body.contact;
  const saverecipientreg = async (addressfacility,authcontact) => {
    try {
    
    
    const query = `INSERT INTO authreg(address,contact)  VALUES ($1,$2) RETURNING *`;
    try {
    
    await client.query(query, [addressfacility, authcontact]);
    
    return res.send(req.body);
    }
    
    catch(error){
    console.error(error.stack);
    return res.status(400).send('Some Error');
    }
    
    
    }
    catch (error) {
    console.error(error.stack);
    return res.status(400).send('Some SQL Error');
    }
    };
    saverecipientreg(addressfaciity,authcontact);
})

app.post('/getsummarydata',(req,res)=>{
  console.log(req);
  let userid=req.body.userid;
  const getsummdata = async (userid) => {
    try {
    
    
    const query = `select * from donorreg where donaruserid = $1`;
    try {
    
      const { rows } = await client.query(query, [userid]);
      if (rows.length)
      { 
        return res.send(rows[0]);
      }else{
        return res.send(req.body);
      }
    
    }
    
    catch(error){
    console.error(error.stack);
    return res.status(400).send('Some Error');
    }
    
    
    }
    catch (error) {
    console.error(error.stack);
    return res.status(400).send('Some SQL Error');
    }
    };
    getsummdata(userid);
})

app.get('/', function (req, res) {
  res.render('index.html');
});
// if (typeof localStorage === "undefined" || localStorage === null) {
//   LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./src');
//   localStorage.removeItem('flagIndex')
// }

// if(localStorage.getItem('flagIndex')==='undefined' || localStorage.getItem('flagIndex')===null ) {
//   localStorage.setItem('flagIndex.json', Math.floor((Math.random() * 243) + 1));
// }
const port=process.env.PORT||3010;
app.listen(port, function () {
  console.log('Counter Dapp listening on port 3010!');
});