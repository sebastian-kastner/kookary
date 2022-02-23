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
import { Options, Vue } from 'vue-class-component'
import { IngredientsClient } from '../clients/IngredientsClient'
import { Ingredient } from '../types'

@Options({
  components: {}
})
export default class IngredientsView extends Vue {
  ingredients: Ingredient[] = [];

  mounted (): void {
    const client = new IngredientsClient()
    client.getIngredients().then((ret) => {
      this.ingredients = ret
      console.log(ret)
    })
  }
}
</script>
