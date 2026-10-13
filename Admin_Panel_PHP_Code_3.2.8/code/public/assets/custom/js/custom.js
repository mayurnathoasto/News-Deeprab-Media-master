function trans(label) {
    return window.languageLabels && window.languageLabels.hasOwnProperty(label)
        ? window.languageLabels[label]
        : label;
}
$(function() {
	// Hide the card body initially
	$("#add_card").hide();

	// Toggle the card body when the button is clicked
	$("#toggleButton").click(function() {
		$("#add_card").slideToggle();
	});

	$(".select2-multiple").select2();

	getWordCount("meta_title", "meta_title_count", "19.9px arial");
	getWordCount("meta_description", "meta_description_count", "12.9px arial");
	getWordCount("edit_meta_title", "edit_meta_title_count", "19.9px arial");
	getWordCount(
		"edit_meta_description",
		"edit_meta_description_count",
		"12.9px arial"
	);
	// First register any plugins
	FilePond.registerPlugin(
		FilePondPluginImagePreview,
		FilePondPluginFileValidateSize,
		FilePondPluginFileValidateType
	);
	// Turn input element into a pond
	$(".filepond").filepond({
		credits: null,
		allowFileSizeValidation: "true",
		maxFileSize: "25MB",
		labelMaxFileSizeExceeded: trans('file_too_large') || "File is too large",
		labelMaxFileSize: trans('maximum_file_size') + " {filesize}" || "Maximum file size is {filesize}",
		allowFileTypeValidation: true,
		acceptedFileTypes: ["image/*"],
		labelFileTypeNotAllowed: trans('file_invalid_type') || "File of invalid type",
		// fileValidateTypeLabelExpectedTypes: "Expects {allButLastType} or {lastType}",
        fileValidateTypeLabelExpectedTypes: (trans('expects_files') || "Expects {allButLastType} or {lastType}"),
        labelIdle: `${trans('drag_drop_files') || "Drag & Drop your files"} ${trans('or') || "or"} <span class="filepond--label-action">${trans('browse') || "Browse"}</span>`,
		storeAsFile: true,
		allowPdfPreview: true,
		pdfPreviewHeight: 320,
		pdfComponentExtraParams: "toolbar=0&navpanes=0&scrollbar=0&view=fitH",
	});

	$(".filepond-video").filepond({
		credits: null,
		allowFileSizeValidation: "true",
		maxFileSize: "25MB",
		labelMaxFileSizeExceeded: trans('file_too_large') || "File is too large",
		labelMaxFileSize: trans('maximum_file_size') + " {filesize}" || "Maximum file size is {filesize}",
		allowFileTypeValidation: true,
		acceptedFileTypes: ["video/*"],
		labelFileTypeNotAllowed: trans('file_invalid_type') || "File of invalid type",
		// fileValidateTypeLabelExpectedTypes: "Expects {allButLastType} or {lastType}",
        fileValidateTypeLabelExpectedTypes: (trans('expects_files') + " {allButLastType} " + trans('or') + " {lastType}" || "Expects {allButLastType} or {lastType}"),
        labelIdle: `${trans('drag_drop_files') || "Drag & Drop your files"} ${trans('or') || "or"} <span class="filepond--label-action">${trans('browse') || "Browse"}</span>`,
		storeAsFile: true,
		allowPdfPreview: true,
		pdfPreviewHeight: 320,
		pdfComponentExtraParams: "toolbar=0&navpanes=0&scrollbar=0&view=fitH",
	});

	$(".filepond-json").filepond({
		credits: null,
		allowFileSizeValidation: "true",
		maxFileSize: "25MB",
		labelMaxFileSizeExceeded: trans('file_too_large') || "File is too large",
		labelMaxFileSize: trans('maximum_file_size') + " {filesize}" || "Maximum file size is {filesize}",
		allowFileTypeValidation: true,
		acceptedFileTypes: ["application/JSON"],
		labelFileTypeNotAllowed: trans('file_invalid_type') || "File of invalid type",
		// fileValidateTypeLabelExpectedTypes: "Expects {allButLastType} or {lastType}",
        fileValidateTypeLabelExpectedTypes: (trans('expects_files') + " {allButLastType} " + trans('or') + " {lastType}" || "Expects {allButLastType} or {lastType}"),
        labelIdle: `${trans('drag_drop_files') || "Drag & Drop your files"} ${trans('or') || "or"} <span class="filepond--label-action">${trans('browse') || "Browse"}</span>`,
		storeAsFile: true,
		allowPdfPreview: true,
		pdfPreviewHeight: 320,
		pdfComponentExtraParams: "toolbar=0&navpanes=0&scrollbar=0&view=fitH",
	});
	$(".filepond-pdf").filepond({
		credits: null,
		allowFileSizeValidation: "true",
		maxFileSize: "25MB",
		labelMaxFileSizeExceeded: trans('file_too_large') || "File is too large",
		labelMaxFileSize: trans('maximum_file_size') + " {filesize}" || "Maximum file size is {filesize}",
		allowFileTypeValidation: true,
		acceptedFileTypes: ["application/pdf"],
		labelFileTypeNotAllowed: trans('file_invalid_type') || "File of invalid type",
		fileValidateTypeLabelExpectedTypes: (trans('expects_files') + " {allButLastType} " + trans('or') + " {lastType}" || "Expects {allButLastType} or {lastType}"),
		fileValidateTypeDetectType: (source, type) =>
			new Promise((resolve, reject) => {
				if (type === 'application/pdf') {
					resolve(type);
					return;
				}
				const ext = source.name ? source.name.split('.').pop().toLowerCase() : '';
				if (ext === 'pdf') {
					resolve('application/pdf');
					return;
				}
				reject(type);
			}),
		labelIdle: `${trans('drag_drop_files') || "Drag & Drop your files"} ${trans('or') || "or"} <span class="filepond--label-action">${trans('browse') || "Browse"}</span>`,
		storeAsFile: true,
	});

    // txt file with filepond
    $(".filepond-txt").filepond({
		credits: null,
		allowFileSizeValidation: "true",
		maxFileSize: "25MB",
		labelMaxFileSizeExceeded: trans('file_too_large') || "File is too large",
		labelMaxFileSize: trans('maximum_file_size') + " {filesize}" || "Maximum file size is {filesize}",
		allowFileTypeValidation: true,
		acceptedFileTypes: ["text/plain"],
		labelFileTypeNotAllowed: trans('file_invalid_type') || "File of invalid type",
		// fileValidateTypeLabelExpectedTypes: "Expects {allButLastType} or {lastType}",
        fileValidateTypeLabelExpectedTypes: (trans('expects_files') + " {allButLastType} " + trans('or') + " {lastType}" || "Expects {allButLastType} or {lastType}"),
        labelIdle: `${trans('drag_drop_files') || "Drag & Drop your files"} ${trans('or') || "or"} <span class="filepond--label-action">${trans('browse') || "Browse"}</span>`,
		storeAsFile: true,
		allowPdfPreview: true,
		pdfPreviewHeight: 320,
		pdfComponentExtraParams: "toolbar=0&navpanes=0&scrollbar=0&view=fitH",
	});
	$('.fa').popover({
		trigger: "manual",
		html: true,
	}).on('click', function() {
		$(this).popover('toggle');
	});

	// Enable links inside the popover to be clickable
	$('body').on('click', '.popover-content a', function(e) {
		e.stopPropagation();
	});

	// Close the popover when clicking outside of it
	$('body').on('click', function(e) {
		if (!$('.fa').is(e.target) && $('.fa').has(e.target).length === 0 && $('.popover').has(e
				.target).length === 0) {
			$('.fa').popover('hide');
		}
	});
});

