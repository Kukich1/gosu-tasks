<template>
    <div class="wrapper">
        <div class="admin_panel">
            <div class="users">
                <div class="name_container">
                    <p class="admin_title">Пользователи</p>
                </div>

                <div class="users_container">
                    <div class="user_button_container" v-for="(user, isEditing) in all_users" :key="id">
                        <div v-if="user.username" class="users_buttons">
                            <button @click="userInfo(user)" class="user_button">
                                <div class="button_user_inner_container">
                                    <div class="button_user_inner_image_container">
                                        <img src="../images_and_gifs/avatar-svgrepo-com.svg" />
                                    </div>
                                    <div class="button_user_inner_text_container">
                                        <strong>{{ user.username }}</strong>
                                    </div>
                                </div>
                            </button>
                        </div>
                        <div v-else class="empty_container">
                            <p>Страница администратора</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="export_button_container">
                <button @click="exportToExcelUsers" class="export_button">
                    <div class="export_button_inner_container">
                        <div class="export_button_image_inner_container">
                            <img class="export_image" src="../images_and_gifs/export.svg" />
                        </div>
                        <div class="export_button_inner_text">
                            <b>Экспорт данных всех пользователей в Excel</b>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <div class="adminpage_body">
            <div class="adminpage_header">
                <div class="logo">
                    <img src="../images_and_gifs/tasks1.svg" alt="Что-то пошло не так братик!" />
                </div>
                <div class="container-img">
                    <img class="background_image_class" src="../images_and_gifs/Фон.svg" />
                </div>

                <div class="admin_info">
                    <p class="name"><b>{{ Name }}</b></p>
                    <h5>Администратор</h5>
                    <div class="button_exit_container">
                        <button @click="exit" class="button_exit">Выйти</button>
                    </div>
                </div>
            </div>

            <div v-if="selectedUser" class="show">
                <div class="cards">
                    <div class="column_yesterday">
                        <div class="column_header">
                            <h2>Итоги вчерашнего дня</h2>
                        </div>
                        <div class="column_body">
                            <div class="item" v-for="(post, id) in selectedUserTasks" :key="id">
                                <div @click="openCardModal(post)" class="card_yesterday"
                                    v-if="post.type === 'default' && isYesterday(post.created_at)">
                                    <strong class="post_title">{{ post.post_tittle }}</strong>
                                    <p class="post_title_date">{{ formatCreatedAt(post.created_at) }}</p>
                                </div>
                                <UserDetails :showUserDetails="isTaskModalVisible" :selectedPost="selectedPost" @close="closeChangTaskModal">
                                </UserDetails>
                            </div>
                        </div>
                    </div>

                    <div class="column_today">
                        <div class="column_header">
                            <h2>Задачи на сегодня</h2>
                        </div>
                        <div class="column_body">
                            <div class="item" v-for="(post, id) in selectedUserTasks" :key="id">
                                <div @click="openCardModal(post)" class="card_today"
                                    v-if="post.type === 'default' && isToday(post.created_at)">
                                    <strong class="post_title">{{ post.post_tittle }}</strong>
                                    <p class="post_title_date">{{ formatCreatedAt(post.created_at) }}</p>
                                </div>
                                <UserDetails :showUserDetails="isTaskModalVisible" :selectedPost="selectedPost" @close="closeChangTaskModal">
                                </UserDetails>
                            </div>
                        </div>
                    </div>

                    <div class="column_question">
                        <div class="column_header">
                            <h2>Вопросы и трудности</h2>
                        </div>
                        <div class="column_body">
                            <div class="item" v-for="(post, id) in selectedUserTasks" :key="id">
                                <div @click="openCardModal(post)" class="card_question" v-if="post.type === 'question'">
                                    <strong class="post_title"> {{ post.post_tittle }} </strong>
                                    <p class="post_title_date">{{ formatCreatedAt(post.created_at) }}</p>
                                </div>
                                <UserDetails :showUserDetails="isTaskModalVisible" :selectedPost="selectedPost" @close="closeChangTaskModal">
                                </UserDetails>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="export_user_button_container">
                    <button @click="exportToExcelUser(selectedUser)" class="export_user_button">
                        Экспорт данных {{selectedUser.username }} в Excel
                    </button>
                </div>
            </div>
            <div v-else class="empty_container">
                <h1>Страница администратора</h1>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import XLSX from 'xlsx';
