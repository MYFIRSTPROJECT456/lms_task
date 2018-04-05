exports.index = function(req, res, next){
    var message = '';

  if (req.session && req.session.user) {
        console.log("User session:", req.session.user);
      }
      else{
        console.log("All clear session");
      }    
  res.render('login',{message: ""});
}

exports.calender = function(req, res, next){
    var message = '';
  res.render('calendar',{message: ""});
}

exports.task_list = function(req, res, next){
    var message = '';
  res.render('task_list',{message: ""});
}

exports.task_reporting = function(req, res, next){
    var message = '';
  res.render('task_reporting',{message: ""});
}
exports.task_creation = function(req, res, next){
    var message = '';
  res.render('task_creation',{message: ""});
}


exports.task_Management = function(req, res, next){
    var message = '';
  res.render('task_Management',{message: ""});
}

exports.task_allocation = function(req, res, next){
    var message = '';
  res.render('task_allocation',{message: ""});
}

exports.task_list = function(req, res, next){
    var message = '';
  res.render('task_list',{message: ""});
}

exports.task_definition = function(req, res, next){
    var message = '';
  res.render('task_definition',{message: ""});
}


