'use strict';

/**
 * A set of functions called "actions" for `webhooks`
 */

module.exports = {
  getAppData: async (ctx, next) => {
    try{
        const appId = ctx.request.headers['app-id'];
        const response = {};
        const {filters, pagination} = ctx.request.body || {};
        
        const data = await strapi.entityService.findMany('api::widget-data.widget-data', {
            populate: ['store'],
            fields:['data'],
            filters: {
              store: {
                url: {
                  $contains: ctx.request.header.origin
                },
              },
              widget: ctx.request.headers['app-id'] || 0,
              active:true
            },
          });
          
          let filteredData = data.filter(item => {
            let passFilter = true;
    
            if (filters) {
              Object.keys(filters).forEach(filterKey => {
                const filterValue = filters[filterKey];
                if (item.data[filterKey] !== filterValue) {
                  passFilter = false;
                }
              });
            }
    
            return passFilter;
          });

            const startIndex = (pagination.page - 1) * pagination.per_page;
            const endIndex = startIndex + pagination.per_page;
            filteredData = filteredData.slice(startIndex, endIndex);


          const formattedData = filteredData.map(item => ({
            data: item.data,
            active: item.active,
          }));

        response.data = formattedData;
        
        //DEPOIMENTOS DE CLIENTES
        // Trás a média de avaliações do produto
        if(appId == 5){ 
          const totalStars = data.reduce((accumulator, current) => {
            return accumulator + (current.data.rating || 0);
          }, 0);
          
          response.rating = (totalStars/data.length).toFixed(1)
        }
    
          ctx.body = response; 
    }catch(e){
        console.log(e)
        ctx.body = { err: true, response: e };
    }
  },
  setAppData: async (ctx, next) => {
    try{
        ctx.body = { err: false, response: 'oe' };
    }catch(e){
        ctx.body = { err: true, response: 'ui' };
    }
  }
};
