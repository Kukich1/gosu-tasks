<template>
  <div class="modal-overlay" v-if="showCardsModal">
      <div class="modal">

          <div class="title_container">
              
              <div class="title_container_text">
                  <h2>{{ title }}</h2>
              </div>    
              <div class="form-group">
                  <label for="taskType">Тип задачи:</label>
                  <select v-model="taskType" id="taskType">
                    <option value="default">Обычная задача</option>
                    <option value="question">Вопрос</option>
                  </select>
              </div>
              <div class="button_close_container">
                  <button @click="closeCardsModal()" class="button_close">X</button>
              </div>
                             
          </div>
          
          <div class="input_container">
              <input v-model="taskTitle" type="text" class="input" placeholder="Название задачи">
          </div>
          <div class="taskarea_container">
              <textarea v-model="taskDescription" class="taskarea" placeholder="Описание задачи"></textarea>
          </div>
          <div class="button_container">
              <button @click="saveTask" class="button_save" >Сохранить</button>
          </div>

      </div>
  </div>
</template>

<script>
export default {
  name: 'show-cards-modal',
  props: {
      showCardsModal: Boolean,
      title: String,
      description: String,
  },
  data() {
      return {
          taskTitle: '',
          taskDescription: '',
          taskType: 'default',
          cardType: "",
          cardText: "",
      };
  },
  methods: {
    closeCardsModal() {
          this.$emit('close');
          console.log(this.showCardsModal)
      },
      isToday(timestamp) {
      const now = new Date();
      const taskDate = new Date(timestamp * 1000);
      return taskDate.toDateString() === now.toDateString();
  },
  saveTask() {
      const changTaskData = {
          post_tittle: this.taskTitle,
          post_text: this.taskDescription,
          created_at: this.isToday(Date.now() / 1000),
          type: this.taskType,
      };
      this.$emit('chang-task', changTaskData);
      this.taskTitle = '';
      this.taskDescription = '';
      this.closeCardsModal();
      },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  width: 52%;
  height: 80%;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 1%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 99;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.modal-overlay {
  position: fixed;
}
.input_container {
  margin: 2%;
  width: 100%;
  height: 10%;
}
.input {
  font-size: 100%;
  display: flex;
  flex-direction: column;
  width: 96%;
  height: 100%;
  border-radius: 4px;
  border: 1px solid #aaaaaa;
  background: #F3F4F8;
  text-indent: 15px;
}

.input:hover {
  background-color: #dddddd;
}
.taskarea_container {
  margin: 2%;
  width: 100%;
  height: 56%;
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
.button_container {
  margin: 2%;
  width: 100%;
  height: 15%;
}
.button_save {
  width: 96%;
  height: 100%;
  padding: 14px 125px;
  gap: 10px;
  border-radius: 4px;
  border-color: #65B2F0;
  background: #65B2F0;
  color: #FFF;
  text-align: center;
  font-size: 150%;
  font-style: normal;
  line-height: normal;
  font-weight: 700;
  font-family: 'Bestorika', sans-serif;
}

.button_save:hover {
  background-color: #2a96ee;
}

.title_container {
  display: flex;
}

.title_container_text {
  width: 93%;
  margin-left: 2%;
  margin-top: 1%;
  font-size: 100%; 
}

.button_close_container {
  display: flex;
  margin: 1%;
  width: 10%;
  height: 20%;
  justify-content: flex-end;
}

.button_close { 
  width: 70%;
  height: 100%;    
  background-color: lightcoral;
  border: 1px solid rgba(0, 0, 0, 0);
  color: white;  
  border-radius: 5; 
}

.button_close:hover {
  background-color: red;
  color: white;
}
</style>