<template>
    <div class="cards">
        <div class="column_yesterday">
            <div class="column_header">
                <h2>Итоги вчерашнего дня</h2>
            </div>
            <div class="item" v-for="(post, id) in posts" :key="id">
                <div @click="openCardModal(post)" class="card_yesterday"
                    v-if="post.type === 'default' && isYesterday(post.created_at)">
                    <strong class="post_title">{{ post.post_tittle }}</strong>
                </div>
                <CardsModal :showCardsModal="isChangTaskModalVisible" 
                :selectedPost="selectedPost"
                :isEditing="showSaveButton" 
                title="Подробная информация о карточке" 
                @close="closeChangTaskModal"
                @chang-task="changTask" 
                @delete-task="deleteTaskHandler"
                ></CardsModal>
            </div>
        </div>

        <div class="column_today">
            <div class="column_header">
                <h2>Задачи на сегодня</h2>
            </div>
            <div class="item" v-for="(post, id) in posts" :key="id">
                <div @click="openCardModal(post)" class="card_today"
                    v-if="post.type === 'default' && isToday(post.created_at)">
                    <strong class="post_title">{{ post.post_tittle }}</strong>
                </div>
                <CardsModal :showCardsModal="isChangTaskModalVisible" 
                :selectedPost="selectedPost"
                :isEditing="showSaveButton" 
                title="Подробная информация о карточке" 
                @close="closeChangTaskModal"
                @chang-task="changTask" 
                @delete-task="deleteTaskHandler"
                ></CardsModal>
            </div>
        </div>

        <div class="column_question">
            <div class="column_header">
                <h2>Вопросы и трудности</h2>
            </div>

            <div class="item" v-for="(post, id) in posts" :key="id">
                <div @click="openCardModal(post)" class="card_question" v-if="post.type === 'question'">
                    <strong class="post_title">{{ post.post_tittle }}</strong>
                </div>
                <CardsModal :showCardsModal="isChangTaskModalVisible" 
                :selectedPost="selectedPost"
                :isEditing="showSaveButton" 
                title="Подробная информация о карточке" 
                @close="closeChangTaskModal"
                @chang-task="changTask" 
                @delete-task="deleteTaskHandler"
                ></CardsModal>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'GetList',
        
    }
</script>

<style lang="scss" scoped>

</style>