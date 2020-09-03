Vue.component('register-user-component', {
    template: `<div>
                <form @submit.prevent="createNewUser" id="registerForm">
                    <div class="form-group">
                        <label for="firstname">Vorname</label>
                        <input type="text" class="form-control" placeholder="Vorname" required name="firstname"" v-model="currentUser.firstname">
                        <small id="emailHelp" class="form-text text-muted">We'll never share your data with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="lastname">Nachname</label>
                        <input type="text" class="form-control" placeholder="Nachname" name="lastname" required v-model="currentUser.lastname">
                        <small id="emailHelp" class="form-text text-muted">We'll never share your data with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="addresse">Adresse</label>
                        <input type="text" class="form-control" name="addresse" placeholder="Addresse" required v-model="currentUser.addresse">
                        <small id="emailHelp" class="form-text text-muted">We'll never share your data with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" name="email" required placeholder="email" v-model="currentUser.email">
                    </div>
                    <span v-if="emailAlreadyUsed">
                            <resent-link-component :email="currentUser.email"  v-on:resetemailsent="resetemailsent"></resent-link-component>
                        </span>
                    <input type="submit" class="btn btn-primary" value="Get personal link!" style="height: 100%;">
                    </input>
                    <template v-if="errorMessageServer.length>0">
                          <br><br>
                        <div class="alert">
                          <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                         {{errorMessageServer}}
                        </div>
                    </template>
                </form>
            </div>`,
    methods: {
        resetemailsent: function ()
        {
            this.emailAlreadyUsed = false;
        },
        validateForm: function ()
        {
            $(function ()
            {
                // Initialize form validation on the registration form.
                // It has the name attribute "registration"
                $("#registerForm").validate({
                    // Specify validation rules
                    rules: {
                        // The key name on the left side is the name attribute
                        // of an input field. Validation rules are defined
                        // on the right side
                        firstname: "required",
                        lastname: "required",
                        email: {
                            required: true,
                            // Specify that email should be validated
                            // by the built-in "email" rule
                            email: true
                        },
                        addresse: {
                            required: true,
                            minlength: 5
                        }
                    },
                    // Specify validation error messages
                    messages: {
                        firstname: "Please enter your firstname",
                        lastname: "Please enter your lastname",
                        addresse: {
                            required: "Please provide a addresse",
                            minlength: "Your addresse must be at least 5 characters long"
                        },
                        email: "Please enter a valid email address"
                    }
                });
            });
        },
        createNewUser: function ()
        {
            this.validateForm();
            if ($('#registerForm').valid())
            {
                this.errorMessageServer = '';
                var that = this;
                store.commit('setLoading', true);

                var promise = ajaxUtilities.PostJson(that.uriUserCreate, that.currentUser);
                emailAlreadyUsed = false;
                $.when(promise).done(function (result)
                {
                    that.$emit('setbarcode', this, result);
                }).fail(function (result)
                {
                    $("#registerForm").validate().showErrors(result.responseJSON.errors);
                    if (result.responseJSON.errors.hasOwnProperty('email'))
                    {
                        that.emailAlreadyUsed = true;
                    }
                }).always(function ()
                {
                    store.commit('setLoading', false);
                });
            }
        }
    },
    mounted: function ()
    {
        this.validateForm();
    },
    computed: {
    },
    data: function ()
    {
        return {
            currentUser: {
                firstname: '',
                lastname: '',
                addresse: '',
                email: '',
            },
            emailAlreadyUsed: false,
            errorMessageServer: '',
            uriBarcode: '/User/byBarcode?barcode=',
            uriUserCreate: '/User/createNew',
            barCodeGiven: false
        };
    }
});