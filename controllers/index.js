var express = require('express');
var fs = require('fs');


exports.index = function(req, res) {
    res.set('Content-Type', 'text/html');

    fs.readFile(__dirname + '/../views/grid.html', function(err, data) {
        if (err) {
            console.log("err: " + err);
            res.send("<html><head/><body>empty: " + __dirname + "</body></html>");
            return;
        }

        res.send(data);
    });
};