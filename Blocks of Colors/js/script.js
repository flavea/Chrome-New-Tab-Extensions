var timeFormat = 12
var dateFormat = 1

function time() {
	if(timeFormat == 24) $('#header h1').html($.format.date(new Date(), "HH:mm:ss"))
	else $('#header h1').html($.format.date(new Date(), "hh:mm a"))
	if(dateFormat == 1) $('#header span').html($.format.date(new Date(), "ddd, MMMM D yyyy"))
	else $('#header span').html($.format.date(new Date(), "ddd, dd MMMM yyyy"))
}

function processSetting(options) {
	let root = document.documentElement

	if(navigator.onLine) {
		root.style.setProperty('--color-1', `#${options.color1}`)
		root.style.setProperty('--color-2', `#${options.color2}`)
		root.style.setProperty('--color-3', `#${options.color3}`)
		if (options.image != '') $("#sidebar").css("background-image", `url(${options.image})`)
		if (options.background != '') $("body").css("background-image", `url(${options.background})`)
		
		if (options.showQuote) {
			var settings = {
				"crossDomain": true,
				"url": "https://andruxnet-random-famous-quotes.p.rapidapi.com/?count=1&cat=movies",
				"method": "POST",
				"headers": {
					"X-RapidAPI-Host": "andruxnet-random-famous-quotes.p.rapidapi.com",
					"X-RapidAPI-Key": "c9ed88a6d7msh2bb16885ae42db6p18398djsn14a875b76406",
					"Content-Type": "application/x-www-form-urlencoded"
				},
				"data": ""
			}

			$.ajax(settings).done(function (response) {
				response.forEach(quote => {
					$('#movie blockquote').text(quote.quote)
					$('#movie source').text(quote.author)
				});
			});
		} else $('#movie').hide()
	} else $('#movie').hide()

	$("#name").text(`Welcome${options.name != '' ? ', ' + options.name : ''}`)
	if (options.onlineStatus) {
		$("#online").text(`You are ${navigator.onLine ? "online" : "offline"}!`)
	}

	if (options.links.length > 0) {
		let links = ''
		options.links.forEach(e => {
			links += `<a href="${e.link}">${e.icon}<span>${e.text}</span></a>`
		})
		$("#links").html(links)
	}

	if (options.links.length < 24) {
		let links = ''
		let sisa = 24 - options.links.length
		for(let i = 0; i < sisa; i++) {
			links += `<a><span></span></a>`
		}
		$("#links").append(links)
	}

	timeFormat = options.timeFormat
	dateFormat = options.dateFormat

	setInterval(time, 1000)
}

$(ready =>  {
	setInterval(time, 1000)

	$("#go-options").click(e => {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	})

	chrome.storage.sync.get(['HLROptions'], (result) => {
		let options = {}
		if (typeof result.HLROptions == "undefined") {
			let request = $.ajax({
				url: 'settings.json'
			})

			request.done(data =>  {
				options = data.HLROptions
				processSetting(options)
			})
		} else {
			options = result.HLROptions
			processSetting(options)
		}

	})


	if (!navigator.onLine) {
		$('body').addClass('offline')
	} else {
		$('body').removeClass('offline')
	}
});