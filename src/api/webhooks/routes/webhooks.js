module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/webhooks/file-upload',
       handler: 'webhooks.fileUpload',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  