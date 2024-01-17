<template>
  <div id="recipe-filter-bar" class="container my-2">
    <div class="d-flex justify-content-between">
      <div class="d-flex align-items-center">
        <span role="button" @click="showFilterMenu">
          <Icon icon="filter" class="me-2" /> Filter
        </span>
      </div>
      <div class="form-floating">
        <recipe-order-by
          :recipe-filter="recipeFilter"
          @orderingUpdated="applyNewOrdering"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { Icon } from "@iconify/vue/dist/offline";
import { RecipeFilter } from "../../clients/RecipesClient";
import cloneDeep from "lodash.clonedeep";
import RecipeFilterMenu from "./RecipeFilterMenu.vue";
import RecipeOrderBy from "./RecipeOrderBy.vue";
import { useModal } from "vue-final-modal";

@Component({
  components: { Icon, RecipeOrderBy },
  emits: ["update-filter", "replace-filter"],
})
export default class RecipeFilterBar extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  applyNewOrdering() {
    this.$emit("update-filter");
  }

  applyFilter(recipeFilter: RecipeFilter) {
    this.$emit("replace-filter", recipeFilter);
  }

  showFilterMenu(): void {
    const localFilter = cloneDeep(this.recipeFilter);
    const emitter = this.$emit;
    const { open, close } = useModal({
      component: RecipeFilterMenu,
      slots: {
        default: () => null,
      },
      attrs: {
        localFilter: localFilter,
        onClose(): void {
          close();
        },
        onApply(newFilter: RecipeFilter): void {
          emitter("replace-filter", newFilter);
          close();
        },
      },
    });
    open();
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

#recipe-filter-bar {
  background-color: $background-color-main;
  color: black;

  span:hover {
    svg {
      background-color: darken($button-color-main, 15%);
    }
  }

  svg {
    background-color: $button-color-main;
    padding: 4px 6px;
    border-radius: 4px;
    color: white;
    font-size: 2.2rem;
  }
}
</style>
