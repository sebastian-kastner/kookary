<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light">
      <a class="navbar-brand" href="/">
        <img src="logo.png"/>
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/recipes">Recipes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/recipe-editor">Add recipe</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ingredients">Ingredients</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default class App extends Vue {}
</script>

<style lang="scss">

@import "../main.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.navbar {
  background-color: $medium-green;
  img {
    max-height: 30px;
  }
  margin-bottom: 20px;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: $gray !important;

    &.router-link-exact-active {
      color: lighten($gray, 25%) !important;
    }
  }
}
</style>
