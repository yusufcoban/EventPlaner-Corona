/**
 * The last used instance of collapsibleTableEditable
 */
var lastCollapsibleTableEditableInstance = null;

/**
 * Collection of generic ajax functions. Requires "custom.login.js"
 */
var AjaxUtilities = function ()
{
    var that = this;
    var ajaxTimeout = 120000; // in [ms]
    var loginEndpoint = 'api/oauth/token/';

    /**
     * The current application (e.g. "EQ")
     * @type {string}
     */
    var application = $('html').data('application');

    // set global ajax settings
    $.ajaxSetup({
        cache: false,
        xhrFields:
        {
            // tell jQuery to send cookies (and some other sensitive information) to pages with other domains
            withCredentials: true
        },
        beforeSend: function (request)
        {
            // tell the server which application is accessing the api
            request.setRequestHeader("X-Client-Application", application);
        }
    });

    $(document).ajaxError(function (event, jqxhr, settings, exception)
    {
        if (jqxhr.status === 401 && settings.url.indexOf(loginEndpoint) === -1)
        {
            // Reload the page if the table is in edit mode, is in active mode and the request could be from a editable select (there is no way to know for sure, because x-editable doesnt have a event or function for that)
            if (lastCollapsibleTableEditableInstance != null && lastCollapsibleTableEditableInstance.GetIsEditMode() === true && settings != null && settings.data == null && settings.type != null && settings.type.toUpperCase() === "GET")
            {
                // Reload is necessary, because otherwise a loop of requests is send to the server, which is quite hard to overcome.
                lastCollapsibleTableEditableInstance.ForceCloseEditMode2();
            }

            login.ShowLoginModal();
        }
    });

    /**
     * Send an ajax get request
     * @param {string} url Url to send the request to
     * @param {any} data The data
     * @param {any} successCallback The function that is called if the request was successful
     * @param {any} errorCallback The function that is called if the request has failed and was not an authentication error
     * @returns {object} Returns the jQuery Ajax Request Object.
     */
    this.GetJson = function (url, data, successCallback, errorCallback)
    {
        return $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url,
            cache: false,
            data: data,
            method: "GET",
            timeout: ajaxTimeout, // in [ms]
            success: function (response)
            {
                ajaxSuccessCallback(response, successCallback);
            },
            error: function (data, status)
            {
                ajaxErrorCallback(data, status, errorCallback);
            }
        });
    };

    /**
     * Send an ajax get request with a html result
     * @param {string} url Url to send the request to
     * @param {any} data The data
     * @param {any} successCallback The function that is called if the request was successful
     * @param {any} errorCallback The function that is called if the request has failed and was not an authentication error
     * @returns {any} The jQuery ajax promise
     */
    this.GetHtml = function (url, data, successCallback, errorCallback)
    {
        return $.ajax({
            dataType: 'html',
            url: url,
            cache: false,
            data: data,
            method: "GET",
            statusCode: { 404: function () { alert("page not found"); } },
            timeout: ajaxTimeout, // in [ms]
            success: function (response)
            {
                ajaxSuccessCallback(response, successCallback);
            },
            error: function (data, status)
            {
                ajaxErrorCallback(data, status, errorCallback);
            }
        });
    };

    /**
     * Send an ajax get request with plain text result and extract suggested filename from the content-disposition header 
     * @param {string} url Url to send the request to
     * @param {any} data The data
     * @param {any} successCallback The function that is called if the request was successful
     * @param {any} errorCallback The function that is called if the request has failed and was not an authentication error
     * @returns {object} Returns the jQuery Ajax Request Object.
     */
    this.GetTextContent = function (url, data, successCallback, errorCallback)
    {
        return $.ajax({
            dataType: 'text',
            contentType: "application/json; charset=utf-8",
            url: url,
            cache: false,
            data: data,
            method: "GET",
            timeout: ajaxTimeout, // in [ms]
            success: function (response, _, xhr)
            {
                if (successCallback != null)
                {
                    var filename = "";
                    var disposition = xhr.getResponseHeader('Content-Disposition');
                    if (disposition)
                    {
                        filename = getFilenameFromContentDispositionHeader(disposition);
                    }

                    successCallback(response, filename);
                }
            },
            error: function (data, status)
            {
                data.responseJSON = JSON.parse(data.responseText);
                ajaxErrorCallback(data, status, errorCallback);
            }
        });
    };

    /**
     * Send an ajax post request
     * @param {string} url Url to send the request to
     * @param {any} data The data
     * @param {any} successCallback The function that is called if the request was successful
     * @param {any} errorCallback The function that is called if the request has failed and was not an authentication error
     * @returns {object} Returns the jQuery Ajax Request Object.
     */
    this.PostJson = function (url, data, successCallback, errorCallback)
    {
        var json = JSON.stringify(data);
        return $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url,
            cache: false,
            data: json,
            method: "POST",
            timeout: ajaxTimeout, // in [ms]
            success: function (response)
            {
                ajaxSuccessCallback(response, successCallback);
            },
            error: function (data, status)
            {
                ajaxErrorCallback(data, status, errorCallback);
            }
        });
    };

    /**
     * Send an ajax put request
     * @param {string} url Url to send the request to
     * @param {any} data The data
     * @param {any} successCallback The function that is called if the request was successful
     * @param {any} errorCallback The function that is called if the request has failed and was not an authentication error
     * @returns {object} Returns the jQuery Ajax Request Object.
     */
    this.PutJson = function (url, data, successCallback, errorCallback)
    {
        var json = JSON.stringify(data);
        return $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url,
            cache: false,
            data: json,
            method: "PUT",
            timeout: ajaxTimeout, // in [ms]
            success: function (response)
            {
                ajaxSuccessCallback(response, successCallback);
            },
            error: function (data, status)
            {
                ajaxErrorCallback(data, status, errorCallback);
            }
        });
    };

    /**
      * Send an ajax delete request
      * @param {string} url Url to send the request to
      * @param {any} data The (optional) data
      * @param {any} successCallback The function that is called if the request was successful
      * @param {any} errorCallback The function that is called if the request has failed and was not an authentication error
      * @param {boolean} doPassDataInBody (Default: null/undefined => false) If the data should be passed in the body instead of the url
     * @returns {object} Returns the jQuery Ajax Request Object.
      */
    this.DeleteJson = function (url, data, successCallback, errorCallback, doPassDataInBody)
    {
        var parametrizedUrl = url;
        var bodyData = undefined;
        if (data != null)
        {
            if (doPassDataInBody === true)
            {
                bodyData = JSON.stringify(data);
            }
            else
            {
                parametrizedUrl = url + "?" + $.param(data);
            }
        }
        return $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: parametrizedUrl,
            cache: false,
            method: "DELETE",
            data: bodyData,
            timeout: ajaxTimeout, // in [ms]
            success: function (response)
            {
                ajaxSuccessCallback(response, successCallback);
            },
            error: function (data, status)
            {
                ajaxErrorCallback(data, status, errorCallback);
            }
        });
    };

    /**
     * Send an ajax post request with form data
     * @param {string} url Url to send the request to
     * @param {any} data The data
     * @param {any} successCallback The function that is called if the request was successful
     * @param {any} errorCallback The function that is called if the request has failed and was not an authentication error
     * @returns {object} Returns the jQuery Ajax Request Object.
     */
    this.PostFormData = function (url, data, successCallback, errorCallback)
    {
        return $.ajax({
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            url: url,
            cache: false,
            data: data,
            method: "POST",
            timeout: ajaxTimeout, // in [ms]
            success: function (response)
            {
                ajaxSuccessCallback(response, successCallback);
            },
            error: function (data, status)
            {
                ajaxErrorCallback(data, status, errorCallback);
            }
        });
    };

    /*
     * Cache of the root url
     */
    var rootUrl = null;

    /*
     * Gets the root url based on the current application
     */
    this.GetRootUrl = function ()
    {
        if (rootUrl == null)
        {
            rootUrl = $('html').data('root');
        }

        return rootUrl;
    };

    /*
     * Cache of the versioned root urls
     */
    var versionedRootUrls = {};

    /**
     * Gets a root url (e.q. "<rootUrl>/V3/") based on the current application
     * @param {number} version Version of the url
     * @returns {string} Versioned root url
     */
    this.GetVersionedRootUrl = function (version)
    {
        if (versionedRootUrls[version] == null)
        {
            versionedRootUrls[version] = this.GetRootUrl() + "V" + version + "/";
        }

        return versionedRootUrls[version];
    };

    /*
     * Cache of the api root url
     */
    var apiRootUrl = null;

    /*
     * Gets the api root url
     */
    this.GetApiRootUrl = function ()
    {
        if (apiRootUrl == null)
        {
            apiRootUrl = $('html').data('apiRoot');
        }

        return apiRootUrl;
    };

    /*
     * Cache of the versioned api urls
     */
    var versionedApiUrls = {};

    /**
     * Gets a versioned api url (e.q. "<rootUrl>/V3/api/")
     * @param {number} apiVersion Version of the api
     * @returns {string} Versioned api url
     */
    this.GetVersionedApiUrl = function (apiVersion)
    {
        if (versionedApiUrls[apiVersion] == null)
        {
            versionedApiUrls[apiVersion] = this.GetApiRootUrl() + "V" + apiVersion + "/api/";
        }

        return versionedApiUrls[apiVersion];
    };

    /*
     * Cache of the versioned urls
     */
    var versionedUrls = {};

    /**
     * Gets a versioned url (e.q. "<rootUrl>/V3/") based on the eq url
     * @param {number} version Version of the url
     * @returns {string} Versioned url
     */
    this.GetVersionedUrl = function (version)
    {
        if (versionedUrls[version] == null)
        {
            versionedUrls[version] = this.GetApiRootUrl() + "V" + version + "/";
        }

        return versionedUrls[version];
    };

    /**
     * Get the error message from a failed request's response.
     * @param {any} response The response object for the HTTP request
     */
    this.GetError = function (response)
    {
        return response.responseJSON.Message || response.responseJSON || response;
    }

    /**
     * Function that is called when an ajax request was successful
     * @param {any} response The data returned from the request
     * @param {any} successCallback The function that is called after this method
     */
    var ajaxSuccessCallback = function (response, successCallback)
    {
        if (successCallback != null)
        {
            successCallback(response);
        }
    };

    /**
     * Function that is called when an ajax request failed
     * @param {any} data The data returned from the request
     * @param {any} status The status of the request
     * @param {any} errorCallback The function that is called if the error was not an authentication error
     */
    var ajaxErrorCallback = function (data, status, errorCallback)
    {
        if (errorCallback != null)
        {
            errorCallback(data, status);
        }
    };
};

var ajaxUtilities = new AjaxUtilities();