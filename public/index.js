$(document).ready(() => {
    var Delta = Quill.import('delta');
    let change = new Delta();
    let customUrl = '';
    let url = '';

    // setting up Quill
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
        theme: 'snow'
    });

    // on every text-change save data to 'change'
    quill.on('text-change', (delta) => {
        change = change.compose(delta);
    });

    //starting function
    function start() {

        //checking if url has # in it
        if (location.hash) {
            let data = {
                'data': location.hash,
            };
            
            $('.inToolbar input').val(location.hash.substr(1));

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
                        $('.inToolbar input').val(updateData.url.substr(1));
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

            //when url doesnt have location.hash in it
            //generating new location.hash
            $.ajax({
                    'type': 'GET',
                    'url': '/start'
                }).done((response) => {
                    location.hash = response;
                    url = location.hash.substr(1);
                    $('.inToolbar input').val(url);
                    //setting update function
                    setInterval(repeatFunc, 3000);

                })
                .fail((err) => {
                    console.log(err);
                })
        }
    }

    // chceking for changes, if any saving them
    // both input for url and basic text
    function repeatFunc() {
        let input = $('.inToolbar input');
        if (customUrl !== input.val()) {
            if(input.val().length > 2){
            if (customUrl === undefined) {
                customUrl = '';
            }
            let inputValue = input.val();

            // chceking for malicious input / making sure
            // user uses only letters and numbers
            if(/[^a-z^A-Z^0-9]/gm.test(inputValue)){
                alert("Url can only contain letters and numbers!");
                input.val(url);
                return;
            }

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
                    if(res === true){
                    customUrl = inputValue;
                    console.log('Url updated');
                    location.hash = customUrl;
                    } else {
                    if(res === false) {
                        alert(`Url #${inputValue} is already taken. Please choose different one!`);
                        input.val(`${url}`);
                    }
                }
                })
                .fail((err) => {
                    console.log('We could not update your custom url');
                    console.log(err);
                })
            }
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

    //appending input for url changes
    $('.ql-toolbar').append(`<div class='inToolbar' style='display: inline-block;'><input type='text' maxlength='6'></input></div><div class='hashtag' style='float: right; margin-right: 3px;'>#</div>`);

    // displaying that changes are being saved
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

    const windowWidth = window.innerWidth;

    // on mobile - options open to the top
    if(windowWidth < 651){
        $(".ql-picker-options").css("top","auto");
        $(".ql-picker-options").css("bottom","100%");
        $(".ql-picker-options").css("z-index","2");
    }

    start()
})