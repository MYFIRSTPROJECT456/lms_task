var async = require('async');

exports.list = function(req, res){

var Qry ="SELECT cvvalule as docname,cvid as docid FROM `tbl_codevalue` WHERE cvmasterid = 10";

    db.query(Qry, [] , function(err, results) {
        if (results && results.length > 0) {
            res.render("doc_gen",{lists:JSON.parse(JSON.stringify(results))});
        } else {
            res.render("doc_gen",{lists:[]});
        }
    });


}

exports.create = function(req, res){
var user = req.session.user;
var post = req.body;
var sql1 = "INSERT INTO `tbl_codevalue` (`cvmasterid`, `cvvalule`) VALUES ('10',?)";
        db.query(sql1,[post.docname] ,function(err, results){   
            console.log("Doc gen",err,results);
        res.redirect("/docgen");
        });
}


