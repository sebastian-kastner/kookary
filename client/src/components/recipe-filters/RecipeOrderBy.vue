<template>
  <div class="form-floating">
    <select
      id="sort-by-select"
      v-model="selectedOption"
      class="form-select"
      @change="updateOrderBy"
    >
      <option
        v-for="option in orderOptions"
        :key="option.orderBy + '.' + option.orderByDirection"
        :value="option"
        :selected="option === selectedOption"
      >
        {{ option.label }}
      </option>
    </select>
    <label for="sort-by-select">Sortieren nach</label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-facing-decorator";
import { RecipeFilter } from "../../clients/RecipesClient";
import { Icon } from "@iconify/vue/dist/offline";

type OrderOption = {
  orderBy: "date" | "name" | "seasonality";
  orderByDirection: "asc" | "desc";
  label: string;
};

@Component({
  components: { Icon },
  emits: ["orderingUpdated"],
})
export default class RecipeOrderBy extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  orderOptions: OrderOption[] = [
    { orderBy: "date", orderByDirection: "desc", label: "Datum (neueste zuerst)" },
    { orderBy: "date", orderByDirection: "asc", label: "Datum (älteste zuerst)" },
    { orderBy: "name", orderByDirection: "asc", label: "Name (aufsteigend)" },
    { orderBy: "name", orderByDirection: "desc", label: "Name (absteigend)" },
    { orderBy: "seasonality", orderByDirection: "desc", label: "Saisonalität" },
  ];

  selectedOption: OrderOption | null = null;

  @Watch("recipeFilter.orderBy", { immediate: true })
  @Watch("recipeFilter.orderByDirection", { immediate: true })
  public updateSelectedOption(): void {
    if (this.recipeFilter.orderBy && this.recipeFilter.orderByDirection) {
      const filterOption = this.orderOptions.find(
        (o) =>
          o.orderBy === this.recipeFilter.orderBy &&
          o.orderByDirection === this.recipeFilter.orderByDirection
      );
      if (filterOption) {
        this.selectedOption = filterOption;
        return;
      }
    }

    this.selectedOption = this.orderOptions[0];
  }

  public updateOrderBy(): void {
    if (!this.selectedOption) {
      return;
    }

    this.recipeFilter.orderBy = this.selectedOption.orderBy;
    this.recipeFilter.orderByDirection = this.selectedOption.orderByDirection;

    this.$emit("orderingUpdated");
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
</style>
