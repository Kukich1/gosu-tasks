<template>
    <div class="users_panel">
        <div class="button_exit_container">
            <button @click="exit" class="button_exit">Выйти</button>
        </div>

        <div class="users">
            <h1>Пользователи</h1>
            <div class="user_container">
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user0: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user1: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user2: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user3: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user4: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user5: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user6: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user7: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user8: Raydinov Raim</a></p>
                <br><p><a href="https://www.youtube.com/watch?v=MGonIw5fd1Y" class="user_text">user9: Raydinov Raim</a></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        exit() {
            localStorage.removeItem("token")
            localStorage.removeItem("role")
            this.$router.push("/login")
        },
        test() {
            console.log("Выполнился")
            const role = localStorage.getItem("role");
            console.log("🚀 ~ file: MainPage.vue:109 ~ test ~ role:", role)
            if (role === "0") {
                this.$router.push('/mainpage')
                console.log("da")
            }
        },
    },
    mounted() {
        this.test();
    }

    // let config =  {
    //         headers: {
    //           'Authorization': `Bearer ${token}`, 
    //         },
    //     };  
}
</script>

<style lang="scss" scoped>
.users_panel {
    background-color: #6DA5D2;
    display: flex;
    flex-direction: column;
    width: 20%;
    height: 100vh;
    text-align: center;
    color: white;
}

</style>