var userModel = require('../models/user');
var indico = require('indico.io');
var indicoConfig = require('../indicoConfig');
indico.apiKey =  indicoConfig["apiKey"];
var securityCollection = indico.Collection('security_camera');


exports.index = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    userModel.find(function (err, users){
        if (err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(users));
        }
    });
};

exports.show = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var username = req.params.username;
    userModel.findOne({name : username}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(user));
        }
    });
};

exports.update = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var io = req.app.locals.io;
    var picture = req.body.picture;
    securityCollection.predict(picture).
        then(function(data){
            for (var username in data) {
                var p_at_door = parseFloat(data[username]);
                userModel.findOneAndUpdate({name: username},
                                           {p_at_door: p_at_door},
                                           {upsert:true, new:true},
                                           function(err, user) {
                                               if (err) {
                                                console.log(err);
                                               } else {
                                                io.emit('user_update', JSON.stringify(user))
                                               }
                                           })
            }
            res.send(JSON.stringify({"status":"success"}));
    })
};