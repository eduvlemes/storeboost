module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'ALPIX'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT','ALPIX'),
  },

});