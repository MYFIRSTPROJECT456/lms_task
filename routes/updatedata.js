var async = require('async');

exports.reschedule = function(req, res) {
    var tuser = JSON.parse(req.body.formdata)[0];
    var leaddata = JSON.parse(req.body.leaddata)[0];
    var lid = req.body.leadid;
    var userid = req.session.user.enid;
    console.log("rescheduledata", tuser);

    function updatelead(callback) {
        var sql1 = "INSERT INTO `tbl_leadsch` (`leadid`, `notes`, `stage`, `nmd`,`userid`,`products`,`refname`,`refnumber`,`allocto`) VALUES (?,?,?,?,?,?,?,?,(SELECT allocto FROM `tbl_leads` WHERE leadid =?));";
        var params = [];
        params.push(lid);
        params.push(tuser.remarks);
        params.push(tuser.stage);
        params.push(tuser.nmd);
        params.push(userid);
        params.push(tuser.products);
        params.push(tuser.refname);
        params.push(tuser.refno);
        params.push(lid);
        db.query(sql1, params, function(err, results) {
            if (err) console.log(err);
            if (results != null && results.affectedRows > 0) {
                return performaction(results, callback);
            } else {
               var resp = {
                status:"1",
                status_msg:"Failed"
            };  
            return callback(err, resp);
        }
    });
    }

    function droplead(callback){
      var sql1="UPDATE `tbl_leads` set status ='-1' WHERE leadid=?";
      db.query(sql1,[lid],function(err, results){ 
          var resp = {
            status:"0",
            status_msg:"Success"
        };
        callback(err,resp);
    });
  }

  function createlead(callback){
    if(tuser.refname && tuser.refno){
       var sql1 = "INSERT INTO `tbl_leads` (`leadname`, `contactno`, `stage`, `allocto`, `nmd`, `userid`) VALUES (?,?,?,(SELECT allocto FROM `tbl_leads` WHERE leadid =?),?,?)";
       db.query(sql1,[tuser.refname,tuser.refno,"205",lid,"",userid] ,function(err, results){   
           // console.log("save lead ",err," -->",results);
           if(results ){
             var resp = {
                status:"0",
                status_msg:"Success",
                insertId:results.insertId
            };
            callback(err,resp);     
        }else{
         var resp = {
            status:"1",
            status_msg:"Failed"
        };
        callback(err,resp);     
    }
});
   }else{
    var resp = {
        status:"0",
        status_msg:"Success"
    };
    callback(null,resp);     
}
}

function performaction(results, callback) {
        if (tuser.stage == "208") //drop
        {
            return droplead(callback);
        } else //none
        {
            var resp = {
                status:"0",
                status_msg:"Success"
            };
            return callback(null, resp);
        }
    }

    updatelead(function(err, results) {
        if (err) {
            throw err;
        }
        console.log("Update results", results);
        var finalresult = JSON.parse(JSON.stringify(results));
        console.log("FInal saving result", finalresult);
        if (!err && finalresult != null) {
            var resp = {
                status: "0",
                status_msg: "Success"
            };
            var response = JSON.parse(JSON.stringify(resp));
            res.send(response);
            // callback(err,response);
        } else {
            var err_msg = "Failed to update schedule";
            if (err) {
                err_msg = err["sqlMessage"]
            }
            var resp = {
                status: "1",
                status_msg: err_msg
            };
            var response = JSON.parse(JSON.stringify(resp));
            res.send(response);
        }  
    });
};

exports.update = function(req, res) {
    var tuser = JSON.parse(req.body.formdata)[0];
    var lid = req.body.leadid;

    console.log("Update data", tuser);
    var sql1 = "UPDATE `tbl_leads` SET `leadname` = ?, `contactno` = ?, `emailid` = ?, `Address` = ? WHERE `tbl_leads`.`leadid` = ?;"

    var params = [];
    params.push(tuser.lname);
    params.push(tuser.phone);
    params.push(tuser.emailid);
    params.push(tuser.address);
    params.push(lid);

//    console.log("params update", params);
db.query(sql1, params, function(err, results) {
    if (err) console.log(err);
    if (!err && results && results.affectedRows > 0) {
        var resp = {
            status: "0",
            status_msg: "Success",
            custid: results.insertId
        };
        var response = JSON.parse(JSON.stringify(resp));
        res.send(response);
            // callback(err,response);
        } else {
            var err_msg = "Failed to update lead";
            if (err) {
                err_msg = err["sqlMessage"]
            }
            var resp = {
                status: "1",
                status_msg: err_msg
            };
            var response = JSON.parse(JSON.stringify(resp));
            res.send(response);
        }
    });
/*  res.send({status:'0'}); */
};