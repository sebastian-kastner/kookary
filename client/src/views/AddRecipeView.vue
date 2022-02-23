<template>
  <div class="about">
    <form>
      <div class="form-group">
        <label for="recipe-name">Rezeptname</label>
        <input
          type="email"
          class="form-control"
          id="recipe-name"
          placeholder="Rezeptname"
        />
      </div>
      <div class="form-group">
        <label>Zutaten</label>
        <div class="row g-3">
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control"
              placeholder="Zutatenname"
              aria-label="Ingredient"
            />
          </div>
          <div class="col-sm">
            <input
              type="text"
              class="form-control"
              placeholder="Menge"
              aria-label="Amount"
            />
          </div>
          <div class="col-sm">
            <input
              type="text"
              class="form-control"
              placeholder="Einheit"
              aria-label="Unit"
            />
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Ingredients, Recipes } from '../../rest/models'
import { IngredientsApi, RecipesApi } from '../../rest/api'
import { restConfig } from '../constants'

@Options({
  components: {}
})
export default class AddRecipeView extends Vue {
  ingredients: Ingredients[] = [];
  recipe: Recipes = {}

  mounted (): void {
    this.recipe.recipeIngredients?.push()
    const client = new RecipesApi(restConfig)
    client.getRecipesCollection().then((ret) => {
      const recipes = ret.data['hydra:member']
      const ingredients = recipes[0].recipeIngredients
      // if (ingredients) {
      //   const foo = ingredients[0].ingredient
      //   console.log(foo.name)
      // }
    })

    // client.getIngredientsCollection().then((ret) => {
    //   this.ingredients = ret.data['hydra:member']
    //   console.log(this.ingredients)
    // })
  }
}
</script>