import UserDetails from './helps/UserDetails.vue'
export default {
    data() {
        const Name = localStorage.getItem('name');
        const clearName = Name.replaceAll('"', '');
        return {
            Name: clearName,
            all_users: [],
            selectedUserTasks: [],
            selectedUser: null,
            isTaskModalVisible: false,
            selectedPost: null,
        };
    },
    created() {
        this.AllFetchTasks();
        this.test();
    },
    methods: {
        async AllFetchTasks() {
            try {
                const token = localStorage.getItem("token");
                const clearToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${clearToken}`
                    },
                };
                const response = await axios.get('https://gosutasks-api.vercel.app/admin/get_data/', config);
                const responseData = response.data.json();
                this.all_users = responseData;
                this.all_users.sort((a, b) => b.created_at - a.created_at);
            }
            catch (error) {
                const refresh_token = localStorage.getItem("refresh_token");
                const clearRef = refresh_token.replaceAll("\"", "");
                let config2 = {
                    headers: {
                        'Authorization': `Bearer ${clearRef}`
                    },
                };
                const response1 = await axios.post('https://gosutasks-api.vercel.app/token/refresh/', undefined, config2);
                localStorage.removeItem("token");
                localStorage.setItem("token", JSON.stringify(response1.data.access_token));
                const token = localStorage.getItem("token");
                const clearToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${clearToken}`
                    },
                };
                const response = await axios.get('https://gosutasks-api.vercel.app/admin/get_data/', config);
                this.all_users = response.data;
                this.all_users.sort((a, b) => b.created_at - a.created_at);
                console.error('Ошибка при получении задач:', error);
            }
        },
        async exportToExcelUsers() {
            try {
                const token = localStorage.getItem("token");
                const clearToken = token.replaceAll('"', '');
                let config = {
                    headers: {
                        'Authorization': `Bearer ${clearToken}`,
                    },
                    responseType: 'blob',
                };
                const response = await axios.get('https://gosutasks-api.vercel.app/admin/exportexcel/all_posts/', config);
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Users_posts.xlsx');
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
            }
            catch (error) {
                const refresh_token = localStorage.getItem("refresh_token");
                const clearRef = refresh_token.replaceAll("\"", "");
                let config2 = {
                    headers: {
                        'Authorization': `Bearer ${clearRef}`
                    },
                };
                const response1 = await axios.post('https://gosutasks-api.vercel.app/token/refresh/', undefined, config2);
                localStorage.removeItem("token");
                localStorage.setItem("token", JSON.stringify(response1.data.access_token));
                const token = localStorage.getItem("token");
                const clearToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${clearToken}`
                    },
                };
                const response = await axios.get('https://gosutasks-api.vercel.app/admin/exportexcel/all_posts/', config);
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Users_posts.xlsx');
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                console.error('Ошибка при получении задач:', error);
            }
        },
        async exportToExcelUser(selectedUser) {
            try {
                const token = localStorage.getItem("token");
                const clearToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${clearToken}`
                    },
                    responseType: 'blob',
                };
                const response = await axios.post(`https://gosutasks-api.vercel.app/admin/exportexcel/${selectedUser.username}`, undefined, config);
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${selectedUser.username}.xlsx`);
                document.body.appendChild(link);
                console.log("selectedUser", selectedUser.username);
                link.click();
                window.URL.revokeObjectURL(url);
            }
            catch (error) {
                const refresh_token = localStorage.getItem("refresh_token");
                const clearRef = refresh_token.replaceAll("\"", "");
                let config2 = {
                    headers: {
                        'Authorization': `Bearer ${clearRef}`
                    },
                };
                const response1 = await axios.post('https://gosutasks-api.vercel.app/token/refresh/', undefined, config2);
                localStorage.removeItem("token");
                localStorage.setItem("token", JSON.stringify(response1.data.access_token));
                const token = localStorage.getItem("token");
                const clearToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${clearToken}`
                    },
                };
                const response = await axios.post(`https://gosutasks-api.vercel.app/admin/exportexcel/${selectedUser}`, undefined, config);
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${selectedUser.username}.xlsx`);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                console.error('Ошибка при получении задач:', error);
            }
        },
        async userInfo(user) {
            try {
                const token = localStorage.getItem("token");
                const clearToken = token.replaceAll('"', '');
                let config = {
                    headers: {
                        'Authorization': `Bearer ${clearToken}`,
                    },
                    responseType: 'blob',
                };
                const response = await axios.get(`https://gosutasks-api.vercel.app/admin/show_user_posts_collection/${user.username}`, config);
                const blobData = response.data;
                const textData = await blobData.text();
                const jsonData = JSON.parse(textData);
                console.log(jsonData);
                this.selectedUser = user;
                this.selectedUserTasks = jsonData;
                console.log(this.selectedUserTasks);
            }
            catch (error) {
                console.error('Ошибка при получении задач:', error);
            }
        },
        formatCreatedAt(createdAt) {
            const date = new Date(createdAt * 1000);
            const formattedDate = date.toLocaleString();
            return formattedDate;
        },
        isYesterday(timestamp) {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return new Date(timestamp * 1000).toDateString() === yesterday.toDateString();
        },
        isToday(timestamp) {
            const now = new Date();
            return new Date(timestamp * 1000).toDateString() === now.toDateString();
        },
        openCardModal(post){
            this.selectedPost = post
            this.isTaskModalVisible= true;
        },
        closeChangTaskModal(){
            this.isTaskModalVisible= false;
        },
        exit() {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('name');
            this.$router.push('/');
            this.all_users = [];
        },
        test() {
            const role = localStorage.getItem("role");
            if (role === "0") {
                this.$router.push('/mainpage');
                console.log("da");
            }
        },
    },
    mounted() {
        this.AllFetchTasks();
        this.test();
    },
    components: { UserDetails }
}
</script>

