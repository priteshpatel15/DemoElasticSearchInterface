'use strict'

angular.module('elasticDemo', [
       'elastic.services',
       'elastic.controllers',
       'ui.bootstrap',
       'elasticsearch'
   ]).service('client', function (esFactory) {
    return esFactory({
        host: 'localhost:9200',
        apiVersion: '1.5',
        log: 'trace'
    });
});