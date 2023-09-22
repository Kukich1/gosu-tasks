<template>
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
        <div class="modal" @click="preventClose">
            <div class="inner_modal">
                <div class="title_container">

                    <div class="title_container_text">
                        <div class="title_text_container">
                            <h2>{{ title }}</h2>
                        </div>
                        <div class="form-group">
                            <label for="taskType">Тип задачи: </label>
                            <select v-model="taskType" id="taskType">
                                <option value="default">Обычная задача</option>
                                <option value="question">Вопрос</option>
                            </select>
                        </div>
                        <div class="button_close_container">
                            <button @click="closeModal" class="button_close">X</button>
                        </div>
                    </div>
                    <div class="title_inner_container">
                        <div class="title_description_container">
                            <p>{{ description }}</p>
                        </div>
                        <button @click="saveTask" class="button_save">Сохранить</button>
                    </div>
                </div>

                <div class="input_container">
                    <input v-model="taskTitle" type="text" class="input" placeholder="Название задачи">
                </div>

                <div class="textarea_container">
                    <textarea v-model="taskDescription" class="textarea" placeholder="Описание задачи"></textarea>
                </div>

            </div>

        </div>
    </div>
</template>
  
<script>
export default {
    name: 'Modal',
    props: {
        showModal: Boolean,
        title: String,
        description: String,
    },
    data() {
        return {
            taskTitle: '',
            taskDescription: '',
            taskType: 'default',
        };
    },
    methods: {
        preventClose(event) {
            event.stopPropagation();
        },
        isToday(timestamp) {
            const now = new Date();
            const taskDate = new Date(timestamp * 1000);
            return taskDate.toDateString() === now.toDateString();
        },
        saveTask() {
            const taskData = {
                post_tittle: this.taskTitle,
                post_text: this.taskDescription,
                created_at: this.isToday(Date.now() / 1000),
                type: this.taskType,
            };
            this.$emit('create-task', taskData);
            this.taskTitle = '';
            this.taskDescription = '';
            this.closeModal();
        },
        closeModal() {
            this.$emit('close');
        },
    },
}
</script>
  
<style scoped>
.modal {
    position: fixed;
    width: 52%;
    height: 80%;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 1%;
    box-shadow: 0 0 10px rgb(0, 0, 0, 0.1);
    z-index: 99;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
}

.inner_modal {
    width: 100%;
    height: 100%;
    padding: 3%;
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

.textarea_container {
    padding-top: 2%;
    margin: 2%;
    width: 100%;
    height: 65%;
}

.textarea {
    padding: 2%;
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

.button_container {
    margin: 2%;
    width: 100%;
    height: 15%;
}

.title_container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.title_text_container {
    width: 40%;
}

.title_container_text {
    display: flex;
    width: 100%;
    margin-left: 2%;
    margin-top: 1%;
    font-size: 100%;
}

.title_inner_container {
    padding: 2%;
    display: flex;
}

.title_description_container {
    width: 100%;
}

.form-group {
    width: 50%;
    margin-right: 2%;
    text-align: right;
}

.button_save {
    background: #EAEAEA;
    background: linear-gradient(0deg, #EAEAEA 0%, #DADADA 50%, #EAEAEA 100%);
    margin-left: 5%;
    width: 20%;
    border: 1px solid white;
    border-radius: 4px;
}

.button_save:hover {
    border: 1px solid black;
}

.button_close_container {
    width: 5%;
    height: 30%;
}

.button_close {
    color: white;
    text-align: center;
    width: 100%;
    height: 26px;
    border: 1px solid white;
    border-radius: 5px;
    background-color: rgb(255, 154, 154);
}

.button_close:hover {
    background-color: red;
}</style>