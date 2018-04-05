var async = require('async');
var request = require('request');


exports.tasklist = function(req, res, next){
 var projectid =req.body.projectid;
 var sql1 = "SELECT prjid,tasksrno, taskdefid, taskname,  taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus,(SELECT GROUP_CONCAT(cvvalule) FROM tbl_codevalue WHERE FIND_IN_SET(cvid,task_docs)) as task_docs,task_depid, estimatehr, (SELECT   prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname,   (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid , a.assignto )) as   assignto, taskduedate as due_date FROM `tbl_task_sch` a where prjid = ? and sts <> -1 and taskstatus NOT IN(6,7)";
  // console.log(sql1);
  db.query(sql1,[projectid] ,function(err, results){
   // console.log("result", err, results);
   if(results && results.length>0){
    res.render("tasks_fclose",{taskmgmt:JSON.parse(JSON.stringify(results)),taskmgmtdd:JSON.stringify(results),prjid:projectid});
  }else{
    res.render("tasks_fclose",{taskmgmt:[],taskmgmtdd:JSON.stringify([]),prjid:projectid});
  }
});
}



exports.update = function(req, res) {
    var post = req.body;
    var taskids = req.body.taskids;
    var taskstatus = JSON.parse(post.formdata)[0].status;
    var remark = JSON.parse(post.formdata)[0].remark;
    var sql = "UPDATE `tbl_task_sch` set taskstatus = ?, TaskNotes = ? WHERE find_in_set(tasksrno,?) AND sts = 0";
    console.log(sql);
    db.query(sql, [taskstatus, remark, taskids], function(err, results) {
        // console.log("result details", err, results);
        if (!err && results && results.affectedRows > 0) {
            var resp = {
                status: "0",
                status_msg: "Success",
                custid: results.insertId
            };
            var response = JSON.parse(JSON.stringify(resp));
            res.send(response);
        } else {
            var err_msg = "Failed";
            if (err) {
                err_msg = err["sqlMessage"]
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
