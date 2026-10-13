window.authorEvents = {
    'click .edit-data': function (e, value, row) {

         // Get the data-user-id from the clicked button
         var userId = $(e.currentTarget).data('user-id');
         var authorId = $(e.currentTarget).data('id');

        $('#telegram_link').val(row.telegram_link);
        $('#whatsapp_link').val(row.whatsapp_link);
        $('#linkedin_link').val(row.linkedin_link);
        $('#facebook_link').val(row.facebook_link);

        // Set the hidden input values
        $('#edit_id').val(authorId);
        $('#user_id').val(userId);

        // Set the form action URL with the correct ID
        //  var form = $('#update_form');
        //  var actionUrl = form.attr('action').replace(/\/\d+$/, '/' + authorId);
        //  form.attr('action', actionUrl);

        // Set the status radio button if needed
        if (row.status) {
            $('input[name="author_status"][value="' + row.status + '"]').prop('checked', true);
        }
    },
};


window.eNewsEvents = {
    'click .edit-data': function (e, value, row) {
        const normalizeDateForInput = (dateValue) => {
            if (!dateValue) return '';

            const dateStr = String(dateValue).trim();

            // Already in HTML date input format.
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                return dateStr;
            }

            // // Convert from DD-MM-YYYY to YYYY-MM-DD.
            // if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
            //     const [dd, mm, yyyy] = dateStr.split('-');
            //     return `${yyyy}-${mm}-${dd}`;
            // }

            // // Handle datetime strings like "YYYY-MM-DD HH:mm:ss".
            // const isoPart = dateStr.split(' ')[0];
            // if (/^\d{4}-\d{2}-\d{2}$/.test(isoPart)) {
            //     return isoPart;
            // }

            return '';
        };

        $('#edit_id').val(row.id);
        $('#edit_language').val(row.language_id).trigger('change');
        $('#edit_title').val(row.title);
        $('#edit_slug').val(row.slug);
        // $('#edit_date').val(normalizeDateForInput(row.date));
        $('#edit_date').val(row.date);
        let des1 = tinyMCE.get('edit_des').setContent(row.description);
        $('#edit_des').val(des1);
        // $('#edit_des').val(row.description);
        $('#edit_meta_title').val(row.meta_title);
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');
        $('#edit_meta_tags').val(row.meta_keyword);
        $('#edit_schema_markup').val(row.schema_markup);
        $('#edit_meta_description').val(row.meta_description);
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');

        var editSwitch = document.querySelector('#edit_status_switch');
        var shouldBeChecked = (row.raw_status == 1);
        if (editSwitch.checked !== shouldBeChecked) {
            editSwitch.click();
        }
        $('#edit_status').val(shouldBeChecked ? 1 : 0);


    },
};

window.staffEvents = {
    'click .edit-data': function (e, value, row) {

        $('#edit_id').val(row.id);
        $('#edit_username').val(row.username);
        $('#edit_email').val(row.email);
        $('#edit_role').val(row.role_id);
        $('input[name="status"][value="' + row.status + '"]').prop('checked', true);
    },
}

window.categoryEvents = {
     'click .edit-data': function (e, value, row) {

        $('#edit_id').val(row.id);
        $('#edit_name').val(row.category_name);
        $('#edit_language_id').val(row.language_id).trigger('change');
        $("#image_url").val(row.image_url);
        $('#edit_slug').val(row.slug);
        $('#edit_meta_tags').val(row.meta_keyword);
        $('#edit_schema_markup').val(row.schema_markup);
        $('#edit_meta_title').val(row.meta_title);
        $('#edit_meta_description').val(row.description)
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');
     }
}

