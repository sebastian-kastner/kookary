export type Tag = {
    tagId?: number;
    name?: string;
    uuid: string;
}

export type Ingredient = {
    ingredientId?: number;
    name?: string;
}

export type RecipeIngredient = {
    recipeIngredientId?: number;
    uuid: string;
    ingredient?: Ingredient | null;
    quantity?: string | null;
    unit?: string | null;
}

export type Recipe = {
    recipeId?: number;
    name?: string;
    description?: string | null;
    servings?: number | null;
    source: string | null;
    rating?: number | null;
    dateAdded?: string | null;
    marked: boolean;
    ingredients: RecipeIngredient[];
    tags: Tag[];
    images: MediaObject[];
    imagesToDelete: number[];
}

export type MediaObject = {
    file?: File; // only required for new uploads
    mediaObjectId?: number | null; // only set for uploaded objects
    url?: string | null; // only set for uploaded objects
}

export function recipeFactory(): Recipe {
    return {
        ingredients: [],
        tags: [],
        source: null,
        marked: false,
        images: [],
        // FIXME this is fugly
        imagesToDelete: [],
    }
}