$("#create_form").on("submit", function(e) {
	e.preventDefault();
	if ($(this).valid()) {
		let formElement = $(this);
		let submitButtonElement = $(this).find(":submit");
		let url = $(this).attr("action");
		let data = new FormData(this);

		function successCallback() {
			$("#table").bootstrapTable("refresh");
			formElement[0].reset();
			setTimeout(function() {
				let filePondElements = document.getElementsByClassName("filepond");
				// Iterate over all elements with the specified class
				for (let i = 0; i < filePondElements.length; i++) {
					let filePond = FilePond.find(filePondElements[i]);
					if (filePond != null) {
						// This will remove all files for each FilePond instance
						filePond.removeFiles();
					}
				}

				let filePondElements1 =
					document.getElementsByClassName("filepond-json");
				// Iterate over all elements with the specified class
				for (let i = 0; i < filePondElements1.length; i++) {
					let filePond = FilePond.find(filePondElements1[i]);
					if (filePond != null) {
						// This will remove all files for each FilePond instance
						filePond.removeFiles();
					}
				}

				let filePondElements2 = document.getElementsByClassName("filepond-video");
				// Iterate over all elements with the specified class
				for (let i = 0; i < filePondElements2.length; i++) {
					let filePond = FilePond.find(filePondElements2[i]);
					if (filePond != null) {
						// This will remove all files for each FilePond instance
						filePond.removeFiles();
					}
				}

				let filePondElements3 = document.getElementsByClassName("filepond-pdf");
				// Iterate over all elements with the specified class
				for (let i = 0; i < filePondElements3.length; i++) {
					let filePond = FilePond.find(filePondElements3[i]);
					if (filePond != null) {
						// This will remove all files for each FilePond instance
						filePond.removeFiles();
					}
				}

				formElement.find("select").val('').trigger("change");
				$('#order_language_id').trigger('change');
				$('#tag_id').val('').trigger('change');
				$('#category_ids').val('').trigger('change');
				$('#news_ids').val('').trigger('change');
				$('#author_news_type').val(null).trigger('change');
				if (typeof resetUserCategorySwitch === 'function') {
					resetUserCategorySwitch();
				}
			}, 500);
		}

		formAjaxRequest("POST", url, data, formElement, submitButtonElement, successCallback);
	}
});

