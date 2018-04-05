/*exports.login = function(req, res){
req.session.coid="5";
req.session.ecryt_key="904697ab-8e60-11e7-bce2-000d3a1134dd";
res.render('dashboard.ejs');       
};*/
var request = require('request');

var Accesscontrol = require('./lib/accesscontrol.js');

exports.login = function(req, res, next){

 var message = '';
 var sess = req.session; 
 if(req.method == "POST"){
   var post  = req.body;
   var tenantid=coid;
   var name= post.PRM02;
   var pass= post.PRM03;
   //console.log('session123', req.session, req.session.user);
   if (req.session && req.session.user && req.session.user.loginid == name ) {
    message = 'Already logged in.'+name;
     // console.log('Wrong Credentials.');
     res.render('login.ejs',{message: message});

   }else{
   // console.log("request ", name, pass, tenantid);
   var sql1="SELECT coid, enid, enname, loginid, roleid, mgrid, contact_mobileno,(SELECT txnid FROM tbl_users b WHERE b.email = a.loginid) as userid, if(photo_url is null or photo_url='', CONCAT('"+url+"','Contents/u00.png'), CONCAT('"+url+"',photo_url)) photo,(select 'data' from dual) as menudata FROM `tbl_login`a WHERE upper(loginid) = upper(?) and pwd = ? and coid = ?;SELECT * FROM `tbl_comsetup`";

 db.query(sql1,[name,pass,tenantid] ,function(err, results){   
     console.log("result01", err, results);
    if(results && results[0].length>0){
      get_info(results[0],function(err,result){
        if(err){
          console.log(err);
        }else{
               // global.menudata=result;
               results[0][0].menudata = result;
               // console.log('data01', results[0][0].menudata);
               // console.log('data02', results[0][0]);
               var user = results[0][0];

               Accesscontrol.kpi = 1;
               if(user.roleid == 37 || user.roleid == 39){
                Accesscontrol.sanction = 1;
                }
              if (user.roleid != 43){
                Accesscontrol.adhoc = 1;
              }
              if (user.roleid == 45){
                Accesscontrol.lupdate = 1;
              }

              if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){
                Accesscontrol.adhoc = 1;
                Accesscontrol.sanction = 1;
                Accesscontrol.kpi = 1;
                Accesscontrol.lupdate = 1;
              }
              results[0][0].accesscontrol = Accesscontrol;
              req.session.user = results[0][0];
              res.locals.user = results[0][0];
              req.session.compdata = results[1][0];

              console.log("User object",req.session.user);


              res.redirect('/calendar');
            }
          });
    }else{
      message = 'Wrong Credentials.';
      console.log('Wrong Credentials.');
      res.render('login.ejs',{message: message});
    }                 
  });


}
     } else {//not post
      message='method not post';
      console.log('method not post');
      res.render('login.ejs',{message: message});
    }  

    function get_info(userdtl, callback){
      var getmenuqry = "select tbl_menu.menuid, menuname, object, pmenuid,fld_faicon from tbl_menu, tbl_accesscontrol where coid =? and roleid =? and tbl_menu.status=0 and find_in_set(tbl_menu.menuid,tbl_accesscontrol.menuid)>0 order by seq";
   // var session =req.session.user;
   db.query(getmenuqry, [userdtl[0].coid,userdtl[0].roleid],function(err, results){
    if (err){
      console.log(err);
    }
    else{
    var menudata =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
  }
  return callback(err,menudata);

});
 };
};

exports.logout = function(req, res, next){
  req.session.destroy();
  res.redirect('/');       
};
