
var request = require('request');
var async = require('async');
var multer = require('multer');


exports.create = function(req, res, next){

    var files = [];

    // var coid = req.session.user.coid;
    var enid = req.session.user.enid;
    
    var custid = enid;
    var filewithdir, doc_name = '',
        doc_desp = '';
    var post;

    // console.log("post",req.body);
   

    var Storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, "./Contents");
        },
        filename: function(req, file, callback) {
            filename = coid + "_" + enid + "_" + Date.now() + "_" + file.originalname;
            var i = filename.lastIndexOf('.');
            extesion = (i < 0) ? '' : filename.substr(i);
            //            console.log(extesion);
            filewithdir = '/Contents/' + filename;
            files.push(filewithdir);

            console.log("FileArray", files);
            console.log("Filename", filename);
            callback(null, filename);
        }
    });

    var upload = multer({
        storage: Storage
    }).array("imgUploader", 5); //Field name and max count 
    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        post = req.body;
        console.log('post ka data', req.body);
        if(post.custid){
            custid = post.custid;
        }
        console.log("COntext body", req.body);
        create();
    });
    
    if(assignto && assignto != ""){
        task_status = "4";
    }
 var message = '';
    var sess = req.session; 
    //var post = JSON.parse(req.body.formdata)[0];
    var tenantid=coid;
    var prjid= post.prjname;
    var taskname= post.taskname;
    var taskdescription= post.taskdesc;
    var assignto= post.assignto;
    var assignby= sess.user.enid;
    var task_docs = post.doclist;
    var estimatehr= post.esthours;
    var taskduedate= post.duedate;
    var task_status = "3";
// console.log("post",post);

};
  function create(){
    var sql1 = "INSERT INTO `tbl_task_sch` (`coid`, `prjid`, `taskname`, `taskDescription`, `assignto`, `assignby`, `estimatehr`,`task_docs`, `taskduedate`,`taskstatus`) VALUES (?,?,?,?,?,?,?,?,?,?)";
db.query(sql1 ,[tenantid,prjid,taskname,taskdescription,assignto,assignby,estimatehr,task_docs,taskduedate,task_status],function(err, results){   
            // console.log(" insert ka result", err, results);
            if (!err && results && results.affectedRows > 0) {
              var resp = {
                status:"0",
                status_msg:"Success",
                custid:results.insertId
              };
              var response = JSON.parse(JSON.stringify(resp));
              res.send(response);
              // callback(err,response);
            }else{
             var err_msg="Failed to create task schedules";
             if(err){err_msg = err["sqlMessage"] }
              var resp = {
                status: "1",
                status_msg: err_msg
              };
              var response = JSON.parse(JSON.stringify(resp));
              res.send(response);
               // callback(err,response);
             }                 
           });    
  }
exports.taskalloclist = function(req, res, next){

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
            var data = result.txnids+","+user.userid;

              var sql1;
              var params= [];

  if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){

sql1 = "SELECT tasksrno, taskdefid, taskname, taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus , estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid ,a.assignto)) as assignto, taskduedate FROM `tbl_task_sch` a WHERE sts='0'";

  }else{

            sql1 = "SELECT tasksrno, taskdefid, taskname, taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus , estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT group_concat(username) FROM `tbl_users` d WHERE find_in_set(d.txnid ,a.assignto)) as assignto, taskduedate FROM `tbl_task_sch` a WHERE (CONCAT(',', assignto, ',') REGEXP concat(',',(?),',')) and sts='0'";
            params.push(data);

          }
            db.query(sql1,params, function(err, results) {
                // console.log("task list getlist : ",result.txnids ,err, results);
                if (results && results.length > 0) {
                    res.render("task_allocation", {
                        taskalloclist: JSON.parse(JSON.stringify(results))
                    });
                } else {
                    res.render("task_allocation", {
                        taskalloclist: []
                    });
                }
            });
        }else{
            res.render("task_allocation", {
                taskalloclist: []
            });
        }
    }

    function getuserids(callback) {
       var user = req.session.user;
        var sql = "select  GROUP_CONCAT(txnid  SEPARATOR '|') as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where find_in_set(reportingto, @pv) > 0 and     @pv := concat(@pv, ',', txnid)";
        db.query(sql, [user.userid], function(err, results) {
            // console.log("getuserids", err, results);
            if (results) {
                callback(null,results[0]);
            } else {
                callback(null,user.userid);
            }
        });

    }

}