window.adSpaceEvents = {
    'click .edit-data': function(e, value, row, index) {
        $('#edit_id').val(row.id);
        $("#edit_language_id").val(row.language_id).trigger('change', [row.language_id, row.ad_space]);
        $("#ad_image_url").val(row.ad_image_url);
        $("#web_ad_image_url").val(row.web_ad_image_url);
        $("#edit_ad_url").val(row.ad_url);
        if (row.status == 1) {
            $("input[name=status][value=1]").prop('checked', true);
        } else {
            $("input[name=status][value=0]").prop('checked', true);
        }
    }
}
window.liveStreamingEvents = {
    'click .edit-data': function (e, value, row, index) {

        $('#edit_id').val(row.id);
        $("#edit_language").val(row.language_id);
        $("#image_url").val(row.image_url);
        $("#edit_title").val(row.title);
        $('#edit_type').val(row.type1).trigger('change');
        $('#url').val(row.url);
        $('#edit_meta_tags').val(row.meta_keyword);
        $('#edit_schema_markup').val(row.schema_markup);
        $('#edit_meta_description').val(row.meta_description);
        $('#edit_meta_title').val(row.meta_title);
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');
    }
};
window.socialMediaEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $('#edit_link').val(row.link);
    }
}
 window.tagEvents = {
    'click .edit-data': function(e, value, row, index) {
        $('#edit_id').val(row.id);
        $("#edit_name").val(row.tag_name);
        $("#edit_language").val(row.language_id).trigger('change');
        $('#edit_slug').val(row.slug);
        $('#edit_meta_tags').val(row.meta_keyword);
        $('#edit_schema_markup').val(row.schema_markup);
        $('#edit_meta_description').val(row.description);
        $('#edit_meta_title').val(row.meta_title);
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');
    }
};
window.seoSettingEvents = {
    'click .edit-data': function (e, value, row, index) {
        $('#edit_id').val(row.id);
        $('#edit_language_id').val(row.language_id);
        $('#edit_page_type').val(row.page_type);
        $('#edit_meta_title').val(row.meta_title);
        $('#edit_meta_tags').val(row.meta_keyword);
        $('#edit_schema_markup').val(row.schema_markup);
        $('#edit_meta_description').val(row.meta_description)
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');
    }
}

window.userEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        if (row.role_id) {
            $("input[name=edit_role]").prop("checked", true);
        } else {
            $("input[name=edit_role]").prop("checked", false);
        }
        if (row.status == 0) {
            $("input[name=edit_status][value=0]").prop("checked", true);
        } else {
            $("input[name=edit_status][value=1]").prop('checked', true);
        }
    }
};