$("#update_form").on("submit", function(e) {
	if ($(this).valid()) {
		e.preventDefault();
		let formElement = $(this);
		let submitButtonElement = $(this).find(":submit");
		let data = new FormData(this);
		data.append("_method", "PUT");
		let url = $(this).attr("action") + "/" + data.get("edit_id");

		function successCallback(response) {
			// console.log(response);
			$("#table").bootstrapTable("refresh");
			setTimeout(function() {
				$("#editDataModal").modal("hide");
				formElement[0].reset();

				let filePondElements = document.getElementsByClassName("filepond");

				// Iterate over all elements with the specified class
				for (let i = 0; i < filePondElements.length; i++) {
					let filePond = FilePond.find(filePondElements[i]);

					if (filePond != null) {
						// This will remove all files for each FilePond instance
						filePond.removeFiles();
					}
				}
				let filePondElements1 =
					document.getElementsByClassName("filepond-json");

				// Iterate over all elements with the specified class
				for (let i = 0; i < filePondElements1.length; i++) {
					let filePond = FilePond.find(filePondElements1[i]);

					if (filePond != null) {
						// This will remove all files for each FilePond instance
						filePond.removeFiles();
					}
				}

				let filePondPdfElements =
					document.getElementsByClassName("filepond-pdf");

				for (let i = 0; i < filePondPdfElements.length; i++) {
					let filePond = FilePond.find(filePondPdfElements[i]);

					if (filePond != null) {
						filePond.removeFiles();
					}
				}
				$('#order_language_id').trigger('change');
				// $("select").val(false).trigger("change");
			}, 1000);
		}

		formAjaxRequest("POST", url, data, formElement, submitButtonElement, successCallback);
	}
});

function showErrorToast(message) {
	Swal.fire({
		toast: true,
		icon: "error",
		title: message,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});
}

function showSuccessToast(message) {
	Swal.fire({
		toast: true,
		icon: "success",
		title: message,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});
}

$.ajaxSetup({
	headers: {
		"X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
	},
});

function ajaxRequest(type, url, data, beforeSendCallback, successCallback, errorCallback, finalCallback) {
	/*
	 * @param
	 * beforeSendCallback : This function will be executed before Ajax sends its request
	 * successCallback : This function will be executed if no Error will occur
	 * errorCallback : This function will be executed if some error will occur
	 * finalCallback : This function will be executed after all the functions are executed
	 */
	$.ajax({
		type: type,
		url: url,
		data: data,
		cache: false,
		processData: false,
		contentType: false,
		dataType: "json",
		beforeSend: function() {
			if (beforeSendCallback != null) {
				beforeSendCallback();
			}
		},
		success: function(data) {
			if (!data.error) {
				if (data.message) {
					showSuccessToast(data.message);
				}

                	// Handle page reload if requested (e.g., after system update)
				if (data.reload === true) {
					setTimeout(function() {
						if (data.reload_url) {
							window.location.href = data.reload_url;
						} else {
							window.location.reload();
						}
					}, 2500); // Small delay to show success message
					return;
				}
				if (successCallback != null) {
					successCallback(data);
				}
			} else {
				showErrorToast(data.message);
				if (errorCallback != null) {
					errorCallback(data);
				}
			}

			if (finalCallback != null) {
				finalCallback(data);
			}
		},
		error: function(jqXHR, textStatus, errorThrown, data) {

            // dd(jqXHR.responseJSON)
			if (jqXHR?.responseJSON?.message || true) {
				showErrorToast(jqXHR?.responseJSON?.message || 'Something went wrong');
			}
			if (finalCallback != null) {
				finalCallback();
			}
		},
	});
}

