

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , compression = require('compression')
  , async = require('async')
  , session = require('express-session');
var multer = require('multer');  

var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");

//database connection
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : 'shri',
              database : 'pmp',
	          debug    : false,
	          multipleStatements: true
});

connection.connect();
console.log("Connection state",connection.state);

//constants
global.db = connection;
global.url=__dirname; 
global.coid = "14";
// all environments


app.use(compression());
app.set('port', process.env.PORT || 4003);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session( 
 { secret: "myname",maxAge: 24 * 60 * 60 * 1000}));

//one session
app.use(function(req, res, next) {
//   console.log("route called",req.url);
  if (req.session && req.session.user) {
        req.user = req.session.user;
        delete req.user.pwd; // delete the password from the session
        req.session.user = req.user;  //refresh the session value
        console.log('session ka data', req.user);
        res.locals.user = req.user;
              if(req.url == "/"){
                req.session.destroy();
                res.redirect('/');
              }else{
                next();
              }
      } else {
//        console.log("app js function not called",req.url);
        if(req.url !="/" && req.url !="/auth"){
        res.redirect('/');
        }else{
          next();
        }
      }
    });

app.use(function(err, req, res, next) {  
 
  if(err){
  res.status(err.status || 500);  
  res.render('error', {  
    error: err  
  });  
}
});

//common routes
var index = require('./routes/index');
var auth = require('./routes/auth');
var usermanagement = require('./routes/usermanagement');
var project_creation = require('./routes/project_list');
var task_allocation = require('./routes/task_allocation');
var dropdown = require('./routes/lib/dropdown');
var task_def = require('./routes/task_def');
var task_list = require('./routes/task_list');
var data = require('./routes/getdata');
var task_management = require('./routes/task_management');
var calender = require('./routes/calender');
var task_creation = require('./routes/task_create');
var leadlist = require('./routes/leadlist');
var task_reporting =require('./routes/task_reporting');
var upandsch = require('./routes/upandsch');
var historydata = require('./routes/historydata');
var updatedata = require('./routes/updatedata');
var cal_click = require('./routes/cal_click');
var sanctions = require('./routes/sanctions');
var closure = require('./routes/closure');
var lead_approval = require('./routes/lead_approval');
var fclose_projects = require('./routes/projects_fclose');
var fclose_tasks = require('./routes/tasks_fclose');
var doc_gen = require('./routes/doc_gen');

//Middleware
app.get('/', index.index);//call for main index page
app.post('/auth',auth.login);
app.get('/logout',auth.logout);
app.get('/task_creation',index.task_creation);
app.get('/task_definition',task_def.list);
app.get('/calendar',calender.list);
app.get('/task_list',task_list.tasklist);
app.post('/updatetask',task_list.updatetask);
app.post('/tdtasks',cal_click.tdlist);
app.post('/filterlist',task_list.filterlist);
app.post('/task_reporting',task_reporting.list);
app.get('/usermanagement',usermanagement.custlist);
app.post('/saveuser',usermanagement.saveuser);
app.post('/getuserdetails',usermanagement.userdetails);
app.get('/project_list',project_creation.list);
app.post('/projectcreate',project_creation.create);
app.get('/task_allocation',task_allocation.taskalloclist);
app.post('/createtask',task_allocation.create);
app.post('/gettaskdetails',task_management.taskdetails);
app.post('/task_management',task_management.taskmgmtlist);
app.post('/taskasign',task_management.updatetask);
app.post('/savetaskdef',task_def.create);
app.get('/events',data.events);
app.post('/taskcreaterec',task_creation.create);
app.use('/v1', dropdown);
app.get('/leadlist',leadlist.list);
app.post('/updatesch',upandsch.list);
app.post('/updatedata',updatedata.update);
app.post('/updateschedule',updatedata.reschedule);
app.post('/historydata',historydata.list);
app.post('/approvelead',closure.approve);
app.post('/rejectlead',closure.reject);
app.post('/sanction_action',lead_approval.list);
app.get('/sanctions',sanctions.list);
app.post('/savelead',leadlist.create);
app.get('/force_closure',fclose_projects.list);
app.post('/fclosetasks',fclose_tasks.tasklist);
app.post('/updatefcloseproject',fclose_projects.update);
app.post('/updatefclosetasks',fclose_tasks.update);
app.get('/docgen',doc_gen.list);
app.post('/doccreate',doc_gen.create);
app.post('/taskdelete',task_management.taskdelete);


//listen to port
var server = app.listen(4003);
server.on('connection', function(socket) {
  socket.setTimeout(30 * 86400 * 1000);
});

