import { ShoppingItem } from "../types";
import { ingredientStore, ingredientCategoryStore } from "../stores/rootStore";

/**
 * Returns the category id of the given item or -1 if no category id is found
 * @param item the item for which to return the category id
 */
function getIngredientCategoryId(item: ShoppingItem): number {
  if (item.ingredientId) {
    const ingredient = ingredientStore.ingredientMap.get(item.ingredientId);
    if (ingredient && ingredient.ingredientCategoryId) {
      return ingredient.ingredientCategoryId;
    }
  }
  return -1;
}

function getCategoryOrder(categoryId: number): number {
  // some randomly high number to make sure that uncategorized items are sorted to the end
  const unsortedOrder = 10000;
  if (categoryId === -1) {
    return unsortedOrder;
  }
  const category = ingredientCategoryStore.categoriesMap.get(categoryId);
  if (!category || !category.order) {
    return unsortedOrder;
  }
  return category.order;
}

export function getShoppingItemsByCategory(shoppingItems: ShoppingItem[]): Map<number, ShoppingItem[]> {
  const itemsByCategory: Map<number, ShoppingItem[]> = new Map();
  const existingCategories: number[] = [];

  // create map by category
  shoppingItems.forEach(item => {
    const categoryId = getIngredientCategoryId(item);
    if (categoryId) {
      let itemsInCategory = itemsByCategory.get(categoryId);
      if (!itemsInCategory) {
        itemsInCategory = [];
        itemsByCategory.set(categoryId, itemsInCategory);
        existingCategories.push(categoryId);
      }
      itemsInCategory.push(item);
    }
  });

  // sort existing categories
  existingCategories.sort((categoryIdA, categoryIdB) => {
    const orderCategoryA = getCategoryOrder(categoryIdA);
    const orderCategoryB = getCategoryOrder(categoryIdB);
    return orderCategoryA - orderCategoryB;
  });

  // create map sorted by category
  const sortedItemsByCategory: Map<number, ShoppingItem[]> = new Map();
  existingCategories.forEach(categoryId => {
    const categoryItems = itemsByCategory.get(categoryId);
    if (!categoryItems) {
      console.error("Failed to find category with id " + categoryId);
    } else {
      sortedItemsByCategory.set(categoryId, categoryItems);
    }
  });
  return sortedItemsByCategory;
}

export function getCategoryName(categoryId: number): string {
  if (categoryId) {
    const category = ingredientCategoryStore.categoriesMap.get(categoryId);
    if (category && category.name) {
      return category.name;
    }
  }
  return "Sonstiges";
}