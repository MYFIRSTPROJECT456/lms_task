var async = require('async');

exports.custlist = function(req, res, next){
    var sql1 = "SELECT txnid,username,address,email,mobileno,(SELECT username FROM tbl_users b WHERE b.txnid = a.reportingto) as manager FROM `tbl_users` a";
    db.query(sql1,[] ,function(err, results){       
     if(results && results.length>0){
        res.render("usermanagement",{custlist:JSON.parse(JSON.stringify(results))});
    }else{
        res.render("usermanagement",{custlist:[]});
   }
});
}


exports.userdetails = function(req, res, next){
    var custid = req.body.custid;
    var sql1 = "SELECT txnid,username,address,email,mobileno,role,reportingto FROM `tbl_users` WHERE txnid = ?";
    db.query(sql1,[custid] ,function(err, results){   
      if(results && results.length>0){
        res.send(JSON.parse(JSON.stringify(results)));
    }else{
        res.send([]);
    }
});
}

exports.saveuser = function(req, res, next){
    var custid = req.body.id;
    var formdata = JSON.parse(req.body.formdata)[0];
    if(custid){
        var sql1 = "UPDATE `tbl_users` SET `username` = ?, `address`= ?,`email`= ?, `mobileno`= ?, `role`= ?, `reportingto`= ? WHERE `tbl_users`.`txnid` = ?;UPDATE tbl_login SET enname = ?,loginid = ?, contact_email = ?, contact_mobileno = ?, roleid = ?, mgrid =? WHERE tbl_login.enid = ?";
        db.query(sql1,[formdata.username,formdata.address,formdata.email,formdata.mobileno,formdata.role,formdata.reportingto,custid,formdata.username,formdata.email,formdata.email,formdata.mobileno,formdata.role,formdata.reportingto,custid] ,function(err, results){   

            if(!err){
                var resp = {
                    status:"0",
                    status_msg:"Success"
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
    }else{
        var sql1 = "INSERT INTO `tbl_users` (`coid`, `username`, `address`, `email`, `mobileno`, `role`, `reportingto`) VALUES (?,?,?,?,?,?,?)";
        db.query(sql1,[coid,formdata.username,formdata.address,formdata.email,formdata.mobileno,formdata.role,formdata.reportingto] ,function(err, results){   
      //      console.log("result", err, results);
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
}
