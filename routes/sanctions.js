var async = require('async');
var request = require('request');


exports.list = function(req, res, next){
        
    async.waterfall([
        getlist
    ], function(err, results) {
        if (err) {
            throw err;
        } else {
            res.render("lead_approvals",{lists:JSON.parse(JSON.stringify(results))});
        }
    });
    
   
   function getlist(callback) {
        
            var sql1 = "SELECT sanctionid,(SELECT tbl_leads.leadname from tbl_leads WHERE txnrefno = tbl_leads.leadid) as leadname,txnrefno as leadid,txntype as ltype,(select username from tbl_users WHERE senderid = txnid) as sender,DATE_FORMAT(dategen, '%m/%d/%Y') as closedon FROM `tbl_sanctions` WHERE sanctionstatus = 0 ";
            db.query(sql1,[] ,function(err, results){   
                if(results && results.length>0){
                            var list= JSON.parse(JSON.stringify(results));
                            return callback(err,list);
                }else{
                            return callback(err,[]);
                }
        });
    }    
}