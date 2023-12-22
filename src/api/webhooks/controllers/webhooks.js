'use strict';

/**
 * A set of functions called "actions" for `webhooks`
 */
const axios = require('axios');
const { Readable } = require("stream");
const folderService = strapi.plugins.upload.services.folder;
module.exports = {
  fileUpload: async (ctx, next) => {
    //console.log('ctx-----', ctx.request.files)
    //console.log('next-----', next)
    //console.log('host-----', ctx.request.header.origin)
    
    try{
        const { files } = ctx.request.files;
        if(files){
            const widgetInstallation = await strapi.entityService.findMany('api::signature.signature', {
                populate: ['store'],
                filters: {                
                    store: {
                        url: {
                            $contains: ctx.request.header.origin
                        },
                    },
                    widget: 7,
                },
            }); 
    
    
            if (widgetInstallation) {
                let storeFolder = await strapi.query('plugin::upload.folder').findOne({where: {name: `${widgetInstallation[0].store.id}`}});
                if (!storeFolder) {
                    await folderService.create({name: `${widgetInstallation[0].store.id}`})
                    storeFolder = await strapi.query('plugin::upload.folder').findOne({where: {name: `${widgetInstallation[0].store.id}`}});
                }
                const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
                    data: {
                    field: 'images', // your collection image field name
                    fileInfo: { folder: storeFolder.id }, // if you want assign a folder
                    },
                    files: files,
                });
                if(uploadedFiles){
                    const entry = await strapi.entityService.create('api::widget-data.widget-data', {
                        data:{
                        store:widgetInstallation[0].store.id,
                        widget:7,
                        active:true,
                        data:{
                            image:uploadedFiles,
                            origin: ctx.request.ip,
                        },
                        publishedAt: new Date().toISOString()      
                        }
                    }); 
                    ctx.body = { err: false, response: entry };
                }else{
                    ctx.body = { err: true, response: 'Falha no upload' };
                }
            } else {
                ctx.body = { err: true, msg: 'App não contratado' };
            }
        }else{
            ctx.body = {err:true,msg:'Nenhum arquivo enviado'}
        }        
    }catch (err) {
        ctx.body = {err:true,msg:'errrrou ' + err};
    }
  }
};
