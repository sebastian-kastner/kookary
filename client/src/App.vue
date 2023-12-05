<template>
  <div id="app">
    <ModalsContainer />

    <div class="topbar">
      <div class="d-flex justify-content-between align-items-center container">
        <div class="topbar-left d-flex d-flex-grow-1">
          <!-- burger menu; only visible on screens smaller than large -->
          <div class="d-lg-none">
            <span
              id="burger-menu"
              class="btn"
              data-bs-toggle="dropdown"
              data-bs-target="#burgerMenuDropdownTarget"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Icon icon="burgerMenu" />
            </span>
            <div
              id="burgerMenuDropdownTarget"
              class="dropdown-menu"
              aria-labelledby="burger-menu"
            >
              <router-link
                v-for="navItem in navItems"
                :key="navItem.name"
                class="dropdown-item d-flex align-items-center"
                :to="navItem.to"
              >
                <Icon :icon="navItem.icon" />
                <component :is="navItem.icon" />{{ navItem.name }}
              </router-link>
            </div>
          </div>

          <!-- brand; hidden on small and below if search is active -->
          <router-link class="navbar-brand" :class="{ 'd-none d-sm-block': searchActive }" to="/">
            &#129348; kookary
          </router-link>
        </div>
        
        <!-- nav items in middle; only visible on large screens; hidden on medium as well if search is active -->
        <div v-if="!searchActive" class="d-none d-lg-block">
          <router-link
            v-for="navItem in navItems"
            :key="navItem.name"
            :to="navItem.to"
            class="nav-button"
          >
            {{ navItem.name }}
          </router-link>
        </div>

        <div class="topbar-right d-flex">
          <div v-if="searchActive" class="input-group">
            <div class="input-group-prepend">
              <span 
                id="search-cancellation"
                class="btn"
                @click="cancelSearch"
              >
                <Icon icon="xCircle" />
              </span>
            </div>
            <input
              ref="searchinput"
              v-model="searchTerm"
              type="text"
              class="form-control"
              @keyup.enter.prevent="executeSearch"
            />
          </div>
          <span
            id="search-activator"  
            class="btn"
            @click="searchClicked"
          >
            <Icon icon="search" />
          </span>

          <!-- login and user menu; hidden on small and below if search is active -->
          <div :class="{ 'd-none d-md-block': searchActive }">
            <!-- Login button and login form if user is not logged in -->
            <span
              id="user-dropdown-button"
              class="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-target="#userDropdownTarget"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span v-if="user === null">
                <Icon icon="boxArrowInRight" /> Login
              </span>
              <span v-else>
                <Icon icon="personCircle" /> {{ user.displayName }}
              </span>
            </span>
            <div
              id="userDropdownTarget"
              class="dropdown-menu"
              aria-labelledby="user-dropdown-button"
            >
              <login-view v-if="user === null" />
              <user-menu v-else />
            </div>
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
import { Options, Vue } from "vue-class-component";
import { ModalsContainer } from "vue-final-modal";
import "vue-final-modal/style.css";
import "bootstrap";
import { userStore } from "./stores/rootStore";
import { User } from "./types";
import { UserStore } from "./stores/userStore";
import LoginView from "./components/user/LoginView.vue";
import UserMenu from "./components/user/UserMenu.vue";
import { Icon } from "@iconify/vue/dist/offline";
import listOlIcon from "@iconify-icons/bi/list-ol";
import plusCircleIcon from "@iconify-icons/bi/plus-circle";
import calendarWeekIcon from "@iconify-icons/bi/calendar-week";

export type NavItem = {
  name: string;
  to: string;
  icon: unknown;
};
@Options({
  components: {
    LoginView,
    UserMenu,
    Icon,
    ModalsContainer,
  },
})
export default class App extends Vue {
  searchActive = false;
  searchTerm = "";

  get user(): User | null {
    return userStore.user;
  }

  get userStore(): UserStore {
    return userStore;
  }

  get navItems(): NavItem[] {
    const items: NavItem[] = [];
    items.push({
      icon: listOlIcon,
      name: "Rezepte",
      to: "/recipes",
    });
    if (this.user) {
      items.push({
        icon: plusCircleIcon,
        name: "Neues Rezept",
        to: "/user/new-recipe",
      });
    }
    items.push({
      icon: calendarWeekIcon,
      name: "Saisonkalender",
      to: "/calendar",
    });
    return items;
  }

  searchClicked(): void {
    if (this.searchActive) {
      this.executeSearch();
    } else {
      this.searchActive = true;
      // wait for search input to be displayed and focus
      this.$nextTick(() => {
        this.focusSearchField();
      });
    }
  }

  focusSearchField(): void {
    const searchInput = this.$refs.searchinput;
    if (searchInput && searchInput instanceof HTMLInputElement) {
      searchInput.focus();
    }
  }

  cancelSearch(): void {
    this.searchTerm = "";
    this.searchActive = false;
  }

  executeSearch(): void {
    if (this.searchTerm != "") {
      this.$router.push(`/recipes?name=${this.searchTerm}`);
      this.cancelSearch();
    } else {
      this.focusSearchField();
    }
  }
}
</script>

<style lang="scss">
@import "styles/custom.scss";
@import "styles/main.scss";
@import "styles/variables.scss";

body {
  overflow-x: hidden;
}

#app,
.vm--modal {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// this prevents the layout from jumping if the scrollbar appears
#app {
  width: 100vw;
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
    color: $link-color-main;
    padding: 0 5px 10px 5px;
  }

  .nav-button:hover {
    text-decoration: none;
  }

  .nav-button.router-link-active {
    border-bottom: 2px solid $button-color-main;
    text-decoration: none;
  }

  .dropdown-menu {
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

  svg {
    font-size: 1.5em;
    padding-bottom: 3px;
  }

  .input-group-text {
    border-radius: 10px 0 0 10px;
  }

  #search-cancellation {
    background-color: $background-color-highlight-1;
    border-radius: 10px 0 0 10px;
  }

}

.main {
  background-image: url("~@/../../partial_bg.png");
  background-repeat: repeat-x;
  padding-top: 15px;
}

.main-wrapper {
  margin-bottom: 50px;
}
</style>
