<template>
  <div id="user-menu">
    <router-link
      class="dropdown-item d-flex align-items-center"
      to="/user/shopping-list"
    >
      <Icon icon="basket" /> Einkaufsliste
    </router-link>

    <div v-if="isAdmin">
      <div class="dropdown-divider" />
      <router-link
        v-if="isAdmin"
        class="dropdown-item d-flex align-items-center"
        to="/admin/users"
      >
        <Icon icon="people" /> Benutzerverwaltung
      </router-link>

      <router-link
        v-if="isAdmin"
        class="dropdown-item d-flex align-items-center"
        to="/admin/ingredients"
      >
        <Icon icon="bag" /> Zutatenverwaltung
      </router-link>

      <router-link
        v-if="isAdmin"
        class="dropdown-item d-flex align-items-center"
        to="/admin/seasonality"
      >
        <Icon icon="calendarWeek" /> Saisonalität
      </router-link>
    </div>

    <div class="dropdown-divider" />

    <a
      class="dropdown-item d-flex align-items-center"
      @click.stop="togglePrivateMode"
    >
      <div class="row">
        <div class="col d-flex justify-content-start">
          <Icon icon="people" /> Privater Modus
        </div>
        <div class="col d-flex justify-content-end private-toggle">
          <Icon v-if="isPrivateMode" icon="toggleOn" class="active" />
          <Icon v-else icon="toggleOff" class="inactive" />
        </div>
      </div>
    </a>

    <router-link
      class="dropdown-item d-flex align-items-center"
      to="/user/account"
    >
      <Icon icon="person" /> Benutzerkonto
    </router-link>

    <a href="#" class="dropdown-item d-flex align-items-center" @click="logout">
      <Icon icon="boxArrowInLeft" /> Logout
    </a>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { userStore } from "../../stores/rootStore";
import { Icon } from "@iconify/vue/dist/offline";

@Component({ components: { Icon } })
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
@import "../../styles/variables.scss";

.private-toggle svg.active {
  color: $button-color-main;
}
</style>
