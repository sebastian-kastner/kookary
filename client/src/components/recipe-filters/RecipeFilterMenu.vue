<template>
  <div v-if="filterMenuOpen" id="filter-menu" class="p-4">
    <div class="d-flex justify-content-between">
      <h3>Filtern & Sortieren</h3>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="closeMenu"
      ></button>
    </div>
    <div class="filter-menu-row">
      <!-- FIXME: extract into separate component -->
      <div class="form-floating">
        <select id="sort-by-select" class="form-select">
          <option value="datum">Datum</option>
          <option value="last-time-cooked">Zuletzt gekocht</option>
          <option value="seasonality">Saisonalität</option>
        </select>
        <label for="sort-by-select">Sortieren nach</label>
      </div>
    </div>
    <div class="filter-menu-row">
      <div class="filter-menu-row-head"><Icon icon="cursor" />Rezeptname</div>
      <div class="filter-menu-row-body">
        <input type="text" class="form-control" />
      </div>
    </div>
    <div class="filter-menu-row">
      <div class="filter-menu-row-head">
        <Icon icon="calendarWeek" />Saisonalität
      </div>
      <div class="filter-menu-row-body">
        <div class="form-check">
          <input
            id="is-seasonal-filter"
            class="form-check-input"
            type="checkbox"
            value=""
          />
          <label class="form-check-label" for="is-seasonal-filter">
            Nur saisonale Rezepte
          </label>
        </div>
      </div>
    </div>
    <div class="filter-menu-row">
      <div class="filter-menu-row-head"><Icon icon="bag" />Zutaten</div>
      <div class="filter-menu-row-body">
        <input type="text" class="form-control" />
      </div>
    </div>
    <div class="filter-menu-row">
      <div class="filter-menu-row-head"><Icon icon="tags" />Tags</div>
      <div class="filter-menu-row-body">
        <input type="text" class="form-control" />
      </div>
    </div>
    <div class="filter-menu-row">
      <div class="filter-menu-row-head"><Icon icon="bell" />Merkliste</div>
      <div class="filter-menu-row-body">
        <div class="form-check">
          <input
            id="is-marked-filter"
            class="form-check-input"
            type="checkbox"
            value=""
          />
          <label class="form-check-label" for="is-marked-filter">
            Nur Rezepte auf Merkliste
          </label>
        </div>
      </div>
    </div>
    <div class="py-4">
      <button
        type="button"
        class="apply-filter btn btn-outline-primary"
        @click="applyFilter"
      >
        Filtern!
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-facing-decorator";
import { RecipeFilter } from "../../clients/RecipesClient";
import { Icon } from "@iconify/vue/dist/offline";
import cloneDeep from "lodash.clonedeep";

@Component({
  components: { Icon },
})
export default class RecipeFilterMenu extends Vue {
  @Prop({ required: true }) filterMenuOpen!: boolean;
  @Prop({ required: true }) activeFilter!: RecipeFilter;

  localFilter: RecipeFilter | null = null;

  @Watch("filterMenuOpen")
  onFilterMenuOpenChanged() {
    if (this.filterMenuOpen) {
      console.log("cloning filter for edit..");
      this.localFilter = cloneDeep(this.activeFilter);
    }
  }

  closeMenu(): void {
    this.$emit("close-menu");
  }

  applyFilter() {
    if (!this.localFilter) {
      this.$emit("close-menu");
      return;
    }
    this.$emit("apply-filter", this.activeFilter);
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

#filter-menu {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 450px;
  height: 100vh;
  background-color: white;
  z-index: 9999;
  color: black;
  border: 1px solid darkgray;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

  .filter-menu-row {
    border-bottom: 1px solid lightgray;
    padding: 15px 0;

    .filter-menu-row-head {
      font-weight: bold;
      padding-bottom: 5px;
      display: flex;
      align-items: center;

      svg {
        margin-right: 5px;
        font-size: 1.1rem;
      }
    }
  }

  .apply-filter {
    width: 100%;
  }
}
</style>
