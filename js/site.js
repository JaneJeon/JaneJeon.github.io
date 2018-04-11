$(function() {
	callHome({
		type: 'visit',
		url: window.location.href,
		prev: document.referrer
	})
	
	$('header h1').attr('class', 'mt-5')
	$('.author').attr('class', 'author lead')
	$('.date').attr('class', 'text-muted')
	$('a').attr('target', '_blank')
	$('a.navbar-brand').removeAttr('target')
	$('a').click(function() {
		callHome({
			type: 'click',
			url: $(this).attr('href')
		})
	})
	
	// allow lightbox initialization - needs to come before loading the script
	// because we need <a><img></a>, not <img>, which is what pandoc generates
	$('img').each(function(index) {
		$(this).after('<a></a>')
		var link = $(this).next()
		link.attr({
			href: $(this).attr('src'),
			'data-lightbox': 'image-'+index
		})
		var caption = $(this).attr('alt')
		if (caption) link.attr('data-title', caption)
		$(this).appendTo(link)
	}).addClass('rounded mx-auto d-block') // make images look nice
	
	$('figure').each(function() { // remove stupid figure & figcapture tags
		$(this).after('<p></p>')
		$(this).next().append($(this).find('a'))
		$(this).remove()
	})
})

function callHome(data) {
	$.ajax({
		url: 'https://54.161.228.9:3000',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		// needed to send cookies
		xhrFields: {
			withCredentials: true
		}
	})
}