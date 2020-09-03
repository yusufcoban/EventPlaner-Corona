Vue.component('resent-link-component', {
    props: ['user', 'products', 'email'],
    template: `<div v-if="emailAlreadyUsed">
                <button v-on:click="resentLinkToUser()"> Fetch link again</button>
            </div>`,
    methods: {
        resentLinkToUser: function ()
        {
            var that = this;
            var promise = ajaxUtilities.GetJson(that.emailApi);
            store.commit('setLoading', true);
            store.commit('setEmailAlreadyUsed', false);

            $.when(promise).done(function (result)
            {
            }).fail(function ()
            {
            }).always(function ()
            {
                store.commit('setLoading', false);
            });
        }
    },
    computed: {
        emailAlreadyUsed: function ()
        {
            return store.getters.getEmailAlreadyUsed;
        },
        emailApi: function ()
        {
            return "/User/resentLink?email=" + encodeURIComponent(this.email);
        }
    },
    data: function ()
    {
        return {
        };
    }
});