function formAjaxRequest(type, url, data, formElement, submitButtonElement, successCallback, errorCallback) {
	if (formElement) {
		let submitButtonText = submitButtonElement.val();

		function beforeSendCallback() {
			submitButtonElement.val("Please Wait...").attr("disabled", true);
		}

		function finalCallback(response) {
			submitButtonElement.val(submitButtonText).attr("disabled", false);
		}
		ajaxRequest(type, url, data, beforeSendCallback, successCallback, errorCallback, finalCallback);
	}
}

$(document).on("click", ".delete-form", function(e) {
	e.preventDefault();

    // Get dynamic title and text from data attributes
    let customTitle = $(this).data('title') || trans('are_you_sure');
    let customText = $(this).data('text') || trans('you_wont_be_able_to_revert_this');


	Swal.fire({
		// title: "Are you sure?",
		title: customTitle,
		text: customText,
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: trans('yes_delete_it'),
		cancelButtonText: trans('cancel'),
	}).then((result) => {
		if (result.isConfirmed) {
			let url = $(this).attr("data-url");
			let data = {
				_token: "{!! csrf-token() !!}",
			};
			function successCallback() {
				$("#table").bootstrapTable("refresh");
				setTimeout(() => {
					$('#order_language_id').trigger('change');
				}, 1000);
			}
			ajaxRequest("DELETE", url, data, null, successCallback);
		}
	});
});

function fetchList(url, data, targetElement) {
	$.ajax({
		url: url,
		type: "POST",
		data: data,
		beforeSend: function() {
			$(targetElement).html("Please wait..");
		},
		success: function(result) {
			$(targetElement).html(result);
		},
		error: function(errors) {
			console.log(errors);
		},
	});
}

$(".modal").on("hidden.bs.modal", function() {
	let filePondElements = document.getElementsByClassName("filepond");

	// Iterate over all elements with the specified class
	for (let i = 0; i < filePondElements.length; i++) {
		let filePond = FilePond.find(filePondElements[i]);

		if (filePond != null) {
			// This will remove all files for each FilePond instance
			filePond.removeFiles();
		}
	}

	let filePondElements1 = document.getElementsByClassName("filepond-video");

	// Iterate over all elements with the specified class
	for (let i = 0; i < filePondElements1.length; i++) {
		let filePond = FilePond.find(filePondElements1[i]);

		if (filePond != null) {
			// This will remove all files for each FilePond instance
			filePond.removeFiles();
		}
	}
	// put your default event here
	$("#youtube_url").val("");
	$("#other_url").val("");
	$("#exampleVideoInputFile1_edit").val("");
});

