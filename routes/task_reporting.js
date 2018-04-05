var async = require('async');
var request = require('request');


exports.list = function(req, res, next){
    var taskid = req.body.taskid;
    console.log(req.body,taskid);
        
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
    
    function getuserids(callback) {
       var user = req.session.user;
        var sql = "select  GROUP_CONCAT(prvtsksrno) as txnids from (select * from tbl_task_sch order by tasksrno DESC) tbl_task_sch,(select @pv := ?) initialisation where find_in_set(tasksrno, @pv) > 0 and @pv := concat(@pv, ',', prvtsksrno)";
        db.query(sql, [taskid], function(err, results) {
           // console.log("getuserids", err, results);
            if (results) {
                callback(null,results[0]);
            } else {
                callback(null,user.userid);
            }
        });
    }
    
   function getlist(result,callback) {
         if(result){
            var data = result.txnids+","+taskid;
            var sql1 = "SELECT (SELECT prjname FROM tbl_projects WHERE prjid = a.prjid) as prjname,prjid , tasksrno, taskdefid, taskname, taskDescription, taskstatus,task_docs,task_depid, estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, assignto, taskduedate as due_date FROM `tbl_task_sch` a WHERE tasksrno =?;SELECT prjid, tasksrno, taskdefid, taskname, taskDescription,(SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = taskstatus) as taskstatus, task_docs, task_depid, estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT group_concat(username) FROM tbl_users WHERE find_in_set(txnid, assignto)) as assignto, (SELECT username FROM tbl_users WHERE txnid = assignby) as assignby, taskduedate as due_date,dategen, TaskNotes FROM `tbl_task_sch` a WHERE find_in_set(tasksrno, ?) ORDER BY tasksrno DESC";
            console.log(req.body,taskid,sql1);
            db.query(sql1,[taskid,data] ,function(err, results){   
                if(results && results[0].length>0){
                console.log("result", err, results[0]);
                    res.render("task_reporting.ejs",{tasks:JSON.stringify(results[0][0]),taskh:JSON.parse(JSON.stringify(results[1]))});
                }else{
                 console.log("result empty");
                    res.render("task_reporting.ejs",{tasks:JSON.stringify([]),taskh:[]});
                }
            });
        }else{
            console.log("result empty");
            res.render("task_reporting.ejs",{tasks:JSON.stringify([]),taskh:[]});
        }
    }
    
}