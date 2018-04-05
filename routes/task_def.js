var async = require('async');
var request = require('request');

exports.create = function(req, res) {
    var message = '';
    var post = JSON.parse(req.body.formdata)[0];
    console.log("task_definition",post);

    var tenantid = coid;
    var taskname = post.taskname;
    var description = post.description;
    var parent_task = post.parent_task;
    var estmatehr = post.estmatehr;
    var docgen = post.docgen;
    var doclist = post.doclist;
    var task_group=post.task_group;
    var task_group_alt=post.task_group_alt;
    
    async.waterfall([
        creategrp,
        saveresult
    ], function(err, results) {
         console.log("task update ",err,results);
         res.send(results);
    });


function creategrp(callback){

if(task_group == "241"){
    var sql1 = "INSERT INTO `tbl_codevalue` (`cvmasterid`, `cvvalule`, `parentid`) VALUES ('3', ?, '0')";

    db.query(sql1, [task_group_alt], function(err, results) {
         console.log(" create group", err, results);
       if (!err && results && results.affectedRows > 0) {
           
            return callback(err,results.insertId);
        } else {
                 return callback(null, null);
        }
    });
}else{

return callback(null,task_group);
}
}

   function saveresult(grpid,callback){
 console.log(" grp result", grpid);
if(grpid){

if(parent_task == ""){
  parent_task = "0";
}

    var sql1 = "INSERT INTO `tbl_task_def` (`coid`, `tdefname`, `tdefdesc`, `tdefparentid`, `tdefesthrs`,`tdefdocflg`, `tdefdoclist`,`tsk_grp`) VALUES (?,?,?,?,?,?,?,?)";

    db.query(sql1, [tenantid, taskname, description, parent_task, estmatehr, "0",doclist,grpid], function(err, results) {
         // console.log(" save result", err, results);
       if (!err && results && results.affectedRows > 0) {
            var resp = {
                status: "0",
                status_msg: "Success",
                custid: results.insertId
            };
            var response = JSON.parse(JSON.stringify(resp));
            res.send(response);
            // callback(err,response);
        } else {
                  var err_msg="Failed to create task";
          if(err){err_msg = err["sqlMessage"] }
            var resp = {
                status: "1",
                status_msg: err_msg
            };
            var response = JSON.parse(JSON.stringify(resp));
               res.send(response);
        }
    });
}else{

 var err_msg="Failed to create task";
            var resp = {
                status: "1",
                status_msg: err_msg
            };
            var response = JSON.parse(JSON.stringify(resp));
               res.send(response);
}
  }
};



exports.list = function(req, res, next){


  function getAllKpis(callback){

   var user = req.session.user;
   var Qry="SELECT (select cvvalule from tbl_codevalue WHERE cvid= a.tsk_grp) as task_group, a.tdefname,a.tdefdesc,a.tdefesthrs, (SELECT tdefname from tbl_task_def WHERE tdefid = a.tdefparentid) as prtask, (SELECT GROUP_CONCAT(cvvalule) FROM tbl_codevalue WHERE FIND_IN_SET(cvid,a.tdefdoclist)) as doclist FROM `tbl_task_def` a " ;
   db.query(Qry,[],function(err, results){
    if (err){ 
      return next(err);
    }
                   var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
                   return callback(err,orders);  
                 });    
 }

 getAllKpis(function(err,result){

  if(err){
    return next(err);
  }
res.render('task_definition.ejs',{tasklist:result});
});
}