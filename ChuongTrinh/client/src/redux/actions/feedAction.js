import request from '../../utils/request';

export const getFeeds = (currentPage) => {
    return async (dispatch) => {
        const res = await request.get('/feed', {
            params: {
                page: currentPage,
            },
        });
        const feeds = res.data.data;
        const countAllFeed = res.data.countAllFeed;
        dispatch({
            type: 'GET_ALL_FEEDS',
            payload: { feeds, countAllFeed },
        });
    };
};

export const addFeed = (data, page) => {
    return async (dispatch) => {
        const res = await request.post('/feed', data);
        console.log(res);
        if (res.status === 200) {
            dispatch(getFeeds(page));
            return {
                type: 'success',
                message: res.data.message,
            };
        } else {
            return {
                type: 'error',
                message: res.data.message,
            };
        }
    };
};


export const deleteFeeds = (id, page) => {
    return async (dispatch) => {
        const res = await request.delete(`/feed/${id}`);
        console.log(res);
        if (res.status === 200) {
            dispatch(getFeeds(page));
            return {
                type: 'success',
                message: res.data.message,
            };
        } else {
            return {
                type: 'error',
                message: res.data.message,
            };
        }
    };
};

export const searchFeeds = (searchText, currentPage) => {
    return async (dispatch) => {
        const res = await request.get(`/feeds/search`, {
            params: {
                name: searchText,
                page: currentPage,
            },
        });
        return {
            result: res.data.result,
            availableFeed: res.data.availableFeed,
        };
    };
};
