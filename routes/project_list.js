var async = require('async');
var request = require('request');
var constants = require('./lib/constants.js');


exports.create = function(req, res, next){
  var compdata= req.session.compdata;

  var message = '';
  var sess = req.session; 
  var post  = req.body;
  var tenantid=coid;
  var userid=req.session.user.enid;
  var projectname= post.projectname;
  var description= post.description;
  var startdate= post.startdate;
  var duedate= post.duedate;
  var reporting= post.reporting;
  var task_group=post.task_group;

  async.waterfall([
    createProject,
    autoTasks
    ], function(err, results) {
      if (err) {
        next(err);
      } else {
        res.redirect("/calendar");
         //   res.send({status:"0"});
       }
     });

  function createProject(callback){

    var sql1="INSERT INTO `tbl_projects` (`coid`, `prjname`,`prjdesc`,`startdate`,`prjduedate`) VALUES (?,?,?,?,?)";

    db.query(sql1 ,[tenantid,projectname,description,startdate,duedate],function(err, results){   
  // console.log(" insert ka result", err, results);
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

  function autoTasks(prjid,callback){

    var compdata= req.session.compdata;
    assign = compdata["defaultassignto"];
    if(prjid && prjid.custid){
      var Qry = "INSERT INTO `tbl_projdtls` (`coid`, `prjid`,`tskname`, `tskdesc`,`tskdoclist`,`assignto`,`tsk_curr_status`,`tsk_due_date`) SELECT coid,? as projectid,tdefname,tdefdesc, tdefdoclist,?,3,? from tbl_task_def WHERE tsk_grp = ?";
      db.query(Qry ,[prjid.custid,assign,duedate,task_group],function(err, results){   
   //console.log(" insert ka result", err, results);
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
              if(err){err_msg = err["sqlMessage"]; }
              var resp = {
                status:"1",
                status_msg:err_msg
              };
              var response = JSON.parse(JSON.stringify(resp));
              return callback(err,response);
            }                 
          });
    }
    else{
     var err_msg="Failed to create new Project";
     var resp = {
      status:"1",
      status_msg:err_msg
    };
    var response = JSON.parse(JSON.stringify(resp));
    return callback(null,response);
  }
}

};


exports.list = function(req, res, next){
    async.waterfall([
        getuserids,
        getlist
        ], function(err, results) {
            if (err) {
                res.send(err);
            } else {
            res.send(results);
        }
    });
    
    function getlist(result,callback) {
      console.log('result ka data', result);
     var user = req.session.user;
     if(result){
      console.log('result ka data', result.txnids);
        var data = result.txnids;
        var sql1;
        var params = [];

        if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){

        sql1 = "SELECT tasksrno, taskdefid, taskname, taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus , estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid , a.assignto)) as assignto, taskduedate,if(STR_TO_DATE(taskduedate, '%m/%d/%Y') >= date_format(date(now()),'%Y-%m-%d'),1,0) as due FROM `tbl_task_sch` a WHERE sts='0'";

        }else{

        sql1 = "SELECT tasksrno, taskdefid, taskname, taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus , estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid , a.assignto)) as assignto, taskduedate,if(STR_TO_DATE(taskduedate, '%m/%d/%Y') >= date_format(date(now()),'%Y-%m-%d'),1,0) as due FROM `tbl_task_sch` a WHERE CONCAT(',', assignto, ',') REGEXP concat(',',(?),',') and sts='0'";
        params.push(data);
        }
        console.log('params ka data', params);
        db.query(sql1, params, function(err, results) {
                // console.log("task list getlist : ",result.txnids ,err, results);
                if (results && results.length > 0) {
                    res.render("project_list", {
                        tasklist: JSON.parse(JSON.stringify(results)),taskmgmtdd:JSON.stringify(results)
                    });
                } else {
                    res.render("project_list", {
                        tasklist: [],taskmgmtdd:JSON.stringify([])
                    });
                }
            });
    }else{
        res.render("project_list", {
            tasklist: [],taskmgmtdd:JSON.stringify([])
        });
    }
}

function getuserids(callback) {
 var user = req.session.user;
 var sql = "select  GROUP_CONCAT(txnid  SEPARATOR '|') as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 or txnid = ?) and @pv := concat(@pv, ',', txnid)";
 db.query(sql, [user.enid,user.enid], function(err, results) {
            // console.log("getuserids", err, results);
            if (results) {
                callback(null,results[0]);
            } else {
                callback(null,user.userid);
            }
        });

}



}

//project_list
