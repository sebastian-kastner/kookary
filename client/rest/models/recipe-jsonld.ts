/* tslint:disable */
/* eslint-disable */
/**
 * 
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { RecipeIngredientJsonld } from './recipe-ingredient-jsonld';

/**
 * Recipe
 * @export
 * @interface RecipeJsonld
 */
export interface RecipeJsonld {
    /**
     * 
     * @type {string | any}
     * @memberof RecipeJsonld
     */
    '@context'?: string | any;
    /**
     * 
     * @type {string}
     * @memberof RecipeJsonld
     */
    '@id'?: string;
    /**
     * 
     * @type {string}
     * @memberof RecipeJsonld
     */
    '@type'?: string;
    /**
     * 
     * @type {number}
     * @memberof RecipeJsonld
     */
    'recipeId'?: number;
    /**
     * 
     * @type {string}
     * @memberof RecipeJsonld
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof RecipeJsonld
     */
    'description'?: string | null;
    /**
     * 
     * @type {number}
     * @memberof RecipeJsonld
     */
    'servings'?: number | null;
    /**
     * 
     * @type {string}
     * @memberof RecipeJsonld
     */
    'source'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof RecipeJsonld
     */
    'dateAdded'?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof RecipeJsonld
     */
    'tags'?: Array<string>;
    /**
     * 
     * @type {Array<RecipeIngredientJsonld>}
     * @memberof RecipeJsonld
     */
    'ingredients'?: Array<RecipeIngredientJsonld>;
    /**
     * 
     * @type {Array<string>}
     * @memberof RecipeJsonld
     */
    'images'?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof RecipeJsonld
     */
    'author'?: string;
}

