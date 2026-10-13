'use client'
import Api from "./AxiosInterceptors"
import { store } from '../../components/store/store'

// General Api
export const GET_SETTINGS = 'get_settings'
export const GET_CATEGORIES = 'get_category'
export const GET_LIVE_STREAMING = 'get_live_streaming'
export const GET_SUBCATEGORY_BY_CATEGORY = 'get_subcategory_by_category'
export const GET_TAG = 'get_tag'
export const GET_PAGES = 'get_pages'
export const GET_VIDEO = 'get_videos'
export const GET_FEATURE_SECTION = 'get_featured_sections'
export const GET_LOCATION = 'get_location'
export const SET_USER_CATEGORIES = 'set_user_category'
export const SET_LIKE_DISLIKE = 'set_like_dislike'
export const SET_FLAG = 'set_flag'
export const REGISTER_TOKEN = 'register_token'
export const GET_WEB_SEO_PAGES = 'get_web_seo_pages'
export const GET_POLICY_PAGES = 'get_policy_pages'
export const GET_WEB_STORIES = 'get_web_stories'
export const TRACK_WEB_STORY_EVENT = 'track_web_story_event'

// User Api
export const GET_USER_BY_ID = 'get_user_by_id'
export const USER_SIGNUP = 'user_signup'
export const UPDATE_PROFILE = 'update_profile'
export const DELETE_ACCOUNT = 'delete_user'

// News Api
export const GET_AD_SPACE_NEWS_DETAILS = 'get_ad_space_news_details'
export const GET_AD_SPACE_HOME_SIDEBAR  = 'get_ad_space_home_sidebar'
export const GET_NEWS = 'get_news'
export const GET_BREAKING_NEWS = 'get_breaking_news'
export const SET_NEWS = 'set_news'
export const DELETE_IMAGES = 'delete_news_images'
export const DELETE_NEWS = 'delete_news'
export const SET_NEWS_VIEW = 'set_news_view'
export const SET_BREAKING_NEWS_VIEW = 'set_breaking_news_view'
export const CHECK_SLUG_AVAILABILITY = 'check_slug_availability'

// Languages Api
export const GET_LANGUAGE_LIST = 'get_languages_list'
export const GET_LANGUAGE_JSON_DATA = 'get_language_json_data'

// Comment Api
export const GET_COMMENT_BY_NEWS = 'get_comment_by_news'
export const SET_COMMENT = 'set_comment'
export const SET_COMMENT_LIKE_DISLIKE = 'set_comment_like_dislike'
export const DELETE_COMMENT = 'delete_comment'

// Bookmark Api
export const GET_BOOKMARK = 'get_bookmark'
export const SET_BOOKMARK = 'set_bookmark'

//Surveys Api
export const GET_QUESTION = 'get_question'
export const GET_QUESTION_RESULT = 'get_question_result'
export const SET_QUESTION_RESULT = 'set_question_result'

// RSS FEEDS
export const GET_RSS_FEED = 'get_rss_feed'
export const GET_RSS_FEEDS = 'get_feed_items'



// Author Endpoints
export const BECOME_AUTHOR = 'become_author'
export const GET_AUTHOR_DETAILS = 'get_authors_news'

// Draft News Endpoints
export const GET_USER_DRAFTED_NEWS = 'get_user_drafted_news'

// Create Tag Endpoint
export const CREATE_TAG = 'create_tag'

// eNews 
export const E_NEWS = 'get_e_news'

// 1. SETTINGS API
export const getSettingsApi = {
    getSettings: ({ type }) => {
        return Api.post(GET_SETTINGS, { type });
    },
}


// 2. CATEGORIES API
export const getCategoriesApi = {
    getCategories: ({ offset, limit, language_code }) => {
        return Api.post(GET_CATEGORIES, { offset, limit, language_code });
    },
}

// 3. MORE PAGES API
export const getMorePagesApi = {
    getMorePages: ({ language_code, slug, offset, limit }) => {
        return Api.post(GET_PAGES, { language_code, slug, offset, limit });
    },
}

// 4. POLICY PAGES API
export const getPolicyPagesApi = {
    getPolicyPages: ({ language_code }) => {
        return Api.post(GET_POLICY_PAGES, { language_code });
    },
}

// 5. POLICY PAGES API
export const getNewsApi = {
    getNews: ({
        language_code,
        offset,
        limit,
        id,
        get_user_news,
        search, // {optional}
        category_id,
        category_slug,
        subcategory_id,
        subcategory_slug,
        slug,
        tag_id,
        tag_slug,
        latitude,
        longitude,
        merge_tag,
        last_n_days,
        date,
        year

    }) => {
        return Api.post(GET_NEWS, { language_code, offset, limit, id, get_user_news, search, category_id, category_slug, subcategory_id, subcategory_slug, slug, tag_id, tag_slug, latitude, longitude, merge_tag, last_n_days, date, year });
    },
}

