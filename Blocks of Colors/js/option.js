$(ready =>  {

    function buildSettingJSON() {
        let options = {}

        options.name = $("#name").val()
        options.image = $("#image").val()
        options.background = $("#background").val()
        options.color1 = $("#color1").val()
        options.color2 = $("#color2").val()
        options.color3 = $("#color3").val()
        options.onlineStatus = $("#optOnline").prop("checked")
        options.showQuote = $("#optMovie").prop("checked")
        options.timeFormat = $("#time").val()
        options.dateFormat = $("#date").val()
        options.links = []

        if ($('#optLinks > .link').length > 0) {
            $('#optLinks > .link').each((i, e) => {
                let link = {}
                link.icon = $('.icon', e).val()
                link.text = $('.text', e).val()
                link.link = $('.link', e).val()
                if(link.text != '' && link.link != '' && link.icon != '') options.links.push(link)
            })
        }

        return options
    }

    function parseOptions(options) {
        $("#optLinks > .link").remove()
        $("#name").val(options.name)
        $("#image").val(options.image)
        $("#background").val(options.background)
        $("#color1").val(options.color1)
        $("#color2").val(options.color2)
        $("#color3").val(options.color3)
        $("#time").val(options.timeFormat).change()
        $("#date").val(options.dateFormat).change()
        if (options.onlineStatus) $("#optOnline").prop("checked", true)
        if (options.showQuote) $("#optMovie").prop("checked", true)

        if (options.links.length > 0) {
            options.links.forEach(e => {
                if ($('#optLinks > .link').length < 24) {
                    let link = $('.linkTemp').clone().removeClass('linkTemp').addClass('link')
                    $('.icon', link).val(e.icon)
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
                }
            })
        }
    }

    $("#addLink").click(e => {
        if ($('#optLinks > .link').length < 24) {
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
        } else alert("Maximum 24 links!")
    })

    $("#save").click(e => {
        chrome.storage.sync.set({
            HLROptions: buildSettingJSON()
        }, then => {
            alert("Options saved!")
        })
    })

    $("#export").click(e => {
        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify({
            "HLROptions": buildSettingJSON()
        })))
        element.setAttribute('download', `block_of_colors_settings_${Date.now()}.json`)

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

        reader.onload = (f =>  {
            return function (e) {
                let read = JSON.parse(e.target.result)
                if (typeof read.HLROptions != "undefined") {
                    let options = read.HLROptions
                    parseOptions(options)
                    alert('Settings imported! Do not forget to save the settings!')
                } else alert("File format is wrong.")
            }
        })(file)

        reader.readAsText(file)
    })

    chrome.storage.sync.get(['HLROptions'], (result) => {

        if (typeof result.HLROptions == "undefined") {
            let request = $.ajax({
                url: 'settings.json'
            })

            request.done(data =>  {
                options = data.HLROptions
                parseOptions(options)
            })
        } else {
            options = result.HLROptions
            parseOptions(options)
        }
    })
})