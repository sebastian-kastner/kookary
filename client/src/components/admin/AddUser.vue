<template>
  <div class="container">
    <h3>Benutzer hinzufügen</h3>

    <form>
      <div class="form-group">
        <label for="email">eMail</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          placeholder="eMail"
        />
      </div>
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="displayname"
          type="text"
          class="form-control"
          placeholder="name"
        />
      </div>
      <div class="form-group">
        <label for="new-password">Passwort</label>
        <input
          id="new-password"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Neues Passwort"
          @keyup="pwCompare"
        />
      </div>

      <div class="form-group">
        <label for="new-password-repeated">Neues Passwort wiederholen</label>
        <input
          id="new-password-repeated"
          v-model="passwordRepeated"
          type="password"
          class="form-control"
          placeholder="Passwort wiederholung"
          @keyup="pwCompare"
        />
      </div>
      <div v-if="warningTxt != ''" class="alert alert-warning" warning="alert">
        {{ warningTxt }}
      </div>
      <div v-if="errorTxt != ''" class="alert alert-error" warning="alert">
        {{ errorTxt }}
      </div>

      <button
        type="submit"
        class="btn btn-primary"
        :disabled="password != passwordRepeated"
        @click="createUser"
      >
        Hinzufügen
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { UserClient } from "../../clients/UserClient";
import { User } from "../../types";

@Component({})
export default class UserEditor extends Vue {
  private userClient = new UserClient();

  @Prop({ required: true })
  private userAddedCallback!: (addedUser: User) => void;

  email = "";
  displayname = "";
  password = "";
  passwordRepeated = "";

  warningTxt = "";
  errorTxt = "";

  pwCompare(): void {
    if (
      this.password != "" &&
      this.passwordRepeated != "" &&
      this.password !== this.passwordRepeated
    ) {
      this.warningTxt = "Die Passwörter stimmen nicht überein.";
    } else {
      this.warningTxt = "";
    }
  }

  createUser(): void {
    this.errorTxt = "";

    if (this.email === "") {
      this.errorTxt = "Eine eMail Adresse muss angegeben werden!";
      return;
    }
    if (this.displayname === "") {
      this.errorTxt = "Ein Benutzername muss angegeben werden!";
      return;
    }
    if (this.password === "") {
      this.errorTxt = "Ein Passwort muss angegeben werden!";
      return;
    }

    this.userClient
      .createUser(this.email, this.displayname, this.password)
      .then((user) => {
        this.userAddedCallback(user);
        // this.$modal.hideAll();
      });
  }
}
</script>
