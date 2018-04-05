
function Screenfield() { 
  var _sanction_close = 0;
  var _adhoc = 0;
  var _lead_update = 0;
  var _task_hist = 0;


  Object.defineProperty(this,"sanction",{
    get: function() { return _sanction_close; },
    set: function(value) { _sanction_close = value;},
    enumerable: true
  });

  Object.defineProperty(this,"adhoc",{
    get: function() { return _adhoc; },
    set: function(value) { _adhoc = value;},
    enumerable: true
  });

  Object.defineProperty(this,"lupdate",{
    get: function() { return _lead_update; },
    set: function(value) { _lead_update = value;},
    enumerable: true
  });
  Object.defineProperty(this,"kpi",{
    get: function() { return _task_hist; },
    set: function(value) { _task_hist = value;},
    enumerable: true
  });

}
