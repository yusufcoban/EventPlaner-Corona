Vue.component('resent-link-component', {
    props: ['user', 'products', 'email'],
    template: `<div v-if="!emailSent">
                <button v-on:click="resentLinkToUser()"> Fetch link again</button>
            </div>`,
    methods: {
        resentLinkToUser: function ()
        {
            var that = this;
            var promise = ajaxUtilities.GetJson(that.emailApi);
            store.commit('setLoading', true);

            $.when(promise).done(function (result)
            {
            }).fail(function ()
            {
            }).always(function ()
            {
                that.emailSent = true;
                that.$emit('resetemailsent');
                store.commit('setLoading', false);
            });
        }
    },
    computed: {
        emailApi: function ()
        {
            return "/User/resentLink?email=" + encodeURIComponent(this.email);
        }
    },
    data: function ()
    {
        return {
            emailSent: false
        };
    }
});