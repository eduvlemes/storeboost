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
    },
    async delete(ctx) {
        const storeId = ctx.request.headers['store-id']
        const appId = ctx.request.headers['app-id']
        const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
        const widgetInstallation = await strapi.entityService.findMany('api::signature.signature', {
            //populate: ['store'],
            filters: {                
                store: {
                    admin_user: id, 
                    id: storeId                    
                },
                widget: appId,
            },
        }); 
        if(widgetInstallation){
            try{
                if(appId == 7){
                    const entry = await strapi.entityService.findOne('api::widget-data.widget-data', ctx.params.id, {
                        populate: ['data'],
                    });
                    if(entry){
                        await strapi.plugins.upload.services.upload.remove({
                            id : entry.data.image[0].id
                        }); 
                    }         
                }
                const response = await super.delete(ctx);
                return response;   
            }catch(e){
                return { err: true, msg: 'Erro ao tentar excluir registro'}
            }
        }
        return { err: true, msg: 'Parece que temos um espertinho por aqui, não é mesmo?'}
    }
}));
