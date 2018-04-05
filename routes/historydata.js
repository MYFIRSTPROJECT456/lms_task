var async = require('async');
var scrno,lid;

 exports.list = function(req, res){
 	lid=req.body.lval;//req.body.lid;
	var user = req.session.user;

	function getAllKpis(callback){
    	async.parallel([
		get_maindetails,
		get_history
   		], function(err, done) {
        	if(err) console.log(err);
			/*return getserv(done,callback); */ 
			return callback(err,done);
  		});
	}


	function get_maindetails(callback){

	var Qry="SELECT leadid,leadname,emailid,contactno,company,Address,(select cvvalule from tbl_codevalue WHERE cvid=(select stage from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as stage, (select username from tbl_users WHERE txnid = (select allocto from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as allocto, (SELECT GROUP_CONCAT(cvvalule) FROM tbl_codevalue WHERE FIND_IN_SET(cvid,products)) as products, nmd, refname,refnumber,date_format(date_gen, '%d/%m/%Y') as date_gen  FROM `tbl_leads` where leadid= ?";
      db.query(Qry,[lid],function(err, results){
            if (err){ 
              throw err;
            }
		else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
		}

		callback(err,orders);
    });
};


	function get_history(callback){

	var Qry="SELECT notes as remarks,(SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_leadsch.stage) as stage,nmd,date_format(date_gen, '%d/%m/%Y') as date_gen,(SELECT enname from tbl_login WHERE tbl_login.enid=tbl_leadsch.userid) as metby,(SELECT enname from tbl_login WHERE tbl_login.enid=tbl_leadsch.allocto) as allocto FROM `tbl_leadsch` WHERE leadid =? order by txnid desc";
      db.query(Qry,[lid],function(err, results){
            if (err){ 
              throw err;
            }
		else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
		}

		callback(err,orders);
    });
};
	// console.log(joverduetask);

	getAllKpis(function(err,result){
		if(err){
			console.log(err);
		}
		var f1=result[0][0];
		f1["history"]=result[1];
try{
if(result[1] && result[1].length > 0){
if(result[1][result[1].length - 1].stage == "Close"){
	req.session.user.accesscontrol.lupdate = 1;
}else{
	req.session.user.accesscontrol.lupdate = 0;
}
}
}catch(e){
}
	var Accesscontrol = user.accesscontrol;

		console.log("history result result: ",f1);
   		res.render('lead_search.ejs',{f:f1,action:Accesscontrol});    	
	});

     
     
};
