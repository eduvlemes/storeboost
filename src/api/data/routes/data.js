const path = require('path');
const checkWidgetInstallationPolicy = require(path.resolve(__dirname, '../../../config/policies/checkWidgetInstallation'));


module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/data/get',
       handler: 'data.getAppData',
       config: {
         policies: [checkWidgetInstallationPolicy],
         middlewares: [],
       },
      },
      {
        method: 'POST',
        path: '/data/set',
        handler: 'data.setAppData',
        config: {
          policies: [checkWidgetInstallationPolicy],
          middlewares: [],
        },
       },
    ],
  };
  