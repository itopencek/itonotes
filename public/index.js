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
    quill.on('text-change', (delta) => {
        console.log('change has been registered');
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
                    quill.setContents([{
                        insert: updateData.data
                    }, ]);
                })
                .fail()

        } else {

            //without #
            //generating new #
            $.ajax({
                    'type': 'GET',
                    'url': '/start'
                }).done((response) => {
                    console.log(response);
                    location.hash = response;
                    setInterval(repeatFunc, 3000);

                })
                .fail((err) => {
                    console.log(err)
                })
        }
    }

    //updating database
    function repeatFunc() {
        if (change.ops.length > 0) {
            console.log('Saving changes');

            let dataRepeat = {
                'data': quill.getContents().ops,
                'hash': location.hash,
            };
            //ajax to send data to update data in db
            $.ajax({
                    'type': 'POST',
                    'dataType': 'json',
                    'cotentType': 'application/json',
                    'data': dataRepeat,
                    'url': '/update',
                })
                .done((res) => {
                    console.log(res);
                })
                .fail((err) => {
                    console.log(err)
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