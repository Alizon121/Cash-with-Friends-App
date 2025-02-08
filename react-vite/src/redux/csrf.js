import Cookies from 'js-cookie'

export async function csrfFetch(url, options = {}) {
    options.method = options.method || 'GET'
    options.headers = options.headers || {}

    // Set the headers for 'Content-Type' and 'XSRF-TOKEN'
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] = 
            options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    options.credentials = "include";

    // Call default window fetch with url/options
    const res = await window.fetch(url, options)
    if (res.status >= 400) throw res

    // If the response status is less than 400 than it is good.
    return res
}

// call this to get the "XSRF-TOKEN" cookie, should only be used in development
// export function restoreCSRF() {
//     return csrfFetch('/api/auth/');
//   }

// export async function csrfFetch(url, options = {}) {
//     options.method = options.method || 'GET';
//     options.headers = options.headers || {};

//     // Set headers only for non-GET requests
//     if (options.method.toUpperCase() !== 'GET') {
//         options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
//     }

//     // Ensure cookies (like csrf_token) are sent with every request
//     options.credentials = 'include';

//     const res = await window.fetch(url, options);

//     if (res.status >= 400) throw res;

//     return res;
// }
