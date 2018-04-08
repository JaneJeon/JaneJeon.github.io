$(function() {
	$('header').prependTo($('.container'))
	$('nav').prependTo($('.container'))
	$('header h1').attr('class', 'mt-5')
	$('.author').attr('class', 'author lead')
	$('.date').attr('class', 'text-muted')
	$('a').each(function() {
		if (!$(this).hasClass('navbar-brand'))
			$('a').attr('target', '_blank')
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