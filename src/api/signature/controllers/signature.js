'use strict';

/**
 * signature controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::signature.signature', ({strapi}) => ({
    async find(ctx){
        //console.log(ctx)
        const { store } = ctx.query;
        const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
        const stores = await strapi.db.query('api::store.store').findMany({
            where:{
                $or:[
                    {admin_user:id},
                    {users: id}
                ],
            }
        });

        const store_ = stores.find(el => el.id == store)

        const entries = await strapi.entityService.findMany('api::signature.signature', {
            populate: "*",
            filters: {                
                store: store_.id 
            },
        });
        return entries

    }    
}));

