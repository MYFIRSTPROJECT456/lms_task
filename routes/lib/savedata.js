var async = require('async');
var utils = require('./utils.js');
var Validation = require('./lib/validate.js');

exports.add = function(req, res){
    var txn=req.session.ecryt_key;
    var coid=req.session.coid;
    var userid = req.session.user.enid;
    var user = req.session.user;
    var tuser=JSON.parse(req.body.formdata);
    var scrid=""+req.body.scrid;
// var query ="INSERT INTO `tbl_params` (`Leadstatus`, `Name`, `Description`, `Parent`,`userid`) VALUES (?, ?, ?, ?, ?)";

var query = "";
var params = [];
console.log("Scrid",scrid);
console.log("Screen details which were added",tuser);
/*    res.send({status:'1'});*/
var inserted;
function getAllKpis(callback){
    async.parallel([
        async.apply(utils.get_datastore,coid,parseInt(scrid),txn),
        async.apply(utils.getscrndtl,coid,parseInt(scrid),txn)  
    ], function(err, result) {
     /*   console.log("validate screen details",result);*/
        if(err) console.log(err);
        update(tuser[0],result[1],function(err,results){
          if(err){
            res.send({status:'0',err_msg:"Could not save :- \n"+results.err_msg});
          }
          else
             return preprocess(result[0][0],callback);
            
          });
  });
}

function update(data,scrndtl,callback){
  var txnid=parseInt(1111);
  console.log("ID:"+scrndtl);
  return Validation.validate_value(txnid,data,scrndtl,callback);
};

function preprocess(data,callback){
switch(scrid) 
{
case "566"://lead
          params.push(""+(new Date().getFullYear())+""+(Math.floor(Math.random() * 10000000)));
          break;
case "569"://user
console.log("inside preprocessing");
          break;
case "570"://CP
          break;
case "571"://CM
          break;
case "573"://task
          break;
}
        for(var x in tuser[0]){
            if (x == 'data-table1_length') {
            }else{
                params.push(tuser[0][x]);
            }
        }
        params.push(parseInt(userid));
        params.push(parseFloat(0.0));
        params.push(parseFloat(0.0));
return savedata(data,params,callback);
};


function savedata(data,param,callback){
    query = data.col6;
 db.query(query, param, function(err, results) {
          var insertresp = JSON.parse(JSON.stringify(results));
            if (err) {
               throw err;
            } else {
/*                console.log('response : ', JSON.stringify(results));*/
                return postprocessing(err,insertresp,data,param,callback); // Scope is larger than function 
      /*          console.log(JSON.stringify(insertresp));*/
            }    
        });
}

function postprocessing(err,insertresp,data,param,callback){

console.log("scrid pp"+scrid);
switch(scrid) 
{
case "566"://lead
           return callback(err,insertresp);
          break;
case "569"://user
console.log("Inside login");
          return insertlogin(param,callback);
          break;
case "570"://CP
           return callback(err,insertresp);
          break;
case "571"://CM
           return callback(err,insertresp);
          break;
case "573"://task
        if(tuser[0].taskstatus=="6" && user.roleid == "60" ){
          return saveMgr(callback);
        }else{
          return callback(err,insertresp);
        }
          break;
    }
};

function saveMgr(callback){
var sql1="INSERT INTO `tbl_task` (`name`,`assignto`,`userid`, `txn_latid`, `txn_longid`) VALUES (?,?,?,?,?)";
   var params = [];
        params.push(tuser[0].name);
        params.push("3");
        params.push(userid);
        params.push(parseFloat(0.0));
        params.push(parseFloat(0.0));
  db.query(sql1,params,function(err, results){  
           return callback(err,results);   
      });
}

function insertlogin(param,callback){
    var query ="INSERT INTO `tbl_login` (`coid`,`enname`, `loginid`, `pwd`, `roleid`) VALUES (?,?,?,?,?)";
  var params=[];
  params.push(coid);
  params.push(tuser[0].user_name);
  params.push(tuser[0].mobile);
  params.push("pass@123");
  params.push(tuser[0].role);
   db.query(query, params, function(err, results) {
       
            if (err) {
               throw err;
            } else {
                 var insertresp = JSON.parse(JSON.stringify(results));
                return callback(err, insertresp); // Scope is larger than function 
            }  
        });
}
    
getAllKpis(function(err,results){
    if(err){
      throw err;
    }
             console.log("FInal saving result",JSON.stringify(results));
       if(results != null && results.affectedRows>0){
        res.send({status:'1'});  
  }
  else{
        res.send({status:'0',err_msg:"Failed while saving data"});
  }
  });

}