function getWordCount(fiels_type = "", field_counter = "", font = "0px arial") {
	let textArea = document.getElementById(fiels_type);
	let characterCounter = document.getElementById(field_counter);

	if (textArea && characterCounter) {
		const text = textArea.value;
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		context.font = font;
		const width = context.measureText(text).width;
		const finalWidth = Math.ceil(width);
		textdata = "";
		info_data = "";
		var fiels_type_value = "";
		if (fiels_type == "meta_title") {
			fiels_type_value =  trans('meta_title');

		} else if (fiels_type == "meta_description") {
			fiels_type_value =  trans('meta_description');
		} else if (fiels_type == "edit_meta_title") {
			fiels_type_value =  trans('meta_title');
		} else if (fiels_type == "edit_meta_description") {
			fiels_type_value =  trans('meta_description');
		}

		if (fiels_type == "meta_title") {
			less_equal = 240;
			less_equal2 = 580;
			textdata = `<span> ${trans('title')} ${textdata} ${trans('is')} <b>${finalWidth}</b> ${trans('pixel_s')} ${trans('long')}</span>`;

		} else if (fiels_type == "meta_description") {
			less_equal = 395;
			less_equal2 = 920;
			textdata = `<span> ${trans('meta_description')} ${textdata} ${trans('is')} <b>${finalWidth}</b> ${trans('pixel_s')} ${trans('long')}</span>`;
		} else if (fiels_type == "edit_meta_title") {
			less_equal = 240;
			less_equal2 = 580;
			textdata = `<span> ${trans('title')} ${textdata} ${trans('is')} <b>${finalWidth}</b> ${trans('pixel_s')} ${trans('long')}</span>`;

		} else if (fiels_type == "edit_meta_description") {
			less_equal = 395;
			less_equal2 = 920;
			textdata = `<span> ${trans('meta_description')} ${textdata} ${trans('is')} <b>${finalWidth}</b> ${trans('pixel_s')} ${trans('long')}</span>`;
		}

		if (finalWidth <= less_equal) {
			info_class = "text-danger";
			info_icon = '<i class="fa fa-exclamation-triangle ' + info_class + '"></i>';
		    info_data = `<span class=" + info_class + ">--${trans('your_page')} ${fiels_type_value} ${trans('is_too_short')}</span>`;

		} else if (finalWidth > less_equal && finalWidth <= less_equal2) {
			info_class = "text-success";
			info_icon = '<i class="fa fa-check-circle ' + info_class + '"></i>';
			info_data = `<span class=" + info_class + ">--${trans('your_page')} ${fiels_type_value} ${trans('is_acceptable_length')}</span>`;
		} else if (finalWidth > less_equal2) {
			info_class = "text-danger";
			info_icon =
				'<i class="fa fa-exclamation-triangle ' + info_class + '"></i>';
			info_data = `<span class=" + info_class + ">--${trans('page')} ${fiels_type_value} ${trans('should_be_around')} ${less_equal2} ${trans('pixel_s')} ${trans('in_length')}</span>`;
		}
		characterCounter.innerHTML = info_icon + " " + textdata + info_data;
	}
}
// function textFormatter(value, row, index) {
//     if (!value) return '';
//     let tempDiv = document.createElement('div');
//     tempDiv.innerHTML = value;
//     let textContent = tempDiv.textContent || tempDiv.innerText || '';

//     if (textContent.length > 100) {
//         return '<div class="description-container">' +
//             '<div class="short-desc">' + textContent.substring(0, 150) + '...</div>' +
//             '<div class="full-desc" style="display:none">' + value + '</div>' +
//             `<a href="javascript:void(0)" class="toggle-desc" data-show="more">${translations.see_more}</a>` +
//         '</div>';
//     }
//     return value;

// }


// // table column text show more and less formatter
// function textFormatter(value, row, index) {
//     if (value.length > 100) {
//         return '<div class="short-description">' + value.substring(0, 50) +
//             '... <a href="#" class="view-more" data-index="' + index + '">' + trans('see_more') + '</a></div>' +
//             '<div class="full-description" style="display:none;">' + value +
//             ' <a href="#" class="view-more" data-index="' + index + '">' + trans('see_less') + '</a></div>';
//     } else {
//         return value;
//     }
// }

// function smallTextFormatter (value, row, index){
//     if (!value) return '';

//     // Remove heading tags and other large tags
//     let sanitized = value.replace(/<\/?h[1-6][^>]*>/gi, '');

//     // Optionally, remove all HTML comments
//     sanitized = sanitized.replace(/<!--.*?-->/gs, '');

//     return `<small style="font-size: 1.0rem;">${sanitized}</small>`;
// }

$(document).ready(function () {
    $('body').on('click', '.view-more', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $row = $this.closest('tr');
        var $fullDescription = $row.find('.full-description');
        var $shortDescription = $row.find('.short-description');

        if ($fullDescription.is(':visible')) {
            $fullDescription.hide();
            $shortDescription.show();
            $this.text(trans('see_less'));
        } else {
            $fullDescription.show();
            $shortDescription.hide();
            $this.text(trans('see_more'));
        }
    });
});

