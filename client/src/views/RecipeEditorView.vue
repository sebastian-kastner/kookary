<template>
  <div id="recipe-editor-view" class="main-content">
    <div class="mb-2">
      <label for="recipe-name">Rezeptname</label>
      <input
        id="recipe-name"
        v-model="recipe.name"
        autocomplete="off"
        class="form-control"
        :class="doValidate && !hasValidName ? 'is-invalid' : ''"
        placeholder="Rezeptname"
      />
    </div>
    <div class="mb-2">
      <label>Rezeptbild</label>
      <image-upload
        :input-file="recipeImage"
        @imageSelected="onRecipeImageSelected"
        @imageRemoved="onRecipeImageRemoved"
      />
    </div>
    <div class="mb-2">
      <label>Tags</label>
      <div>
        <inline-item-list
          :suggest-items="existingTags"
          :items="recipe.tags"
          :add-new-handler="createTag"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-5">
        <div class="mb-2">
          <label>Portionen</label>
          <input
            id="recipe-servings"
            v-model.number="recipe.servings"
            autocomplete="off"
            class="form-control"
            type="number"
          />
        </div>
      </div>
      <div class="col-7">
        <div class="mb-2">
          <label>Quelle</label>
          <input
            id="recipe-source"
            v-model="recipe.source"
            autocomplete="off"
            class="form-control"
            placeholder="Rezept Quelle"
          />
        </div>
      </div>
    </div>
    <div class="mb-2">
      <label>Zutaten</label>
      <recipe-ingredients-editor
        :ingredients="recipe.ingredients"
        :existing-ingredients="existingIngredients"
      />
    </div>
    <div class="mb-2">
      <label>Beschreibung</label>
      <textarea
        id="exampleFormControlTextarea1"
        v-model="recipeDescription"
        class="form-control"
        rows="10"
      />
    </div>

    <div class="d-flex justify-content-end">
      <save-button
        button-text="Speichern"
        :is-loading="isSaving"
        @onSave="doSubmit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { v4 as uuid } from "uuid";
import { useModal } from "vue-final-modal";
import { Ingredient, Recipe, Tag, recipeFactory, MediaObject } from "../types";
import { ingredientStore, tagStore } from "../stores/rootStore";
import { RecipesClient } from "../clients/RecipesClient";
import RecipeIngredientsEditor from "../components/RecipeIngredientsEditor.vue";
import ImageUpload from "../components/ImageUpload.vue";
import InlineItemList from "../components/InlineItemList.vue";
import SaveButton from "../components/SaveButton.vue";
import DialogModal from "../components/DialogModal.vue";
import { getErrorMessage } from "../utils/errors";
import { useToast } from "vue-toast-notification";

@Options({
  components: {
    RecipeIngredientsEditor,
    InlineItemList,
    ImageUpload,
    SaveButton,
  },
  watch: {
    recipe: {
      handler() {
        this.handleRecipeUpdate();
      },
      deep: true,
    },
    "recipe.ingredients": {
      handler() {
        this.handleIngredientUpdate();
      },
      deep: true,
    },
  },
  beforeRouteLeave: RecipeEditorView.navGuard,
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

  // FIXME: this component is using useToast directly instead of
  // the ToastMixin. To use the ToastMixin, migrating the watchers
  // and the beforeRouteLeave configuration to vue-facing-decorators
  // is required
  showToast = useToast();

  static navGuard(
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void {
    const editor = this as unknown as RecipeEditorView;
    if (editor.isDirty) {
      const submitHandler = editor.doSubmit;
      const { open, close } = useModal({
        component: DialogModal,
        attrs: {
          title: "Ungespeicherte Änderungen",
          text: "Es gibt ungespeicherte Änderungen",
          confirmText: "Speichern",
          cancelText: "Verwerfen",
          isSaving: editor.isSaving,
          onConfirm() {
            submitHandler().finally(() => {
              close();
            });
          },
          onCancel() {
            close();
            next();
          },
        },
      });
      open();
    } else {
      next();
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

  handleRecipeUpdate(): void {
    // ignore first change on component mount
    if (this.initialized) {
      this.isDirty = true;
    } else {
      this.initialized = true;
    }
  }

  handleIngredientUpdate(): void {
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
        this.showToast.error(
          `Fehler beim Anlegen des Tags ${tagName}: ${errorMessage}`
        );
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
      this.showToast.error("Rezeptname muss angegeben werden.");
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
            this.showToast.error(
              "Fehler beim Speichern: <br/> " + errorDetails
            );
          });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

#recipe-editor-view {
  padding: $content-padding;

  label {
    font-weight: bold;
  }
}
</style>
