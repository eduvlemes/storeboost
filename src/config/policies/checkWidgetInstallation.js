module.exports = async (ctx, next) => {
  try {
    const widgetInstallation = await strapi.entityService.findMany('api::signature.signature', {
      populate: ['store'],
      filters: {
        store: {
          url: {
            $contains: ctx.request.header.origin
          },
        },
        widget: ctx.request.headers['app-id'] || 0,
      },
    });

    if (widgetInstallation.length === 0) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
