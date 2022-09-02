<template>
  <div class="about">
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
        :input-file="recipe.image"
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
      <div
        v-for="ingredient in recipe.ingredients"
        v-bind="ingredient"
        v-bind:key="ingredient.uuid"
      >
        <ingredient-editor
          :ingredient="ingredient"
          :existingIngredients="existingIngredients"
          @onNameChanged="updateIngredientName"
          @onDelete="onDeleteIngredient"
        />
      </div>
    </div>
    <div class="form-group">
      <label>Beschreibung</label>
      <textarea
        class="form-control"
        id="exampleFormControlTextarea1"
        rows="3"
        v-model="recipe.description"
      />
    </div>
    <button class="btn btn-primary" v-on:click="doSubmit">Submit</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  Ingredient,
  Recipe,
  RecipeIngredient,
  Tag,
  recipeFactory,
} from "../types";
import { ingredientStore, tagStore } from "../stores/rootStore";
import { RecipesClient } from "../clients/RecipesClient";
import IngredientEditor from "../components/IngredientEditor.vue";
import ImageUpload from "../components/ImageUpload.vue";
import InlineItemList from "../components/InlineItemList.vue";
import { v4 as uuid } from "uuid";

@Component({
  components: { IngredientEditor, InlineItemList, ImageUpload },
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

  onDeleteTag(tagToDelete: Tag): void {
    if (this.recipe.tags) {
      this.recipe.tags.splice(this.recipe.tags.indexOf(tagToDelete), 1);
    }
  }

  updateIngredientName(): void {
    if (this.recipe.ingredients) {
      if (
        this.recipe.ingredients[this.recipe.ingredients.length - 1].ingredient
          ?.name
      ) {
        this.addNewIngredient();
      }
    }
  }

  private addNewIngredient(): void {
    this.recipe.ingredients?.push({
      uuid: uuid(),
    });
  }

  onDeleteIngredient(ingredientToRemove: RecipeIngredient): void {
    if (this.recipe.ingredients) {
      this.recipe.ingredients.splice(
        this.recipe.ingredients.indexOf(ingredientToRemove),
        1
      );
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
