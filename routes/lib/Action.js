	var async = require('async');

	var Action={ 
		//use to perform DML queries like insert,delete and update
		exeDML:function setserv(sql,params,col3,col4,callback){

			var sql1 = sql;
			var params = params;
			db.query(sql1, params, function(err, results) {
				var resp ;
				var error= null;
				if (err) {
					error = err;
					resp = {
						status: "1",
						status_msg: error["sqlMessage"],
						custid: null
					};
				} else {
					if(results && results.affectedRows > 0){
						resp = {
							status: "0",
							status_msg: "success",
							custid: results.insertId
						};
					}else{
						resp = {
							status: "1",
							status_msg: "failed to insert",
							custid: null
						};
					}
				}
				var response = JSON.parse(JSON.stringify(resp));
				return callback(error,response);
			});	
		},
			//use to perform DDL queries like select
			exeSEL:function getserv(sql,params,col3,col4,callback){

				var sql1 = sql;
				var params = params;
				db.query(sql1, params, function(err, results) {
					var resp = [] ;
					var error = null;
					if (results && results.length>0) {
						resp = results;
					} else {
						if(err){
							error = err;
							resp = [];
						}else{
							resp = [];
						}
					}
					var response = JSON.parse(JSON.stringify(resp));
					return callback(error,response);
				});
			},
			//use to perform parallel DDL select
			exeSelParallel: function getParallel(arr_Sql_Params, col2, col3, col4, callback){

				var objects = arr_Sql_Params;

				async.map(objects, function(obj, callback) {
					getData(obj, function (err, res) {
						callback(err, res);
					})
				}, function(err, results) {
					return callback(err,results);
				});

				function getData(obj,callback){
					var sql1 = obj.sql;
					var params = obj.params;
					db.query(sql1, params, function(err, results) {

						var resp = [];
						var error = null;
						if (results && results.length > 0) {
							resp = results;
						} else {
							if(err){
								error = err;
								resp = [];
							}else{
								resp = [];
							}
						}
						var response = JSON.parse(JSON.stringify(resp));
						return callback(error,response);
					});
				}

			}    
		}
		module.exports = Action;  