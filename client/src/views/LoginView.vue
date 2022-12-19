<template>
  <div id="login" class="main-content form-group">
    <div class="alert alert-danger" role="alert" v-if="errorTxt != ''">
      Fehler beim Login: {{ errorTxt }}
    </div>

    <div class="form-group">
      <label for="exampleInputEmail1">Email adresse</label>
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
    <div class="form-check">
      <input
        type="checkbox"
        class="form-check-input"
        id="remember-me"
        v-model="rememberMe"
      />
      <label class="form-check-label" for="remember-me"
        >Eingeloggt bleiben</label
      >
    </div>
    <br />
    <button type="submit" class="btn btn-primary" @click="login">Submit</button>
    <br />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { userStore } from "../stores/rootStore";

@Component({})
export default class HomeView extends Vue {
  private email = "";
  private password = "";
  private rememberMe = false;
  private errorTxt = "";

  login(): void {
    userStore
      .checkCredentials({
        email: this.email,
        password: this.password,
        rememberUser: this.rememberMe,
      })
      .then(() => {
        this.errorTxt = "";
        // TBD: do something more useful after login
        console.log("welcome " + userStore.user?.displayName);
      })
      .catch((reason) => {
        this.errorTxt = "Fehler beim Login: " + reason.toString();
      });
  }

  // eslint-disable-next-line
  getReturnCode(err: any): number | null {
    if (err.response) {
      if (err.response.status) {
        return err.response.status;
      }
    }
    return null;
  }
}
</script>

<style lang="scss">
@import "../../main.scss";

#login {
  padding: $content-padding;
}
</style>