// 6. FEATURE DATA API
export const getFeatureDataApi = {
    getFeatureData: ({ language_code, offset, limit, slug, latitude, longitude, section_id, isToken, section_limit, section_offset }) => {
        return Api.post(GET_FEATURE_SECTION, { language_code, offset, limit, slug, latitude, longitude, section_id, isToken, section_limit, section_offset });
    },
}

// 7. LANGUAGES LIST API
export const getLanguagesApi = {
    getLanguages: () => {
        return Api.post(GET_LANGUAGE_LIST);
    },
}

// 8. LANGUAGES JSON API
export const getLanguageJsonDataApi = {
    getLanguageJsonData: ({ language_code, platform_type }) => {
        return Api.post(GET_LANGUAGE_JSON_DATA, { language_code, platform_type });
    },
}

// 9. GET TAGS API
export const getTagsApi = {
    getTags: ({ language_code, slug, limit, offset }) => {
        return Api.post(GET_TAG, { language_code, slug, limit, offset });
    },
}

// 10. GET LIVE NEWS API
export const getLiveNewsApi = {
    getLiveNews: ({ language_code, offset, limit, }) => {
        return Api.post(GET_LIVE_STREAMING, { language_code, offset, limit, });
    },
}

// 10. GET VIDEO NEWS API
export const getVideoNewsApi = {
    getVideoNews: ({ language_code, offset, limit, slug, category_id, category_slug }) => {
        return Api.post(GET_VIDEO, { language_code, offset, limit, slug, category_id, category_slug });
    },
}

// 11. GET BREAKING NEWS API
export const getBreaingNewsApi = {
    getBreakingNews: ({ language_code, slug, offset, limit, }) => {
        return Api.post(GET_BREAKING_NEWS, { language_code, slug, offset, limit, });
    },
}

