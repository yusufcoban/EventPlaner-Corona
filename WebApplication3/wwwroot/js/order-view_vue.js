Vue.component('order-view-component', {
    props: ['user', 'products'],
    template: `<div>
            <div v-if="Object.keys(orderList).length>0">
                <table class="table table-striped">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Produkt</th>
                                  <th>Menge</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(order,i) in orderList" :key="i">
                                    <td>{{i+1}}.</td>
                                   <th scope="row">{{ getProductName(order.produkteid)  }}</th>  
                                   <td>{{ order.amount }}</td>
                                </tr>
                               </tbody>
                 </table>
            </div>
            <div v-else>
            <br>
            <br>
             <div class="alert">
               
            No Orders yet. Please order in the second tab.
            </div>
            </div>
            </div>`,
    methods: {
        getProductName: function (id)
        {
            return this.lookupProducts(id, 'productname');
        },
        lookupProducts: function (id, prop)
        {
            // Only change code below this line
            for (var i = 0; i < this.products.length; i++)
            {
                if (this.products[i].id == id)
                {
                    return this.products[i][prop];
                }
            }
        },
        preLoadData: function ()
        {
            if (this.user.id != "")
            {
                var that = this;
                var promise = ajaxUtilities.GetJson(that.uriUserOrderList);
                store.commit('setLoading', true);

                $.when(promise).done(function (result)
                {
                    that.orderListFromApi = result;
                }).fail(function ()
                {
                }).always(function ()
                {
                    store.commit('setLoading', false);
                });
            }
        }
    },
    watch:
    {
        user: function()
        {
            this.preLoadData();
        }
    },
    mounted: function ()
    {
        this.preLoadData();
    },
    computed: {
        orderList: function ()
        {
            return this.orderListFromApi;
        },
        uriUserOrderList: function ()
        {
            return '/Product/listByUserid?userid=' + this.user.id;
        }
    },
    data: function ()
    {
        return {
            orderListFromApi: {}
        };
    }
});