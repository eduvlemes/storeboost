'use strict';

/**
 * widget-data controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::widget-data.widget-data');

module.exports = createCoreController('api::widget-data.widget-data', ({strapi}) => ({
    async find(ctx){
        const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
        const { appId, storeId } = ctx.request.query
        const q = await strapi.entityService.findMany('api::store.store', {
            populate: ['admin_user', 'users','logo','invoice_data'],
            filters: {                
                admin_user: id, 
                id: storeId
            },
        });

        if(q){            
            const entries = await strapi.entityService.findMany('api::widget-data.widget-data', {
                filters: {                
                    widget: appId,
                    store: storeId
                },
            });
            return entries
        }
    }
}));
