<template>
  <div class="modal-container" v-if="showCardsModal" @click="closeChangTaskModal">
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
          <div class="type_select_form" v-if="isEditing && selectedPost.type !== 'question'">
            <label for="type">Выберите тип:</label>
            <select :value="localPostType" id="type" @change="updatePostType">
              <option value="default">Default</option>
              <option value="question">Question</option>
            </select>
          </div>
          <div v-else-if="isEditing">
            <p>Изменение типа для постов в категории "Вопросы" недоступно.</p>
          </div>
          <div class="button_close_container">
            <button @click="closeChangTaskModal" class="button_close">X</button>
          </div>
        </div>

        <div class="input_container">
          <img class="segment_image" src="../../images_and_gifs/segment.svg" />
          <div class="input_title_container">
            <h2>Описание</h2>
          </div>

          <div class="change_button_container">
            <button v-if="!isEditing" @click="editPost" class="change_button">
              <img src="../../images_and_gifs/change.svg" /> Изменить
            </button>
            <button v-else @click="savePost" class="button_save">Сохранить</button>
            <button @click="deleteTask" class="button_delete">Удалить</button>
          </div>

        </div>
        <div class="taskarea_container">
          <textarea class="taskarea" :disabled="isLoading || !isEditing" @input="updateEditedText"
            @keydown="handleCtrlEnterKey"
            :value="isEditing ? editedText : (selectedPost ? selectedPost.post_text : '')"></textarea>
        </div>

        <div class="comment_container">
          <div class="comment_title">
              <div class="comment_title_image_container">
                  <img src="../../images_and_gifs/comments.svg"/>
              </div>
              <div class="comment_container_text">
                  <h2>Комментарии</h2>
              </div>  
          </div>
          <div class="comments" v-if="selectedPost.comments && selectedPost.comments.length > 0">
            <ul>
              <li class="comment" v-for="(comment, index) in selectedPost.comments" :key="index">
                <p>{{ comment  }}</p>
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
name: 'CardsModal',
props: {
  showCardsModal: Boolean,
  selectedPost: Object,
  fetchTasks: Function,
  columnTitle: String,
  postDataType: String,
},
data() {
  return {
    isEditing: false,
    editedText: '',
    isLoading: false,
    postType: '',
    changTask: '',
    localPostType: this.postType,
    changTask: null,
    comments: null,
  };
},
methods: {
  preventClose(event) {
    event.stopPropagation();
  },
  updatePostType(event) {
    const selectedValue = event.target.value;
    this.localPostType = selectedValue;
  },
  editPost() {
    this.isEditing = true
    this.localPostType = this.postType;
    if (this.isEditing) {
      this.editedText = this.selectedPost.post_text;
    }
  },
  async savePost() {
    this.isLoading = true;
    console.log("Сохранение данных:", this.editedText);
    const changTextTaskData = {
      post_text: this.editedText,
    };
    console.log("Измененый тип:", this.localPostType);
    const changTypeTaskData = {
      type: this.localPostType,
    }
    try {
      if (this.selectedPost) {
        const response = await this.changTaskText(changTextTaskData);
        console.log("Ответ от сервера:", response);
        const response1 = await this.changTaskType(changTypeTaskData);
        console.log('Карточка успешно изменена:', response.data, response1.data);
        this.$emit('update:postType', this.localPostType);
      } else {
        console.error('Выбранная карточка не определена.');
      }
    } catch (error) {
      console.error('Произошла ошибка при изменении карточки:', error);
    } finally {
      this.isLoading = false;
    }
    if (this.selectedPost) {
      this.selectedPost.post_text = this.editedText;
    }
    this.editedText = '';
    this.isEditing = false
  },
  async changTaskText(changTextTaskData) {
    try {
      const token = localStorage.getItem("token");
      const cleanToken = token.replaceAll("\"", "");
      const config = {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
        }
      };
      const response = await axios.put
        (`https://gosutasks-api.vercel.app/user/change_post/${this.selectedPost.id}`,
          changTextTaskData, config);
      await this.fetchTasks();
    } catch {
      const refresh_token = localStorage.getItem("refresh_token");
      const clearRef = refresh_token.replaceAll("\"", "");
      const config2 = {
        headers: {
          'Authorization': `Bearer ${clearRef}`,
        },
      };
      const response1 = await axios.post('https://gosutasks-api.vercel.app/token/refresh/', undefined, config2);
      localStorage.removeItem("token")
      localStorage.setItem("token", JSON.stringify(response1.data.access_token));
      const token = localStorage.getItem("token");
      const cleanToken = token.replaceAll("\"", "");
      const config = {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
        },
      };
      const response = await axios.put(`https://gosutasks-api.vercel.app/user/change_post/${this.selectedPost.id}`, changTextTaskData, config);
      await this.fetchTasks();
    }
  },
  async changTaskType(changTypeTaskData) {
    try {
      const token = localStorage.getItem("token");
      console.log(changTypeTaskData)
      const cleanToken = token.replaceAll("\"", "");
      const config = {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
        }
      };
      const response = await axios.put
        (`https://gosutasks-api.vercel.app/user/change_type_post/${this.selectedPost.id}`,
          changTypeTaskData, config);
      await this.fetchTasks();
    } catch {
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
      const response = await axios.put
        (`https://gosutasks-api.vercel.app/user/change_type_post/${this.selectedPost.id}`,
          changTypeTaskData, config);
      await this.fetchTasks();
    }
  },
  deleteTask() {
    this.$emit('delete-task', this.selectedPost);
    this.closeChangTaskModal();
  },
  updateEditedText(event) {
    this.editedText = event.target.value;
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
height: 80%;
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

.modal-container {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
display: flex;
justify-content: center;
align-items: center;
z-index: 100;
background-color: rgba(0, 0, 0, 0.01);
}
.loading {
pointer-events: none; 
}
.input_container {
margin: 2%;
width: 100%;
height: 10%;
}

.space_dashboard_image {
width: 3%;
}

.segment_image {
width: 4%;
}

.taskarea_container {
margin: 2%;
width: 100%;
height: 35%;
}

.taskarea {
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

.taskarea:hover {
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
padding-bottom: 1.5%;
height: 3em;
}

.comment_title_image_container {
display: flex;
align-items: center;
}

.comment_container_text {
padding-left: 2%;
}

.comments {
  width: 100%;
  height: 6em;
  padding-left: 5%;
  overflow-y: auto;
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
margin-top: 1%;
font-size: 100%;
}

.button_close_container {
margin: 1%;
margin-left: 2%;
width: 5%;
height: 30%;
}

.button_close {
color: white;
text-align: center;
width: 90%;
height: 26px;
border: 1px solid rgba(0, 0, 0, 0);
border-radius: 5px;
background-color: rgb(255, 154, 154);
}

.button_close:hover {
background-color: red;
color: white;
}

.input_container {
display: flex;
width: 100%;
}

.input_title_container {
width: 30%;
margin: 1%;
}

.change_button_container {
margin-top: 2%;
width: 60%;
height: 100%;
display: flex;
}

.change_button {
background: #EAEAEA;
background: linear-gradient(0deg, #EAEAEA 0%, #DADADA 50%, #EAEAEA 100%);
width: 100%;
height: 50%;
border: 1px solid white;
border-radius: 4px;
}

.change_button:hover {
border: 1px solid black;
}

.button_delete {
background: #EAEAEA;
background: linear-gradient(0deg, #EAEAEA 0%, #DADADA 50%, #EAEAEA 100%);
margin-left: 5%;
width: 100%;
height: 50%;
border: 1px solid white;
border-radius: 4px;
}

.button_delete:hover {
border: 1px solid black;
}

.button_save {
background: #EAEAEA;
background: linear-gradient(0deg, #EAEAEA 0%, #DADADA 50%, #EAEAEA 100%);
margin-left: 5%;
width: 100%;
height: 50%;
border: 1px solid white;
border-radius: 4px;
}

.button_save:hover {
border: 1px solid black;
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
position: fixed;
top: 0;
left: 0;
z-index: 101;
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
}</style>