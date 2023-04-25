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


import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { InlineResponse2004 } from '../models';
// @ts-ignore
import { Recipe } from '../models';
// @ts-ignore
import { RecipeJsonld } from '../models';
/**
 * RecipeApi - axios parameter creator
 * @export
 */
export const RecipeApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Removes the Recipe resource.
         * @summary Removes the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteRecipeItem: async (recipeId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'recipeId' is not null or undefined
            assertParamExists('deleteRecipeItem', 'recipeId', recipeId)
            const localVarPath = `/api/recipes/{recipeId}`
                .replace(`{${"recipeId"}}`, encodeURIComponent(String(recipeId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieves the collection of Recipe resources.
         * @summary Retrieves the collection of Recipe resources.
         * @param {number} [page] The collection page number
         * @param {string} [ingredients] Provide a comma separated list of ingredient ids to only return recipes containing all the given ingredients
         * @param {string} [tags] Provide a comma separated list of tag ids to only return recipes tagged with all the given tags
         * @param {boolean} [seasonal] Set to true to only return recipes with at least one seasonal ingredient
         * @param {boolean} [marked] Set to true to only return recipes marked by the logged in user
         * @param {'date' | 'rand'} [orderBy] If set, results will be sorted by the given property (Default: date)
         * @param {'desc' | 'asc'} [orderByDirection] If set, results will be sorted in the given direction (Default: desc)
         * @param {string} [author] Provide a comma separated list of author ids to only return recipes created by the given authors
         * @param {string} [name] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecipeCollection: async (page?: number, ingredients?: string, tags?: string, seasonal?: boolean, marked?: boolean, orderBy?: 'date' | 'rand', orderByDirection?: 'desc' | 'asc', author?: string, name?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/recipes`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (ingredients !== undefined) {
                localVarQueryParameter['ingredients'] = ingredients;
            }

            if (tags !== undefined) {
                localVarQueryParameter['tags'] = tags;
            }

            if (seasonal !== undefined) {
                localVarQueryParameter['seasonal'] = seasonal;
            }

            if (marked !== undefined) {
                localVarQueryParameter['marked'] = marked;
            }

            if (orderBy !== undefined) {
                localVarQueryParameter['order_by'] = orderBy;
            }

            if (orderByDirection !== undefined) {
                localVarQueryParameter['order_by_direction'] = orderByDirection;
            }

            if (author !== undefined) {
                localVarQueryParameter['author'] = author;
            }

            if (name !== undefined) {
                localVarQueryParameter['name'] = name;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieves a Recipe resource.
         * @summary Retrieves a Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecipeItem: async (recipeId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'recipeId' is not null or undefined
            assertParamExists('getRecipeItem', 'recipeId', recipeId)
            const localVarPath = `/api/recipes/{recipeId}`
                .replace(`{${"recipeId"}}`, encodeURIComponent(String(recipeId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Updates the Recipe resource.
         * @summary Updates the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {Recipe} recipe The updated Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patchRecipeItem: async (recipeId: string, recipe: Recipe, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'recipeId' is not null or undefined
            assertParamExists('patchRecipeItem', 'recipeId', recipeId)
            // verify required parameter 'recipe' is not null or undefined
            assertParamExists('patchRecipeItem', 'recipe', recipe)
            const localVarPath = `/api/recipes/{recipeId}`
                .replace(`{${"recipeId"}}`, encodeURIComponent(String(recipeId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/merge-patch+json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(recipe, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Creates a Recipe resource.
         * @summary Creates a Recipe resource.
         * @param {RecipeJsonld} recipeJsonld The new Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postRecipeCollection: async (recipeJsonld: RecipeJsonld, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'recipeJsonld' is not null or undefined
            assertParamExists('postRecipeCollection', 'recipeJsonld', recipeJsonld)
            const localVarPath = `/api/recipes`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/ld+json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(recipeJsonld, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Replaces the Recipe resource.
         * @summary Replaces the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {RecipeJsonld} recipeJsonld The updated Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putRecipeItem: async (recipeId: string, recipeJsonld: RecipeJsonld, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'recipeId' is not null or undefined
            assertParamExists('putRecipeItem', 'recipeId', recipeId)
            // verify required parameter 'recipeJsonld' is not null or undefined
            assertParamExists('putRecipeItem', 'recipeJsonld', recipeJsonld)
            const localVarPath = `/api/recipes/{recipeId}`
                .replace(`{${"recipeId"}}`, encodeURIComponent(String(recipeId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/ld+json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(recipeJsonld, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * RecipeApi - functional programming interface
 * @export
 */
export const RecipeApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = RecipeApiAxiosParamCreator(configuration)
    return {
        /**
         * Removes the Recipe resource.
         * @summary Removes the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteRecipeItem(recipeId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteRecipeItem(recipeId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves the collection of Recipe resources.
         * @summary Retrieves the collection of Recipe resources.
         * @param {number} [page] The collection page number
         * @param {string} [ingredients] Provide a comma separated list of ingredient ids to only return recipes containing all the given ingredients
         * @param {string} [tags] Provide a comma separated list of tag ids to only return recipes tagged with all the given tags
         * @param {boolean} [seasonal] Set to true to only return recipes with at least one seasonal ingredient
         * @param {boolean} [marked] Set to true to only return recipes marked by the logged in user
         * @param {'date' | 'rand'} [orderBy] If set, results will be sorted by the given property (Default: date)
         * @param {'desc' | 'asc'} [orderByDirection] If set, results will be sorted in the given direction (Default: desc)
         * @param {string} [author] Provide a comma separated list of author ids to only return recipes created by the given authors
         * @param {string} [name] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getRecipeCollection(page?: number, ingredients?: string, tags?: string, seasonal?: boolean, marked?: boolean, orderBy?: 'date' | 'rand', orderByDirection?: 'desc' | 'asc', author?: string, name?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2004>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getRecipeCollection(page, ingredients, tags, seasonal, marked, orderBy, orderByDirection, author, name, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves a Recipe resource.
         * @summary Retrieves a Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getRecipeItem(recipeId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RecipeJsonld>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getRecipeItem(recipeId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Updates the Recipe resource.
         * @summary Updates the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {Recipe} recipe The updated Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async patchRecipeItem(recipeId: string, recipe: Recipe, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RecipeJsonld>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.patchRecipeItem(recipeId, recipe, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a Recipe resource.
         * @summary Creates a Recipe resource.
         * @param {RecipeJsonld} recipeJsonld The new Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postRecipeCollection(recipeJsonld: RecipeJsonld, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RecipeJsonld>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.postRecipeCollection(recipeJsonld, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Replaces the Recipe resource.
         * @summary Replaces the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {RecipeJsonld} recipeJsonld The updated Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putRecipeItem(recipeId: string, recipeJsonld: RecipeJsonld, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RecipeJsonld>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.putRecipeItem(recipeId, recipeJsonld, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * RecipeApi - factory interface
 * @export
 */
export const RecipeApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = RecipeApiFp(configuration)
    return {
        /**
         * Removes the Recipe resource.
         * @summary Removes the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteRecipeItem(recipeId: string, options?: any): AxiosPromise<void> {
            return localVarFp.deleteRecipeItem(recipeId, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the collection of Recipe resources.
         * @summary Retrieves the collection of Recipe resources.
         * @param {number} [page] The collection page number
         * @param {string} [ingredients] Provide a comma separated list of ingredient ids to only return recipes containing all the given ingredients
         * @param {string} [tags] Provide a comma separated list of tag ids to only return recipes tagged with all the given tags
         * @param {boolean} [seasonal] Set to true to only return recipes with at least one seasonal ingredient
         * @param {boolean} [marked] Set to true to only return recipes marked by the logged in user
         * @param {'date' | 'rand'} [orderBy] If set, results will be sorted by the given property (Default: date)
         * @param {'desc' | 'asc'} [orderByDirection] If set, results will be sorted in the given direction (Default: desc)
         * @param {string} [author] Provide a comma separated list of author ids to only return recipes created by the given authors
         * @param {string} [name] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecipeCollection(page?: number, ingredients?: string, tags?: string, seasonal?: boolean, marked?: boolean, orderBy?: 'date' | 'rand', orderByDirection?: 'desc' | 'asc', author?: string, name?: string, options?: any): AxiosPromise<InlineResponse2004> {
            return localVarFp.getRecipeCollection(page, ingredients, tags, seasonal, marked, orderBy, orderByDirection, author, name, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a Recipe resource.
         * @summary Retrieves a Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecipeItem(recipeId: string, options?: any): AxiosPromise<RecipeJsonld> {
            return localVarFp.getRecipeItem(recipeId, options).then((request) => request(axios, basePath));
        },
        /**
         * Updates the Recipe resource.
         * @summary Updates the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {Recipe} recipe The updated Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patchRecipeItem(recipeId: string, recipe: Recipe, options?: any): AxiosPromise<RecipeJsonld> {
            return localVarFp.patchRecipeItem(recipeId, recipe, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a Recipe resource.
         * @summary Creates a Recipe resource.
         * @param {RecipeJsonld} recipeJsonld The new Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postRecipeCollection(recipeJsonld: RecipeJsonld, options?: any): AxiosPromise<RecipeJsonld> {
            return localVarFp.postRecipeCollection(recipeJsonld, options).then((request) => request(axios, basePath));
        },
        /**
         * Replaces the Recipe resource.
         * @summary Replaces the Recipe resource.
         * @param {string} recipeId Resource identifier
         * @param {RecipeJsonld} recipeJsonld The updated Recipe resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putRecipeItem(recipeId: string, recipeJsonld: RecipeJsonld, options?: any): AxiosPromise<RecipeJsonld> {
            return localVarFp.putRecipeItem(recipeId, recipeJsonld, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * RecipeApi - object-oriented interface
 * @export
 * @class RecipeApi
 * @extends {BaseAPI}
 */
export class RecipeApi extends BaseAPI {
    /**
     * Removes the Recipe resource.
     * @summary Removes the Recipe resource.
     * @param {string} recipeId Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecipeApi
     */
    public deleteRecipeItem(recipeId: string, options?: AxiosRequestConfig) {
        return RecipeApiFp(this.configuration).deleteRecipeItem(recipeId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves the collection of Recipe resources.
     * @summary Retrieves the collection of Recipe resources.
     * @param {number} [page] The collection page number
     * @param {string} [ingredients] Provide a comma separated list of ingredient ids to only return recipes containing all the given ingredients
     * @param {string} [tags] Provide a comma separated list of tag ids to only return recipes tagged with all the given tags
     * @param {boolean} [seasonal] Set to true to only return recipes with at least one seasonal ingredient
     * @param {boolean} [marked] Set to true to only return recipes marked by the logged in user
     * @param {'date' | 'rand'} [orderBy] If set, results will be sorted by the given property (Default: date)
     * @param {'desc' | 'asc'} [orderByDirection] If set, results will be sorted in the given direction (Default: desc)
     * @param {string} [author] Provide a comma separated list of author ids to only return recipes created by the given authors
     * @param {string} [name] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecipeApi
     */
    public getRecipeCollection(page?: number, ingredients?: string, tags?: string, seasonal?: boolean, marked?: boolean, orderBy?: 'date' | 'rand', orderByDirection?: 'desc' | 'asc', author?: string, name?: string, options?: AxiosRequestConfig) {
        return RecipeApiFp(this.configuration).getRecipeCollection(page, ingredients, tags, seasonal, marked, orderBy, orderByDirection, author, name, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves a Recipe resource.
     * @summary Retrieves a Recipe resource.
     * @param {string} recipeId Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecipeApi
     */
    public getRecipeItem(recipeId: string, options?: AxiosRequestConfig) {
        return RecipeApiFp(this.configuration).getRecipeItem(recipeId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Updates the Recipe resource.
     * @summary Updates the Recipe resource.
     * @param {string} recipeId Resource identifier
     * @param {Recipe} recipe The updated Recipe resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecipeApi
     */
    public patchRecipeItem(recipeId: string, recipe: Recipe, options?: AxiosRequestConfig) {
        return RecipeApiFp(this.configuration).patchRecipeItem(recipeId, recipe, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a Recipe resource.
     * @summary Creates a Recipe resource.
     * @param {RecipeJsonld} recipeJsonld The new Recipe resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecipeApi
     */
    public postRecipeCollection(recipeJsonld: RecipeJsonld, options?: AxiosRequestConfig) {
        return RecipeApiFp(this.configuration).postRecipeCollection(recipeJsonld, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Replaces the Recipe resource.
     * @summary Replaces the Recipe resource.
     * @param {string} recipeId Resource identifier
     * @param {RecipeJsonld} recipeJsonld The updated Recipe resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecipeApi
     */
    public putRecipeItem(recipeId: string, recipeJsonld: RecipeJsonld, options?: AxiosRequestConfig) {
        return RecipeApiFp(this.configuration).putRecipeItem(recipeId, recipeJsonld, options).then((request) => request(this.axios, this.basePath));
    }
}
