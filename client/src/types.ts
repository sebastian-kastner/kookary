export type Tag = {
    tagId?: number;
    name?: string;
    authorId?: number;
    uuid: string;
}

export type Ingredient = {
    ingredientId?: number;
    name?: string;
    authorId?: number;
}

export type RecipeIngredient = {
    recipeIngredientId?: number;
    uuid: string;
    ingredient?: Ingredient | null;
    quantity?: string | null;
    unit?: string | null;
    position?: number | null;
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
    authorId: number | null;
}

export type User = {
    id?: number;
    email?: string;
    displayName?: string;
    roles?: string[];
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
        marked: false,
        images: [],
        authorId: null,
        // FIXME this is fugly
        imagesToDelete: [],
    }
}
