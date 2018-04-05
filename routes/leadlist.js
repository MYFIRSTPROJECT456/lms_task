var async = require('async');

exports.list = function(req, res){

var Qry ="SELECT leadid,leadname,emailid,contactno,company,Address,(select cvvalule from tbl_codevalue WHERE cvid=(select stage from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as stage, (select username from tbl_users WHERE txnid = (select allocto from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as allocto, (SELECT GROUP_CONCAT(cvvalule) FROM tbl_codevalue WHERE FIND_IN_SET(cvid,products)) as products, nmd, refname,refnumber,date_format(date_gen, '%d/%m/%Y') as date_gen  FROM `tbl_leads`";

    db.query(Qry, [] , function(err, results) {
        if (results && results.length > 0) {
            res.render("lead_list",{lists:JSON.parse(JSON.stringify(results))});
        } else {
            res.render("lead_list",{lists:[]});
        }
    });


}

exports.filterlist = function(req, res) {
    var user = req.session.user;
    var lid = req.body.lid;
    // console.log("project id ",prjid , req.body);
    var sql1 = "SELECT leadid,leadname,emailid,contactno,company,Address,(select cvvalule from tbl_codevalue WHERE cvid=(select stage from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as stage, (select username from tbl_users WHERE txnid = (select allocto from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as allocto, (SELECT GROUP_CONCAT(cvvalule) FROM tbl_codevalue WHERE FIND_IN_SET(cvid,products)) as products, nmd, refname,refnumber,date_format(date_gen, '%d/%m/%Y') as date_gen  FROM `tbl_leads` where leadid= ?";
      // console.log("task list query", sql1);
    db.query(sql1, [lid], function(err, results) {
         // console.log("task list result", err, results);
        if (results && results.length > 0) {
            res.send(results[0]);
        } else {
            res.send([]);
        }
    });
}



exports.create = function(req, res){
var user = req.session.user;
var post = JSON.parse(req.body.formdata)[0];
console.log("save lead ",user," -->",post);
var sql1 = "INSERT INTO `tbl_leads` (`leadname`, `emailid`, `contactno`, `company`, `Address`, `stage`, `allocto`, `products`, `nmd`, `notes`, `refname`, `refnumber`, `userid`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        db.query(sql1,[post.lname,post.emailid,post.phone,post.company,post.address,post.stage,post.assignto,post.products,post.nmd,post.notes,post.refname,post.refno,user.userid] ,function(err, results){   
            console.log("save lead ",err," -->",results);
            if(results ){
               var resp = {
                    status:"0",
                    status_msg:"Success",
                    insertId:results.insertId
                };
                res.send(resp);
            }else{
               var resp = {
                    status:"1",
                    status_msg:"Failed"
                };
                res.send(resp);
            }
        });
}