// Global function to generate all meta fields using AI
function generateAllMetaFields(options = {}) {


    // Default configuration
    const config = {
        isEditForm: false,
        buttonSelector: '#generate_meta_fields',
        // titleSelector: options.isEditForm ? '#edit_title' : '#name',
        // contentSelector: options.isEditForm ? 'edit_des' : 'des',
        // categorySelector: options.isEditForm ? '#edit_category_id' : '#category_id',
        // languageSelector: '',
        routeUrl: '',
        csrfToken: '',
        // fieldMappings: {
        //     metaTags: options.isEditForm ? '#edit_meta_tags' : '#meta_tags',
        //     metaTitle: options.isEditForm ? '#edit_meta_title' : '#meta_title',
        //     metaDescription: options.isEditForm ? '#edit_meta_description' : '#meta_description'
        // },
        validationMessages: {
            selectLanguage: 'Please select language first',
            enterTitle: 'Please enter title first'
        },
        ...options
    };

    var title = '';
    // var content = '';
    // var category = '';

    // Get title based on configuration
    if ($(config.titleSelector).length) {
        title = $(config.titleSelector).val();
    }

    // Get content from TinyMCE editor
    // if (tinymce.get(config.contentSelector)) {
    //     content = tinymce.get(config.contentSelector).getContent({format: 'text'}).substring(0, 200);
    // }

    // Get category
    // if ($(config.categorySelector).length) {
    //     category = $(config.categorySelector + ' option:selected').text();
    // }

    // Get language
    let languageName = $(config.languageSelector + ' option:selected').data('name');

    // Validate we have at least a language
    if (!languageName || languageName === '') {
        showErrorToast(config.validationMessages.selectLanguage);
        return;
    }

    // Validate we have at least a title
    if (!title.trim()) {
        showErrorToast(config.validationMessages.enterTitle);
        return;
    }

    // Get the button element
    var buttonElement = $(config.buttonSelector);
    if (!buttonElement.length) {
        console.error('Button element not found:', config.buttonSelector);
        return;
    }

    // Show loading state
    var originalHtml = buttonElement.html();
    buttonElement.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> ' + (trans('generating_meta_fields') || 'Generating All Meta Fields...'));

    // Add progress animation
    var progressSteps = [
        trans('analyzing_content') || 'Analyzing content...',
        trans('generating_keywords') || 'Generating keywords...',
        trans('creating_meta_title') || 'Creating meta title...',
        trans('writing_description') || 'Writing description...',
        trans('finalizing') || 'Finalizing...'
    ];

    var currentStep = 0;
    var progressInterval = setInterval(function() {
        if (currentStep < progressSteps.length) {
            buttonElement.html('<i class="fas fa-spinner fa-spin"></i> ' + progressSteps[currentStep]);
            currentStep++;
        }
    }, 800);

    // console.log(config);

    // Make AJAX request
    $.ajax({
        url: config.routeUrl,
        type: 'POST',
        data: {
            _token: config.csrfToken,
            title: title,
            // content: content,
            // category: category,
            language_name: languageName,
            includeDescription: Boolean(config.includeDescription) || false,
            includeSummarizedDescription: Boolean(config.includeSummarizedDescription) || false,
        },
        success: function(response) {
            clearInterval(progressInterval);

            if (response.success && response.data) {
                // Set meta keywords
                if ($(config.fieldMappings.metaTags).length) {
                    $(config.fieldMappings.metaTags).val(response.data.meta_keywords);
                }

                // Set meta title
                if ($(config.fieldMappings.metaTitle).length) {
                    $(config.fieldMappings.metaTitle).val(response.data.meta_title);
                    $(config.fieldMappings.metaTitle).trigger('input'); // Trigger word count
                }

                // Set meta description
                if ($(config.fieldMappings.metaDescription).length) {
                    $(config.fieldMappings.metaDescription).val(response.data.meta_description);
                    $(config.fieldMappings.metaDescription).trigger('input'); // Trigger word count
                }

                // Set description
                if (config.fieldMappings.description && response.data.description) {
                    // console.log('Setting description to:', config.fieldMappings.description);
                    setTinyMCEContent(config.fieldMappings.description, response.data.description);
                }

                // Set summarized description
                if ($(config.fieldMappings.summarizedDescription).length) {
                    $(config.fieldMappings.summarizedDescription).val(response.data.summarized_description);
                    $(config.fieldMappings.summarizedDescription).trigger('input'); // Trigger word count
                }

                // Success animation
                buttonElement.html('<i class="fas fa-check"></i> ' + (trans('generated_successfully') || 'Generated Successfully!'));

                setTimeout(function() {
                    buttonElement.html(originalHtml);
                }, 2000);

                // Show success message with details
                var successMsg = (trans('meta_fields_generated_successfully') || 'All meta fields generated successfully!') +
                    '\n• ' + (trans('keywords') || 'Keywords') + ': ' + response.data.meta_keywords.split(',').length + ' ' + (trans('keywords') || 'keywords') +
                    '\n• ' + (trans('title') || 'Title') + ': ' + response.data.meta_title.length + ' ' + (trans('characters') || 'characters') +
                    '\n• ' + (trans('description') || 'Description') + ': ' + response.data.meta_description.length + ' ' + (trans('characters') || 'characters');

                showSuccessToast(successMsg);
            } else {
                showErrorToast(response.message || (trans('failed_to_generate_meta_fields') || 'Failed to generate meta fields'));
            }
        },
        error: function(xhr, status, error) {
            clearInterval(progressInterval);

            var errorMessage = trans('failed_to_generate_meta_fields') || 'Failed to generate meta fields. Please try again.';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }
            showErrorToast(errorMessage);

            // Error animation
            buttonElement.html('<i class="fas fa-exclamation-triangle"></i> ' + (trans('generation_failed') || 'Generation Failed'));

            setTimeout(function() {
                buttonElement.html(originalHtml);
            }, 3000);
        },
        complete: function() {
            clearInterval(progressInterval);
            // Reset button state
            buttonElement.prop('disabled', false);
        }
    });
}

