<template>
  <div id="recipe-view" class="container main-content">
    <div id="top-icons" class="p-1 pt-2 d-flex flex-row-reverse">
      <div>
        <button v-if="isEditable" class="rounded-button" @click="deleteRecipe">
          <Icon icon="trash" />
        </button>
      </div>

      <div v-if="isEditable">
        <router-link
          v-slot="{ navigate }"
          :to="{
            path: '/user/recipe-editor',
            query: { recipeId: recipe.recipeId },
          }"
          custom
        >
          <button class="rounded-button" @click="navigate">
            <Icon icon="pencil" />
          </button>
        </router-link>
      </div>

      <div>
        <button v-if="loggedInUserId" class="rounded-button" @click="addCookup">
          <Icon icon="calendarWeek" />
        </button>
      </div>

      <div>
        <button
          v-if="loggedInUserId"
          :disabled="favouriteId === null"
          class="rounded-button"
          :class="{ active: isMarked }"
          @click="toggleMarked"
        >
          <Icon v-if="isMarked" icon="bellFill" />
          <Icon v-else icon="bell" />
        </button>
      </div>
    </div>

    <div v-if="recipeImgSrc" class="recipe-image row">
      <div>
        <img :src="recipeImgSrc" />
      </div>
    </div>

    <div id="recipe-description">
      <div v-if="recipe.tags.length > 0" class="tags row">
        <div
          v-for="item in recipe.tags"
          :key="item.uuid"
          class="inline-item-list-element"
        >
          <router-link :to="{ path: '/recipes', query: { tags: item.tagId } }">
            {{ item.name }}
          </router-link>
        </div>
      </div>

      <div class="row">
        <h1>{{ recipe.name }}</h1>
      </div>

      <div class="d-flex flex-row">
        <div>
          <h4>ZUTATEN</h4>
        </div>
        <div class="ps-3">
          <button
            v-if="loggedInUserId"
            class="rounded-button float-start"
            @click="addIngredientsToShoppingList"
          >
            <Icon icon="bag" />
          </button>
        </div>
      </div>

      <div v-if="showServingsForm" class="row">
        <div class="mb-2 form-inline">
          Für
          <input
            v-model.number="internalServings"
            type="number"
            class="form-control mx-sm-1 servings-input"
            @input="setQuanitityFactor"
          />
          Personen
        </div>
      </div>

      <div class="row">
        <recipe-ingredient-list
          :ingredients="recipe.ingredients"
          :quantity-factor="quantityFactor"
        />
      </div>

      <div class="row">
        <h4>ZUBEREITUNG</h4>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="row recipe-description" v-html="description" />

      <div v-if="sourceLink && sourceLink !== ''" class="row">
        <h4>QUELLE</h4>
      </div>
      <div v-if="sourceLink && sourceLink !== ''" class="row source-link">
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
import { Watch, Component, mixins } from "vue-facing-decorator";
import { useModal } from "vue-final-modal";
import DialogModal from "../components/DialogModal.vue";
import ToastMixin from "../mixins/ToastMixin.vue";
import { Recipe, recipeFactory, Cookup, User } from "../types";
import { RecipesClient } from "../clients/RecipesClient";
import { UserRecipeFavouritesClient } from "../clients/UserRecipeFavouritesClient";
import { marked } from "marked";
import { mediaObjectStore } from "../stores/rootStore";
import { userStore } from "../stores/rootStore";
import { getErrorMessage } from "../utils/errors";
import AddCookupView from "../components/user/AddCookupView.vue";
import AddToShoppingListModal from "../components/user/AddToShoppingListModal.vue";
import RecipeIngredientList from "../components/recipe-view/RecipeIngredientList.vue";
import { Icon } from "@iconify/vue/dist/offline";

@Component({
  components: {
    RecipeIngredientList,
    Icon,
  },
})
export default class RecipeView extends mixins(ToastMixin) {
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
          
          if(this.recipe.name) {
            document.title = this.recipe.name;
          }

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
          this.showToast.error("Fehler beim Lesen des Rezepts: " + msg);
        });
    } else {
      this.showToast.error(
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
          this.showToast.error(
            "Fehler beim Auslesen des Favoriten Status: " + msg
          );
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
    const { open, close } = useModal({
      component: AddCookupView,
      attrs: {
        recipe: this.recipe,
        onCookupAdded() {
          close();
        },
        onCancel() {
          close();
        },
      },
    });
    open();
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
          this.showToast.error(
            "Fehler beim Hinzufügen des Rezepts als Favorit: " + msg
          );
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
          this.showToast.error(
            "Fehler beim Löschen des Favoriten Status: " + msg
          );
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
    const deleteHandler = () => {
      if (this.recipe.recipeId) {
        this.recipesClient
          .deleteRecipe(this.recipe.recipeId)
          .then(() => {
            this.$router.push("/recipes");
          })
          .catch((err: unknown) => {
            const msg = getErrorMessage(err);
            this.showToast.error("Fehler beim Löschen des Rezepts: " + msg);
          });
      }
    };

    const { open, close } = useModal({
      component: DialogModal,
      attrs: {
        title: "Rezept löschen",
        text: `Soll das Rezept ${this.recipe.name} wirklich gelöscht werden?`,
        onConfirm() {
          deleteHandler();
          close();
        },
        onCancel() {
          close();
        },
      },
    });
    open();
  }

  addIngredientsToShoppingList(): void {
    const { open, close } = useModal({
      component: AddToShoppingListModal,
      attrs: {
        user: this.loggedInUser,
        ingredients: Array.from(this.recipe.ingredients),
        onDone() {
          close();
        },
        onCancel() {
          close();
        },
      },
    });
    open();
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/breakpoints.scss";

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

  .recipe-description {
    max-width: 100%;
  }

  .source-link {
    a {
      overflow-x: hidden;
    }
  }
}
</style>
