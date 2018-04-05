var async = require('async');

var request = require('request');
exports.updatetask = function(req, res) {
    async.waterfall([
        update_task,
        insert_task
        ], function(err, results) {
            res.send(results);
       /* if (err) {
            res.send(err);
        } else {
        
        }*/
    });

    function insert_task(result,callback) {
        if(result == '0'){
            var post = JSON.parse(req.body.formdata)[0];
            var tenantid = coid;
            var prjid = post.prjname;
            var tasksrno = post.taskid;
            var taskname = post.taskname;
            var taskdescription = post.taskdesc;
            var status = post.status;
            var taskduedate = post.duedate;
            var taskdoc = post.doclist;
            var remark = post.remark;
            var estimatehr = post.esthours;
            var assignto = post.assignto;


var assignby = req.session.user.userid;

            // console.log("post", post);
            var sql1 = "INSERT INTO `tbl_task_sch` (`coid`, `prjid`, `taskname`, `taskDescription`, `taskstatus`,`taskduedate`,`taskNotes`,`task_docs`,`estimatehr`,`assignto`,`assignby`,`prvtsksrno`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            db.query(sql1, [tenantid, prjid, taskname, taskdescription, status, taskduedate, remark, taskdoc,estimatehr,assignto,assignby,tasksrno], function(err, results) {
               // console.log("update task result : ",err," ",results);
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


exports.filterlist = function(req, res) {
    var user = req.session.user;
    var prjid = req.body.prjid;
    // console.log("project id ",prjid , req.body);
    var sql1 = "SELECT tasksrno, taskdefid, taskname, taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus , estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid , a.assignto)) as assignto, taskduedate,if(STR_TO_DATE(taskduedate, '%m/%d/%Y') >= date_format(date(now()),'%Y-%m-%d'),1,0) as due FROM `tbl_task_sch` a WHERE sts='0' and prjid = ?";
     // console.log("task list query", sql1);
     db.query(sql1, [prjid], function(err, results) {
         // console.log("task list result", err, results);
         if (results && results.length > 0) {
            res.render("task_list", {
                tasklist: JSON.parse(JSON.stringify(results))
            });
        } else {
            res.render("task_list", {
                tasklist: []
            });
        }
    });
 }
 
 exports.tasklist = function(req, res) {
    async.waterfall([
        getuserids,
        getlist
        ], function(err, results) {
            if (err) {
                res.send(err);
            } else {
            // res.redirect("/task_list");
            res.send(results);
        }
    });
    
    
    function getlist(result,callback) {
     var user = req.session.user;
     if(result){
        var data = result.txnids;
        var sql1;
        var params = [];

        if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){

        sql1 = "SELECT tasksrno, taskdefid, taskname, taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus , estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid , a.assignto)) as assignto, taskduedate,if(STR_TO_DATE(taskduedate, '%m/%d/%Y') >= date_format(date(now()),'%Y-%m-%d'),1,0) as due FROM `tbl_task_sch` a WHERE sts='0'";

        }else{

        sql1 = "SELECT tasksrno, taskdefid, taskname, taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus , estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid , a.assignto)) as assignto, taskduedate,if(STR_TO_DATE(taskduedate, '%m/%d/%Y') >= date_format(date(now()),'%Y-%m-%d'),1,0) as due FROM `tbl_task_sch` a WHERE CONCAT(',', assignto, ',') REGEXP concat(',',(?),',') and sts='0'";
params.push(data);
        }
        db.query(sql1, params, function(err, results) {
                // console.log("task list getlist : ",result.txnids ,err, results);
                if (results && results.length > 0) {
                    res.render("task_list", {
                        tasklist: JSON.parse(JSON.stringify(results))
                    });
                } else {
                    res.render("task_list", {
                        tasklist: []
                    });
                }
            });
    }else{
        res.render("task_list", {
            tasklist: []
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