// Helper function to safely set TinyMCE content
function setTinyMCEContent(selector, content) {
    if (!selector || !content) return false;

    // Remove # from selector if present for TinyMCE
    var editorId = selector.replace('#', '');

    // Try to get the TinyMCE editor instance
    var editor = tinymce.get(editorId);

    if (editor) {
        // Editor exists, set content
        editor.setContent(content);
        // console.log('Content set successfully to TinyMCE editor:', editorId);
        return true;
    } else {
        // Editor doesn't exist, try to set as regular textarea
        // console.log('TinyMCE editor not found, trying as textarea:', editorId);
        if ($(selector).length) {
            $(selector).val(content);
            $(selector).trigger('input');
            return true;
        }
    }

    // console.warn('Could not set content for:', selector);
    return false;
}

// Helper function to initialize meta field generation for a specific form
function initMetaFieldGeneration(config) {
    $(document).on('click', config.buttonSelector || '#generate_meta_fields', function(e) {
        e.preventDefault();
        generateAllMetaFields(config);
    });
}

// JS is customized for TinyMCE toolbar overflow not hiding when modal is closed
$(document).ready(function() {
    // Fix TinyMCE toolbar overflow not hiding when modal is closed

    $('#editDataModal').on('hidden.bs.modal', function() {
        // Hide all TinyMCE overflow toolbars that might be left visible
        // These elements are often appended to body, so we search globally
        setTimeout(function() {
            $('.tox-toolbar__overflow').each(function() {
                $(this).hide().removeClass('tox-toolbar__overflow--open');
            });

            // Also hide any TinyMCE popups/dropdowns that might be open
            $('.tox-menu').hide();
            $('.tox-collection').hide();
            $('.tox-pop').hide();

            // Remove open state classes
            $('.tox-toolbar__overflow--open').removeClass('tox-toolbar__overflow--open');
        }, 10); // Small delay to ensure modal animation completes

        // update the tox-toolbar__group > button attributes like aria-expanded = false and remove class tox-tbtn--enabled and remove attribute aria-controls
        $('.tox-toolbar__group').each(function() {
            $(this).find('button').attr('aria-expanded', 'false').removeClass('tox-tbtn--enabled').removeAttr('aria-controls');
        });
    });

    // Also handle when modal is shown to ensure proper cleanup
    $('#editDataModal').on('show.bs.modal', function() {
        // Clean up any leftover overflow elements before showing
        $('.tox-toolbar__overflow').hide();
        $('.tox-toolbar__overflow--open').removeClass('tox-toolbar__overflow--open');
        $('.tox-menu').hide();
        $('.tox-collection').hide();
    });
});



// breaking news show more and less formatter
$(document).on('click', '.toggle-desc', function() {
    const container = $(this).closest('.description-container');
    const shortDesc = container.find('.short-desc');
    const fullDesc = container.find('.full-desc');

    if ($(this).data('show') === 'more') {
        shortDesc.hide();
        fullDesc.show();
        $(this).text(trans('see_less'));
        $(this).data('show', 'less');
    } else {
        fullDesc.hide();
        shortDesc.show();
        $(this).text(trans('see_more'));
        $(this).data('show', 'more');
    }
});

