<template>
  <div>
    <div class="top-wrapper">
      <div id="app" class="container">
        <div class="topbar d-flex justify-content-between">
          <div class="topbar-left">
            <!-- <nav class="navbar navbar-expand-lg navbar-light">
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
                    <router-link class="nav-link" to="/ingredients"
                      >Ingredients</router-link
                    >
                  </li>
                </ul>
              </div>
            </nav> -->
            <router-link class="navbar-brand" to="/">
              <img src="logo.png" />
            </router-link>
          </div>

          <div class="topbar-right">
            <router-link class="btn nav-button-full" to="/recipes"
              >recipes</router-link
            >
            <router-link class="btn nav-button-outer" to="/recipe-editor"
              >+ add recipe</router-link
            >
          </div>
        </div>
      </div>
      <div class="main-top-background" />
      <div class="main-wrapper">
        <div class="container">
          <router-view />
        </div>
      </div>
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
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.topbar {
  img {
    max-height: 30px;
  }
  margin-top: 20px;
  margin-bottom: 20px;

  .btn {
    border: 2px solid $button-color-main;
    border-radius: 20px;
    min-width: 125px;
    margin-right: 10px;
    color: $button-color-main;
  }

  .btn:hover {
    font-weight: bold;
  }

  .btn.router-link-exact-active {
    background-color: $button-color-main;
    color: white;
  }
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

.top-wrapper {
  background-color: $background-color-top;
}

.main-wrapper {
  background-color: $background-color-main;
}
</style>
