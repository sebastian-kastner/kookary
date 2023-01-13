<template>
  <div id="app">
    <div class="topbar">
      <div class="d-flex justify-content-between container">
        <div class="topbar-left">
          <router-link class="navbar-brand" to="/"
            >&#129348; kookary</router-link
          >
        </div>

        <div class="topbar-right">
          <router-link class="btn nav-button rounded-button" to="/recipes"
            >recipes</router-link
          >
          <router-link
            v-if="user"
            class="btn nav-button rounded-button"
            to="/recipe-editor"
            >+ add recipe</router-link
          >

          <!-- Login button and login form if user is not logged in -->
          <span
            class="btn dropdown-toggle"
            type="button"
            id="user-dropdown-button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span v-if="user === null">
              <b-icon-box-arrow-in-right /> Login
            </span>
            <span v-else>
              <b-icon-person-circle /> {{ user.displayName }}
            </span>
          </span>
          <div
            class="dropdown-menu user-dropdown"
            aria-labelledby="user-dropdown-button"
          >
            <login-view v-if="user === null" />
            <user-menu v-else />
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-wrapper container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { userStore } from "./stores/rootStore";
import { User } from "./types";
import { UserStore } from "./stores/userStore";
import LoginView from "./components/user/LoginView.vue";
import UserMenu from "./components/user/UserMenu.vue";

@Component({
  components: {
    LoginView,
    UserMenu,
  },
})
export default class App extends Vue {
  get user(): User | null {
    return userStore.user;
  }

  get userStore(): UserStore {
    return userStore;
  }
}
</script>

<style lang="scss">
@import "../main.scss";

#app, .vm--modal {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.topbar {
  padding-top: 20px;
  padding-bottom: 20px;

  position: sticky;
  top: 0;
  background-color: $background-color-main;
  border-bottom: 2px solid $background-color-highlight-1;
  box-shadow: 0 6px 10px $background-color-highlight-1;
  z-index: 10;

  .navbar-brand {
    font-family: Helvetica, Arial, sans-serif;
    font-weight: bold;
    font-size: 20pt;
    color: black;

    a {
      color: black;
    }
  }

  .nav-button {
    min-width: 125px;
    margin-left: 10px;
  }

  .user-dropdown {
    min-width: 250px;

    a {
      height: 3em;

      svg {
        font-size: 1.5em;
        padding-bottom: 3px;
        margin-right: 8px;
      }
    }
  }

  #user-dropdown-button {
    svg {
      font-size: 1.5em;
      padding-bottom: 3px;
    }
  }
}

.main {
  background-image: url("~@/../public/partial_bg.png");
  background-repeat: repeat-x;
  padding-top: 15px;
}

.main-wrapper {
  margin-bottom: 50px;
}
</style>
