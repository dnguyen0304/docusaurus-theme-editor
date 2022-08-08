const https = require('https');
const util = require('util');

const githubEndpoint = 'https://github.com/login/oauth/access_token';
const defaultPort = 443;
const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
};
const defaultHeadersResponse = {
    ...defaultHeaders,
    'Content-Type': 'application/json',
};

function toStringDeep(object) {
    return util.inspect(object, {
        showHidden: false,
        depth: null,
        colors: false,
    });
}

async function httpPost(url, options) {
    return new Promise((resolve, reject) => {
        // TODO(dnguyen0304): Investigate if the GitHub server ever returns a
        // non-200 status code.
        const request = https.request(url, options, (response) => {
            response.setEncoding('utf8');

            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                resolve({
                    body: body,
                });
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.end();
    });
}

async function main(event) {
    console.log(`Started getAccessToken: ${toStringDeep(event)}`);

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const parsedRequestBody = JSON.parse(event.body);

    const url = githubEndpoint + '?' + new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: parsedRequestBody.authorizationCode,
    });
    const options = {
        port: defaultPort,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    try {
        const { body } = await httpPost(url, options);
        // TODO(dnguyen0304): Handle non-JSON content-type such as "Cookies must
        // be enabled to use GitHub".
        const parsedResponseBody = JSON.parse(body);

        if ('error' in parsedResponseBody) {
            return {
                statusCode: 400,
                headers: defaultHeadersResponse,
                body,
            };
        }
        return {
            statusCode: 200,
            headers: defaultHeadersResponse,
            body: JSON.stringify({
                accessToken: parsedResponseBody.access_token,
            }),
        };
    } catch (error) {
        console.log(`Failed getAccessToken: ${error}`);
    }
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                ...defaultHeaders,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Accept, Content-Type',
            },
        };
    } else if (event.httpMethod === 'POST') {
        return main(event);
    } else {
        return {
            statusCode: 405,
            headers: {
                ...defaultHeaders,
                'Allow': 'POST, OPTIONS',
            },
        };
    }
};