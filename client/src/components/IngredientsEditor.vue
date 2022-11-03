<template>
  <div>
    <draggable
      :list="ingredients"
      class="list-group"
      @end="updatePositions"
    >
      <div
        v-for="ingredient in ingredients"
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
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import draggable from "vuedraggable";
import { RecipeIngredient, Ingredient } from "../types";
import IngredientEditor from "./IngredientEditor.vue";
import { v4 as uuid } from "uuid";

@Component({
  components: { IngredientEditor, draggable },
})
export default class IngredientsEditor extends Vue {
  @Prop({ required: true }) ingredients!: RecipeIngredient[];
  @Prop({ required: true }) existingIngredients!: Ingredient[];

  updateIngredientName(): void {
    if (this.ingredients) {
      if (this.ingredients[this.ingredients.length - 1].ingredient?.name) {
        this.addNewIngredient();
      }
    }
  }

  onDeleteIngredient(ingredientToRemove: RecipeIngredient): void {
    if (this.ingredients) {
      this.ingredients.splice(this.ingredients.indexOf(ingredientToRemove), 1);
    }
  }

  updatePositions(): void {
    for (let i = 0; i < this.ingredients.length; i++) {
      this.ingredients[i].position = i;
    }
  }

  addNewIngredient(): void {
    this.ingredients?.push({
      uuid: uuid(),
    });
  }
}
</script>

<style lang="scss">
@import "../../main.scss";
</style>