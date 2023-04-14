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

    <save-button buttonText="Speichern" :isLoading="isSaving" @onSave="doSubmit"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { v4 as uuid } from "uuid";
import {
  Ingredient,
  Recipe,
  Tag,
  recipeFactory,
  MediaObject
} from "../types";
import { ingredientStore, tagStore } from "../stores/rootStore";
import { RecipesClient } from "../clients/RecipesClient";
import RecipeIngredientsEditor from "../components/RecipeIngredientsEditor.vue";
import ImageUpload from "../components/ImageUpload.vue";
import InlineItemList from "../components/InlineItemList.vue";
import SaveButton from "../components/SaveButton.vue";
import { getErrorMessage } from "../utils/errors"

@Component({
  components: { RecipeIngredientsEditor, InlineItemList, ImageUpload, SaveButton },
})
export default class RecipeEditorView extends Vue {
  recipeId?: string;
  recipe: Recipe = recipeFactory();
  isSaving = false;

  recipesClient: RecipesClient = new RecipesClient();

  doValidate = false;

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
        this.$toast.open(`Fehler beim Anlegen des Tags ${tagName}: ${errorMessage}`);
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
      this.recipe.images[0] = {}
    }
  }

  doSubmit(): void {
    if (!this.hasValidName) {
      this.$toast.open('Rezeptname muss angegeben werden.');
      this.doValidate = true;
    } else {
      // create new recipe if no recipeId was given
      this.isSaving = true;
      this.recipesClient
        .saveRecipe(this.recipe)
        .then(() => {
          this.isSaving = false;
          this.$router.push({ path: "/recipes" });
        })
        .catch((err) => {
          this.isSaving = false;
          console.error(err);
          const errorDetails = getErrorMessage(err);
          this.$toast.open("Fehler beim Speichern: <br/> " + errorDetails);
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