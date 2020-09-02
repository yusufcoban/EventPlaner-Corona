Vue.component('greeting-user-component', {
    props: ['user'],
    template: `<div>
                 Hallo {{user.firstname}} {{user.lastname}}
            </div>`,
});