// function fetchRssFeedsList(url, data, selector) {
//     $.ajax({
//         url: url,
//         type: "GET",
//         data: data,
//         success: function(result) {
//             $(selector).html(result);
//         },
//         error: function(errors) {
//             $(selector).html('');
//             // console.log(errors);
//         },
//     });
// }
// function fetchCategoriesList(url, data, selector, callback) {
//     $.ajax({
//         url: url,
//         type: "GET",
//         data: data,
//         success: function(result) {
//             $(selector).html(result);
//             // Execute callback if provided (e.g., to reinitialize Select2)
//             if (typeof callback === 'function') {
//                 callback(result);
//             }
//         },
//         error: function(errors) {
//             $(selector).html('');
//             console.error('Error fetching categories list:', errors);
//             // Execute callback even on error to handle cleanup
//             if (typeof callback === 'function') {
//                 callback(null);
//             }
//         },
//     });
// }

function fetchEditRssFeedsList(url, data, selector, selectedValues) {

	$.ajax({
		url: url,
		type: "GET",
		data: data,
		success: function(result) {
			$(selector).html(result);
			// Set selected values if provided
			if (selectedValues) {
				// Convert comma-separated string to array if needed
				var valuesArray = Array.isArray(selectedValues) ? selectedValues : (typeof selectedValues === 'string' ? selectedValues.split(',') : []);
				// Filter out empty values and convert to strings/numbers as needed
				valuesArray = valuesArray.filter(function(val) {
					return val !== null && val !== undefined && String(val).trim() !== '';
				}).map(function(val) {
					// Convert to string and trim
					return String(val).trim();
				});
				if (valuesArray.length > 0) {
					$(selector).val(valuesArray).trigger('change');
				}
			}
		}
	});

}
// function fetchEditCategoryList(url, data, selector, selectedValues) {

// 	$.ajax({
// 		url: url,
// 		type: "GET",
// 		data: data,
// 		success: function(result) {
// 			$(selector).html(result);
// 			// Set selected values if provided
// 			if (selectedValues) {
// 				// Convert comma-separated string to array if needed
// 				var valuesArray = Array.isArray(selectedValues) ? selectedValues : (typeof selectedValues === 'string' ? selectedValues.split(',') : []);
// 				// Filter out empty values and convert to strings/numbers as needed
// 				valuesArray = valuesArray.filter(function(val) {
// 					return val !== null && val !== undefined && String(val).trim() !== '';
// 				}).map(function(val) {
// 					// Convert to string and trim
// 					return String(val).trim();
// 				});
// 				if (valuesArray.length > 0) {
// 					$(selector).val(valuesArray).trigger('change');
// 				}
// 			}
// 		}
// 	});
// }


// Tagify initialization — wrapped in IIFE to prevent re-declaration errors.
// jQuery's $.globalEval (called by .html() when content has <script> tags) can
// re-execute this file. Using `const` at top level throws SyntaxError on the
// second execution. The IIFE + ._tagify sentinel ensures single init per element.
(function () {
    var _tagifyEl = document.querySelector("#TagifyCustomListSuggestion");
    if (_tagifyEl && !_tagifyEl._tagify) {
        window.TagifyCustomListSuggestion = new Tagify(_tagifyEl, {
            whitelist: [],
            maxTags: 10,
            dropdown: { maxItems: 20, classname: "", enabled: 0, closeOnSelect: false }
        });
        _tagifyEl._tagify = true;
    }

    // edit news
    var _editTagifyEl = document.querySelector("#edit_news_tagify");
    if (_editTagifyEl && !_editTagifyEl._tagify) {
        window.editTagCustomListSuggestion = new Tagify(_editTagifyEl, {
            whitelist: [],
            maxTags: 10,
            dropdown: { maxItems: 20, classname: "", enabled: 0, closeOnSelect: false }
        });
        _editTagifyEl._tagify = true;
    }
}());


// create rss feed + edit rss feed Tagify init (same IIFE guard pattern)
(function () {
    var _rssFeedEl = document.querySelector("#rss_feed_tagify");
    if (_rssFeedEl && !_rssFeedEl._tagify) {
        window.RSSFeedTagCustomListSuggestion = new Tagify(_rssFeedEl, {
            whitelist: [],
            maxTags: 10,
            dropdown: { maxItems: 20, classname: "", enabled: 0, closeOnSelect: false }
        });
        _rssFeedEl._tagify = true;
    }

    var _editRssFeedEl = document.querySelector("#edit_rss_tagify");
    if (_editRssFeedEl && !_editRssFeedEl._tagify) {
        window.editRSSFeedTagCustomListSuggestion = new Tagify(_editRssFeedEl, {
            whitelist: [],
            maxTags: 10,
            dropdown: { maxItems: 20, classname: "", enabled: 0, closeOnSelect: false }
        });
        _editRssFeedEl._tagify = true;
    }
}());
