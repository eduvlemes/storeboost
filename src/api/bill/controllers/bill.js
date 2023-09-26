'use strict';

/**
 * bill controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::bill.bill', ({strapi}) => ({
    async find(ctx){
        const { store } = ctx.request.query
        const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
        //console.log(store)
        const isRelated = await strapi.entityService.findMany('api::store.store', {
            populate: ['admin_user', 'users'],
            filters: {                
                $or: [{admin_user: id},{users: id}],
                id : store
            },
        });
        
        if(isRelated.length > 0){      
            ctx.request.query.filters = {
                store : store
            }
            const { data, meta } = await super.find(ctx);
            return { data, meta };
        }
        return { data:[], meta:[] }
        

    }    
}));


