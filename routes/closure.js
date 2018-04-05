var async = require('async');
var constants = require('./lib/constants.js');

exports.approve = function(req, res){
  var scrid=req.body.scrid;
  var lid=req.body.lid;
  var sanctionid=req.body.sanctionid;
  var tuser=JSON.parse(req.body.formdata)[0];
  var leaddata=JSON.parse(req.body.leaddata);
  var user=req.session.user;
  var compdata= req.session.compdata;
  //console.log("inside update task lid",lid,tuser);

  function updatedata(callback){
    var sql1="UPDATE `tbl_sanctions` SET sanctionremarks=?,tat=?,sanctionstatus='1' WHERE txnrefno=?"
    var params = [];
    var parsed = tuser;
    params.push(parsed.comments);
    params.push(parsed.tat);
    params.push(lid);
    db.query(sql1,params,function(err, results){  
      return callback(err,results);            
    });
  }
// function deffered, task for CRM created in Taskschedule module.
function createProject(presult,callback){ 
  var sql1="INSERT INTO `tbl_projects` (`coid`, `prjname`,`prjdesc`,`startdate`,`prjduedate`) VALUES (?,?,?,?,?)";
  var params = [];

  params.push(user.coid);
  params.push(leaddata.leadname);
  params.push(leaddata.leadname);
  params.push("");
  params.push(tuser.duedate);

  db.query(sql1,params,function(err, results){  
   if (!err && results && results.affectedRows > 0) {
    var resp = {
      status:"0",
      status_msg:"Success",
      custid:results.insertId
    };
    var response = JSON.parse(JSON.stringify(resp));
    return callback(err,response);
              // callback(err,response);
            }else{
              var err_msg="Failed to create new Project";
              if(err){err_msg = err["sqlMessage"] }
                var resp = {
                  status:"1",
                  status_msg:err_msg
                };
                var response = JSON.parse(JSON.stringify(resp));
                return callback(err,response);

              }   
            });
}



function gettasks(prjid,callback){
var params= [];
var param = [];
var Qry = "SELECT coid,tdefname,tdefdesc, tdefdoclist,tsk_grp from tbl_task_def WHERE find_in_set(tsk_grp,(SELECT GROUP_CONCAT(cvid) FROM tbl_codevalue WHERE find_in_set(parentid,?))) ";
db.query(Qry ,[leaddata.prdids],function(err, results){   
  //console.log(" auto insert ka result", err, results);
    var response = JSON.parse(JSON.stringify(results));
     
for (var i = 0; i < response.length; i++) {
 
var task = response[i];
var assign = compdata[constants[task.tsk_grp]];
console.log("Userid from compdata",assign);
if(!assign){

   assign = compdata["defaultassignto"];
}
//console.log("Userid from compdata",assign);

  param.push(task.coid);
  param.push(prjid.custid);
  param.push(task.tdefname);
  param.push(task.tdefdesc);
  param.push(task.tdefdoclist);
  param.push(assign);
  param.push("4");
  param.push(tuser.duedate);
  params.push(param);
  param = [];
}
console.log("Params for tasks",params);

return callback(err,params);
          });
}

function autoTasks(tasks,callback){

if(tasks.length > 0 ){
var Qry = "INSERT INTO `tbl_projdtls` (`coid`, `prjid`,`tskname`, `tskdesc`,`tskdoclist`,`assignto`,`tsk_curr_status`,`tsk_due_date`) values ?";
db.query(Qry ,[tasks],function(err, results){   
   console.log(" auto insert ka result", err, results);
    if (!err) {
    var resp = {
      status:"0",
      status_msg:"Success",
      custid:results.insertId
    };
          var response = JSON.parse(JSON.stringify(resp));
          return callback(err,response);
              // callback(err,response);
            }else{
                var err_msg="Failed to create new Project";
          if(err){err_msg = err["sqlMessage"]; }
              var resp = {
                status:"1",
                status_msg:err_msg
              };
              var response = JSON.parse(JSON.stringify(resp));
               return callback(err,response);
            }            
          });
} else{
var resp = {
      status:"0",
      status_msg:"Success"
    };
          var response = JSON.parse(JSON.stringify(resp));
          return callback(null,response);
}


}

async.waterfall([
  updatedata,
    createProject,
      gettasks,
        autoTasks
  ], function(err, results) {
    // console.log("Result from closure accept",results);
    if(err) console.log(err);  
    if (!err) {
      var resp = {
        status: "0",
        status_msg: "Success"
      };
      var response = JSON.parse(JSON.stringify(resp));
      res.send(response);
    } else {
      var err_msg = "Failed to Approve Lead";
      if (err) {
        err_msg = err["sqlMessage"];
      }
      var resp = {
        status: "1",
        status_msg: err_msg
      };
      var response = JSON.parse(JSON.stringify(resp));
      res.send(response);
    }
  });
};



exports.reject = function(req, res){
  var scrid=req.body.scrid;
  var lid=req.body.lid;
  var sanctionid=req.body.sanctionid;
  var tuser=JSON.parse(req.body.formdata);

  // console.log("inside update task");

  function updatedata(callback){
    var sql1="insert into `tbl_leadsch`(leadid,stage,nmd,allocto,products,userid,status,notes) (SELECT ? as leadid,'206' as stage,date_format(now(), '%m/%d/%Y') as nmd,allocto,products,userid, status,? as notes from tbl_leadsch WHERE txnid = (select max(txnid) from tbl_leadsch WHERE leadid = ? ))"
    var params = [];
    params.push(lid);
    params.push(tuser[0].comments);
    params.push(lid);
    db.query(sql1,params,function(err, results){  
      return callback(err,results);            
    });
  }

  function savedata(callback){
    var sql1="UPDATE `tbl_sanctions` SET sanctionremarks=?,tat=?,sanctionstatus='-1' WHERE txnrefno=?";
    var params = [];
    var parsed = tuser[0];
    params.push(parsed.comments);
    params.push(parsed.tat);
    params.push(lid);
    db.query(sql1,params,function(err, result){  
     return callback(err,result);   
   });
  }

  async.parallel([
    updatedata,
    savedata
    ], function(err, results) {
      if(err) console.log(err);  
      // console.log("Result from closure reject",results);
      if (!err && results && results[0].affectedRows > 0 && results[1].affectedRows > 0) {
        var resp = {
          status: "0",
          status_msg: "Success",
          custid: results.insertId
        };
        var response = JSON.parse(JSON.stringify(resp));
        res.send(response);
      } else {
        var err_msg = "Failed to Reject Lead";
        if (err) {
          err_msg = err["sqlMessage"];
        }
        var resp = {
          status: "1",
          status_msg: err_msg
        };
        var response = JSON.parse(JSON.stringify(resp));
        res.send(response);
      }
    });
  /*  res.send({status:'0'}); */  
};
