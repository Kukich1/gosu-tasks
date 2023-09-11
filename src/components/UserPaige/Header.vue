<template>
        <header>
            <div>
                <img src="./images/tasks.svg" alt="Что-то пошло не так братик!" />
            </div>
    
            <div class="container-img">
                <img src="./images/Фон.svg" />
            </div>
            <div class="header-content">
                <p>{{ Kuanysh }}</p>
                <button @click="exit">Выйти</button>
            </div>
        </header>
  </template>

<script>
    export default {
        name: 'Header',
        props: {
            Kuanysh: String,
        },
    methods: {
        exit() {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            this.$router.push("/")
            this.posts = []
        },
    }
}
</script>

<style lang="scss" scoped>

</style>