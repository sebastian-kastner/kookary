export type Tag = {
    tagId?: number;
    name?: string;
    authorId?: number;
    uuid: string;
}

export type IngredientCategory = {
    ingredientCategoryId?: number;
    name?: string;
    order?: number;
    isDefault?: null | boolean;
}

export type Ingredient = {
    ingredientId?: number;
    name?: string;
    authorId?: number;
    seasonStart?: null | number;
    seasonEnd?: null | number;
    ingredientCategoryId?: number;
}

export type RecipeIngredient = {
    recipeIngredientId?: number;
    uuid: string;
    ingredient?: Ingredient | null;
    quantity?: string | null;
    unit?: string | null;
    position?: number | null;
}

export type Cookup = {
    cookupId?: number | null;
    userId?: number | null;
    recipeId?: number | null;
    date?: string | null;
}

export type ShoppingItem = {
    shoppingItemId?: number | null;
    name?: string | null;
    user?: number | null;
    ingredientId?: number | null;
    unit?: string | null;
    quantity?: string | null;
    done?: boolean;
}

export type Recipe = {
    recipeId?: number;
    name?: string;
    description?: string | null;
    servings?: number | null;
    source: string | null;
    rating?: number | null;
    dateAdded?: string | null;
    ingredients: RecipeIngredient[];
    tags: Tag[];
    images: MediaObject[];
    imagesToDelete: number[];
    authorId: number | null;
}

export type User = {
    id?: number;
    email?: string;
    displayName?: string;
    roles?: Set<string>;
}

export type MediaObject = {
    file?: File; // only required for new uploads
    mediaObjectId?: number | null; // only set for uploaded objects
    url?: string | null; // only set for uploaded objects
    authorId?: number | null;
}

export function recipeFactory(): Recipe {
    return {
        ingredients: [],
        tags: [],
        source: null,
        images: [],
        authorId: null,
        // FIXME this is fugly
        imagesToDelete: [],
    }
}