// 12. USER SIGNUP API
export const userSignUpApi = {
    userSignup: ({ firebase_id, name, email, mobile, type, profile, status, fcm_id } = {}) => {
        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (firebase_id) formData.append('firebase_id', firebase_id);
        if (name) formData.append('name', name);
        if (email) formData.append('email', email);
        if (mobile) formData.append('mobile', mobile);
        if (type) formData.append('type', type);
        // Assuming `profile` is a file object. If it's a URL or other type, handle accordingly.
        if (profile) {
            formData.append('profile', profile);
        }
        if (status) formData.append('status', status);
        if (fcm_id) formData.append('fcm_id', fcm_id);

        return Api.post(USER_SIGNUP, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 13. USER SIGNUP API
export const registertokenApi = {
    registertoken: ({ language_code, token, latitude, longitude, user_id } = {}) => {
        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (language_code) formData.append('language_code', language_code);
        if (token) formData.append('token', token);
        if (latitude) formData.append('latitude', latitude);
        if (longitude) formData.append('longitude', longitude);
        if (user_id) formData.append('user_id', user_id);

        return Api.post(REGISTER_TOKEN, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 14. USER SIGNUP API
export const deleteAccountApi = {
    deleteAccount: ({ } = {}) => {
        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        // if (user_id) formData.append('user_id', user_id);

        return Api.post(DELETE_ACCOUNT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 15. GET ADSPACES API
export const getNewsDetailsAdSpacesApi = {
    getNewsDetailsAdSpaces: ({ language_code }) => {
        return Api.post(GET_AD_SPACE_NEWS_DETAILS, { language_code, });
    },
}

// 15b. GET HOME SIDEBAR AD SPACES API
export const getAdSpaceHomeSidebarApi = {
    getAdSpaceHomeSidebar: ({ language_code }) => {
        return Api.post(GET_AD_SPACE_HOME_SIDEBAR, { language_code });
    },
}

// 16. SET NEWS VIEWS API
export const setNewsViewApi = {
    setNewsView: ({ news_id } = {}) => {

        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (news_id) formData.append('news_id', news_id);

        return Api.post(SET_NEWS_VIEW, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 17. SET BREAKING NEWS VIEWS API
export const setBreakingNewsViewApi = {
    setBreakingNewsView: ({ breaking_news_id } = {}) => {

        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (breaking_news_id) formData.append('breaking_news_id', breaking_news_id);

        return Api.post(SET_BREAKING_NEWS_VIEW, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 18. SET BOOKMARk API
export const setBookmarkApi = {
    setBookmark: ({ news_id, status } = {}) => {

        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (news_id) formData.append('news_id', news_id);
        formData.append('status', status);

        return Api.post(SET_BOOKMARK, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 19. SET LIKE/DISLIKE API
export const setLikeDisLikeApi = {
    setLikeDisLike: ({ news_id, status } = {}) => {

        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (news_id) formData.append('news_id', news_id);
        formData.append('status', status);

        return Api.post(SET_LIKE_DISLIKE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}

// 20. GET COMMENTS API
export const getCommentsByNewsApi = {
    getCommentsByNews: ({ news_id, offset, limit }) => {
        return Api.post(GET_COMMENT_BY_NEWS, { news_id, offset, limit });
    },
}

// 21. SET COMMENT API
export const setCommentApi = {
    setCommnet: ({ language_code, parent_id, news_id, message }) => {
        return Api.post(SET_COMMENT, { language_code, parent_id, news_id, message, });
    },
}

// 22. SET COMMENT LIKE/DISLIKE API
export const setCommentLikeDisLikeApi = {
    setCommentLikeDisLike: ({ language_code, comment_id, status }) => {
        return Api.post(SET_COMMENT_LIKE_DISLIKE, { language_code, comment_id, status });
    },
}

// 23. DELETE COMMENT API
export const deleteCommentApi = {
    deleteComment: ({ comment_id }) => {
        return Api.post(DELETE_COMMENT, { comment_id });
    },
}

// 24. SET FLAG API
export const setFlagApi = {
    setFlag: ({ comment_id, news_id, message }) => {
        return Api.post(SET_FLAG, { comment_id, news_id, message });
    },
}

// 25. GET/SET BOOKMARK NEWS API
export const getBookmarkNewsApi = {
    getBookmark: ({ language_code, offset, limit }) => {
        return Api.post(GET_BOOKMARK, { language_code, offset, limit });
    },
    setBookmark: ({ news_id, status }) => {
        return Api.post(SET_BOOKMARK, { news_id, status });
    },
}

// 26. SET USER CATEGORIES API
export const setUserCategoriesApi = {
    setUserCategories: ({ category_id }) => {
        return Api.post(SET_USER_CATEGORIES, { category_id });
    },
}

// 27. GET USER BY ID API
export const getUserByIdApi = {
    getUserById: ({ language_code, offset, limit }) => {
        return Api.post(GET_USER_BY_ID, { language_code, offset, limit });
    },
}

// 28. UPDATE PROFILE API
export const updateProfileApi = {

    updateProfile: ({ name, mobile, email, image, bio, telegram_link, linkedin_link, facebook_link, whatsapp_link }) => {
        const formData = new FormData();

        // Append only if the value is defined and not an empty string
        if (name) formData.append('name', name);
        if (mobile) {
            formData.append('mobile', mobile);
        }
        else {
            formData.append('mobile', '');
        }
        if (email) {
            formData.append('email', email);
        }
        else {
            formData.append('email', '');
        }
        if (image) formData.append('profile', image);
        if (bio) formData.append('bio', bio);
        if (telegram_link) formData.append('telegram_link', telegram_link);
        if (linkedin_link) formData.append('linkedin_link', linkedin_link);
        if (facebook_link) formData.append('facebook_link', facebook_link);
        if (whatsapp_link) formData.append('whatsapp_link', whatsapp_link);
        return Api.post(UPDATE_PROFILE, formData);
    },
}

// 29. GET LOCATION API
export const getLocationApi = {
    getLocation: ({ limit }) => {
        return Api.post(GET_LOCATION, { limit });
    },
}

// 30. GET SUB_CATEGORY BY CATEGORY ID API
export const getSubCategoryByCategoryIdApi = {
    getSubCategoryByCategoryId: ({ language_code, category_id }) => {
        return Api.post(GET_SUBCATEGORY_BY_CATEGORY, { language_code, category_id });
    },
}

// 31. SET NEWS API

export const setNewsApi = {
    setNews: ({ action_type,
        category_id,
        subcategory_id,
        tag_id,
        title,
        meta_title,
        meta_description,
        meta_keyword,
        slug,
        content_type,
        content_data,
        description,
        summarized_description,
        image,
        ofile,
        show_till,
        language_code,
        location_id,
        published_date,
        is_draft = 0,
        is_short_news
    }) => {
        let formData = new FormData()
        let createToEdit = store.getState().createNews.createToEdit
        let news_id = createToEdit ? createToEdit.id : null
        if (action_type === 2) {
            formData.append('news_id', news_id)
        }
        formData.append('is_draft', is_draft);
        formData.append('action_type', action_type) //1-add, 2-update if action_type- 2 => news_id:1
        formData.append('title', title)
        formData.append('category_id', category_id)
        if (subcategory_id) formData.append('subcategory_id', subcategory_id)
        if (tag_id) formData.append('tag_id', tag_id)
        if (meta_title) formData.append('meta_title', meta_title)
        if (meta_description) formData.append('meta_description', meta_description)
        if (meta_keyword) formData.append('meta_keyword', meta_keyword)
        if (slug) formData.append('slug', slug || '')
        if (content_type) formData.append('content_type', content_type)
        if (content_data) formData.append('content_data', content_data)
        if (description) formData.append('description', description)
        if (summarized_description) formData.append('summarized_description', summarized_description)
        if (image) formData.append('image', image)
        if (ofile) {
            if (Array.isArray(ofile)) {
                ofile.forEach((elem, key) => {
                    formData.append('ofile[]', elem)
                })
            }
        }
        if (show_till) formData.append('show_till', show_till)
        if (published_date) formData.append('published_date', published_date)
        if (language_code) formData.append('language_code', language_code)
        if (location_id) formData.append('location_id', location_id)
        formData.append('is_short_news', is_short_news)
        return Api.post(SET_NEWS, formData);
    },
}

// 32. DELETE NEWS API
export const deleteNewsApi = {
    deleteNews: ({ id }) => {
        return Api.post(DELETE_NEWS, { id });
    },
}

// 33. DELETE EDIT-NEWS IMAGES API
export const deleteImagesApi = {
    deleteImages: ({ id }) => {
        return Api.post(DELETE_IMAGES, { id });
    },
}

// 34. SURVEYS API
export const surveysApi = {
    getQuestions: ({ language_code, voter_key, limit = 2 }) => {
        return Api.post(GET_QUESTION, { language_code, voter_key, limit });
    },
    getQuestionResult: ({ language_code, question_id, voter_key }) => {
        return Api.post(GET_QUESTION_RESULT, { language_code, question_id, voter_key });
    },
    setQuestionsResultApi: ({ language_code, question_id, option_id, voter_key }) => {
        return Api.post(SET_QUESTION_RESULT, { language_code, question_id, option_id, voter_key });
    },
}

// 37. GET RSS-FEEDS API
export const getRssFeedsApi = {
    getRssFeeds: ({ language_code, offset, limit, category_id, category_slug, subcategory_id, subcategory_slug, tag_id, tag_slug, search }) => {
        return Api.post(GET_RSS_FEED, { language_code, offset, limit, category_id, category_slug, subcategory_id, subcategory_slug, tag_id, tag_slug, search });
    },
    getAllRssFeeds: ({ language_code, source_ids, category_ids, subcategory_ids, page = "1", per_page }) => {
        const formData = new FormData();
        formData.append('language_code', language_code);
        if (source_ids) formData.append('source_ids', source_ids);
        if (category_ids) formData.append('category_ids', category_ids);
        if (subcategory_ids) formData.append('subcategory_ids', subcategory_ids);
        formData.append('page', page);
        formData.append('per_page', per_page);
        return Api.post(GET_RSS_FEEDS, formData);
    },
}

// 38. CHECK SLUG AVAILABILITY API
export const checkSlugAvailabilityApi = {
    checkSlugAvailability: ({ slug }) => {
        return Api.post(CHECK_SLUG_AVAILABILITY, { slug });
    },
}

// 39. Become Author API
export const becomeAnAuthorApi = {
    becomeAnAuthor: ({ }) => {
        return Api.post(BECOME_AUTHOR, {});
    }
}

// 40. Get User Drafted News API
export const getUserDraftedNewsApi = {
    getUserDraftedNews: ({ author_id }) => {
        const formdata = new FormData();
        formdata.append('author_id', author_id);
        return Api.post(GET_USER_DRAFTED_NEWS, formdata);
    }
}

// 41. Get Author Profile and News Details API
export const getAuthorProfileAndNewsApi = {
    getAuthorProfileAndNews: ({ user_id, language_code, page = "1" }) => {
        const formdata = new FormData();
        formdata.append('user_id', user_id);
        formdata.append('language_code', language_code);
        formdata.append('page', page);
        return Api.post(GET_AUTHOR_DETAILS, formdata);
    },
}

// 42. Create Tag API
export const createTagApi = {
    createTag: ({ tag_name, language_code }) => {
        const formData = new FormData();
        formData.append('tag_name', tag_name);
        formData.append('language_code', language_code);
        return Api.post(CREATE_TAG, formData);
    },
}

// 43. E-NEWS API
export const getENewsApi = {
    getENews: ({ language_code, page, per_page }) => {
        const formData = new FormData();
        formData.append('language_code', language_code);
        formData.append('page', page);
        formData.append('per_page', per_page);
        return Api.post(E_NEWS, formData);
    },
}

// 6b. WEB STORIES API
export const getWebStoriesApi = {
    getWebStories: ({ language_code, offset, limit, slug, category_id, category_slug }) => {
        return Api.post(GET_WEB_STORIES, { language_code, offset, limit, slug, category_id, category_slug });
    },
    trackEvent: ({ story_id, event }) => {
        return Api.post(TRACK_WEB_STORY_EVENT, { story_id, event });
    },
}
