<template>
  <div class="wrapper">
    <div class="left">
      <div v-show="isLoading === false" class="logo-container">
        <img src="../images_and_gifs/tasks.svg" alt="Что-то пошло не так братик!" />
      </div>
      <div v-if="isLoading === true" class="container">
        <main>
          <span class="loader"></span>
        </main>
      </div>
      <div v-else class="container-form">
        <form @submit.prevent>
          <div class="form-group">
            <input
            v-model.trim="username"
            id="login"
            type="text"
            name="login"
            placeholder="Логин"
            :class="{ 'is-invalid': usernameError }"
            @focus="usernameError = ''"
              >
          <div class="error-message" :class="{ 'error-active': usernameError }">{{ usernameError }}</div>
        </div>

          <div class="form-group">
            <input
            v-model.trim="password"
            id="password"
            type="password"
            name="password"
            placeholder="Пароль"
            :class="{ 'is-invalid': passwordError }"
            @focus="passwordError = ''">
            <div class="error-message" :class="{ 'error-active': passwordError }">{{ passwordError }}</div>
        </div>


          <div class="form-group">
              <button @click.prevent="onSubmit" class="btn btn-white btn-animate" :disabled="isSubmitting">
                Войти
              </button>
          </div>
        </form>
      </div>
    </div>
    <div class="right"><img src="../images_and_gifs/resource.png" /></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyLogin',
  data() {
    return {
      username: '',
      password: '',
      isButtonDisabled: false,
      isLoading: false,
      usernameError: '',
      passwordError: '',
    };
  },

  methods: {
    async onSubmit() {
      this.usernameError = '';
      this.passwordError = '';

      if (!this.username || !this.password) {
        if (!this.username) { 
          this.usernameError = 'Username is required';
        }
        if (!this.password) {
          this.passwordError = 'Password is required';
        }
        return;
      }


      this.isButtonDisabled = true;
      try {
        this.isLoading = true
        const postData = {
          username: this.username,
          password: this.password,
        }
        const response = await axios.post('https://gosutasks-api.vercel.app/auth/login/', postData)
        console.log
        localStorage.setItem("token", JSON.stringify(response.data.access_token))
        localStorage.setItem("refresh_token", JSON.stringify(response.data.refresh_token))
        localStorage.setItem("role", JSON.stringify(response.data.role))
        localStorage.setItem("name", JSON.stringify(response.data.name))
        

        console.log("localstorage token :", localStorage.getItem("token"))
        console.log("localstorage refresh_token:", localStorage.getItem("refresh_token"))
        console.log("localstorage role :", localStorage.getItem("role"))
        

        const tokenData = response.data;
        if (tokenData.access_token && tokenData.role === 0) {
          this.$router.push('/mainpage');
        }
        else if (tokenData.access_token && tokenData.role === 1) {
          this.$router.push('/admin');
        } 
        else {
          this.usernameError = 'Invalid username or password';
        }
        } catch (e){
          console.error(e);
          alert("An error occurred");
        }
        finally {
          this.isLoading = false;
          this.isButtonDisabled = false;
        }
    },
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0 0;
  box-sizing: border-box;
}

body,
html {
  background-image: url('../images_and_gifs/resource.png');
  background-repeat: no-repeat;
  background-position: center right;
  background-attachment: fixed;
  overflow: hidden;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  justify-content: space-between;
  overflow: hidden;
  margin: 0 auto;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75vw;
}

.container img {
  width: 100px;
}

.left {
  display: flex;
  flex-direction: column;
  max-width: 357px;
  height: 100;
  align-items: center;
  margin-left: 20vh;
  align-items: flex-start;
}

.right img {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 647px;
  height: 1024px;
  margin-right: -10vh;
}

.form-group {
  margin-top: 20px;
  margin-bottom: 20px;
}

input {
  width: 357px;
  height: 70px;
  border-radius: 4px;
  border: 1px solid #D9DADF;
  background: #F3F4F8;
  text-indent: 15px;
}

.circle {
  border-radius: 50%;
  background: transparent;
  border: 10px solid white;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
}

.is-invalid {
  border-color: red;
  color: red;
  background-color: #F3F4F8;
}
.error-active {
  color: red;
}
.error-message{
  margin-top: 2vh;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.loader {
  --loader-size: 80px;
  --loader-border-size: 5px;
  --loader-border-color: black;
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
  content:"";
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


.btn {
  width: 100%;
  height: 11vh;
  border-radius: 4px;
  background-color: #65B2F0;
  color: white;
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 0em;
  text-align: center;
  border: 1px solid white;
}
.btn:hover {
  background-color: #35B2F0 ;
}
</style>