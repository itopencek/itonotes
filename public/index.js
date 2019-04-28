$(document).ready(() => {
    var Delta = Quill.import('delta');
    let change = new Delta();

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
                    quill.setContents(JSON.parse(updateData.data));

                    //setting update function
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
        if (change.ops.length > 0) {
            let dataRepeat = {
                'data': quill.getContents().ops,
                'hash': location.hash,
            };
            //ajax to send dataRepeat to update data in db
            $.ajax({
                    'type': 'POST',
                    'dataType': 'json',
                    'cotentType': 'application/json',
                    'data': dataRepeat,
                    'url': '/update',
                })
                .done((res) => {})
                .fail((err) => {
                    console.log(err);
                })

            change = new Delta();
        }
    }

    window.onbeforeunload = () => {
        if (change.length() > 0) {
            return 'There are unsaved changes. Are you sure you want to leave?';
        }
    }
    start()
})