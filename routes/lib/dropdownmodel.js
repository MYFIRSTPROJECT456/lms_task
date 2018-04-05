var Dropdown = {   
    getAssignto: function(user,callback) {
var Qry;
var params = [];
if(user.roleid == 38 || user.roleid == 37 || user.roleid == 39){
Qry = "select txnid as id, username as name from tbl_users where role <> 38";
}else{
Qry = "select txnid as id, username as name from tbl_users WHERE find_in_set(txnid,(select  GROUP_CONCAT(txnid) as txnids from (select * from tbl_users order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and     @pv := concat(@pv, ',', txnid)) OR find_in_set(txnid, ?)))";
params.push(user.enid);
params.push(user.enid);
}
        return db.query(Qry,params,callback);  
    },    
    getStatus: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=2 AND cvid != 7",callback);  
    },
    getRoles: function(callback) {  
       return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue`  WHERE cvmasterid = 7",callback);
    },
    getUsers: function(callback) {  
       return db.query(" SELECT txnid as id, username as name FROM `tbl_users`",callback);
    }, 
    getProjects: function(callback) {  
       return db.query(" SELECT prjid as id, prjname as name FROM `tbl_projects`",callback);
    }, 
    getDoclist: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=10",callback);
    },
    getIntervals: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=11",callback);  
    },
    getTaskGroups: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=3",callback);  
    }, 
    getProducts: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=15",callback);  
    },
     getStages: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=14",callback);  
    }, 
     getddTasks: function(value,callback) { 
        return db.query("SELECT tdefid as id, tdefname as name FROM `tbl_task_def` where tsk_grp=?",[value],callback);  
    },
     getSales: function(mgr,callback) {  
        return db.query("select txnid as id, username as name from tbl_users WHERE find_in_set(txnid,(select  GROUP_CONCAT(txnid) as txnids from (select * from tbl_users WHERE role in (44,45) order by role, txnid) tbl_users,(select @pv := ?) initialisation where (find_in_set(reportingto, @pv) > 0 and @pv := concat(@pv, ',', txnid)) OR find_in_set(txnid, ?)))",[mgr,mgr],callback);  
    }, 
     getAllStatus: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=2",callback);  
    }
};  
module.exports = Dropdown;  
