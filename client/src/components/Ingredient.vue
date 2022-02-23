<template>
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
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Ingredients, Recipes } from '../../rest/models'
import { IngredientsApi } from '../../rest/api'
import { restConfig } from '../constants'

@Options({
  components: {}
})
export default class Ingredient extends Vue {
  ingredients: Ingredients[] = [];
  recipe: Recipes = {};

  // mounted (): void {
  //   const client = new IngredientsApi(restConfig)
  //   client.getIngredientsCollection().then((ret) => {
  //     this.ingredients = ret.data['hydra:member']
  //     console.log(this.ingredients)
  //   })
  // }
}
</script>
