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
        widget: ctx.request.headers['app-id'],
      },
    });

    console.log(widgetInstallation)

    if (widgetInstallation.length === 0) {
      ctx.status = 401; // Unauthorized
      ctx.body = 'A instalação do widget não foi encontrada.';
      return;
    }

    // Se a condição for atendida, continue para o próximo middleware ou rota
    await next();
  } catch (error) {
    ctx.status = 401; // Unauthorized
    ctx.body = error.message || 'Erro não autorizado.';
  }
};
 