<template>
  <div id="recipe-view" class="container main-content">
    <div id="top-icons" class="row justify-content-end">
      <button
        v-if="isEditable"
        class="rounded-button"
        v-on:click="deleteRecipe"
      >
        <b-icon-trash />
      </button>

      <div v-if="isEditable">
        <router-link
          :to="{
            path: '/user/recipe-editor',
            query: { recipeId: recipe.recipeId },
          }"
          custom
          v-slot="{ navigate }"
        >
          <button @click="navigate" role="link" class="rounded-button">
            <b-icon-pencil />
          </button>
        </router-link>
      </div>

      <button
        v-if="loggedInUserId"
        class="rounded-button"
        v-on:click="addCookup"
      >
        <b-icon-calendar-week />
      </button>

      <button
        v-if="loggedInUserId"
        :disabled="favouriteId === null"
        class="rounded-button"
        :class="{ active: isMarked }"
        v-on:click="toggleMarked"
      >
        <b-icon-bell-fill v-if="isMarked" />
        <b-icon-bell v-else />
      </button>
    </div>

    <div class="recipe-image row" v-if="recipeImgSrc">
      <div>
        <img :src="recipeImgSrc" />
      </div>
    </div>

    <div id="recipe-description">
      <div class="tags row">
        <div
          v-for="item in recipe.tags"
          class="inline-item-list-element"
          v-bind:key="item.uuid"
        >
          <router-link :to="{ path: '/recipes', query: { tags: item.tagId } }">
            {{ item.name }}
          </router-link>
        </div>
      </div>

      <div class="row">
        <h1>{{ recipe.name }}</h1>
      </div>

      <div class="row">
        <h4>ZUTATEN</h4>
        <div class="col">
          <button
            v-if="loggedInUserId"
            class="rounded-button"
            v-on:click="addIngredientsToShoppingList"
          >
            <b-icon-bag />
          </button>
        </div>
      </div>

      <div class="row" v-if="showServingsForm">
        <div class="form-group form-inline">
          Für
          <input
            type="number"
            class="form-control mx-sm-1 servings-input"
            v-model.number="internalServings"
            @input="setQuanitityFactor"
          />
          Personen
        </div>
      </div>

      <div class="row">
        <ul>
          <recipe-ingredient-list-item
            v-for="ingredient in recipe.ingredients"
            v-bind:key="ingredient.uuid"
            :ingredient="ingredient"
            :quantityFactor="quantityFactor"
          />
        </ul>
      </div>

      <div class="row">
        <h4>ZUBEREITUNG</h4>
      </div>

      <div class="row" v-html="description" />

      <div class="row">
        <h4>QUELLE</h4>
      </div>
      <div class="row">
        <a v-if="sourceLink !== null" :href="sourceLink" target="_blank">
          {{ recipe.source }}
        </a>
        <p v-else>
          {{ recipe.source }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-facing-decorator";
import { Recipe, recipeFactory, Cookup, User } from "../types";
import { RecipesClient } from "../clients/RecipesClient";
import { UserRecipeFavouritesClient } from "../clients/UserRecipeFavouritesClient";
import { marked } from "marked";
import { mediaObjectStore } from "../stores/rootStore";
import { userStore } from "../stores/rootStore";
import { getScreenWidth } from "../utils/screenUtils";
import { getErrorMessage } from "../utils/errors";
import AddCookupView from "../components/user/AddCookupView.vue";
import AddToShoppingListModal from "../components/user/AddToShoppingListModal.vue";
import RecipeIngredientListItem from "../components/RecipeIngredientListItem.vue";

@Component({
  components: { RecipeIngredientListItem },
})
export default class RecipeView extends Vue {
  recipeId?: string;
  recipe: Recipe = recipeFactory();

  recipesClient: RecipesClient = new RecipesClient();
  userRecipeFavouritesClient = new UserRecipeFavouritesClient();

  isMarked = false;
  favouriteId: number | null = null;

  doValidate = false;

  showServingsForm = false;

  internalServings = -1;

  quantityFactor = 1;

  // poor man's regex for url validation
  urlRegex = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^((http|https):\/\/)?([a-z0-9\-\_]+\.)?([a-z0-9\-\_]+\.)([a-z0-9]){2,5}((\/?)[a-z0-9\-_~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\ \,\;\%\=]*)?$/i
  );

  mounted(): void {
    const routeRecipeId = this.$route.query["recipeId"];
    if (routeRecipeId) {
      this.recipeId = routeRecipeId.toString();
      this.recipesClient
        .getRecipe(this.recipeId)
        .then((recipe) => {
          this.recipe = recipe;
          this.setRecipeFavouriteState();
          if (
            typeof this.recipe.servings === "number" &&
            this.recipe.servings > 0
          ) {
            this.showServingsForm = true;
            this.internalServings = this.recipe.servings;
          }
        })
        .catch((err) => {
          const msg = getErrorMessage(err);
          this.$toast.open("Fehler beim Lesen des Rezepts: " + msg);
        });
    } else {
      this.$toast.open(
        "Es kann kein Rezept angezeigt werden da keine Rezept ID übergeben wurde"
      );
    }
  }

  @Watch("loggedInUserId")
  setRecipeFavouriteState(): void {
    const recipeId = this.recipe.recipeId;
    if (recipeId && this.loggedInUserId) {
      this.userRecipeFavouritesClient
        .getUserFavourite(this.loggedInUserId, recipeId)
        .then((favouriteId) => {
          if (favouriteId === null) {
            this.favouriteId = -1;
          } else {
            this.favouriteId = favouriteId;
            this.isMarked = true;
          }
        })
        .catch((err) => {
          const msg = getErrorMessage(err);
          this.$toast.open("Fehler beim Auslesen des Favoriten Status: " + msg);
        });
    } else {
      this.favouriteId = null;
      this.isMarked = false;
    }
  }

  get isEditable(): boolean {
    const loggedInUserId = this.loggedInUserId;
    if (
      (loggedInUserId && loggedInUserId == this.recipe.authorId) ||
      userStore.userIsAdmin
    ) {
      return true;
    }
    return false;
  }

  get loggedInUser(): User | null {
    return userStore.user;
  }

  get loggedInUserId(): number | null {
    if (this.loggedInUser && this.loggedInUser.id) {
      return this.loggedInUser.id;
    }
    return null;
  }

  get recipeImgSrc(): string | null {
    if (this.recipe.images.length > 0 && this.recipe.images[0].mediaObjectId) {
      const url = mediaObjectStore.mediaObjectMap.get(
        this.recipe.images[0].mediaObjectId
      );
      if (url) {
        return url;
      }
    }
    return null;
  }

  get sourceLink(): string | null {
    if (this.recipe.source) {
      if (this.recipe.source.match(this.urlRegex)) {
        if (
          !this.recipe.source.startsWith("http") &&
          !this.recipe.source.startsWith("https")
        ) {
          return "http://" + this.recipe.source;
        }
        return this.recipe.source;
      }
    }
    return null;
  }

  get description(): string {
    if (this.recipe.description) {
      return marked.parse(this.recipe.description);
    }
    return "";
  }

  async addCookup(): Promise<Cookup | void> {
    // this.$modal.show(
    //   AddCookupView,
    //   { recipe: this.recipe, cookupAddedCallback: () => this.$modal.hideAll() },
    //   { height: "auto", width: getScreenWidth(400) }
    // );
  }

  async toggleMarked(): Promise<void> {
    if (!this.loggedInUserId || !this.recipe || !this.recipe.recipeId) {
      return;
    }

    const oldFavouriteId = this.favouriteId;

    this.favouriteId = null;
    if (!oldFavouriteId || oldFavouriteId <= 0) {
      this.userRecipeFavouritesClient
        .createUserFavourite(this.loggedInUserId, this.recipe.recipeId)
        .then((favouriteId) => {
          if (favouriteId) {
            this.favouriteId = favouriteId;
            this.isMarked = true;
          }
        })
        .catch((err) => {
          const msg = getErrorMessage(err);
          this.$toast.open("Fehler Hinzufügen des Rezepts als Favorit: " + msg);
        });
    } else {
      this.userRecipeFavouritesClient
        .deleteUserFavourite(oldFavouriteId)
        .then(() => {
          this.favouriteId = -1;
          this.isMarked = false;
        })
        .catch((err) => {
          const msg = getErrorMessage(err);
          this.$toast.open("Fehler beim Löschen des Favoriten Status: " + msg);
        });
    }
  }

  setQuanitityFactor(): void {
    if (this.recipe.servings) {
      this.quantityFactor = this.internalServings / this.recipe.servings;
    } else {
      this.quantityFactor = 1;
    }
  }

  deleteRecipe(): void {
    // this.$modal.show('dialog', {
    //   title: "Rezept löschen",
    //   text: "Soll das Rezept " + this.recipe.name + " wirklich gelöscht werden?",
    //   buttons: [
    //     {
    //       title: 'Abbrechen',
    //       handler: () => {
    //         this.$modal.hide('dialog')
    //       }
    //     },
    //     {
    //       title: 'Löschen',
    //       handler: () => {
    //         if (this.recipe.recipeId) {
    //           this.recipesClient.deleteRecipe(this.recipe.recipeId)
    //             .then(() => {
    //               this.$router.push("/recipes");
    //             }).catch((err) => {
    //               const msg = getErrorMessage(err);
    //               this.$toast.open("Fehler beim Löschen des Rezepts: " + msg);
    //             });
    //         }
    //         this.$modal.hide('dialog');
    //       }
    //     }
    //   ]
    // });
  }

  addIngredientsToShoppingList(): void {
    // this.$modal.show(
    //   AddToShoppingListModal,
    //   {
    //     user: this.loggedInUser,
    //     ingredients: Array.from(this.recipe.ingredients),
    //     doneHandler: () => this.$modal.hideAll(),
    //   },
    //   { height: "auto", width: getScreenWidth(350) }
    // );
  }
}
</script>

<style lang="scss" scoped>
@import "../../main.scss";
@import "~bootstrap/scss/bootstrap-grid.scss"; // import breakpoint mixin from grid definition

#recipe-view {
  @include media-breakpoint-up(sm) {
    width: 80%;
  }

  .row {
    padding-top: 15px;
  }

  h2 {
    font-size: 1.5rem;
    color: $font-color-highlight;
  }

  #top-icons {
    padding-left: $content-padding;
    padding-right: $content-padding;
    font-size: 1.5rem;

    button {
      border-radius: 30px; // this overwrites the border-radius in round-button
      margin-left: 10px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 5px;
    }
  }

  #recipe-description {
    padding: 0 $content-padding $content-padding $content-padding;
  }

  .recipe-image {
    div {
      width: 100%;
      text-align: center;
    }

    img {
      max-width: 100%;
      max-height: 600px;
    }
  }

  .tags {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .servings-input {
    width: 60px;
  }
}
</style>
