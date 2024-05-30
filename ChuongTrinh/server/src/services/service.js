import camelizeKeys from '../helpers/utils/camelizeKeys';
import { FormData } from 'sync-request';
import socialConfig from '../config/social';

const axios = require('axios');
const querystring = require('querystring');
const request = require('sync-request');
const INSTAGRAM_OAUTH_BASE_URL = 'https://api.instagram.com/oauth';
const INSTAGRAM_GRAPH_BASE_URL = 'https://graph.instagram.com';

class InstagramApi {
    constructor(config = {}) {
        this._appId = socialConfig.instagramAppId;
        this._redirectUri = socialConfig.instagramRedirectUri;
        this._appSecret = socialConfig.instagramAppSecret;
        this._scope = config.scope;
        this._authorizationUrl = `${INSTAGRAM_OAUTH_BASE_URL}/authorize?${querystring.stringify({
            client_id: this._appId,
            redirect_uri: this._redirectUri,
            scope: this._scope,
            response_type: 'code',
        })}`;
    }

    get authorizationUrl() {
        return this._authorizationUrl;
    }

    refreshLongLivedToken(accessToken) {
        const requestData = {
            grant_type: 'ig_refresh_token',
            access_token: accessToken,
        };

        return axios
            .get(`${INSTAGRAM_GRAPH_BASE_URL}/refresh_access_token?${querystring.stringify(requestData)}`)
            .then(res => res.data);
    }

    retrieveToken(userCode) {
        const formData = new FormData();
        formData.append('client_id', this._appId);
        formData.append('client_secret', this._appSecret);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', this._redirectUri);
        formData.append('code', userCode);

        try {
            const response = request('POST', 'https://api.instagram.com/oauth/access_token', {
                form: formData,
            });
            return JSON.parse(response.getBody('utf8'));
        } catch (e) {
            return { access_token: false, user_id: false };
        }
    }

    retrieveLongLivedToken(accessToken) {
        const requestData = {
            grant_type: 'ig_exchange_token',
            client_secret: this._appSecret,
            access_token: accessToken,
        };

        const formData = new FormData();
        formData.append('grant_type', 'ig_exchange_token');
        formData.append('client_secret', this._appSecret);
        formData.append('access_token', accessToken);

        try {
            const response = request(
                'GET',
                `${INSTAGRAM_GRAPH_BASE_URL}/access_token?${querystring.stringify(requestData)}`,
            );
            return JSON.parse(response.getBody('utf8'));
        } catch (e) {
            return { access_token: false, expires_in: false };
        }
    }

    retrieveUserNode(accessToken, fields = 'id,username,account_type,media_count') {
        const requestData = {
            fields,
            access_token: accessToken,
        };

        return axios
            .get(`${INSTAGRAM_GRAPH_BASE_URL}/me?${querystring.stringify(requestData)}`)
            .then(res => {
                const { id: socialId, ...result } = res.data;
                return camelizeKeys({ ...result, socialId });
            });
    }

    retrieveUserMedia(
        accessToken,
        limit = 99999,
        after = '',
        fields = 'caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_url,media_type}',
    ) {
        const requestData = {
            fields,
            limit,
            access_token: accessToken,
        };

        if (after.length) {
            requestData.after = after;
        }

        return axios
            .get(`${INSTAGRAM_GRAPH_BASE_URL}/me/media?${querystring.stringify(requestData)}`)
            .then(res => {
                const { id: mediaId, ...result } = res.data;
                return camelizeKeys({ ...result, mediaId });
            });
    }

    retrieveMediaData(
        accessToken,
        mediaId,
        fields = 'caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_url,thumbnail_url}',
    ) {
        const requestData = {
            fields,
            access_token: accessToken,
        };

        return axios.get(
            `${INSTAGRAM_GRAPH_BASE_URL}/${mediaId}?${querystring.stringify(requestData)}`,
        );
    }
}

module.exports = InstagramApi;
