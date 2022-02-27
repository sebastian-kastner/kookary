<template>
  <div class="about">
    <div class="form-group">
      <label for="recipe-name">Rezeptname</label>
      <input
        autocomplete="off"
        class="form-control"
        :class="(doValidate && !hasValidName) ? 'is-invalid' : ''"
        id="recipe-name"
        placeholder="Rezeptname"
        v-model="recipe.name"
      />
    </div>
    <div class="form-group">
      <label>Zutaten</label>
      <div
        v-for="ingredient in recipe.recipeIngredients"
        v-bind="ingredient"
        v-bind:key="ingredient.uuid"
      >
        <ingredient-editor
          :ingredient="ingredient"
          :existingIngredients="availableIngredients"
          @onNameChanged="updateName"
          @onDelete="onDelete"
        />
      </div>
    </div>
    <div class="form-group">
      <label>Beschreibung</label>
      <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="recipe.description" />  
    </div>
    <button class="btn btn-primary" v-on:click="doSubmit">Submit</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Ingredient, Recipe, RecipeIngredient } from "../types";
import { IngredientsClient } from "../clients/IngredientsClient";
import { RecipesClient } from "../clients/RecipesClient";
import IngredientEditor from "../components/IngredientEditor.vue";
import {v4 as uuid} from 'uuid';

@Component({
  components: { IngredientEditor },
})
export default class RecipeEditorView extends Vue {
  recipe: Recipe = {};
  availableIngredients: Ingredient[] = [];
  recipesClient: RecipesClient = new RecipesClient();
  ingredientsClient: IngredientsClient = new IngredientsClient();
  doValidate = false;

  mounted(): void {
    this.recipe = {
      recipeIngredients: [],
    };
    this.createNewIngredient();

    this.ingredientsClient.getIngredients().then((ingredients) => {
      this.availableIngredients = ingredients;
    });
  }

  get hasValidName(): boolean {
    if(this.recipe.name && this.recipe.name.length > 2) {
      return true;
    }
    return false;
  }

  updateName(): void {
    if(this.recipe.recipeIngredients) {
      if(this.recipe.recipeIngredients[this.recipe.recipeIngredients.length - 1].ingredient?.name) {
        this.createNewIngredient();
      }
    }
  }

  private createNewIngredient(): void {
    this.recipe.recipeIngredients?.push({
      uuid: uuid(),
    })
  }

  onDelete(ingredientToRemove: RecipeIngredient): void {
    if (this.recipe.recipeIngredients) {
      this.recipe.recipeIngredients.splice(this.recipe.recipeIngredients.indexOf(ingredientToRemove), 1);
    }
  }

  doSubmit(): void {
    if(!this.hasValidName) {
      this.doValidate = true;
    } else {
      // do something
      this.recipesClient.saveRecipe(this.recipe).then((recipe) => {
        console.log("recipe saved: ", recipe)
      }).catch((err) => {
        // console.error("failed to save recipe.", err);
      });
    }
  }
}
</script>
