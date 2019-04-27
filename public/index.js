var Delta = Quill.import('delta');
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
$(document).ready(() => {
    var change = new Delta();
    quill.on('text-change', (delta) => {
        change = change.compose(delta);
    });

    function start() {
        if (location.hash) {
            let data = {
                data: location.hash
            };
            console.log(data);
            console.log('herj');

            $.ajax({
                    type: 'GET',
                    data: data,
                    url: '/getData',
                    dataType: 'json',
                })
                .done()
                .fail()

        } else {

            $.ajax({
                    type: 'GET',
                    url: '/start'
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

    function repeatFunc() {
        if (change.length() > 0) {
            console.log('Saving changes ', change);

            let data = quill.getContents();
            $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    data: data,
                    url: '/request'
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