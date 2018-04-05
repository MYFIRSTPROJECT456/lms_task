//var utils = require('./utils.js');
var async = require('async');

exports.events = function(req, res, next){
  var user = req.session.user;
  function getAllKpis(callback){
    async.parallel([
      getCalls,
      getTasks
      ], function(err, done) {
        if(err) console.log(err); 
        return callback(err,done);
      });
  }  


  function getTasks(callback){
var Qry;
var params=[];

if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){

  Qry =" SELECT COUNT(*) as title, DATE_FORMAT(STR_TO_DATE(taskduedate, '%m/%d/%Y'), '%Y-%m-%d') as start FROM `tbl_task_sch` WHERE  assignto= ? and sts = 0 and taskduedate is NOT null  AND taskduedate <> '' GROUP by start;SELECT COUNT(*) as title, DATE_FORMAT(STR_TO_DATE(taskduedate, '%m/%d/%Y'), '%Y-%m-%d') as start FROM `tbl_task_sch` WHERE sts = 0 and taskduedate is NOT null  AND taskduedate <> '' GROUP by start";
params.push(user.enid);

}else{

     Qry =" SELECT COUNT(*) as title, DATE_FORMAT(STR_TO_DATE(taskduedate, '%m/%d/%Y'), '%Y-%m-%d') as start FROM `tbl_task_sch` WHERE  assignto= ? and sts = 0 and taskduedate is NOT null  AND taskduedate <> '' GROUP by start;SELECT COUNT(*) as title, DATE_FORMAT(STR_TO_DATE(taskduedate, '%m/%d/%Y'), '%Y-%m-%d') as start FROM `tbl_task_sch` WHERE (CONCAT(',', assignto, ',') REGEXP concat(',',((select  GROUP_CONCAT(txnid SEPARATOR '|') as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0) and  @pv := concat(@pv, ',', txnid))),',')) and sts = 0 and taskduedate is NOT null  AND taskduedate <> '' GROUP by start";
params.push(user.enid);
params.push(user.enid);
}

    db.query(Qry,params,function(err, results){
      if (err){ 
        return next(err);
      }
      else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
         }
         callback(err,orders);  
       });

  }

  function getCalls(callback){
var Qry;
var params=[];

if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){
    Qry ="SELECT COUNT(*) as title,DATE_FORMAT(STR_TO_DATE(t1.nmd, '%m/%d/%Y'), '%Y-%m-%d') as start FROM tbl_leadsch t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadsch t2 WHERE t2.leadid = t1.leadid) AND t1.stage <> 207 AND t1.stage <> 208 AND allocto =? AND nmd <> ''  GROUP by start;SELECT COUNT(*) as title,DATE_FORMAT(STR_TO_DATE(t1.nmd, '%m/%d/%Y'), '%Y-%m-%d') as start FROM tbl_leadsch t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadsch t2 WHERE t2.leadid = t1.leadid) AND t1.stage <> 207 AND t1.stage <> 208 AND nmd <> '' and nmd is not null GROUP by start";
  params.push(user.enid);
}else{

    Qry ="SELECT COUNT(*) as title,DATE_FORMAT(STR_TO_DATE(t1.nmd, '%m/%d/%Y'), '%Y-%m-%d') as start FROM tbl_leadsch t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadsch t2 WHERE t2.leadid = t1.leadid) AND t1.stage <> 207 AND t1.stage <> 208 AND allocto =? AND nmd <> ''  GROUP by start;SELECT COUNT(*) as title,DATE_FORMAT(STR_TO_DATE(t1.nmd, '%m/%d/%Y'), '%Y-%m-%d') as start FROM tbl_leadsch t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadsch t2 WHERE t2.leadid = t1.leadid) AND t1.stage <> 207 AND t1.stage <> 208 AND (find_in_set(allocto,(select  GROUP_CONCAT(txnid) as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where find_in_set(reportingto, @pv) > 0 and  @pv := concat(@pv, ',', txnid)))) AND nmd <> '' and nmd is not null GROUP by start";

  params.push(user.enid);
  params.push(user.enid);
}

    db.query(Qry,params,function(err, results){
      if (err){ 
        return next(err);
      }
      else{
           var orders =JSON.parse(JSON.stringify(results)); 
         }
         callback(err,orders);  
       });

  }


  getAllKpis(function(err,done){
      //  console.log("cal click result: ",result);
      if(err){
        console.log(err);
      }

      var allData= {};
      allData.mytasks = done[1][0];
      allData.othertasks = done[1][1];
      allData.mycalls = done[0][0];
      allData.othercalls = done[0][1];

      var result = JSON.parse(JSON.stringify(allData));
  //  console.log("Callender data",result);
  res.send(result);
});
}