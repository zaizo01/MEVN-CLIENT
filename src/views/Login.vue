<template>
    <div class="container">
        <form class="border  border-2 p-4 rounded shadow-sm" @submit.prevent="login()">
            <h1>Login</h1>
            <input type="email" placeholder="Email" class="form-control my-4" v-model="user.email">
            <input type="password" placeholder="Password" class="form-control my-4" v-model="user.password">
            <b-button variant="outline-primary btn-block" type="submit">Button</b-button>
        </form>
        <div v-if="mensaje !=''" class="alert alert-danger my-5">
            <p>{{mensaje}}</p>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            user: {
                email: '',
                password: ''
            },
            mensaje: ''
        }
    },
    methods: {
        ...mapActions(['saveUser']),
        login(){
            this.axios.post('/login', this.user)
            .then((result) => {
                console.log(result.data);
                const token = result.data.token;
                this.saveUser(token);
                this.$router.push({name: 'Notes'});
            }).catch((err) => {
                console.log(err.response);
                this.mensaje = err.response.data.message;
            });
        }
    },
}
</script>

<style scoped>
    .container {
        max-width: 500px;
    }
</style>
