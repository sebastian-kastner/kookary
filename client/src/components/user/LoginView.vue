<template>
  <div
    id="login"
    class="form-group"
    @click.stop
  >
    <div
      v-if="errorTxt != ''"
      class="alert alert-danger"
      role="alert"
    >
      {{ errorTxt }}
    </div>

    <div class="form-group">
      <label for="email">Email adresse</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="form-control"
        placeholder="Email adresse"
      >
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="form-control"
        placeholder="Passwort"
      >
    </div>
    <div class="form-group custom-control-lg custom-control custom-checkbox">
      <input
        id="remember-me"
        v-model="rememberMe"
        type="checkbox"
        class="custom-control-input"
      >
      <label
        class="custom-control-label"
        for="remember-me"
      >
        Eingeloggt bleiben
      </label>
    </div>

    <button
      type="submit"
      class="btn btn-primary"
      @click="login"
    >
      Login
    </button>
    <br>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { userStore } from "../../stores/rootStore";

@Component({})
export default class LoginView extends Vue {
  email = "";
  password = "";
  rememberMe = false;
  errorTxt = "";

  async login(event: Event): Promise<void> {
    // stop propagation. we want to keep the login dropdown open if the login fails
    // if the login succeeds, we will close the dropdown manually
    event.stopPropagation();

    await userStore
      .checkCredentials({
        email: this.email,
        password: this.password,
        rememberUser: this.rememberMe,
      })
      .then(() => {
        this.errorTxt = "";
        // randomly click body element to close dropdown (hacks ftw!)
        document.getElementsByTagName("body")[0].click();
      })
      .catch((reason) => {
        this.errorTxt = reason.toString();
      });
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";

#login {
  padding: $content-padding;
  margin: $content-padding;
  width: 350px;

  // fix to enlarge checkbox, see https://stackoverflow.com/questions/48293920/change-bootstrap-4-checkbox-size
  .custom-control-lg .custom-control-label::before,
  .custom-control-lg .custom-control-label::after {
    top: 0rem !important;
    left: -2rem !important;
    width: 1.5rem !important;
    height: 1.5rem !important;
  }

  .custom-control-lg .custom-control-label {
    margin-left: 0.5rem !important;
    font-size: 1rem !important;
  }
}
</style>
