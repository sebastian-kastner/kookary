<template>
  <div id="ingredients" class="main-content">
    <ul class="list-group">
      <li
        class="list-group-item"
        v-for="ingredient in ingredients"
        v-bind:key="ingredient.ingredientId"
      >
        {{ ingredient.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Ingredient } from '@/types';
import { Component, Vue } from 'vue-property-decorator'
import { ingredientStore } from '../stores/rootStore'
@Component({
  components: {}
})
export default class IngredientsView extends Vue {
  get ingredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }
}
</script>

<style lang="scss">
@import "../../main.scss";

#ingredients {
  padding: $content-padding;
}

</style>
