<template>
  <div id="user-menu">
    <router-link
      class="dropdown-item d-flex align-items-center"
      to="/user/shopping-list"
    >
      <b-icon-basket /> Einkaufsliste
    </router-link>

    <div v-if="isAdmin">
      <div class="dropdown-divider"></div>
      <router-link
        v-if="isAdmin"
        class="dropdown-item d-flex align-items-center"
        to="/admin/users"
      >
        <b-icon-people /> Benutzerverwaltung
      </router-link>

      <router-link
        v-if="isAdmin"
        class="dropdown-item d-flex align-items-center"
        to="/admin/ingredients"
      >
        <b-icon-bag /> Zutatenverwaltung
      </router-link>
    </div>

    <div class="dropdown-divider"></div>

    <a
      class="dropdown-item d-flex align-items-center"
      @click.stop="togglePrivateMode"
    >
      <div class="row">
        <div class="col d-flex justify-content-start">
          <b-icon-people /> Privater Modus
        </div>
        <div class="col d-flex justify-content-end private-toggle">
          <b-icon-toggle-on class="active" v-if="isPrivateMode" />
          <b-icon-toggle-off class="inactive" v-else />
        </div>
      </div>
    </a>

    <router-link
      class="dropdown-item d-flex align-items-center"
      to="/user/account"
    >
      <b-icon-person /> Benutzerkonto
    </router-link>

    <a href="#" class="dropdown-item d-flex align-items-center" @click="logout">
      <b-icon-box-arrow-in-left /> Logout
    </a>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { userStore } from "../../stores/rootStore";

@Options({})
export default class UserMenu extends Vue {
  get isAdmin(): boolean {
    return userStore.userIsAdmin;
  }

  get isPrivateMode(): boolean {
    return userStore.privateMode;
  }

  logout(): void {
    userStore.logout();
    if (this.$route.path.startsWith("/user")) {
      this.$router.push({ path: "/" });
    }
  }

  togglePrivateMode(): void {
    userStore.togglePrivateMode();
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";

.private-toggle svg.active {
  color: $button-color-main;
}
</style>
