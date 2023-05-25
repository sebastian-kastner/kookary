<template>
  <div id="user-mgt" class="container main-content padding-top">
    <h3>Zutaten</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col" class="d-none d-ml-table-cell">Author</th>
          <th scope="col">Name</th>
          <th scope="col">Category</th>
          <th scope="col" class="d-none d-sm-table-cell">Saison von</th>
          <th scope="col" class="d-none d-sm-table-cell">Saison bis</th>
          <th scope="col" />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="d-none d-ml-table-cell">
            <select
              v-model="filter.authorId"
              name="author"
              class="form-control"
              @change="applyFilter"
            >
              <option value="-1">-</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.displayName }}
              </option>
            </select>
          </td>
          <td>
            <input
              v-model="filter.ingredientName"
              type="text"
              class="form-control"
              @focusout="applyFilter"
              @keydown.enter="applyFilter"
            />
          </td>
          <td>
            <select
              v-model="filter.categoryId"
              name="category"
              class="form-control"
              @change="applyFilter"
            >
              <option value="-1">-</option>
              <option value="0">Unkategorisiert</option>
              <option
                v-for="category in categories"
                :key="category.ingredientCategoryId"
                :value="category.ingredientCategoryId"
              >
                {{ category.name }}
              </option>
            </select>
          </td>
          <td colspan="2" class="d-none d-sm-table-cell">
            <select
              v-model="filter.seasonal"
              name="seasonal"
              class="form-control"
              @change="applyFilter"
            >
              <option value="">-</option>
              <option value="seasonal">Saisonal</option>
              <option value="nonseasonal">Nicht Saisonal</option>
            </select>
          </td>
          <td />
        </tr>

        <ingredient-editor
          v-for="ingredient in ingredients"
          :key="ingredient.ingredientId"
          :ingredient="ingredient"
          @onIngredientDelete="removeIngredient"
        />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Ingredient, User, IngredientCategory } from "../../types";
import { Options, Vue } from "vue-class-component";
import {
  ingredientStore,
  userStore,
  ingredientCategoryStore,
} from "../../stores/rootStore";
import IngredientEditor from "../../components/admin/IngredientEditor.vue";
import { getErrorMessage } from "../../utils/errors";
import { useModal } from "vue-final-modal";
import DialogModal from "../../components/DialogModal.vue";

type IngredientFilter = {
  ingredientName: string | null;
  authorId: string;
  categoryId: string;
  seasonal: string;
};

@Options({
  components: {
    IngredientEditor,
  },
})
export default class IngredientMgmtView extends Vue {
  ingredients: Ingredient[] = [];

  filter: IngredientFilter = {
    ingredientName: null,
    authorId: "-1",
    categoryId: "0",
    seasonal: "",
  };

  mounted(): void {
    this.ingredients = [...ingredientStore.ingredients];
    this.applyFilter();
  }

  get users(): User[] {
    return userStore.users;
  }

  get categories(): IngredientCategory[] {
    return ingredientCategoryStore.categories;
  }

  applyFilter(): void {
    const filteredIngredients: Ingredient[] = [];

    let ingredientName: string | null = null;
    if (this.filter.ingredientName && this.filter.ingredientName !== "") {
      ingredientName = this.filter.ingredientName;
    }

    let categoryId = -1;
    if (this.filter.categoryId) {
      const tmpNmbr = parseInt(this.filter.categoryId);
      if (!isNaN(tmpNmbr)) {
        categoryId = tmpNmbr;
      }
    }

    let authorId = -1;
    if (this.filter.authorId) {
      const tmpNmbr = parseInt(this.filter.authorId);
      if (!isNaN(tmpNmbr)) {
        authorId = tmpNmbr;
      }
    }

    let seasonal: null | boolean = null;
    if (this.filter.seasonal === "seasonal") {
      seasonal = true;
    } else if (this.filter.seasonal === "nonseasonal") {
      seasonal = false;
    }

    ingredientStore.ingredients.forEach((ingredient) => {
      if (
        this.appliesToFilter(
          ingredient,
          ingredientName,
          categoryId,
          authorId,
          seasonal
        )
      ) {
        filteredIngredients.push(ingredient);
      }
    });
    this.ingredients = filteredIngredients;
  }

  removeIngredient(ingredient: Ingredient): void {
    const deleteHandler = () => {
      return new Promise<void>((resolve, reject) => {
        if (ingredient.ingredientId) {
          ingredientStore
            .removeIngredient(ingredient.ingredientId)
            .then(() => {
              // remove ingredient from view
              this.ingredients.splice(this.ingredients.indexOf(ingredient), 1);
              resolve();
            })
            .catch((err) => {
              // const errorMessage = getErrorMessage(err);
              // this.$toast.open(`Fehler beim Löschen von ${ingredient.name}: ${errorMessage}`);
              reject();
            });
        }
      });
    };

    const { open, close } = useModal({
      component: DialogModal,
      attrs: {
        title: `Zutat löschen`,
        text: `Soll die Zutat ${ingredient.name} wirklich gelöscht werden?`,
        confirmText: "Löschen",
        cancelText: "Abbrechen",
        onConfirm() {
          deleteHandler().finally(() => close());
        },
        onCancel() {
          close();
        },
      },
    });
    open();
  }

  private appliesToFilter(
    ingredient: Ingredient,
    ingredientName: null | string,
    categoryId: number,
    authorId: number,
    seasonal: null | boolean
  ) {
    if (
      ingredientName &&
      ingredientName !== "" &&
      !ingredient.name?.toLowerCase().includes(ingredientName.toLowerCase())
    ) {
      return false;
    }
    if (categoryId > 0 && ingredient.ingredientCategoryId !== categoryId) {
      return false;
    }
    if (
      categoryId == 0 &&
      ingredient.ingredientCategoryId &&
      ingredient.ingredientCategoryId > 0
    ) {
      return false;
    }
    if (authorId > 0 && ingredient.authorId !== authorId) {
      return false;
    }
    if (seasonal !== null) {
      if (seasonal && (!ingredient.seasonStart || !ingredient.seasonEnd)) {
        return false;
      }
      if (!seasonal && (ingredient.seasonStart || ingredient.seasonEnd)) {
        return false;
      }
    }
    return true;
  }
}
</script>

<style lang="scss">
@import "../../styles/variables.scss";
</style>
