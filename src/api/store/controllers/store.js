'use strict';

/**
 * store controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::store.store', ({strapi}) => ({
    async find(ctx){
        //console.log(ctx)
        const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
        
        const entries = await strapi.entityService.findMany('api::store.store', {
            populate: ['admin_user', 'users','logo','invoice_data'],
            filters: {                
                admin_user: id 
            },
        });
        return entries

    },
    async create(ctx){
        console.log(ctx.request.body)
        const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
        
        //ctx.data.admin_user = id
        const create = await super.create(ctx);

        console.log(id)
        console.log(create)
        const response = await strapi.entityService.update("api::store.store", create.data.id, {
            data: {
                admin_user: [id]
            }
        });

        const entries = await strapi.entityService.findMany('api::store.store', {
            populate: ['admin_user', 'users','logo','invoice_data'],
            filters: {                
                id: create.data.id
            },
        });
        return entries        
        
    }
}));

