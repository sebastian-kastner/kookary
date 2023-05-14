<template>
  <div id="recipe-editor-view" class="main-content">
    <div class="form-group">
      <label for="recipe-name">Rezeptname</label>
      <input
        autocomplete="off"
        class="form-control"
        :class="doValidate && !hasValidName ? 'is-invalid' : ''"
        id="recipe-name"
        placeholder="Rezeptname"
        v-model="recipe.name"
      />
    </div>
    <div class="form-group">
      <label>Rezeptbild</label>
      <image-upload
        :input-file="recipeImage"
        @imageSelected="onRecipeImageSelected"
        @imageRemoved="onRecipeImageRemoved"
      />
    </div>
    <div class="form-group">
      <label>Tags</label>
      <div>
        <inline-item-list
          :suggestItems="existingTags"
          :items="recipe.tags"
          :addNewHandler="createTag"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-5">
        <div class="form-group">
          <label>Portionen</label>
          <input
            autocomplete="off"
            class="form-control"
            id="recipe-servings"
            type="number"
            v-model.number="recipe.servings"
          />
        </div>
      </div>
      <div class="col-7">
        <div class="form-group">
          <label>Quelle</label>
          <input
            autocomplete="off"
            class="form-control"
            id="recipe-source"
            placeholder="Rezept Quelle"
            v-model="recipe.source"
          />
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Zutaten</label>
      <recipe-ingredients-editor
        :ingredients="recipe.ingredients"
        :existingIngredients="existingIngredients"
      />
    </div>
    <div class="form-group">
      <label>Beschreibung</label>
      <textarea
        class="form-control"
        id="exampleFormControlTextarea1"
        rows="10"
        v-model="recipeDescription"
      />
    </div>

    <save-button
      buttonText="Speichern"
      :isLoading="isSaving"
      @onSave="doSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Watch } from "vue-facing-decorator";
import { Options, Vue } from "vue-class-component";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { v4 as uuid } from "uuid";
import { Ingredient, Recipe, Tag, recipeFactory, MediaObject } from "../types";
import { ingredientStore, tagStore } from "../stores/rootStore";
import { RecipesClient } from "../clients/RecipesClient";
import RecipeIngredientsEditor from "../components/RecipeIngredientsEditor.vue";
import ImageUpload from "../components/ImageUpload.vue";
import InlineItemList from "../components/InlineItemList.vue";
import SaveButton from "../components/SaveButton.vue";
import ConfirmLeaveModal from "../components/user/ConfirmLeaveModal.vue";
import { getErrorMessage } from "../utils/errors";
import { getScreenWidth } from "../utils/screenUtils";

@Options({
  components: {
    RecipeIngredientsEditor,
    InlineItemList,
    ImageUpload,
    SaveButton,
  },
  // beforeRouteLeave: RecipeEditorView.navGuard,
})
export default class RecipeEditorView extends Vue {
  recipeId?: string;
  recipe: Recipe = recipeFactory();
  isSaving = false;

  recipesClient: RecipesClient = new RecipesClient();

  doValidate = false;

  isDirty = false;

  ingredientsHaveChanges = false;

  initialized = false;

  ingredientsInitialized = false;

