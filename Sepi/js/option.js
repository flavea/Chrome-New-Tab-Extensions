$(ready =>  {

    function buildSettingJSON() {
        let options = {}

        options.scheme = $("#scheme").val()
        options.timeFormat = $("#time").val()
        options.dateFormat = $("#date").val()
        options.links = []

        if ($('#optLinks > .link').length > 0) {
            $('#optLinks > .link').each((i, e) => {
                let link = {}
                link.icon = $('.icon', e).val()
                link.link = $('.link', e).val()
                if(link.icon != '' && link.link != '') options.links.push(link)
            })
        }

        return options
    }

    function parseOptions(options) {
        $("#optLinks > .link").remove()
        $("#scheme").val(options.scheme).change()
        $("#time").val(options.timeFormat).change()
        $("#date").val(options.dateFormat).change()

        if (options.links.length > 0) {
            options.links.forEach(e => {
                if ($('#optLinks > .link').length < 16) {
                    let link = $('.linkTemp').clone().removeClass('linkTemp').addClass('link')
                    $('.icon', link).val(e.icon)
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

    $(".addLink").click(e => {
        if ($('#optLinks > .link').length < 16) {
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
        } else alert("Maximum 16 links!")
    })

    $("#save").click(e => {
        chrome.storage.sync.set({
            HLROptions2: buildSettingJSON()
        }, then => {
            alert("Options saved!")
        })
    })

    $("#export").click(e => {
        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify({
            "HLROptions2": buildSettingJSON()
        })))
        element.setAttribute('download', `sepi_settings_${Date.now()}.json`)

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
                if (typeof read.HLROptions2 != "undefined") {
                    let options = read.HLROptions2
                    parseOptions(options)
                    alert('Settings imported! Do not forget to save the settings!')
                } else alert("File format is wrong.")
            }
        })(file)

        reader.readAsText(file)
    })

    chrome.storage.sync.get(['HLROptions2'], (result) => {
        if (typeof result.HLROptions2 == "undefined") {
            let request = $.ajax({
                url: 'settings.json'
            })

            request.done(data =>  {
                options = data.HLROptions2
                parseOptions(options)
            })
        } else {
            options = result.HLROptions2
            parseOptions(options)
        }
    })
})