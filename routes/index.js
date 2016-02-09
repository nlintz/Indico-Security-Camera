/**
 * Module dependencies
 */
var express = require('express');
var indexController = require('../controllers/index');
var userController = require('../controllers/user');
var lastUpdateController = require('../controllers/lastUpdate')

/**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
var indexRouter = express.Router();

/**
 * this accepts all request methods to the `/` path
 */
indexRouter.route('/')
  .all(indexController.index);

indexRouter.route('/user')
  .get(userController.index)

indexRouter.route('/user/:username')
  .get(userController.show)

indexRouter.route('/security_camera')
  .put(userController.update)

indexRouter.route('/last_update')
  .get(lastUpdateController.index)

indexRouter.route('/last_update')
  .put(lastUpdateController.update)

exports.indexRouter = indexRouter;
