'use strict';

angular.module('services.config', [])

  .constant('config', {
    apiEndpoint: '/api/auth',
    authEndpoint: 'http://localhost:11080/auth'
  });
