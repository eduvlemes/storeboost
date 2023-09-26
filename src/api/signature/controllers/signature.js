'use strict';

/**
 * signature controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::signature.signature', ({strapi}) => ({
    async find(ctx){
        //console.log(ctx)
        const { store } = ctx.request.query;
        const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
        const isRelated = await strapi.entityService.findMany('api::store.store', {
            filters:{
                $or:[
                    {admin_user:id},
                    {users: id}
                ],
                store : store
            }
        });

        if(isRelated.length > 0){      
            ctx.request.query.filters = {
                store : store
            }
            ctx.request.query.populate = "*"
            const { data, meta } = await super.find(ctx);
            return { data, meta };
        }
        return { data:[], meta:[] }
        

        // const entries = await strapi.entityService.findMany('api::signature.signature', {
        //     populate: "*",
        //     filters: {                
        //         store: store_.id 
        //     },
        // });
        // return entries

    }    
}));

