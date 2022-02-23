<template>
  <div class="form-group">
    <div class="row g-3">
      <div class="col-sm-7">
        <input
          type="text"
          class="form-control"
          placeholder="Zutatenname"
          v-model="ingredient.name"
          v-on:change="onNameChanged"
        />
      </div>
      <div class="col-sm">
        <input
          type="text"
          class="form-control"
          placeholder="Menge"
          v-model="ingredient.amount"
        />
      </div>
      <div class="col-sm">
        <input
          type="text"
          class="form-control"
          placeholder="Einheit"
          v-model="ingredient.unit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { IngredientsClient } from "../clients/IngredientsClient";
import { Ingredient } from "../types";

@Component({
  components: {},
})
export default class IngredientEditor extends Vue {
  @Prop({ required: true }) ingredient!: Ingredient;
  @Prop({ required: true }) existingIngredients!: Ingredient[];

  ingredients: Ingredient[] = [];
  client: IngredientsClient = new IngredientsClient();

  mounted(): void {
    const client = new IngredientsClient();
    client.getIngredients().then((ret) => {
      this.ingredients = ret;
    });
  }

  onNameChanged(): void {
    this.$emit("onNameChanged", this.ingredient.name);
  }
}
</script>
