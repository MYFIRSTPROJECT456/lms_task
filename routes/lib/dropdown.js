var express = require('express');  
var router = express.Router();  
var Dropdown = require('./dropdownmodel');  

router.get('/getstatus', function(req, res, next) {  
        Dropdown.getStatus(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getassignto', function(req, res, next) {

    Dropdown.getAssignto(req.session.user, function(err, rows) {
        console.log("getAssignto results : ", rows);
        if (err) {
            res.send(err);
            console.log("Error dropdown");
        } else {
            res.send(rows);
        }
    });
});

router.get('/getroles', function(req, res, next) {  
    console.log("called");
        Dropdown.getRoles(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getusers', function(req, res, next) {  
    console.log("called");
        Dropdown.getUsers(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
});

router.post('/getddtasks', function(req, res, next) {  
    console.log("ddtasks",req.body);
var ddval = JSON.parse(req.body.formdata);
        Dropdown.getddTasks(ddval,function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
});  

router.get('/getprojects', function(req, res, next) {  
    console.log("called");
        Dropdown.getProjects(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 


router.get('/getdoclist', function(req, res, next) {  
    console.log("called");
        Dropdown.getDoclist(function(err, rows) {  
            console.log("document list : ",rows);
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 


router.get('/getinterval', function(req, res, next) {  
        Dropdown.getIntervals(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 


router.get('/gettaskgroups', function(req, res, next) {  
        Dropdown.getTaskGroups(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 


router.get('/getproducts', function(req, res, next) {  
        Dropdown.getProducts(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getstages', function(req, res, next) {  
        Dropdown.getStages(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 


router.get('/getsales', function(req, res, next) {

    Dropdown.getSales(req.session.user.userid, function(err, rows) {
        // console.log("getAssignto results : ", rows);
        if (err) {
            res.send(err);
            // console.log("Error dropdown");
        } else {
            res.send(rows);
        }
    });
});


router.get('/getallstatus', function(req, res, next) {  
        Dropdown.getAllStatus(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 
module.exports = router;  