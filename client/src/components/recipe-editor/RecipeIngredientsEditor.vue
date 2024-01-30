<template>
  <div>
    <div class="d-flex justify-content-end m-2">
      <button
        type="submit"
        class="btn btn-outline-primary"
        @click="addSeparator"
      >
        + Überschrift
      </button>
    </div>
    <draggable
      :list="ingredients"
      class="list-group"
      handle=".draggable-handle"
      @end="updatePositions"
    >
      <div
        v-for="ingredient, index in ingredients"
        v-bind="ingredient"
        :key="ingredient.uuid"
      >
        <recipe-ingredient-separator-editor
          v-if="isSeparator(ingredient)"
          :separator="ingredient"
          :separator-index="index"
          handle-class="draggable-handle"
          @onDelete="onSeparatorDelete"
        />
        <recipe-ingredient-editor
          v-else
          :ingredient="ingredient"
          :existing-ingredients="existingIngredients"
          handle-class="draggable-handle"
          @onNameChanged="updateIngredientName"
          @onDelete="onDeleteIngredient"
        />
      </div>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { VueDraggableNext } from "vue-draggable-next";
import { RecipeIngredient, Ingredient } from "../../types";
import RecipeIngredientEditor from "./RecipeIngredientEditor.vue";
import RecipeIngredientSeparatorEditor from "./RecipeIngredientSeparatorEditor.vue";
import { v4 as uuid } from "uuid";

@Component({
  components: {
    RecipeIngredientEditor,
    RecipeIngredientSeparatorEditor,
    draggable: VueDraggableNext,
  },
})
export default class RecipeIngredientsEditor extends Vue {
  @Prop({ required: true }) ingredients!: RecipeIngredient[];
  @Prop({ required: true }) existingIngredients!: Ingredient[];

  updateIngredientName(): void {
    if (this.ingredients) {
      const lastIngredient = this.ingredients[this.ingredients.length - 1].ingredient;
      if (lastIngredient && lastIngredient.name) {
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

  onSeparatorDelete(separator: RecipeIngredient): void {
    if (this.ingredients) {
      this.ingredients.splice(this.ingredients.indexOf(separator), 1);
    }
  }

  isSeparator(ingredient: RecipeIngredient): boolean {
    if (ingredient.separatorLabel !== undefined && ingredient.separatorLabel !== null) {
      return true;
    }
    return false;
  }

  addSeparator(): void {
    let position = 0;
    let hasSeparator = false;
    for (let i = 0; i < this.ingredients.length; i++) {
      const ingredient = this.ingredients[i];
      if (ingredient.separatorLabel !== null && ingredient.separatorLabel !== undefined) {
        hasSeparator = true;
        break;
      }
    }
    if (hasSeparator) {
      position = this.ingredients.length - 1;
    }
    const separator: RecipeIngredient = {
      uuid: uuid(),
      separatorLabel: "",
      position: position,
    }

    // insert separator at calculated position
    this.ingredients.splice(position, 0, separator);
  }

  addNewIngredient(): void {
    this.ingredients?.push({
      uuid: uuid(),
    });
  }
}
</script>

<style lang="scss">
@import "../../styles/variables.scss";
</style>
