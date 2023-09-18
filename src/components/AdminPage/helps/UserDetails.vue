<template>
    <div class="modal-overlay" v-if="showUserDetails" @click="closeChangTaskModal">
        <div class="modal-window" @click="preventClose">
            <div class="loader-overlay" v-if="isLoading">
                <div class="loader"></div>
            </div>
            <div class="modal">
                <div class="title_container">
                    <img class="space_dashboard_image" src="../../images_and_gifs/space_dashboard.svg" />
                    <div class="title_container_text">
                        <h2>{{ selectedPost.post_tittle }}</h2>
                        <p>в колонке "{{ columnTitle }}"</p>
                    </div>
                    <div class="button_close_container">
                        <button @click="closeChangTaskModal" class="button_close">X</button>
                    </div>
                </div>

                <div class="input_container">
                    <div class="segment_image_container">
                        <img class="segment_image" src="../../images_and_gifs/segment.svg" />
                    </div>
                    <div class="input_title_container">
                        <h2>Описание</h2>
                    </div>

                </div>
                <div class="textarea_container">
                    <textarea class="textarea" :disabled="true"
                        :value="selectedPost ? selectedPost.post_text : ''"></textarea>
                </div>
                <div class="comment_container">
                    <div class="comment_title">
                        <div class="comment_title_image_container">
                            <img src="../../images_and_gifs/comments.svg" />   
                        </div>
                        <div class="comment_container_text">
                            <h2>Комментарии</h2>
                        </div>
                    </div>
                    <div class="comment-section_container">
                        <textarea v-model="newComment" class="comment_section" placeholder="Введите комментарий"></textarea>
                    </div>
                    <div class="comment_add_button_container">
                        <button @click="addComment(selectedPost.id)" class="comment_add_button">Отправить</button>
                    </div>
                    <div class="comments" v-if="selectedPost && Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0">
                        <ul>
                            <li class="comment" v-for="(comment, index) in selectedPost.comments" :key="index">
                                <p>{{ comment }}</p>
                            </li>
                        </ul>
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    name: 'UserDetails',
    props: {
        showUserDetails: Boolean,
        selectedPost: Object,
        AllFetchTasks: Function,
        columnTitle: String,
        taskId: String,
    },
    data() {
        return {
            isLoading: false,
            newComment: '',
            comments: [],
        };
    },
    methods: {
        preventClose(event) {
            event.stopPropagation();
        },
        async addComment(taskId) {
            console.log("🚀 ~ file: UserDetails.vue:86 ~ addComment ~ taskId:", taskId)
            try {
                const token = localStorage.getItem("token");
                const clearToken = token.replaceAll("\"", "");
                let config = {
                    headers: {
                        'Authorization': `Bearer ${clearToken}`
                    },
                };
                const response = await axios.post(`https://gosutasks-api.vercel.app/admin/add_comment/${taskId}`, {
                    comment: this.newComment,
                }, config);
                console.log("Response data from server:", response.data);
                this.selectedPost.comments.push(this.newComment);

                this.newComment = '';
            } catch (error) {
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
                const response = await axios.post(`https://gosutasks-api.vercel.app/admin/add_comment/${taskId}`, {
                    comment: this.newComment,
                }, config);
                this.selectedPost.comments.push(this.newComment);

                this.newComment = '';
                console.error('Ошибка при добавлении комментария:', error);
            }
        },

        editPost() {
            this.isEditing = true
            this.localPostType = this.postType;
            if (this.isEditing) {
                this.editedText = this.selectedPost.post_text;
            }
        },
        handleCtrlEnterKey(event) {
            if (event.key === 'Enter' && event.ctrlKey) {
                this.savePost();
            }
        },
        closeChangTaskModal() {
            this.$emit('close');
            this.isEditing = false
        },
    },
};
</script>
  
<style scoped>
* {
    font-family: 'Jost', sans-serif;
}

.modal {
    position: fixed;
    width: 52%;
    height: 85%;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 1%;
    box-shadow: 0 2 6px rgba(133, 128, 128, 0.01);
    z-index: 99;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1.5%;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.01);
}

.input_container {
    margin: 2%;
    width: 100%;
    height: 9%;
}

.segment_image_container {
    width: 4%;
    display: flex;
    align-items: center;
}

.segment_image {
    width: 100%;
}

.space_dashboard_image {
    width: 3%;
}



.textarea_container {
    padding-left: 2%;
    width: 100%;
    height: 30%;
}

.textarea {
    font-size: 120%;
    display: flex;
    flex-direction: column;
    width: 96%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid #aaaaaa;
    background: #F3F4F8;
    text-indent: 15px;
    resize: none;
}

.textarea:hover {
    background-color: #dddddd;
}

.comment_container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.comment_title {
    display: flex;
    align-items: center;
    padding-left: 2%;
}

.comment_title_image_container {
    display: flex;
    padding-top: 2%;
    width: 4%;
    height: 5%;
}

.comment_container_text {
    width: 30%;
    height: 1.5em;
}

.comment-section_container {
    padding-top: 2%;
    padding-left: 2%;
    width: 96%;
    height: 10%;
}

.comment_section {
    padding: 1%;
    font-size: 100%;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid #aaaaaa;
    background: #F3F4F8;
    resize: none;
}

.comment_section:hover {
    background-color: #dddddd;
}

.comment_add_button_container {
    width: 20%;
    display: flex;
    align-items: flex-start;
    padding-left: 2%;
}

.comment_add_button {
    background: #EAEAEA;
    background: linear-gradient(0deg, #DADADA 100%, #EAEAEA 0%);
    border: 1px solid white;
    width: 100%;
    height: 2em;
    border-radius: 4px;
}

.comment_add_button:hover {
    cursor: pointer;
    border: 1px solid black;
}

.comments {
    width: 100%;
    height: 4em;
    margin: 1%;
    padding-left: 4%;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}

.comments::-webkit-scrollbar {
    width: 6px;
}

.comments::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 6px;
}

.comments::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.comments::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

.title_container {
    display: flex;
    margin-left: 2%;
}

.title_container_text {
    width: 90%;
    margin-left: 2%;
    font-size: 100%;
}

.button_close_container {
    margin-left: 2%;
    width: 5%;
    height: 30%;
}

.button_close {
    color: white;
    text-align: center;
    width: 90%;
    height: 4.5vh;
    border: 1px solid rgba(0, 0, 0, 0);
    border-radius: 5px;
    background-color: rgb(255, 154, 154);
}

.button_close:hover {
    cursor: pointer;
    background-color: red;
    color: white;
}

.input_title_container {
    padding-left: 1.5%;
    width: 20%;
}

.input_container {
    display: flex;
    width: 100%;
}

body {
    margin: 0;
    padding: 0;
}

main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #24262D;
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 50%;
    left: 50%;
}

.loader {
    --loader-size: 50px;
    --loader-border-size: 4px;
    --loader-border-color: white;
    width: var(--loader-size);
    height: var(--loader-size);
    border: var(--loader-border-size) solid var(--loader-border-color);
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    background-color: transparent;
    border-radius: 50%;
    position: relative;
    animation: rotateX 1s infinite linear;
}

.loader::before {
    content: "";
    border: var(--loader-border-size) solid var(--loader-border-color);
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
    background-color: transparent;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    animation: rotateX 0.5s infinite linear reverse;
}

@keyframes rotateX {
    from {
        transform: rotateZ(0deg);
    }

    to {
        transform: rotateZ(360deg);
    }
}
</style>