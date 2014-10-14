'use strict';

var Boop = require('boop'),
  Promise = require('q');


var Command = Boop.extend({
  createDeferred: function(){
    return Promise.defer();
  },

  reject: function(message){
    this.rejected = true;
    this.getDeferred().reject(new Error(message));
  },

  isRejected: function(){
    return !!this.rejected;
  },

  resolve: function(message){
    this.resolved = true;
    this.getDeferred().resolve(message);
  },

  isResolved: function(){
    return !!this.resolved;
  },

  initPromise: function(){
    this.deferred = this.createDeferred();
    this.promise = this.deferred.promise;
  },

  getDeferred: function(){
    return this.deferred;
  },

  getPromise: function(){
    return this.promise;
  },

  setOptions: function(options){
    this.options = options;
  },

  setConfig: function(config){
    this.config = config;
  },

  getConfig: function(){
    return this.config;
  },

  isForce: function(){
    return this.options && this.options.force === true;
  },

  flow: function(){
    var q = this.getDeferred();

    q.resolve();

    return q.promise;
  }
//  flow: function(){
//
//    var then = function(expr){
//
//      if (!this.isRejected()){
//        expr.call(this);
//      }
//
//      return {
//        then: then
//      };
//    }.bind(this);
//
//    return {
//      then: then
//    }
//  }
});


module.exports = Command;