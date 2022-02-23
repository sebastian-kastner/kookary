<template>
  <div class="form-group">
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
import { Vue, Component } from 'vue-property-decorator'
import { IngredientsClient } from '../clients/IngredientsClient'
import { Ingredient } from '../types'

@Component({
  components: {}
})
export default class IngredientEditor extends Vue {
  ingredients: Ingredient[] = [];
  client: IngredientsClient = new IngredientsClient();

  mounted (): void {
    const client = new IngredientsClient()
    client.getIngredients().then((ret) => {
      this.ingredients = ret
      console.log(this.ingredients)
    })
  }
}
</script>