  static navGuard(
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void {
    if (this instanceof RecipeEditorView) {
      // if (this.isDirty) {
      // const modalHandler = this.$modal;
      // const submitHandler = this.doSubmit;
      // modalHandler.show(
      //   ConfirmLeaveModal,
      //   {
      //     saveHandler: () => {
      //       submitHandler().finally(() => {
      //         modalHandler.hideAll()
      //       })
      //     },
      //     discardHandler: () => {
      //       modalHandler.hideAll();
      //       next();
      //     },
      //     isSaving: this.isSaving
      //   },
      //   { height: "auto", width: getScreenWidth(400) }
      // );
      // } else {
      next();
      // }
      // } else {
      // this.$toast.open(
      //   `Unbekannter Fehler beim Versuch den Rezept Editor zu verlassen.`
      // );
    }
  }

  mounted(): void {
    const routeRecipeId = this.$route.query["recipeId"];
    if (routeRecipeId) {
      this.recipeId = routeRecipeId.toString();
      this.recipesClient.getRecipe(this.recipeId).then((recipe) => {
        this.recipe = recipe;
        this.addNewIngredient();
        if (this.recipe.tags === undefined) {
          this.recipe.tags = [];
        }
      });
    } else {
      this.recipe = recipeFactory();
      this.addNewIngredient();
    }
  }

  @Watch("recipe", { deep: true })
  dirtyStateWatcher() {
    // ignore first change on component mount
    if (this.initialized) {
      this.isDirty = true;
    } else {
      this.initialized = true;
    }
  }

  @Watch("recipe.ingredients", { deep: true })
  ingredientsDirtyStateWatcher() {
    // ignore first change on component mount
    if (this.ingredientsInitialized) {
      this.ingredientsHaveChanges = true;
    } else {
      this.ingredientsInitialized = true;
    }
  }

  get existingIngredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }

  get existingTags(): Tag[] {
    return tagStore.tags;
  }

  get recipeDescription(): string {
    if (this.recipe.description) {
      return this.recipe.description;
    }
    return "";
  }

  set recipeDescription(description: string) {
    if (description) {
      this.recipe.description = description;
    } else {
      this.recipe.description = "";
    }
  }

  get recipeImage(): MediaObject | null {
    if (this.recipe.images.length > 0) {
      return this.recipe.images[0];
    }
    return null;
  }

  get hasValidName(): boolean {
    if (this.recipe.name && this.recipe.name.length > 2) {
      return true;
    }
    return false;
  }

  async createTag(tagName: string): Promise<void> {
    tagStore
      .addTag(tagName)
      .then((tag) => {
        this.recipe.tags?.push(tag);
      })
      .catch((error) => {
        const errorMessage = getErrorMessage(error);
        // this.$toast.open(
        //   `Fehler beim Anlegen des Tags ${tagName}: ${errorMessage}`
        // );
      });
  }

  private addNewIngredient(): void {
    this.recipe.ingredients?.push({
      uuid: uuid(),
    });
  }

  onDeleteTag(tagToDelete: Tag): void {
    if (this.recipe.tags) {
      this.recipe.tags.splice(this.recipe.tags.indexOf(tagToDelete), 1);
    }
  }

  onRecipeImageSelected(file: File): void {
    if (this.recipe.images.length == 0) {
      this.recipe.images.push({});
    }
    this.recipe.images[0].file = file;
  }

  onRecipeImageRemoved(): void {
    if (this.recipe.images[0].mediaObjectId) {
      this.recipe.imagesToDelete.push(this.recipe.images[0].mediaObjectId);
      this.recipe.images[0] = {};
    }
  }

  async doSubmit(): Promise<void> {
    // nothing to do if no changes were made
    if (!this.isDirty) {
      return;
    }

    if (!this.hasValidName) {
      // this.$toast.open("Rezeptname muss angegeben werden.");
      this.doValidate = true;
    } else {
      this.isSaving = true;
      return new Promise<void>((resolve, reject) => {
        this.recipesClient
          .saveRecipe(this.recipe, this.ingredientsHaveChanges)
          .then(() => {
            this.isDirty = false;
            this.ingredientsHaveChanges = false;
            this.isSaving = false;
            resolve();
            this.$router.push({ path: "/recipes" });
          })
          .catch((err) => {
            this.isSaving = false;
            console.error(err);
            const errorDetails = getErrorMessage(err);
            reject();
            // this.$toast.open("Fehler beim Speichern: <br/> " + errorDetails);
          });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../main.scss";

#recipe-editor-view {
  padding: $content-padding;

  label {
    font-weight: bold;
  }
}
</style>
