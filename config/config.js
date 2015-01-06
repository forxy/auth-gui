'use strict';

angular.module('services.config', [])

  .constant('config', {
    apiEndpoint: '/api/auth',
    authEndpoint: '@@authEndpoint'
  });
