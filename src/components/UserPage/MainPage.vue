<template>
    <div>
        <Header />
    </div>
    <div class="cards">
        <div class="column_yesterday">
            <div class="column_header">
                <h2>Итоги вчерашнего дня</h2>
            </div>
            <div class="column_body">
                <div class="item" v-for="(post, id) in posts" :key="id">
                    <div @click="openCardModal(post, 'Итоги вчерашнего дня')" class="card_yesterday"
                        v-if="post.type === 'default' && isYesterday(post.created_at)">
                        <strong class="post_title">{{ post.post_tittle }}</strong>
                        <p class="post_title_date">{{ formatCreatedAt(post.created_at) }}</p>
                    </div>
                    <CardsModal :showCardsModal="isChangTaskModalVisible" :selectedPost="selectedPost"
                        :isEditing="showSaveButton" :postType="post.type" :fetchTasks="fetchTasks" :columnTitle="postColumn"
                        title="Подробная информация о карточке" @close="closeChangTaskModal" @chang-task="changTask"
                        @delete-task="deleteTaskHandler">
                    </CardsModal>
                </div>
            </div>
        </div>

        <div class="column_today">
            <div class="column_header">
                <h2>Задачи на сегодня</h2>
            </div>
            <div class="column_body">
                <div class="item" v-for="(post, id) in posts" :key="id">
                    <div @click="openCardModal(post, 'Задачи на сегодня')" class="card_today"
                        v-if="post.type === 'default' && isToday(post.created_at)">
                        <strong class="post_title">{{ post.post_tittle }}</strong>
                        <p class="post_title_date">{{ formatCreatedAt(post.created_at) }}</p>
                    </div>
                    <CardsModal :showCardsModal="isChangTaskModalVisible" :selectedPost="selectedPost"
                        :isEditing="showSaveButton" :postType="post.type" :fetchTasks="fetchTasks" :columnTitle="postColumn"
                        title="Подробная информация о карточке" @close="closeChangTaskModal" @chang-task="changTask"
                        @delete-task="deleteTaskHandler"></CardsModal>
                </div>
            </div>
        </div>

        <div class="column_question">
            <div class="column_header">
                <h2>Вопросы и трудности</h2>
            </div>
            <div class="column_body">
                <div class="item" v-for="(post, id) in posts" :key="id">
                    <div @click="openCardModal(post, 'Вопросы и трудности')" class="card_question"
                        v-if="post.type === 'question'">
                        <strong class="post_title"> {{ post.post_tittle }} </strong>
                        <p class="post_title_date">{{ formatCreatedAt(post.created_at) }}</p>
                    </div>
                    <CardsModal :showCardsModal="isChangTaskModalVisible" :selectedPost="selectedPost"
                        :isEditing="showSaveButton" :postType="post.type" :fetchTasks="fetchTasks" :columnTitle="postColumn"
                        title="Подробная информация о карточке" @close="closeChangTaskModal" @chang-task="changTask"
                        @delete-task="deleteTaskHandler"></CardsModal>
                </div>
            </div>
        </div>
    </div>

    <div class="button_create_task_container">
        <button @click="showCreateTaskModal" class="button_create_task">Создать задачу</button>
    </div>
    <Modal :showModal="isCreateTaskModalVisible" title="Создание задачи"
        description="Введите информацию о задаче и выберите контейнер." @close="closeCreateTaskModal"
        @create-task="createTask">
    </Modal>
</template>

<script>
import axios from 'axios';
import CardsModal from './helpers/CardsModal.vue';
import Modal from "./helpers/Modal.vue";
import Header from './Header.vue';

