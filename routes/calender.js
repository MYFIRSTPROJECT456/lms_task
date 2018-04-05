
var Accesscontrol = require('./lib/accesscontrol.js');
var async = require('async');
var Action = require('./lib/Action.js');
//var scrno;

exports.list = function(req, res, next){

	var user = req.session.user;
	var arr_sql_param = [];
	var arr_sql_param_obj={};

// first request
/*arr_sql_param_obj.sql = "SELECT prjid as id,prjname as name,concat(round(ifnull((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND taskstatus <> 7),0) * 100,1),'%') as percentage,if(STR_TO_DATE(prjduedate, '%m/%d/%Y') > date_format(date(now()),'%Y-%m-%d'),0,1) as due FROM `tbl_projects`  WHERE prjid <> 1";*/

if(user.roleid == 37 || user.roleid == 39 || user.roleid == 38){

	arr_sql_param_obj.sql = "SELECT prjid as id,prjname as name,concat(ifnull((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND taskstatus <> 7),0) * 100,'%') as percentage,if(STR_TO_DATE(prjduedate, '%m/%d/%Y') < date_format(date(now()),'%Y-%m-%d'),0,1) as due FROM `tbl_projects`  WHERE prjid <> 1";
	arr_sql_param_obj.params = [];

}else{


	arr_sql_param_obj.sql = "SELECT prjid as id,prjname as name,concat(ifnull((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND taskstatus <> 7),0) * 100,'%') as percentage,if(STR_TO_DATE(prjduedate, '%m/%d/%Y') < date_format(date(now()),'%Y-%m-%d'),0,1) as due FROM `tbl_projects`  WHERE prjid <> 1 AND find_in_set(prjid, (SELECT GROUP_CONCAT(DISTINCT(prjid)) FROM `tbl_task_sch` WHERE sts = 0 and CONCAT(',', assignto, ',') REGEXP concat(',',((select  GROUP_CONCAT(txnid SEPARATOR '|') as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 or txnid = ?) and  @pv := concat(@pv, ',', txnid))),',')))";
	arr_sql_param_obj.params = [user.enid,user.enid];
}


arr_sql_param.push(arr_sql_param_obj);

// second request	
arr_sql_param_obj={};

/*arr_sql_param_obj.sql = "select (SELECT count(*) FROM `tbl_projects`  WHERE prjid <> 1) as tproj,(SELECT concat(round(avg(ifnull(((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1   AND taskstatus <> 7)),0) * 100),1),'%') FROM `tbl_projects`  WHERE prjid <> 1) as poverview,(SELECT count(*) FROM `tbl_task_sch` WHERE sts = 0 AND assignto = ? AND taskstatus <> 6) as ptasks, (SELECT count(*) FROM `tbl_sanctions` WHERE sanctionstatus = 0) as lfunnel";*/

if(user.roleid == 37 || user.roleid == 39 || user.roleid == 38){

	arr_sql_param_obj.sql = "select (SELECT count(*) FROM `tbl_projects`  WHERE prjid <> 1) as tproj, (SELECT ifnull(concat(round(avg(ifnull(((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND taskstatus <> 7)),0) * 100),1),'%'),'') FROM `tbl_projects`  WHERE prjid <> 1) as poverview,(SELECT count(*) FROM `tbl_task_sch` WHERE sts = 0 AND CONCAT(',', assignto, ',') REGEXP concat(',',(?),',') AND taskstatus <> 6) as ptasks, (SELECT count(*) FROM `tbl_sanctions` WHERE sanctionstatus = 0) as lfunnel";
	arr_sql_param_obj.params = [user.enid];


}else{
	arr_sql_param_obj.sql = "select (SELECT count(DISTINCT(prjid)) FROM `tbl_task_sch` WHERE prjid<>1  AND sts = 0 and CONCAT(',', assignto, ',') REGEXP concat(',',((select  GROUP_CONCAT(txnid SEPARATOR '|') as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 or txnid = ?) and  @pv := concat(@pv, ',', txnid))),',')) as tproj,  (SELECT ifnull(concat(round(avg(ifnull(((SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND taskstatus = 6 AND sts <> -1)/(SELECT COUNT(*) FROM `tbl_task_sch` WHERE prjid =tbl_projects.prjid AND sts <> -1  AND find_in_set(prjid, (SELECT GROUP_CONCAT(DISTINCT(prjid)) FROM `tbl_task_sch` WHERE sts = 0 and CONCAT(',', assignto, ',') REGEXP concat(',',((select  GROUP_CONCAT(txnid SEPARATOR '|') as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 or txnid = ?) and  @pv := concat(@pv, ',', txnid))),',')))  AND taskstatus <> 7)),0) * 100),1),'%'),'') FROM `tbl_projects`  WHERE prjid <> 1) as poverview,(SELECT count(*) FROM `tbl_task_sch` WHERE sts = 0 AND CONCAT(',', assignto, ',') REGEXP concat(',',(?),',') AND taskstatus <> 6) as ptasks, (SELECT count(*) FROM `tbl_sanctions` WHERE sanctionstatus = 0) as lfunnel";
	arr_sql_param_obj.params = [user.enid,user.enid,user.enid,user.enid,user.enid];
}


arr_sql_param.push(arr_sql_param_obj);

Action.exeSelParallel(arr_sql_param,null,null,null,function(err,result){
	var action = 0 ;
	if(err){
		return next(err);
	}

	var Accesscontrol = user.accesscontrol;
	res.render('calendar.ejs',{projects:result[0],kpis:result[1][0],action:Accesscontrol});     
});
};