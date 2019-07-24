var timeFormat = 12
var dateFormat = 1

function time() {
	if(timeFormat == 24) $('#header h1').html($.format.date(new Date(), "HH:mm:ss"))
	else $('#header h1').html($.format.date(new Date(), "hh:mm a"))
	if(dateFormat == 1) $('#header span').html($.format.date(new Date(), "ddd, MMMM D yyyy"))
	else $('#header span').html($.format.date(new Date(), "ddd, dd MMMM yyyy"))
}

function processSetting(options) {
	$("body").removeClass().addClass(options.scheme)

	if (options.links.length > 0) {
		let links = ''

		if ($('#links > .span').length < 16) {
			options.links.forEach(e => {
				links += `<span><a href="${e.link}">${e.icon}</a></span>`
			})
			$("#links").html(links)
		}
	}

	timeFormat = options.timeFormat
	dateFormat = options.dateFormat

	setInterval(time, 1000)
}

$(ready =>  {
	$("#go-options").click(e => {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	})

	chrome.storage.sync.get(['HLROptions2'], (result) => {
		let options = {}
		if (typeof result.HLROptions2 == "undefined") {
			let request = $.ajax({
				url: 'settings.json'
			})

			request.done(data =>  {
				options = data.HLROptions2
				processSetting(options)
			})
		} else {
			options = result.HLROptions2
			processSetting(options)
		}
	})
});