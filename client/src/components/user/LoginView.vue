<template>
  <div id="login" @click.stop class="form-group">
    <div class="alert alert-danger" role="alert" v-if="errorTxt != ''">
      {{ errorTxt }}
    </div>

    <div class="form-group">
      <label for="email">Email adresse</label>
      <input
        type="email"
        class="form-control"
        id="email"
        placeholder="Email adresse"
        v-model="email"
      />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        class="form-control"
        id="password"
        placeholder="Passwort"
        v-model="password"
      />
    </div>
    <div class="form-group custom-control-lg custom-control custom-checkbox">
      <input
        type="checkbox"
        class="custom-control-input"
        id="remember-me"
        v-model="rememberMe"
      />
      <label class="custom-control-label" for="remember-me">
        Eingeloggt bleiben
      </label>
    </div>

    <button type="submit" class="btn btn-primary" @click="login">Login</button>
    <br />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { userStore } from "../../stores/rootStore";

@Component({})
export default class LoginView extends Vue {
  private email = "";
  private password = "";
  private rememberMe = false;
  private errorTxt = "";

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
