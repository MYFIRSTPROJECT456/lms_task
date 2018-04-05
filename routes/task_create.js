var request = require('request');
var TaskSchedules = require('./lib/task_schedule.js');
var async = require('async');

exports.create = function(req, res,next) {
    var message = '';
    var tenantid = coid;
   var post = JSON.parse(req.body.formdata)[0];
    // console.log("task_creation",post);

   async.waterfall([
        generateSchedule,
        savedata
    ], function(err, results) {
        if (err) {
            next(err);
        } else {
            // console.log("Result of task creation",results);
           //res.send(results);
            res.send({status:"0"});
        }
    });

function generateSchedule(callback){   
 var taskschedules=TaskSchedules.taskmaster(post);
  var params=builddata(taskschedules);
return callback(null,params);
}

    function savedata(params, callback) {
        var sql1 = "INSERT INTO `tbl_projdtls` (`coid`, `prjid`,`tskname`, `tskdesc`, `tskesthrs`, `assignto`, `tsk_due_date`, `tsk_curr_status`,`tskdoclist`) VALUES ?";
        db.query(sql1, [params], function(err, results) {
            // console.log(" insert ka result", err, results);
            if (!err && results && results.affectedRows > 0) {
                var resp = {
                    status: "0",
                    status_msg: "Success",
                    custid: results.insertId
                };
                var response = JSON.parse(JSON.stringify(resp));
                // res.redirect("/task_definition");
                callback(err, response);
            } else {
                var err_msg = "Failed to create task schedules";
                if (err) {
                    err_msg = err["sqlMessage"]
                }
                var resp = {
                    status: "1",
                    status_msg: err_msg
                };
                var response = JSON.parse(JSON.stringify(resp));
                // res.redirect("/task_definition");
                callback(err, response);
            }
        });
    }

function builddata(data){
  var params = [];
  var param=[];
    // console.log("*********INSIDEARRAY********",data);
    for (var i = 0; i < data.length; i++) {
      var item =data[i];
      for(var x in item){
          param.push(item[x]);  
      }
//      param.push(req.session.user.userid);
      params.push(param);
      param=[];
    }
  return params;   
}
};