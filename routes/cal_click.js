var async = require('async');
var scrno,lid;

exports.tdlist = function(req, res){
	var user = req.session.user;
	var calldate = req.body.calldate;
	var type = req.body.type;
	console.log("Call click",req.body);

	function getAllKpis(callback){
		async.parallel([
			get_Calls,
			get_Tasks
			], function(err, done) {
				if(err) console.log(err);
				/*return getserv(done,callback); */ 
				return callback(err,done);
			});
	}


	function get_Calls(callback){
		var Qry="";
		var params = [];
		if(type == 3 || type == 4 ){		

			Qry ="SELECT (select leadname from tbl_leads WHERE tbl_leads.leadid = t1.leadid) as leadname,(select contactno from tbl_leads WHERE tbl_leads.leadid = t1.leadid) as contactno,(select emailid from tbl_leads WHERE tbl_leads.leadid = t1.leadid) as emailid,(select tbl_codevalue.cvvalule from tbl_codevalue where tbl_codevalue.cvmasterid=14 and tbl_codevalue.cvid= t1.stage) as `stage`,t1.leadid as leadid,(select tbl_login.enname from tbl_login WHERE tbl_login.enid= t1.allocto) as allocto FROM tbl_leadsch t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadsch t2 WHERE t2.leadid = t1.leadid) AND t1.stage <> 208 AND t1.stage <> 207 AND nmd = DATE_FORMAT(STR_TO_DATE(?, '%Y-%m-%d'), '%m/%d/%Y') ";


			if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){
				params.push(calldate);
			}else{
				if(type == 3){
					Qry += " AND t1.allocto = ?";
				}else {
					Qry += " AND FIND_IN_SET(t1.allocto,(select  GROUP_CONCAT(txnid) as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where find_in_set(reportingto, @pv) > 0 and  @pv := concat(@pv, ',', txnid)))";
				}
				params.push(calldate);
				params.push(user.enid);
			}
	// console.log("Calls query", Qry);


	db.query(Qry,params,function(err, results){
		if (err){ 
			throw err;
		}
		else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
       }
       return callback(err,orders);
   });
}else{
	var orders = [];
	return callback(null,orders);
}     
};


function get_Tasks(callback){
	var Qry="";
	var params = [];

	if(type == 1 || type == 2 ){

		Qry = "select tasksrno as taskid, taskdefid, taskname, taskDescription, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = a.taskstatus) as taskstatus , estimatehr, (SELECT prjname from tbl_projects c WHERE c.prjid = a.prjid) as projectname, (SELECT username FROM `tbl_users` d WHERE d.txnid = a.assignto) as assignto, taskduedate,if(STR_TO_DATE(taskduedate, '%m/%d/%Y') >= date_format(date(now()),'%Y-%m-%d'),1,0) as due FROM `tbl_task_sch` a WHERE sts=0 and taskduedate = DATE_FORMAT(STR_TO_DATE(?,'%Y-%m-%d'), '%m/%d/%Y') ";
		if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){
			params.push(calldate);
		}else{
			if(type == 1){

				Qry += " and CONCAT(',', assignto, ',') REGEXP concat(',',(?),',')";
			}else {
				Qry += " AND (CONCAT(',', assignto, ',') REGEXP concat(',',((select  GROUP_CONCAT(txnid SEPARATOR '|') as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0) and  @pv := concat(@pv, ',', txnid))),','))";
			}
			params.push(calldate);
			params.push(user.enid);
		}
		db.query(Qry,params,function(err, results){
			if (err){ 
				throw err;
			}
			else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
       }
       return callback(err,orders);
   });
	}else{
		var orders = [];
		return callback(null,orders);
	} 

};
	// console.log(joverduetask);

	getAllKpis(function(err,result){
			//	console.log("cal click result: ",result);
			if(err){
				console.log(err);
			}
			if(type == 1 || type == 2 ){
				res.render('ftask_list.ejs',{tasks:result[1]});
			}else if (type == 3 || type == 4 ){
				res.render('call_list.ejs',{lists:result[0]});
			} 
			else{
				res.redirect('task_list');    	
			}
		});

	
	
};
