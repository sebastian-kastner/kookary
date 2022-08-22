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
import { InlineResponse2001 } from '../models';
// @ts-ignore
import { MediaObjectJsonldMediaObjectRead } from '../models';
// @ts-ignore
import { MediaObjectMediaObjectRead } from '../models';
/**
 * MediaObjectApi - axios parameter creator
 * @export
 */
export const MediaObjectApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Retrieves the collection of MediaObject resources.
         * @summary Retrieves the collection of MediaObject resources.
         * @param {number} [page] The collection page number
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMediaObjectCollection: async (page?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/media_objects`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
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
         * Retrieves a MediaObject resource.
         * @summary Retrieves a MediaObject resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMediaObjectItem: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getMediaObjectItem', 'id', id)
            const localVarPath = `/api/media_objects/{id}`
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


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Creates a MediaObject resource.
         * @summary Creates a MediaObject resource.
         * @param {any} [file] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postMediaObjectCollection: async (file?: any, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/media_objects`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();


            if (file !== undefined) { 
                localVarFormParams.append('file', file as any);
            }
    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * MediaObjectApi - functional programming interface
 * @export
 */
export const MediaObjectApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = MediaObjectApiAxiosParamCreator(configuration)
    return {
        /**
         * Retrieves the collection of MediaObject resources.
         * @summary Retrieves the collection of MediaObject resources.
         * @param {number} [page] The collection page number
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMediaObjectCollection(page?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2001>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMediaObjectCollection(page, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves a MediaObject resource.
         * @summary Retrieves a MediaObject resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMediaObjectItem(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<MediaObjectJsonldMediaObjectRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMediaObjectItem(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a MediaObject resource.
         * @summary Creates a MediaObject resource.
         * @param {any} [file] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postMediaObjectCollection(file?: any, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<MediaObjectJsonldMediaObjectRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.postMediaObjectCollection(file, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * MediaObjectApi - factory interface
 * @export
 */
export const MediaObjectApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = MediaObjectApiFp(configuration)
    return {
        /**
         * Retrieves the collection of MediaObject resources.
         * @summary Retrieves the collection of MediaObject resources.
         * @param {number} [page] The collection page number
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMediaObjectCollection(page?: number, options?: any): AxiosPromise<InlineResponse2001> {
            return localVarFp.getMediaObjectCollection(page, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a MediaObject resource.
         * @summary Retrieves a MediaObject resource.
         * @param {string} id Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMediaObjectItem(id: string, options?: any): AxiosPromise<MediaObjectJsonldMediaObjectRead> {
            return localVarFp.getMediaObjectItem(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a MediaObject resource.
         * @summary Creates a MediaObject resource.
         * @param {any} [file] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postMediaObjectCollection(file?: any, options?: any): AxiosPromise<MediaObjectJsonldMediaObjectRead> {
            return localVarFp.postMediaObjectCollection(file, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * MediaObjectApi - object-oriented interface
 * @export
 * @class MediaObjectApi
 * @extends {BaseAPI}
 */
export class MediaObjectApi extends BaseAPI {
    /**
     * Retrieves the collection of MediaObject resources.
     * @summary Retrieves the collection of MediaObject resources.
     * @param {number} [page] The collection page number
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MediaObjectApi
     */
    public getMediaObjectCollection(page?: number, options?: AxiosRequestConfig) {
        return MediaObjectApiFp(this.configuration).getMediaObjectCollection(page, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves a MediaObject resource.
     * @summary Retrieves a MediaObject resource.
     * @param {string} id Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MediaObjectApi
     */
    public getMediaObjectItem(id: string, options?: AxiosRequestConfig) {
        return MediaObjectApiFp(this.configuration).getMediaObjectItem(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a MediaObject resource.
     * @summary Creates a MediaObject resource.
     * @param {any} [file] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MediaObjectApi
     */
    public postMediaObjectCollection(file?: any, options?: AxiosRequestConfig) {
        return MediaObjectApiFp(this.configuration).postMediaObjectCollection(file, options).then((request) => request(this.axios, this.basePath));
    }
}