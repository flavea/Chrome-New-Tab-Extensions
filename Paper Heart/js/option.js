$(ready =>  {

    function buildSettingJSON() {
        let options = {}

        options.twitter = $("#twitter").val()
        options.image = $("#image").val()
        options.backgroundPosition = $("#backgroundPost").val()
        options.color1 = $("#color1").val()
        options.color2 = $("#color2").val()
        options.showBookmarks = $("#optBookmarks").prop("checked")
        options.showHistory = $("#optHistory").prop("checked")
        options.grayScale = $("#optGrayscale").prop("checked")
        options.timeFormat = $("#time").val()
        options.dateFormat = $("#date").val()
        options.links = []

        if ($('#optLinks > .link').length > 0) {
            $('#optLinks > .link').each((i, e) => {
                let link = {}
                link.text = $('.text', e).val()
                link.link = $('.link', e).val()
                if(link.text != '' && link.link != '') options.links.push(link)
            })
        }

        return options
    }

    function parseOptions(options) {
        $("#optLinks > .link").remove()
        $("#twitter").val(options.twitter)
        $("#backgroundPost").val(options.backgroundPosition)
        $("#image").val(options.image)
        $("#color1").val(options.color1)
        $("#color2").val(options.color2)
        $("#time").val(options.timeFormat).change()
        $("#date").val(options.dateFormat).change()
        if (options.showBookmarks) $("#optBookmarks").prop("checked", true)
        if (options.grayScale) $("#optGrayscale").prop("checked", true)
        if (options.showHistory) $("#optHistory").prop("checked", true)

        if (options.links.length > 0) {
            options.links.forEach(e => {
                let link = $('.linkTemp').clone().removeClass('linkTemp').addClass('link')
                $('.text', link).val(e.text)
                $('.link', link).val(e.link)
                $('legend', link).text(`Link ${$('#optLinks > .link').length + 1}`)
                $(".delete", link).click(e => {
                    $(e.target).parent().remove()
                    $('#optLinks > .link').each((i, e) => {
                        $('legend', e).text(`Link ${i+1}`)
                    })
                })
                $("#optLinks").append(link)
            })
        }
    }

    $(".addLink").click(e => {
        let link = $('.linkTemp').clone().removeClass('linkTemp').addClass('link')
        $('input', link).val('')
        $('legend', link).text(`Link ${$('#optLinks > .link').length + 1}`)
        $("#optLinks").append(link)

        $(".delete", link).click(e => {
            $(e.target).parent().remove()
            $('#optLinks > .link').each((i, e) => {
                $('legend', e).text(`Link ${i+1}`)
            })
        })
    })

    $("#save").click(e => {
        chrome.storage.sync.set({
            HLROptions3: buildSettingJSON()
        }, then => {
            alert("Options saved!")
        })
    })

    $("#export").click(e => {
        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify({
            "HLROptions3": buildSettingJSON()
        })))
        element.setAttribute('download', `paper_heart_settings_${Date.now()}.json`)

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
    })

    $("#import").click(e => {
        $("#importFile").click()
    })

    $("#importFile").change(evt => {
        var file = evt.target.files[0]

        var reader = new FileReader()

        reader.onload = (f => {
            return e => {
                let read = JSON.parse(e.target.result)
                if (typeof read.HLROptions3 != "undefined") {
                    let options = read.HLROptions3
                    parseOptions(options)
                    alert('Settings imported! Do not forget to save the settings!')
                } else alert("File format is wrong.")
            }
        })(file)

        reader.readAsText(file)
    })

    chrome.storage.sync.get(['HLROptions3'], (result) => {
        if (typeof result.HLROptions3 == "undefined") {
            let request = $.ajax({
                url: 'settings.json'
            })

            request.done(data =>  {
                options = data.HLROptions3
                parseOptions(options)
            })
        } else {
            options = result.HLROptions3
            parseOptions(options)
        }
    })
})