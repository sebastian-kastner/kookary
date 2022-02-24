<template>
  <div class="ingredients">
    <ul class="list-group">
      <li
        v-for="ingredient in ingredients"
        v-bind:key="ingredient.ingredientId"
      >
        {{ ingredient.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IngredientsClient } from '../clients/IngredientsClient'
import { Ingredient } from '../types'

@Component({
  components: {}
})
export default class IngredientsView extends Vue {
  ingredients: Ingredient[] = [];

  mounted (): void {
    const client = new IngredientsClient()
    client.getIngredients().then((ret) => {
      this.ingredients = ret
    })
  }
}
</script>
