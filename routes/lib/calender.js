var Action = require('./lib/Action.js');
var async = require('async');
//var scrno;

exports.list = function(req, res, next){

	var user = req.session.user;
	var arr_sql_param = [];
	var arr_sql_param_obj={};

// first request
//	arr_sql_param_obj.sql = "SELECT prjid as id,prjname as name,concat(ifnull((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND taskstatus <> 7),0) * 100,'%') as percentage FROM `tbl_projects`  WHERE prjid <> 1";
    
    	arr_sql_param_obj.sql = "SELECT prjid as id,prjname as name,concat(ifnull((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND taskstatus <> 7),0) * 100,'%') as percentage FROM `tbl_projects`  WHERE prjid <> 1 AND find_in_set(prjid, (SELECT GROUP_CONCAT(DISTINCT(prjid)) FROM `tbl_task_sch` WHERE sts = 0 and find_in_set(assignto, (select  GROUP_CONCAT(txnid) as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and     @pv := concat(@pv, ',', txnid)) OR find_in_set(txnid, ?)))))";

	arr_sql_param_obj.params = [user.enid,user.enid];
	arr_sql_param.push(arr_sql_param_obj);

// second request	
	arr_sql_param_obj={};
//	arr_sql_param_obj.sql = "select (SELECT count(*) FROM `tbl_projects`  WHERE prjid <> 1) as tproj,  (SELECT concat(round(avg(ifnull(((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND taskstatus <> 7)),0) * 100),1),'%') FROM `tbl_projects`  WHERE prjid <> 1) as poverview,(SELECT count(*) FROM `tbl_task_sch` WHERE sts = 0 AND assignto = ? AND taskstatus <> 6) as ptasks, (SELECT count(*) FROM `tbl_sanctions` WHERE sanctionstatus = 0) as lfunnel";

    
    arr_sql_param_obj.sql = "select (SELECT count(*) FROM `tbl_projects`  WHERE prjid <> 1) as tproj,  (SELECT concat(round(avg(ifnull(((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND find_in_set(prjid, (SELECT GROUP_CONCAT(DISTINCT(prjid)) FROM `tbl_task_sch` WHERE sts = 0 and find_in_set(assignto, (select  GROUP_CONCAT(txnid) as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and     @pv := concat(@pv, ',', txnid)) OR find_in_set(txnid, ?)))))  AND taskstatus <> 7)),0) * 100),1),'%') FROM `tbl_projects`  WHERE prjid <> 1) as poverview,(SELECT count(*) FROM `tbl_task_sch` WHERE sts = 0 AND assignto = ? AND taskstatus <> 6) as ptasks, (SELECT count(*) FROM `tbl_sanctions` WHERE sanctionstatus = 0) as lfunnel";
    
	arr_sql_param_obj.params = [user.enid,user.enid,user.enid];
	arr_sql_param.push(arr_sql_param_obj);

Action.exeSelParallel(arr_sql_param,null,null,null,function(err,result){
	var action = 0 ;
	if(err){
		return next(err);
	}
	if(user.roleid != 43){
		action = 1;
	}
	else{
		action = 0;
	}

	res.render('calendar.ejs',{projects:result[0],kpis:result[1][0],action:action});     
});
};