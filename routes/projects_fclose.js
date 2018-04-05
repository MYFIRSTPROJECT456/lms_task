var async = require('async');
var request = require('request');

exports.list = function(req, res, next) {
    var sql = "SELECT prjid,prjname,prjdesc,startdate,prjduedate FROM `tbl_projects` WHERE prjid IN (SELECT DISTINCT(prjid) FROM `tbl_task_sch` WHERE taskstatus NOT IN(6,7))";

    console.log(sql);
    db.query(sql, [], function(err, results) {
        // console.log("result details", err, results);
        if (results && results.length > 0) {
            res.render("projects_fclose", {
                projects: JSON.parse(JSON.stringify(results))
            });
        } else {
            res.render("projects_fclose", {
                projects: []
            });
        }
    });
};

exports.update = function(req, res) {
    var userid = req.session.user.enid
    var post = req.body;
    var prjids = req.body.prjids;
    var taskstatus = JSON.parse(post.formdata)[0].status;
    var remark = JSON.parse(post.formdata)[0].remark;
    var sql = "UPDATE `tbl_task_sch` set taskstatus = ?, TaskNotes = ?, assignby = ? WHERE find_in_set(prjid,?) AND sts = 0";
    console.log(sql);
    db.query(sql, [taskstatus, remark, userid, prjids], function(err, results) {
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