window.subCategoryEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $("#image_url").val(row.image_url);
        $("#edit_language_id").val(row.language_id).trigger('change', [row.language_id, row.category_id]);
        $("#edit_name").val(row.subcategory_name);
        $('#edit_slug').val(row.slug);
    }
};
window.surveyEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $("#question").val(row.question);
        $("#edit_language_id").val(row.language_id);
        if ((row.status) == '1') {
            $("input[name=status][value=1]").prop('checked', true);
        } else {
            $("input[name=status][value=0]").prop('checked', true);
        }
    }
};
window.surveyOptionEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $("#edit_option").val(row.options);
    }
};
window.pagesEvents = {
    'click .edit-data': function (e, value, row, index) {

        $('#edit_id').val(row.id);
        $("#edit_language").val(row.language_id).trigger('change');
        $("#edit_title").val(row.title);
        $("#edit_slug").val(row.slug);
        $('#edit_page_type').val(row.page_type).attr('readonly', row.readonly).trigger('change');
        var des1 = tinyMCE.get('edit_page_content').setContent(row.page_content);
        $('#edit_page_content').val(des1);
        $('#edit_meta_tags').val(row.meta_keyword);
        $('#edit_schema_markup').val(row.schema_markup);
        $('#edit_meta_description').val(row.meta_description);
        $('#edit_meta_title').val(row.meta_title);
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');
        $("#edit_meta_keywords").val(row.meta_keywords);
        if (row.status == 0) {
            $("input[name=status][value=0]").prop("checked", true);
        } else {
            $("input[name=status][value=1]").prop('checked', true);
        }
        $("input[name=status]").prop('disabled', row.readonly);
    }
};
window.rssEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $('#edit_slug').val(row.slug);
        $("#edit_feed_name").val(row.feed_name);
        $("#edit_feed_url").val(row.feed_url);
        if (row.status == '0') {
            $("input[name=status][value=0]").prop('checked', true);
        } else {
            $("input[name=status][value=1]").prop('checked', true);
        }

        $("#edit_language_id").val(row.language_id).trigger('change', [row.language_id, row.category_id, row
            .subcategory_id, row.tag_id
        ]);
    }
};
window.feedItemEvents = {
    // delete is handled globally by .delete-form class in custom.js
};
 window.locationEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $('#name').val(row.location_name);
        $('#latitude').val(row.latitude);
        $("#longitude").val(row.longitude);
    }
}
window.languageEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $('#edit_language').val(row.language);
        $('#edit_display_name').val(row.display_name);
        $('#edit_code').val(row.code);

        if (row.status == 0) {
            $("input[name=status][value=0]").prop('checked', true);
        } else {
            $("input[name=status][value=1]").prop('checked', true);
        }
        if (row.is_default) {
            $('#is_default').hide();
        } else {
            $('#is_default').show();
        }
        setTimeout(function() {
            if (row.isRtl_value == 1) {
                $(".editInModel").prop("checked", false).trigger("click");
            } else {
                $(".editInModel").prop("checked", true).trigger("click");
            }
        }, 500);
    }
}
window.breakingNewsEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $("#image_url").val(row.image_url);
        $("#edit_language").val(row.language_id);
        $("#edit_title").val(row.title);
        $('#edit_slug').val(row.slug);
        $("#edit_content_type").val(row.content).trigger('change');
        $('#edit_meta_tags').val(row.meta_keyword);
        $('#edit_schema_markup').val(row.schema_markup);
        $('#edit_meta_description').val(row.meta_description);
        $('#edit_meta_title').val(row.meta_title);
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');
        var con_value = row.content_value;
        $('.evideo_youtube').hide();
        $('.evideo_other').hide();
        $('.evideo_upload').hide();
        if (row.content == "video_youtube") {
            $('.evideo_youtube').show();
            $('#youtube_url').val(con_value);
        } else if (row.content == "video_other") {
            $('#other_url').val(con_value);
            $('.evideo_other').show();
        } else if (row.content == "video_upload") {
            $('.evideo_upload').show();
            $("#video_url").val('public/images/breaking_news_video/' + con_value);
        }
        var des1 = tinyMCE.get('edit_des').setContent(row.description);
        $('#edit_des').val(des1);
        $('#edit_summarized_description').val(row.summarized_description);
    }
};
window.featuredSectionEvents = {
    'click .edit-data': function(e, value, row, index) {

        $("#edit_language_id").val(row.language_id).trigger('change', [row.language_id, row.category_id, row
            .subcategory_id, row.news_id, row.filter_type, row.news_type, row.user_ids, row.category_list, row.rss_feeds_news_type
        ]);
        $('#edit_id').val(row.id);
        $("#edit_title").val(row.title);
        $('#edit_slug').val(row.slug);
        $("#edit_schema_markup").val(row.schema_markup);
        $("#edit_videos_type").val(row.videos_type);
        if (row.news_type == "videos") {
            $('#edit_videos_option').show();
        } else {
            $('#edit_videos_option').hide();
        }
        // Handle author_news type on modal open
        if (row.news_type == "author_news") {
            $('#edit_author_news_type_section').show();
            $('#edit_filter_type_section').hide();
            $('#edit_filter_news').hide();
        } else {
            $('#edit_author_news_type_section').hide();
            $('#edit_filter_type_section').show();
            if (row.news_type != 'breaking_news') {
                $('#edit_filter_news').show();
            }
        }

        // if(row.news_type == "rss_feeds_news"){
        //     // working
        //     // console.log("if edit");

        //     $('#edit_filter_category_list').show();
        //     $('#edit_rss_feeds_news_section').show();
        // } else {
        //     $('#edit_filter_category_list').hide();
        //     $('#edit_rss_feeds_news_section').hide();
        // }

        $("#edit_short_description").val(row.short_description_full);
        $('#edit_meta_description').val(row.meta_description);
        $('#edit_meta_title').val(row.meta_title);
        $("#edit_meta_tags").val(row.meta_keyword);
        // edit_rss_feeds_news_type
        // $("#edit_rss_feeds_news_type").val(row.rss_feeds_news_type);
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');
        if (row.status == 0) {
            $("input[name=status][value=0]").prop('checked', true);
        } else {
            $("input[name=status][value=1]").prop('checked', true);
        }
        setTimeout(function() {
            if (row.is_based_on_user_choice == "1") {
                $(".editInModel").prop("checked", false).trigger("click");
            } else {
                $(".editInModel").prop("checked", true).trigger("click");
            }
        }, 1000);
        $("input[name=style_app][value=" + row.style_app_edit + "]").prop('checked', true);
        $("input[name=style_web][value=" + row.style_web_edit + "]").prop('checked', true);
    },
};
window.newsEvents = {
    'click .edit-data': function(e, value, row, index) {

        $('#edit_id').val(row.id);
        $("#image_url").val(row.image_url);
        $('#edit_slug').val(row.slug);
        $("#edit_title").val(row.title);
        $('#edit_published_date').val(row.published_date);
        $("#edit_date").val(row.date1);
        $("#edit_location_id").val(row.location_id);
        $("#edit_show_till").val(row.show_till).prop('min', row.published_date);
        $('#edit_meta_tags').val(row.meta_keyword);
        $('#edit_schema_markup').val(row.schema_markup);
        $("#edit_content_type").val(row.content_type1).trigger('change');

        var con_value = row.content_value;
        $('.evideo_youtube').hide();
        $('.evideo_other').hide();
        $('.evideo_upload').hide();
        if (row.content_type1 == "video_youtube") {
            $('.evideo_youtube').show();
            $('#youtube_url').val(con_value);
        } else if (row.content_type1 == "video_other") {
            $('.evideo_other').show();
            $('#other_url').val(con_value);
        } else if (row.content_type1 == "video_upload") {
            $('.evideo_upload').show();
            $("#video_url").val('public/images/news_video/' + con_value);
        }
        // $('#edit_is_notification').prop('checked', false);
        if (row.status == '0') {
            $("input[name=status][value=0]").prop('checked', true);
        } else {
            $("input[name=status][value=1]").prop('checked', true);
        }
        $("#edit_is_notification").prop("checked", true).trigger("click");


        if (row.is_draft == '1' || row.is_draft == 1) {
            $('#edit_draft_switch').prop('checked', true);
            $('#edit_is_draft').val('1');
            let draftEl = $('#edit_draft_switch')[0];
            if (draftEl) {
                draftEl.dispatchEvent(new Event('change'));
            }
        } else {
            $('#edit_draft_switch').prop('checked', false);
            $('#edit_is_draft').val('0');
            let draftEl = $('#edit_draft_switch')[0];
            if (draftEl) {
                draftEl.dispatchEvent(new Event('change'));
            }
        }
        if (row.is_short_news == '1' || row.is_short_news == 1) {
            $('#edit_is_short_news_switch').prop('checked', true);
            $('#edit_is_short_news').val('1');
            let shortNewsEl = $('#edit_is_short_news_switch')[0];
            if (shortNewsEl) {
                shortNewsEl.dispatchEvent(new Event('change'));
            }
        } else {
            $('#edit_is_short_news_switch').prop('checked', false);
            $('#edit_is_short_news').val('0');
            let shortNewsEl = $('#edit_is_short_news_switch')[0];
            if (shortNewsEl) {
                shortNewsEl.dispatchEvent(new Event('change'));
            }
        }

        // Set is_comment switch state
        if (row.is_comment == '1') {
            $("#edit_comments_switch").prop("checked", true);
            $("#edit_is_comment").val(1);
            // Force update the switch UI

            let commentsEl = $('#edit_comments_switch')[0];
            if (commentsEl) {
                commentsEl.dispatchEvent(new Event('change'));
            }
        } else {
            $("#edit_comments_switch").prop("checked", false);
            $("#edit_is_comment").val(0);

            let commentsEl = $('#edit_comments_switch')[0];
            if (commentsEl) {
                commentsEl.dispatchEvent(new Event('change'));
            }
        }

        switcheryInstances1.forEach(function(switchery) {
            if (switchery.element.id === 'edit_is_notification') {

            if (row.status == '0' || row.published_date > today) {
                switchery.disable();
            } else {
                switchery.enable();
            }
        }
        });

        $('#edit_meta_description').val(row.meta_description);
        $('#edit_meta_title').val(row.meta_title);
        getWordCount('edit_meta_description', 'edit_meta_description_count', '12.9px arial');
        getWordCount('edit_meta_title', 'edit_meta_title_count', '19.9px arial');

        $("#edit_language_id").val(row.language_id).trigger('change', [row.language_id, row.category_id, row
            .subcategory_id, row.tag_id
        ]);
    },
    'click .edit-data-des': function(e, value, row, index) {
        $('input[name=edit_id]').val(row.id);
        var des1 = tinyMCE.get('edit_des').setContent(row.description);
        $('#edit_des').val(des1);
        $('#edit_summarized_description').val(row.summarized_description);
    }
};
