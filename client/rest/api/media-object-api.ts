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
import { InlineResponse2003 } from '../models';
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
         * Removes the MediaObject resource.
         * @summary Removes the MediaObject resource.
         * @param {string} mediaObjectId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteMediaObjectItem: async (mediaObjectId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'mediaObjectId' is not null or undefined
            assertParamExists('deleteMediaObjectItem', 'mediaObjectId', mediaObjectId)
            const localVarPath = `/api/media_objects/{mediaObjectId}`
                .replace(`{${"mediaObjectId"}}`, encodeURIComponent(String(mediaObjectId)));
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
         * Retrieves the collection of MediaObject resources.
         * @summary Retrieves the collection of MediaObject resources.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMediaObjectCollection: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
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
         * Retrieves a MediaObject resource.
         * @summary Retrieves a MediaObject resource.
         * @param {string} mediaObjectId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMediaObjectItem: async (mediaObjectId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'mediaObjectId' is not null or undefined
            assertParamExists('getMediaObjectItem', 'mediaObjectId', mediaObjectId)
            const localVarPath = `/api/media_objects/{mediaObjectId}`
                .replace(`{${"mediaObjectId"}}`, encodeURIComponent(String(mediaObjectId)));
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
         * Creates a MediaObject resource.
         * @summary Creates a MediaObject resource.
         * @param {any} [file] 
         * @param {string} [fileName] 
         * @param {number} [author] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postMediaObjectCollection: async (file?: any, fileName?: string, author?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
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

            // authentication JWT required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


            if (file !== undefined) { 
                localVarFormParams.append('file', file as any);
            }
    
            if (fileName !== undefined) { 
                localVarFormParams.append('fileName', fileName as any);
            }
    
            if (author !== undefined) { 
                localVarFormParams.append('author', author as any);
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
         * Removes the MediaObject resource.
         * @summary Removes the MediaObject resource.
         * @param {string} mediaObjectId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteMediaObjectItem(mediaObjectId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteMediaObjectItem(mediaObjectId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves the collection of MediaObject resources.
         * @summary Retrieves the collection of MediaObject resources.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMediaObjectCollection(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2003>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMediaObjectCollection(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves a MediaObject resource.
         * @summary Retrieves a MediaObject resource.
         * @param {string} mediaObjectId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMediaObjectItem(mediaObjectId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<MediaObjectJsonldMediaObjectRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMediaObjectItem(mediaObjectId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a MediaObject resource.
         * @summary Creates a MediaObject resource.
         * @param {any} [file] 
         * @param {string} [fileName] 
         * @param {number} [author] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postMediaObjectCollection(file?: any, fileName?: string, author?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<MediaObjectJsonldMediaObjectRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.postMediaObjectCollection(file, fileName, author, options);
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
         * Removes the MediaObject resource.
         * @summary Removes the MediaObject resource.
         * @param {string} mediaObjectId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteMediaObjectItem(mediaObjectId: string, options?: any): AxiosPromise<void> {
            return localVarFp.deleteMediaObjectItem(mediaObjectId, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the collection of MediaObject resources.
         * @summary Retrieves the collection of MediaObject resources.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMediaObjectCollection(options?: any): AxiosPromise<InlineResponse2003> {
            return localVarFp.getMediaObjectCollection(options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves a MediaObject resource.
         * @summary Retrieves a MediaObject resource.
         * @param {string} mediaObjectId Resource identifier
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMediaObjectItem(mediaObjectId: string, options?: any): AxiosPromise<MediaObjectJsonldMediaObjectRead> {
            return localVarFp.getMediaObjectItem(mediaObjectId, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a MediaObject resource.
         * @summary Creates a MediaObject resource.
         * @param {any} [file] 
         * @param {string} [fileName] 
         * @param {number} [author] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postMediaObjectCollection(file?: any, fileName?: string, author?: number, options?: any): AxiosPromise<MediaObjectJsonldMediaObjectRead> {
            return localVarFp.postMediaObjectCollection(file, fileName, author, options).then((request) => request(axios, basePath));
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
     * Removes the MediaObject resource.
     * @summary Removes the MediaObject resource.
     * @param {string} mediaObjectId Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MediaObjectApi
     */
    public deleteMediaObjectItem(mediaObjectId: string, options?: AxiosRequestConfig) {
        return MediaObjectApiFp(this.configuration).deleteMediaObjectItem(mediaObjectId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves the collection of MediaObject resources.
     * @summary Retrieves the collection of MediaObject resources.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MediaObjectApi
     */
    public getMediaObjectCollection(options?: AxiosRequestConfig) {
        return MediaObjectApiFp(this.configuration).getMediaObjectCollection(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves a MediaObject resource.
     * @summary Retrieves a MediaObject resource.
     * @param {string} mediaObjectId Resource identifier
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MediaObjectApi
     */
    public getMediaObjectItem(mediaObjectId: string, options?: AxiosRequestConfig) {
        return MediaObjectApiFp(this.configuration).getMediaObjectItem(mediaObjectId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a MediaObject resource.
     * @summary Creates a MediaObject resource.
     * @param {any} [file] 
     * @param {string} [fileName] 
     * @param {number} [author] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MediaObjectApi
     */
    public postMediaObjectCollection(file?: any, fileName?: string, author?: number, options?: AxiosRequestConfig) {
        return MediaObjectApiFp(this.configuration).postMediaObjectCollection(file, fileName, author, options).then((request) => request(this.axios, this.basePath));
    }
}
