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
import { InlineResponse2006 } from '../models';
// @ts-ignore
import { UserJsonldRead } from '../models';
// @ts-ignore
import { UserJsonldWrite } from '../models';
// @ts-ignore
import { UserRead } from '../models';
// @ts-ignore
import { UserWrite } from '../models';
/**
 * UserApi - axios parameter creator
 * @export
 */
export const UserApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Removes the User resource.
         * @summary Removes the User resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteUserItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteUserItem', 'id', id)
            const localVarPath = `/api/users/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
         * Retrieves the collection of User resources.
         * @summary Retrieves the collection of User resources.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserCollection: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/users`;
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
         * Retrieves a User resource.
         * @summary Retrieves a User resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getUserItem', 'id', id)
            const localVarPath = `/api/users/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
         * Updates the User resource.
         * @summary Updates the User resource.
         * @param {string} id Resource identifier
         * @param {UserWrite} userWrite The updated User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patchUserItem: async (id: string, userWrite: UserWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('patchUserItem', 'id', id)
            // verify required parameter 'userWrite' is not null or undefined
            assertParamExists('patchUserItem', 'userWrite', userWrite)
            const localVarPath = `/api/users/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
            localVarRequestOptions.data = serializeDataIfNeeded(userWrite, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Creates a User resource.
         * @summary Creates a User resource.
         * @param {UserJsonldWrite} userJsonldWrite The new User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postUserCollection: async (userJsonldWrite: UserJsonldWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userJsonldWrite' is not null or undefined
            assertParamExists('postUserCollection', 'userJsonldWrite', userJsonldWrite)
            const localVarPath = `/api/users`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(userJsonldWrite, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Replaces the User resource.
         * @summary Replaces the User resource.
         * @param {string} id Resource identifier
         * @param {UserJsonldWrite} userJsonldWrite The updated User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putUserItem: async (id: string, userJsonldWrite: UserJsonldWrite, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('putUserItem', 'id', id)
            // verify required parameter 'userJsonldWrite' is not null or undefined
            assertParamExists('putUserItem', 'userJsonldWrite', userJsonldWrite)
            const localVarPath = `/api/users/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
            localVarRequestOptions.data = serializeDataIfNeeded(userJsonldWrite, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UserApi - functional programming interface
 * @export
 */
export const UserApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UserApiAxiosParamCreator(configuration)
    return {
        /**
         * Removes the User resource.
         * @summary Removes the User resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteUserItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteUserItem(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves the collection of User resources.
         * @summary Retrieves the collection of User resources.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserCollection(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2006>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUserCollection(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves a User resource.
         * @summary Retrieves a User resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserJsonldRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUserItem(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Updates the User resource.
         * @summary Updates the User resource.
         * @param {string} id Resource identifier
         * @param {UserWrite} userWrite The updated User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async patchUserItem(id: string, userWrite: UserWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserJsonldRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.patchUserItem(id, userWrite, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a User resource.
         * @summary Creates a User resource.
         * @param {UserJsonldWrite} userJsonldWrite The new User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postUserCollection(userJsonldWrite: UserJsonldWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserJsonldRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.postUserCollection(userJsonldWrite, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Replaces the User resource.
         * @summary Replaces the User resource.
         * @param {string} id Resource identifier
         * @param {UserJsonldWrite} userJsonldWrite The updated User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putUserItem(id: string, userJsonldWrite: UserJsonldWrite, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserJsonldRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.putUserItem(id, userJsonldWrite, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * UserApi - factory interface
 * @export
 */
export const UserApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UserApiFp(configuration)
    return {
        /**
         * Removes the User resource.
         * @summary Removes the User resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteUserItem(id: string, options?: any): AxiosPromise<void> {
            return localVarFp.deleteUserItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the collection of User resources.
         * @summary Retrieves the collection of User resources.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserCollection(options?: any): AxiosPromise<InlineResponse2006> {
            return localVarFp.getUserCollection(options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a User resource.
         * @summary Retrieves a User resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserItem(id: string, options?: any): AxiosPromise<UserJsonldRead> {
            return localVarFp.getUserItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Updates the User resource.
         * @summary Updates the User resource.
         * @param {string} id Resource identifier
         * @param {UserWrite} userWrite The updated User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patchUserItem(id: string, userWrite: UserWrite, options?: any): AxiosPromise<UserJsonldRead> {
            return localVarFp.patchUserItem(id, userWrite, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a User resource.
         * @summary Creates a User resource.
         * @param {UserJsonldWrite} userJsonldWrite The new User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postUserCollection(userJsonldWrite: UserJsonldWrite, options?: any): AxiosPromise<UserJsonldRead> {
            return localVarFp.postUserCollection(userJsonldWrite, options).then((request) => request(axios, basePath));
        },
        /**
         * Replaces the User resource.
         * @summary Replaces the User resource.
         * @param {string} id Resource identifier
         * @param {UserJsonldWrite} userJsonldWrite The updated User resource
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putUserItem(id: string, userJsonldWrite: UserJsonldWrite, options?: any): AxiosPromise<UserJsonldRead> {
            return localVarFp.putUserItem(id, userJsonldWrite, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * Removes the User resource.
     * @summary Removes the User resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public deleteUserItem(id: string, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).deleteUserItem(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves the collection of User resources.
     * @summary Retrieves the collection of User resources.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getUserCollection(options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).getUserCollection(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves a User resource.
     * @summary Retrieves a User resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getUserItem(id: string, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).getUserItem(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Updates the User resource.
     * @summary Updates the User resource.
     * @param {string} id Resource identifier
     * @param {UserWrite} userWrite The updated User resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public patchUserItem(id: string, userWrite: UserWrite, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).patchUserItem(id, userWrite, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a User resource.
     * @summary Creates a User resource.
     * @param {UserJsonldWrite} userJsonldWrite The new User resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public postUserCollection(userJsonldWrite: UserJsonldWrite, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).postUserCollection(userJsonldWrite, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Replaces the User resource.
     * @summary Replaces the User resource.
     * @param {string} id Resource identifier
     * @param {UserJsonldWrite} userJsonldWrite The updated User resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public putUserItem(id: string, userJsonldWrite: UserJsonldWrite, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).putUserItem(id, userJsonldWrite, options).then((request) => request(this.axios, this.basePath));
    }
}
