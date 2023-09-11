<template>
    <div>
        <Header :Kuanysh="Kuanysh" />
    </div>

<div class="cards">
    <div class="column_yesterday">
        <div class="column_header">
            <h2>Итоги вчерашнего дня</h2>
        </div>
        <div class="item" v-for="(post, id) in posts" :key="id">
            <div @click="openCardModal()"  class="card_yesterday" v-if="post.type === 'default' && isYesterday(post.created_at)">
                <strong class="post_title">{{ post.post_tittle }}</strong>                
                <CardsModal :show-cards-modal="isChangTaskModalVisible" title="Подробная информация о карточке" @close="closeCardTaskModal" @chang-task="changTask">
                    <strong class="post_title">{{ post.post_tittle }}</strong>
                    <p>{{ post.post_text }}</p>
                    <button @click="openUpdateModal(post)" class="update-button">Обновить</button>
                    <button @click="deleteCard(post)" class="delete-button">Удалить</button>
                </CardsModal>
            </div>
        </div>
    </div>

    <div class="column_today">
        <div class="column_header">
            <h2>Задачи на сегодня</h2>
        </div>
        <div class="item" v-for="(post, id) in posts" :key="id">
            <div class="card_today" v-if="post.type === 'default' && isToday(post.created_at)">
                <strong class="post_title">{{ post.post_tittle }}</strong>
                <p>{{ post.post_text }}</p>
                <button @click="openUpdateModal(post)" class="update-button">Обновить</button>
                <button @click="deleteCard(post)" class="delete-button">Удалить</button>

            </div>
        </div>
    </div>

    <div class="column_question">
        <div class="column_header">
            <h2>Вопросы и трудности</h2>
        </div>

        <div class="item" v-for="(post, id) in posts" :key="id">
            <div class="card_question" v-if="post.type === 'question'">
                <strong class="post_title">{{ post.post_tittle }}</strong>
                <p>{{ post.post_text }}</p>
                <button @click="openUpdateModal(post)" class="update-button">Обновить</button>
                <button @click="deleteCard(post)" class="delete-button">Удалить</button>
            </div>
        </div>
    </div>
</div>

<div class="button_create_task_container">
    <button @click="showCreateTaskModal" class="button_create_task">Создать задачу</button>
</div>
<Modal :show-modal="isCreateTaskModalVisible" title="Создание задачи"
    description="Введите информацию о задаче и выберите контейнер." @close="closeCreateTaskModal"
    @create-task="createTask">
</Modal>
</template>

<script>
import axios from 'axios';
import Modal from "./helpers/Modal.vue";
import Header from './Header.vue';
import CardsModal from './helpers/CardsModal.vue';

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
      selectedContainer: "",
      posts: [],
      tasks: [],
      name: '',
      cardModals: {},
      editingCardId: null,
      deletingCardId: null,
      showSaveButton: false,
      Kuanysh: 'Some Value',
    };
  },
  created() {
    this.fetchTasks();
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
                console.log(config)
                const response = await axios.get('https://gosutasks-api.vercel.app/user/get_posts/', config);
                console.log("🚀 ~ file: MainPage.vue:105 ~ fetchTasks ~ response:", response)
                // this.posts = this.posts.concat(response.data);
                this.posts = response.data;
                this.posts.sort((a, b) => b.created_at - a.created_at);

                console.log(response.data)
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
        closeCreateTaskModal() {
            this.isCreateTaskModalVisible = false;
        },


        openCardModal() {
            this.isChangTaskModalVisible = true;
        },
        closeCardTaskModal() {
            this.isChangTaskModalVisible = false;
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
                const response = await axios.post('https://gosutasks-api.vercel.app/user/create_posts/', taskData, config);

                console.log('Задача успешно создана:', response.data);
                this.closeCreateTaskModal();
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
                const response = await axios.post('https://gosutasks-api.vercel.app/user/create_posts/',taskData, config);

                console.log('Задача успешно создана:', response.data);
                this.closeCreateTaskModal();
                await this.fetchTasks();
                
                console.error('Ошибка при создании задачи:', error);
            }
        },
        async changTask(changTaskData){

        },
        editCard(cardId) {
            this.editingCardId = cardId;
            this.showSaveButton = true;
        },
        cancelEditCard(cardId) {
            this.editingCardId = null;
            this.showSaveButton = false;
        },
        saveEditedCard(cardId) {
            this.editingCardId = null;
            this.showSaveButton = false;
        },
        confirmDeleteCard(cardId) {
            this.deletingCardId = cardId;
        },
        async deleteCard(post) {
            try {
                const token = localStorage.getItem("token");
                const cleanToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${cleanToken}`,
                    },
                };
                const response = await axios.delete(`https://gosutasks-api.vercel.app/user/delete_post/${card.id}`, config);

                console.log('Карточка успешно удалена:', response.data);

                const index = this.posts.indexOf(card);
                if (index !== -1) {
                this.posts.splice(index, 1);
                }

                this.closeCardTaskModal();
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
                const response = await axios.delete(`https://gosutasks-api.vercel.app/user/delete_post/${post.id}`, config);
                
                console.log('Карточка успешно удалена:', response.data);

                const index = this.posts.indexOf(post);
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
    async fetchAndTest() {
        await this.fetchTasks();
        this.test();
    }
}
</script>

<style lang="scss" scoped>
* {
    font-family: sans-serif;
}

.container-img {
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: -1;
    left: 100px;
}

header {
    margin-left: 10vh;
    margin-right: 10vh;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 0;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-container {
    margin-bottom: 95spx;
}

.button_create_task_container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    
}

.button_create_task {
    width: 357px;
    height: 70px;
    margin: 2%;
    padding: 1% 10%;
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

.input_text input[type="text"] {
    display: flex;
    flex-direction: column;
    width: 357px;
    height: 70px;
    margin-top: 10px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #65B2F0;
    border-radius: 4px;
}

.cards {
    display: flex;
}

.column_header {
    margin: 1%;
    text-align: center;
    width: 98%;
    height: 25%;
    border-radius: 10px;
    font-size: 100%;
}

.post_title {
    font-size: 20px;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.5;
    letter-spacing: 1px;
    color: #333;
}

.column_yesterday {
    flex-direction: column;
    width: 32%;
    height: 100%;
    text-align: left;
    margin: 1%;
}

.card_yesterday {
    margin-top: 3%;
    width: 98%;
    height: 100%;
    background: #9DE09C;
    border-radius: 3.5px;
    padding: 2%;
}

.column_today {
    flex-direction: column;
    width: 32%;
    height: 100%;
    text-align: left;
    margin: 1%;
}

.card_today {
    margin-top: 3%;
    width: 98%;
    background-color: rgb(255, 255, 110);
    height: 100%;
    border-radius: 3.5px;
    padding: 2%;
}

.column_question {
    flex-direction: column;
    width: 32%;
    height: 100%;
    text-align: left;
    margin: 1%;
}

.card_question {
    margin-top: 3%;
    width: 98%;
    height: 100%;
    background-color: pink;
    border-radius: 3.5px;
    padding: 2% 2%;
}

.update-button {
    width: 30%;
    background-color: white;
    margin-top: 2%;
    margin-right: 1%;
    border: 1px solid rgba(0, 0, 0, 0);
}

.update-button:hover {
    background-color: rgb(221, 221, 221);
}

.delete-button {
    width: 30%;
    background-color: red;
    color: white;
    margin-top: 2%;
    margin-left: 1%;
    border: 1px solid rgba(0, 0, 0, 0);
}

.delete-button:hover {
    background-color: rgb(255, 108, 133);
}
</style>