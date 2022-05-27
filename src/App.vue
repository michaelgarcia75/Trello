<template>
  <div class="header"></div>
  <router-view />
</template>

<style>
#app {
  font-family: Copperplate Gothic Light, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: url("../src/assets/image.jpg") no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
}

.header {
  height: 50px;
}
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