export default {
    components: {
        Modal,
        Header,
        CardsModal,

    },
    data() {
        return {
            isCreateTaskModalVisible: false,
            isChangTaskModalVisible: false,
            selectedPost: null,
            posts: [],
            showSaveButton: false,
            postColumn: '',
            postDataType: '',
            changTask: null,
            selectedDate: null,
            locale: "ru-RU",
        };
    },
    created() {
        this.test();
    },
    methods: {
        async fetchTasks() {
            try {
                const token = localStorage.getItem("token");
                const cleanToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${cleanToken}`
                    },
                };
                const response = await axios.get('https://gosutasks-api.vercel.app/user/get_posts/', config);
                // this.posts = this.posts.concat(response.data);
                this.posts = response.data;
                this.posts.sort((a, b) => b.created_at - a.created_at);
            } catch (error) {
                const refresh_token = localStorage.getItem("refresh_token");
                const clearRef = refresh_token.replaceAll("\"", "");
                let config2 = {
                    headers: {
                        'Authorization': `Bearer ${clearRef}`
                    },
                };
                const response1 = await axios.post('https://gosutasks-api.vercel.app/token/refresh/', undefined, config2);
                localStorage.removeItem("token")
                localStorage.setItem("token", JSON.stringify(response1.data.access_token));
                const token = localStorage.getItem("token");
                const cleanToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${cleanToken}`
                    },
                };
                const response = await axios.get('https://gosutasks-api.vercel.app/user/get_posts/', config);
                this.posts = response.data;
                this.posts.sort((a, b) => b.created_at - a.created_at);

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



        showCreateTaskModal() {
            this.isCreateTaskModalVisible = true;
        },
        async createTask(taskData) {
            try {
                const token = localStorage.getItem("token");
                const cleanToken = token.replaceAll("\"", "");
                const config = {
                    headers: {
                        'Authorization': `Bearer ${cleanToken}`,
                    },
                };
                const response = await axios.post('https://gosutasks-api.vercel.app/user/create_post/', taskData, config);

                console.log('Задача успешно создана:', response.data);
                this.closeCreateTaskModal();
                setTimeout(async () => {
                    await this.fetchTasks();
                }, 2000)
            } catch (error) {
                const refresh_token = localStorage.getItem("refresh_token");
                const clearRef = refresh_token.replaceAll("\"", "");
                let config2 = {
                    headers: {
                        'Authorization': `Bearer ${clearRef}`,
                    },
                };
                const response1 = await axios.post('https://gosutasks-api.vercel.app/token/refresh/', undefined, config2);
                localStorage.removeItem("token")
                localStorage.setItem("token", JSON.stringify(response1.data.access_token));
                const token = localStorage.getItem("token");
                const cleanToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${cleanToken}`,
                    },
                };
                const response = await axios.post('https://gosutasks-api.vercel.app/user/create_post/', taskData, config);

                console.log('Задача успешно создана:', response.data);
                this.closeCreateTaskModal();
                setTimeout(async () => {
                    await this.fetchTasks();
                }, 2000)
                console.error('Ошибка при создании задачи:', error);
            }
        },
        closeCreateTaskModal() {
            this.isCreateTaskModalVisible = false;
        },



        openCardModal(post, columnTitle) {
            this.postColumn = columnTitle;
            if (post.type === 'default' && this.isYesterday(post.created_at)) {
                this.columnTitle = 'Итоги вчерашнего дня';
            } else if (post.type === 'default' && this.isToday(post.created_at)) {
                this.columnTitle = 'Задачи на сегодня';
            } else if (post.type === 'question') {
                this.columnTitle = 'Вопросы и трудности';
            } else {
                this.columnTitle = '';
            }
            if (post.comments) {
                this.selectedPost = post;
                this.postType = post.type;
                this.initialComment = post.comments;
                this.isChangTaskModalVisible = true;
            } else {
                console.error('Комментарии отсутствуют.');
            }
        },
        closeChangTaskModal() {
            this.isChangTaskModalVisible = false;
        },


        async deleteTaskHandler(selectedPost) {
            try {
                const token = localStorage.getItem("token");
                const cleanToken = token.replaceAll("\"", "");
                const config = {
                    headers: {
                        'Authorization': `Bearer ${cleanToken}`,
                    },
                };
                const response = await axios.delete(`https://gosutasks-api.vercel.app/user/delete_post/${selectedPost.id}`, config);
                console.log('Карточка успешно удалена:', response.data);

                const index = this.posts.indexOf(selectedPost);
                if (index !== -1) {
                    this.posts.splice(index, 1);
                }
                await this.fetchTasks();
            } catch (error) {
                const refresh_token = localStorage.getItem("refresh_token");
                const clearRef = refresh_token.replaceAll("\"", "");
                let config2 = {
                    headers: {
                        'Authorization': `Bearer ${clearRef}`,
                    },
                };
                const response1 = await axios.post('https://gosutasks-api.vercel.app/token/refresh/', undefined, config2);
                localStorage.removeItem("token")
                localStorage.setItem("token", JSON.stringify(response1.data.access_token));
                const token = localStorage.getItem("token");
                const cleanToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${cleanToken}`,
                    },
                };
                const response = await axios.delete(`https://gosutasks-api.vercel.app/user/delete_post/${selectedPost.id}`, config);

                console.log('Карточка успешно удалена:', response.data);

                const index = this.posts.indexOf(selectedPost);
                if (index !== -1) {
                    this.posts.splice(index, 1);
                }
                await this.fetchTasks();
                console.error('Ошибка при удалении карточки:', error);
            }
        },
        test() {
            const role = localStorage.getItem("role");
            if (role === "1") {
                this.$router.push('/admin')
                console.log("da")
            }
        }
    },
    mounted() {
        this.fetchTasks();
        this.test();
    },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Jost&display=swap');

* {
    margin: 0 0;
    box-sizing: border-box;
    font-family: 'Jost', sans-serif;
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

header {
    margin-left: 11%;
    margin-right: 10vh;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 4%;
}

.button_create_task_container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

}

.button_create_task {
    width: 20%;
    height: 70px;
    margin: 2%;
    margin-left: 35%;
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 5px;
    border-color: #65B2F0;
    background: #65B2F0;
    color: #FFF;
    text-align: center;
    font-size: 120%;
    font-style: normal;
    line-height: normal;
    font-weight: 700;
}

.button_create_task:hover {
    background-color: #3299ec;
}

.cards {
    margin-left: 10%;
    display: flex;
    width: 70%;
    height: 100%;
}

.column_header {
    width: 100%;
    height: 10vh;
    border-radius: 10px;
    font-size: 100%;
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
    border: 2px solid white;
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
    border: 2px solid white;
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
    border: 2px solid white;
    border-radius: 3.5px;
    padding: 2% 2%;
}

.card_question:hover {
    border: 2px solid rgb(99, 76, 79);
}

/* верстка на мобилку */

@media screen and (max-width: 800px) {
    * {
    margin: 0 0;
    box-sizing: border-box;
    font-family: 'Jost', sans-serif;
}

    .column_body {
        width: 100%;
        height: 100%;
}

    header {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 4%;
    }

    .button_create_task_container {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;

    }

    .button_create_task {
        width: 100%;
        height: 10vh;   
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 5px;
        border-color: #65B2F0;
        background: #65B2F0;
        color: #FFF;
        text-align: center;
        font-size: 120%;
        font-style: normal;
        line-height: normal;
        font-weight: 700;
    }

    .button_create_task:hover {
        background-color: #3299ec;
    }

    .cards {
        display: flex;
        width: 70%;
        height: 100%;
    }

    .column_header {
        padding: 10%;
        width: 100%;
        height: 10vh;
        border-radius: 10px;
        font-size: 100%;
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
        border: 2px solid white;
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
        border: 2px solid white;
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
        border: 2px solid white;
        border-radius: 3.5px;
        padding: 2% 2%;
    }

    .card_question:hover {
        border: 2px solid rgb(99, 76, 79);
    }
}
</style>