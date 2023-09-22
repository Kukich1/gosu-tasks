<template>
  <header>
    <div>
      <img src="../images_and_gifs/tasks1.svg" alt="Что-то пошло не так братик!" />
    </div>

    <div class="container-img">
      <img class="background_container" src="../images_and_gifs/Фон.svg" />
    </div>

    <div class="header-content">
      <div class="name_container">
        <div class="name_img_container">
          <img src="../images_and_gifs/avatar-svgrepo-com.svg" />
        </div>
        <div class="name_text_container">
          <b>{{ Name }}</b>
        </div>
      </div>
      <button @click="exit" class="button_exit">Выйти</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    const Name = localStorage.getItem('name');
    const clearName = Name.replaceAll('"', '');
    return {
      Name: clearName,
    };
  },
  methods: {
    exit() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('name');
      this.$router.push('/');
      this.posts = [];
    },
  },
};
</script>


<style lang="scss" scoped>
* {
  font-family: "Jost", "sans-serif";
}

.header-content {
  width: 15%;
}

.button_exit {
  background-color: #D9D9D9;
  text-align: center;
  width: 100%;
  height: 30px;
  border: 2px solid #7eb0df;
  background-color: white;
  font-size: 100%;
  transition: background-color 0.3s ease;
  border-radius: 3px;
}

.button_exit:hover {
  cursor: pointer;
  border: 2px solid white;
  border-radius: 3px;
  background: #7eb0df;
  color: white;
}

.name_container {
  width: 100%;
  font-size: 20px;
  display: flex;
}

.name_img_container {
  display: flex;
  align-items: center;
  width: 5%;
}

.name_text_container {
  width: 100%;
  text-align: center;
}

/*отсюда начинается верстка на мобильные устройства*/

@media screen and (max-height: 800px) {

}
</style>