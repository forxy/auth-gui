'use strict';

(function (exports) {

  var config = {

    /* List all the roles you wish to use in the app
     * You have a max of 31 before the bit shift pushes the accompanying integer out of
     * the memory footprint for an integer
     */
    roles: [
      'users_get',
      'users_create',
      'users_update',
      'users_delete',
      'groups_get',
      'groups_create',
      'groups_update',
      'groups_delete',
      'clients_get',
      'clients_create',
      'clients_update',
      'clients_delete',
      'tokens_get',
      'tokens_create',
      'tokens_update',
      'tokens_delete'
    ],

    /*
     Build out all the access levels you want referencing the roles listed above
     You can use the '*' symbol to represent access to all roles
     */
    accessLevels: {
      'public': '*',
      'users_reader': [
        'users_get'
      ],
      'users_manager': [
        'users_get',
        'users_create',
        'users_update',
        'users_delete'
      ],
      'groups_reader': [
        'groups_get'
      ],
      'groups_manager': [
        'groups_get',
        'groups_create',
        'groups_update',
        'groups_delete'
      ],
      'clients_reader': [
        'clients_get'
      ],
      'clients_manager': [
        'clients_get',
        'clients_create',
        'clients_update',
        'clients_delete'
      ],
      'tokens_reader': [
        'tokens_get'
      ],
      'tokens_manager': [
        'tokens_get',
        'tokens_create',
        'tokens_update',
        'tokens_delete'
      ],
      'admin': [
        'users_get',
        'users_create',
        'users_update',
        'users_delete',
        'groups_get',
        'groups_create',
        'groups_update',
        'groups_delete',
        'clients_get',
        'clients_create',
        'clients_update',
        'clients_delete',
        'tokens_get',
        'tokens_create',
        'tokens_update',
        'tokens_delete'
      ]
    }

  };

  /*
   Method to build a distinct bit mask for each role
   It starts off with '1' and shifts the bit to the left for each element in the
   roles array parameter
   */

  function buildRoles(roles) {

    var bitMask = '01';
    var userRoles = {};

    for (var role in roles) {
      var intCode = parseInt(bitMask, 2);
      userRoles[roles[role]] = {
        bitMask: intCode,
        title: roles[role]
      };
      bitMask = (intCode << 1 ).toString(2)
    }

    return userRoles;
  }

  /*
   This method builds access level bit masks based on the accessLevelDeclaration parameter which must
   contain an array for each access level containing the allowed user roles.
   */
  function buildAccessLevels(accessLevelDeclarations, userRoles) {

    var accessLevels = {};
    for (var level in accessLevelDeclarations) {

      if (typeof accessLevelDeclarations[level] == 'string') {
        if (accessLevelDeclarations[level] == '*') {

          var resultBitMask = '';

          for (var role in userRoles) {
            resultBitMask += '1'
          }
          //accessLevels[level] = parseInt(resultBitMask, 2);
          accessLevels[level] = {
            bitMask: parseInt(resultBitMask, 2)
          };
        } else {
          console.log('Access Control Error: Could not parse '
            + accessLevelDeclarations[level]
            + ' as access definition for level '
            + level
          );
        }
      }
      else {

        var resultBitMask = 0;
        for (var role in accessLevelDeclarations[level]) {
          if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
            resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask
          else {
            console.log('Access Control Error: Could not find role '
              + accessLevelDeclarations[level][role]
              + ' in registered roles while building access for '
              + level
            );
          }
        }
        accessLevels[level] = {
          bitMask: resultBitMask
        };
      }
    }

    return accessLevels;
  }

  exports.userRoles = buildRoles(config.roles);
  exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);

})(typeof exports === 'undefined' ? this['routingConfig'] = {} : exports);
