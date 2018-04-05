var async = require('async');
exports.list = function(req, res) {
    var lid = req.body.lid;
    // console.log("project id ",prjid , req.body);
    var sql1 = "SELECT leadid,leadname,emailid,contactno,company,Address,(select cvvalule from tbl_codevalue WHERE cvid=(select stage from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as stage, (select username from tbl_users WHERE txnid = (select allocto from tbl_leadsch WHERE tbl_leads.leadid = tbl_leadsch.leadid ORDER BY tbl_leadsch.txnid DESC LIMIT 1)) as allocto, (select cvvalule from tbl_codevalue WHERE cvid=products) as products, nmd, refname,refnumber,date_format(date_gen, '%d/%m/%Y') as date_gen  FROM `tbl_leads` where leadid= ?";
      // console.log("task list query", sql1);
    db.query(sql1, [lid], function(err, results) {
      res.render("updatesch",{lead:JSON.stringify(results),lid: lid});
    });
    }
