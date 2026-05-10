'use strict'
/**
 * New Relic agent configuration.
 */
exports.config = {
  app_name: ['M2 Nexus Sovereign Engine'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || 'REPLACE_WITH_ACTUAL_KEY',
  logging: {
    level: 'info'
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie',
      'request.headers.xGpcAuthorization',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie',
      'response.headers.xGpcAuthorization'
    ]
  }
}
