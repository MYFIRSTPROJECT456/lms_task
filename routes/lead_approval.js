var async = require('async');
var sanctionid,lid;

 exports.list = function(req, res){
 	lid=req.body.lval;//req.body.lid;
 	sanctionid = req.body.sanctionid;
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

	var Qry="SELECT leadid,leadname,emailid,contactno,company,Address,(select cvvalule from tbl_codevalue WHERE cvid=(select stage from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as stage, (select username from tbl_users WHERE txnid = (select allocto from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as allocto, (select GROUP_CONCAT(cvvalule) from tbl_codevalue WHERE find_in_set(cvid,products)) as products,products as prdids ,nmd, refname,refnumber,date_format(date_gen, '%d/%m/%Y') as date_gen  FROM `tbl_leads` where leadid= ?";
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
		console.log("history result result: ",f1);
   		res.render('lead_approval.ejs',{f:f1,sanctionid: sanctionid,lid:lid,leaddata:JSON.stringify(result[0][0])});    	
	});

     
     
};
