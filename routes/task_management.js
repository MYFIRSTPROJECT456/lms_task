var async = require('async');
var request = require('request');


exports.taskmgmtlist = function(req, res, next){
   var projectid =req.body.projectid;
   var sql1 = "SELECT prjid,tasksrno, taskdefid, taskname,  taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus,(SELECT GROUP_CONCAT(cvvalule) FROM tbl_codevalue WHERE FIND_IN_SET(cvid,task_docs)) as task_docs,task_depid, estimatehr, (SELECT   prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname,   (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid, a.assignto)) as   assignto, taskduedate as due_date FROM `tbl_task_sch` a where prjid = ? and sts <> -1";
  // console.log(sql1);
  db.query(sql1,[projectid] ,function(err, results){
   // console.log("result", err, results);
   if(results && results.length>0){
    res.render("task_Management",{taskmgmt:JSON.parse(JSON.stringify(results)),taskmgmtdd:JSON.stringify(results),prjid:projectid});
}else{
    res.render("task_Management",{taskmgmt:[],taskmgmtdd:JSON.stringify([]),prjid:projectid});
}
});
}

exports.taskdetails = function(req, res, next){
    var taskid = req.body.taskid;
    // console.log(req.body,taskid);
    var sql1 = "SELECT prjid, tasksrno, taskdefid, taskname, taskDescription,taskstatus,task_docs,task_depid, estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, assignto, taskduedate as due_date FROM `tbl_task_sch` a WHERE tasksrno =?";
    // console.log(req.body,taskid,sql1);
    db.query(sql1,[taskid] ,function(err, results){   
        // console.log("result", err, results);
        if(results && results.length>0){
            res.send(JSON.parse(JSON.stringify(results)));
        }else{
            res.send([]);
        }
    });
}

exports.updatetask = function(req, res) {
    async.waterfall([
        update_task,
        insert_task
        ], function(err, results) {
        // console.log("task update ",err,results);
        res.send(results);
    });

    function insert_task(result,callback) {
        if(result == '0'){
            var post = JSON.parse(req.body.formdata)[0];
            var tenantid=coid;
            var prjid= post.prjname;
            var taskid= post.taskid;
            var taskname= post.taskname;
            var taskdescription= post.taskdesc;
            var assignto= post.assignto;
            var taskdepid =post.depid;
            var doclist =post.doclist;
            var taskduedate =post.duedate;
            var estimatehr = post.esthours;
            var assignby = req.session.user.userid
            var status = "3"
            if(post.status){
                status = post.status; 
            }
            // console.log("post", post);
            var sql1 = "INSERT INTO `tbl_task_sch` (`coid`, `prjid`, `taskname`, `taskDescription`, `assignto`, `assignby`, `task_depid`, `task_docs`, `taskduedate`,`estimatehr`,`prvtsksrno`,`taskstatus`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            db.query(sql1 ,[tenantid,prjid,taskname,taskdescription,assignto,assignby,taskdepid,doclist,taskduedate,estimatehr,taskid,status],function(err, results){
                // console.log(" insert ka result", err, results);
                if (!err && results && results.affectedRows > 0) {
                    var resp = {
                        status: "0",
                        status_msg: "Success",
                        custid: results.insertId
                    };
                    var response = JSON.parse(JSON.stringify(resp));
                    callback(err,response);
                } else {
                  var err_msg="Failed to create task";
                  if(err){err_msg = err["sqlMessage"] }
                    var resp = {
                        status: "1",
                        status_msg: err_msg
                    };
                    var response = JSON.parse(JSON.stringify(resp));
                    callback(err,response);
                }
            });
        }else{
            var resp = {
                status: "-1",
                status_msg: "Failed"
            };
            var response = JSON.parse(JSON.stringify(resp));
            callback(null,response);
        }
    }

    function update_task(callback) {
        var post = JSON.parse(req.body.formdata)[0];
        var tasksrno = post.taskid;
        var sql = "UPDATE `tbl_task_sch` SET `sts` = '-1' WHERE `tbl_task_sch`.`tasksrno` = ?";
        db.query(sql, [tasksrno,tasksrno], function(err, results) {
            // console.log("", err, results);
            if (results) {
                callback(null,0);
            } else {
                callback(null,-1);
            }
        });

    }
}

exports.taskdelete = function(req, res, next){
    var taskid = req.body.taskid;
    var sql1 = "UPDATE `tbl_task_sch` SET `sts` = '-1' WHERE `tbl_task_sch`.`tasksrno` = ?";
    db.query(sql1,[taskid] ,function(err, results){   
     if (!err && results && results.affectedRows > 0) {
        var resp = {
            status: "0",
            status_msg: "Success"
        };
        var response = JSON.parse(JSON.stringify(resp));
        res.send(response);
    } else {
      var err_msg="Failed to delete task";
      if(err){err_msg = err["sqlMessage"] }
        var resp = {
            status: "1",
            status_msg: err_msg
        };
        var response = JSON.parse(JSON.stringify(resp));
        res.send(response);
    }
});
}
