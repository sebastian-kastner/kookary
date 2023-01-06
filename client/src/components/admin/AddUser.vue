<template>
  <div class="container">
    <h3>Benutzer hinzufügen</h3>

    <form>
      <div class="form-group">
        <label for="email">eMail</label>
        <input type="email" class="form-control" id="email" placeholder="eMail" v-model="email" />
      </div>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" placeholder="name" v-model="displayname" />
      </div>
      <div class="form-group">
        <label for="new-password">Passwort</label>
        <input v-on:keyup="pwCompare" type="password" class="form-control" id="new-password"
          placeholder="Neues Passwort" v-model="password"/>
      </div>

      <div class="form-group">
        <label for="new-password-repeated">Neues Passwort wiederholen</label>
        <input v-on:keyup="pwCompare" type="password" class="form-control" id="new-password-repeated"
          placeholder="Passwort wiederholung" v-model="passwordRepeated"/>
      </div>
      <div v-if="warningTxt != ''" class="alert alert-warning" warning="alert">
        {{ warningTxt }}
      </div>
      <div v-if="errorTxt != ''" class="alert alert-error" warning="alert">
        {{ errorTxt }}
      </div>

      <button type="submit" class="btn btn-primary" :disabled="password != passwordRepeated" @click="createUser">Hinzufügen</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserClient } from "../../clients/UserClient"
import { User } from "../../types"

@Component({})
export default class UserEditor extends Vue {
  private userClient = new UserClient();

  @Prop({required: true })
  private userAddedCallback!: (addedUser: User) => void

  email = "";
  displayname = "";
  password = "";
  passwordRepeated = "";

  warningTxt = "";
  errorTxt = "";

  pwCompare(): void {
    if (this.password != "" && this.passwordRepeated != "" && this.password !== this.passwordRepeated) {
      this.warningTxt = "Die Passwörter stimmen nicht überein."
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

    this.userClient.createUser(this.email, this.displayname, this.password)
      .then((user) => {
        this.userAddedCallback(user);
        this.$modal.hideAll();
      })
      .catch((err) => {
        // do something useful!
      });
  }
}
</script>
