$(document).ready(() => {
    var Delta = Quill.import('delta');
    let change = new Delta();
    let customUrl = '';
    let url = '';

    var quill = new Quill('#editor', {
        modules: {
            toolbar: [
                [{
                    size: ['small', false, 'large', 'huge']
                }],
                ['bold', 'italic', 'underline', 'strike'],
                [{
                    'color': []
                }, {
                    'background': []
                }],
                ['link']
            ]
        },
        placeholder: 'Note everything...',
        theme: 'snow' // or 'bubble'
    });
    // on every text-change save data to 'change'
    quill.on('text-change', (delta) => {
        change = change.compose(delta);
    });

    //starting function
    function start() {
        //chceking if url has # in it
        if (location.hash) {
            let data = {
                'data': location.hash,
            };

            //ajax to get data from db where url = location.hash
            $.ajax({
                    'method': 'POST',
                    'url': '/getData',
                    'dataType': 'json',
                    'data': data,
                })
                .done((updateData) => {
                    //if successful then update the text-box
                    if (updateData.custom !== '') {
                        $('.inToolbar input').val(updateData.custom);
                        customUrl = updateData.custom;
                    }
                    if (updateData.data === '') {
                        console.log('No data to display');
                    } else {
                        quill.setContents(JSON.parse(updateData.data));
                    }
                    //setting update function

                    url = location.hash.substr(1);
                    setInterval(repeatFunc, 3000);
                })
                .fail((err) => {
                    console.log('We couldnt load the content :(');
                    console.log(err);
                })

        } else {

            //when url doesnt have # in it
            //generating new #
            $.ajax({
                    'type': 'GET',
                    'url': '/start'
                }).done((response) => {
                    location.hash = response;
                    url = location.hash.substr(1);
                    //setting update function
                    setInterval(repeatFunc, 3000);

                })
                .fail((err) => {
                    console.log(err);
                })
        }
    }

    //updating database
    function repeatFunc() {
        let input = $('.inToolbar input');
        if (customUrl !== input.val()) {
            if (customUrl === undefined) {
                customUrl = '';
            }
            let inputValue = input.val();
            let dataRepeat = {
                'data': {
                    'url': url,
                    'input': inputValue,
                }
            };
            $.ajax({
                    'type': 'POST',
                    'dataType': 'json',
                    'cotentType': 'application/json',
                    'data': dataRepeat,
                    'url': '/custom',

                }).done((res) => {
                    customUrl = inputValue;
                    console.log('Custom url updated');
                })
                .fail((err) => {
                    console.log('We could not update your custom url');
                    console.log(err);
                })
        }
        if (change.ops.length > 0) {
            let dataRepeat = {
                'data': quill.getContents().ops,
                'hash': location.hash,
            };

            savingChanges(true)
            //ajax to send dataRepeat to update data in db
            $.ajax({
                    'type': 'POST',
                    'dataType': 'json',
                    'cotentType': 'application/json',
                    'data': dataRepeat,
                    'url': '/update',
                })
                .done((res) => {
                    savingChanges(false)
                })
                .fail((err) => {
                    console.log(err);
                    savingChanges(undefined)
                })

            change = new Delta();
        }
    }

    window.onbeforeunload = () => {
        if (change.length() > 0) {
            return 'There are unsaved changes. Are you sure you want to leave?';
        }
    }
    //appending input
    $('.ql-toolbar').append(`<div class='inToolbar' style='display: inline-block;'><input type='text' maxlength='6'></input></div><div class='hashtag' style='float: right; margin-right: 3px;'>#</div>`);

    function savingChanges(bool) {
        if (bool === true) {
            document.title = 'Saving changes...'
        } else if (bool === false) {
            setTimeout(() => {
                document.title = 'Changes Saved!';
                setTimeout(() => {
                    document.title = 'itoNotes';
                }, 3000)
            }, 1000)
        } else {
            document.title = 'Error while saving changes';
        }
    }

    start()
})