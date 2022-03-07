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
        v-for="ingredient in recipe.ingredients"
        v-bind="ingredient"
        v-bind:key="ingredient.uuid"
      >
        <ingredient-editor
          :ingredient="ingredient"
          :existingIngredients="existingIngredients"
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
  recipeId?: string;
  recipe: Recipe = {};
  existingIngredients: Ingredient[] = [];
  recipesClient: RecipesClient = new RecipesClient();
  ingredientsClient: IngredientsClient = new IngredientsClient();
  doValidate = false;

  mounted(): void {
    const routeRecipeId = this.$route.query['recipeId'];
    if (routeRecipeId) {
      this.recipeId = routeRecipeId.toString();
      this.recipesClient.getRecipe(this.recipeId).then((recipe) => {
        this.recipe = recipe;
        this.createNewIngredient();
      });
      
    } else {
      this.recipe = {
        ingredients: [],
      };
      this.createNewIngredient();
    }

    this.ingredientsClient.getIngredients().then((ingredients) => {
      this.existingIngredients = ingredients;
    });
  }

  get hasValidName(): boolean {
    if(this.recipe.name && this.recipe.name.length > 2) {
      return true;
    }
    return false;
  }

  updateName(): void {
    if(this.recipe.ingredients) {
      if(this.recipe.ingredients[this.recipe.ingredients.length - 1].ingredient?.name) {
        this.createNewIngredient();
      }
    }
  }

  private createNewIngredient(): void {
    this.recipe.ingredients?.push({
      uuid: uuid(),
    })
  }

  onDelete(ingredientToRemove: RecipeIngredient): void {
    if (this.recipe.ingredients) {
      this.recipe.ingredients.splice(this.recipe.ingredients.indexOf(ingredientToRemove), 1);
    }
  }

  doSubmit(): void {
    if(!this.hasValidName) {
      this.doValidate = true;
    } else {
      // create new recipe if no recipeId was given
      this.recipesClient.saveRecipe(this.recipe).then(() => {
        this.$router.push({ path: '/recipes' });
      }).catch((err) => {
        console.error("failed to save recipe.", err);
      });

    }
  }
}
</script>
