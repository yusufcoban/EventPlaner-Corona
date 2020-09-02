Vue.component('order-change-component', {
    props: ['user', 'products', 'barcode'],
    template: `<div :class="{loader: isLoading}">
                <table class="table table-striped">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Produkt</th>
                                  <th>Menge</th>
                                  <th>max</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr class="orderUpdate" v-for="(product,i) in products" :key="i">
                                    <td>{{i+1}}.</td>
                                   <th scope="row" class="productid" :data-value="product.id">{{product.productname}}</th>  
                                   <td><input type="number" name="anzahl" :value="orderListById(product.id)" class="orderamount" min="0" :max="product.maxOrderCount" step="1"/></td>
                                    <td>{{product.maxOrderCount}}</td>
                                </tr>
                               </tbody>
                            <button v-on:click="updateOrder" type="button" class="btn btn-primary">Update order</button>
                         </table>
                        <div>
                        <template v-if="errorMessageServer.length>0">
                                                  <br><br>
                                                <div class="alert">
                                                  <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                                                 {{errorMessageServer}}
                                                </div>
                                            </template>
                        </div>
                    </div>
          `,
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
        orderListById: function (id)
        {
            var that = this;
            var currentValue = 0;
            _.forEach(that.orderListFromApi, function (value)
            {
                if (value.produkteid == id)
                {
                    currentValue = value.amount;
                }
            });

            return currentValue;
        },
        preloadData()
        {
            if (this.user.id != "")
            {
                var that = this;
                var promise = ajaxUtilities.GetJson(that.uriUserOrderList);
                this.isLoading = true;
                $.when(promise).done(function (result)
                {
                    that.orderListFromApi = result;
                }).fail(function ()
                {
                }).always(function ()
                {
                    that.isLoading = false;
                });
            }
        },
        updateOrder: function ()
        {
            var that = this;
            var orderListPost = [];
            var orderListUpdate = $('.orderUpdate');
            _.forEach(orderListUpdate, function (order)
            {
                var object = {
                    'produkteid': parseInt($(order).children()[1].dataset.value),
                    'amount': parseInt($(order).find('input[name=anzahl]').val()),
                    'userid': that.user.id
                }
                if (object.amount > 0)
                {
                    orderListPost.push(object);
                }
            });
            that.errorMessageServer = '';
            var promise = ajaxUtilities.PostJson(that.uriUserOrderUpdate, orderListPost);
            $.when(promise).done(function (result)
            {
                that.$emit('updatedorder');
            }).fail(function (result)
            {
                if (result.hasOwnProperty('responseJSON'))
                {
                    that.errorMessageServer = JSON.stringify(result.responseJSON.errors);
                }
                
                that.$emit('updatedorder');
            });



        }
    },
    mounted: function ()
    {
        this.preloadData();
    },
    watch: {
        user: function ()
        {
            this.preloadData();
        }
    },
    computed: {
        uriUserOrderList: function ()
        {
            return '/Product/listByUserid?userid=' + this.user.id;
        },
        orderListLength: function ()
        {
            return this.orderListFromApi.length;
        },
        uriUserOrderUpdate: function ()
        {
            return '/Product/overwriteOrder?barcode=' + this.barcode
        }
    },
    data: function ()
    {
        return {
            orderListFromApi: {},
            isLoading: false,
            errorMessageServer: ""
        };
    }
});