<style lang="scss" scoped>
* {
    font-family: 'Jost', sans-serif;
}

.wrapper {
    display: flex;
}

.admin_panel {
    box-shadow: 8px 0 10px rgba(0, 0, 0, 0.3);
    background-color: #7eb0df;
    position: fixed;
    display: flex;
    flex-direction: column;
    max-width: 17%;
    min-width: 15%;
    height: 100vh;
    text-align: center;
    color: white;
}

.adminpage_body {
    margin-left: 16%;
    width: 100%;
}

.adminpage_header {
    width: 100%;
    height: 20%;
    display: flex;
}

.logo {
    padding: 3%;
    width: 30%;
}

.container-img {
    width: 60%;
}

.background_image_class {
    width: 100%;
    height: 100%;
}

.admin_info {
    text-align: center;
    width: 15%;
    padding: 1%;
}

.name_container {
    width: 100%;
}

.admin_title {
    padding: 10%;
    text-align: left;
    font-size: 3vh;
    max-width: 90%;
}

.export_button_container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.export_button {
    padding: 2%;
    border-radius: 5px;
    border: 2px solid white;
    background-color: #85b3df;
    text-align: left;
    width: 80%;
}

.export_button:hover {
    cursor: pointer;
    border: 2px solid lightgrey;
    background-color: #99a2e4;
}

.export_button_inner_container {
    width: 100%;
    display: flex;
}

.export_button_image_inner_container {
    width: 13%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.export_button_inner_text {
    width: 80%;
}

.user_button {
    text-align: left;
    width: 80%;
    height: 100%;
    background-color: #7eb0df;
    border: 2px solid #7eb0df;
    border-radius: 3px;
}

.button_user_inner_container {
    width: 100%;
    display: flex;
}

.button_user_inner_image_container {
    padding: 2%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.button_user_inner_text_container {
    font-size: 110%;
}

.user_button strong {
    text-align: left;
}

.user_button:hover {
    cursor: pointer;
    border: 2px solid white;
}

.empty_container {
    padding-left: 35%;
    padding-top: 20%;
    color: lightgrey;
}

.users_container {
    overflow: auto;
    width: 100%;
    height: 75vh;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}

.users_container::-webkit-scrollbar {
    width: 6px;
}

.users_container::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 6px;
}

.users_container::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.users_container::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}


.user_button_container {
    height: 7%;
}

.users_buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.users {
    padding-top: 1%;
}

.button_exit_container {
    padding: 10%;
    width: 100%;
}

.button_exit {
    width: 100%;
    border: 1px solid #7eb0df;
    background: white;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.button_exit:hover {
    cursor: pointer;
    border: 1px solid white;
    background: #7eb0df;
    color: white;
}

.name {
    font-size: 100%;
}

.users {
    font-size: 100%;
}

.cards {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin-left: 5%;
}

.column_header {
    width: 100%;
    height: 10vh;
    border-radius: 10px;
    font-size: 100%;
}

.column_body {
    width: 100%;
    height: 44vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}

.post_title {
    font-size: 15px;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.5;
    letter-spacing: 1px;
    color: #333;
}

.post_title_date {
    color: rgb(104, 104, 104);
    font-size: 90%;
}

.column_yesterday {
    margin-top: 5%;
    flex-direction: column;
    width: 32%;
    height: 100%;
    margin: 2%;
}

.card_yesterday {
    cursor: pointer;
    text-align: center;
    margin-top: 3%;
    width: 98%;
    height: 100%;
    background: #9DE09C;
    border-radius: 3.5px;
    padding: 2%;
}

.card_yesterday:hover {
    border: 2px solid #015300;
}

.column_today {
    flex-direction: column;
    width: 32%;
    height: 100%;
    margin: 2%;
}

.card_today {
    cursor: pointer;
    text-align: center;
    margin-top: 3%;
    width: 98%;
    background-color: rgb(255, 255, 110);
    height: 100%;
    border-radius: 3.5px;
    padding: 2%;
}

.card_today:hover {
    border: 2px solid rgb(148, 148, 0);
}

.column_question {
    flex-direction: column;
    width: 32%;
    height: 100%;
    margin: 2%;
}

.card_question {
    cursor: pointer;
    text-align: center;
    margin-top: 3%;
    width: 98%;
    height: 100%;
    background-color: pink;
    border-radius: 3.5px;
    padding: 2% 2%;
}

.card_question:hover {
    border: 2px solid rgb(99, 76, 79);
}

.export_user_button_container {
    display: flex;
    justify-content: center;
    margin-right: 10%;
}

.export_user_button {
    width: 30%;
    height: 10vh;
    border: 2px solid #7eb0df;
    background-color: white;
    font-size: 100%;
    transition: background-color 0.3s ease;
}

.export_user_button:hover {
    cursor: pointer;
    border: 2px solid white;
    background: #7eb0df;
    color: white;
}

.column_body::-webkit-scrollbar {
    width: 6px;
}

.column_body::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 6px;
}

.column_body::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.column_body::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}
</style>
