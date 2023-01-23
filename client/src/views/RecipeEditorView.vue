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
      <ingredients-editor
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
    <button class="btn rounded-button" v-on:click="doSubmit">Submit</button>
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
import IngredientsEditor from "../components/IngredientsEditor.vue";
import ImageUpload from "../components/ImageUpload.vue";
import InlineItemList from "../components/InlineItemList.vue";

@Component({
  components: { IngredientsEditor, InlineItemList, ImageUpload },
})
export default class RecipeEditorView extends Vue {
  recipeId?: string;
  recipe: Recipe = recipeFactory();

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
      .catch((reason) => {
        console.error("Failed to create tag", tagName, reason);
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
      this.doValidate = true;
    } else {
      // create new recipe if no recipeId was given
      this.recipesClient
        .saveRecipe(this.recipe)
        .then(() => {
          this.$router.push({ path: "/recipes" });
        })
        .catch((err) => {
          console.error("failed to save recipe.", err);
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