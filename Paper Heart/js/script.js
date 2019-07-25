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

	if(navigator.onLine){
		root.style.setProperty('--color-1', `#${options.color1}`)
		root.style.setProperty('--color-2', `#${options.color2}`)
		if (options.image != '') $("body").css("background-image", `url(${options.image})`).css("background-position", options.backgroundPosition)
	}

	if (options.links.length > 0) {
		let links = ''
		options.links.forEach((e, i) => {
			links += `<a href="${e.link}"><b>${(i+1) < 10 ? ('0'+(i+1)) : (i+1)} <span></span> </b>${e.text}</a>`
		})
		$("#links").html(links)
	}

	if (options.grayScale) $('.twitter-inside').addClass('grayscale')

	if (options.twitter == '' && !options.showHistory) $('#content').remove()
	if (options.twitter != '' && navigator.onLine) $('.twitter-timeline').attr("href", options.twitter).attr("data-link-color", `#${options.color1}`)
	if (options.showHistory) {
		chrome.history.search({
			text: '',
			maxResults: 20
		}, data =>  {
			$("#history .history").remove()
			data.forEach(page => {
				let link = $('.historyTemp').clone().removeClass('historyTemp').addClass('history')
				$('h3', link).text(page.title)
				$('span', link).text(page.url)
				$(link).attr("href", page.url)
				$("#history").append(link)
				$('.twitter-timeline').attr("href", options.twitter).attr("data-link-color", `#${options.color1}`)
			});
		});

		$('#searchHistory').on('input', then => {
			let input = $("#searchHistory").val()
			if (input.length > 3) {
				chrome.history.search({
					text: input,
					maxResults: 20
				}, data =>  {
					$("#history .history").remove()
					data.forEach(page => {
						let link = $('.historyTemp').clone().removeClass('historyTemp').addClass('history')
						$('h3', link).text(page.title)
						$('span', link).text(page.url)
						$(link).attr("href", page.url)
						$("#history").append(link)
					});
				});
			}
		});
	}

	if (options.twitter != '' && !options.showHistory && navigator.onLine) $("#twitter, [target=twitter]").show()
	if (options.twitter == '' && options.showHistory) $("#history, [target=history]").show()
	if (options.twitter != '' && options.showHistory && navigator.onLine) {
		$("#twitter, .info a").show()
		$(".info > a").click(e => {
			$(".info > a").removeClass('active')
			$(e.target).addClass('active')
			let target = $(e.target).attr('target')
			$('.ccontent').hide()
			$(`#${target}`).show()

		})
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

	chrome.storage.sync.get(['HLROptions3'], (result) => {
		let options = {}
		if (typeof result.HLROptions3 == "undefined") {
			let request = $.ajax({
				url: 'settings.json'
			})

			request.done(data =>  {
				options = data.HLROptions3
				processSetting(options)
			})
		} else {
			options = result.HLROptions3
			processSetting(options)
		}
	})


	if (!navigator.onLine) {
		$('body').addClass('offline')
	} else {
		$('body').removeClass('offline')
		$("#twitter, [target=twitter]").hide()
	}
});