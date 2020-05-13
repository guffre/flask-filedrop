$(window).on("load", function () {
     document.getElementById("uploadFile").addEventListener('change', upload_single_file);
});

function handle_upload_click() {
    $("#uploadFile").click();
}

function upload_error() {
    $("#fileUploadError").removeClass("hide").text("An error occured!");
    $("#progressbox").addClass("hide");
    $("#uploadFile").closest("form").trigger("reset");
}

function make_data_array() {
    var formData = new FormData();
    formData.append('fname', $("#fname").val());
    formData.append('lname', $("#lname").val());
    return formData;
}

function validate_fields() {
    var fname = $("#fname").val();
    var lname = $("#lname").val();
    if (fname == "" || lname  == "") {
        return false;
    }
    return true;
}

function upload_single_file() {
    if (!validate_fields()) {
        alert("Please fill out student information first (both fields)");
        return;
    }
    var formData = make_data_array();
    var file = this.files[0];
    formData.append('file', file);

    $("#progressbox").removeClass("hide");
    $("#fileUploadError").addClass("hide");
    $("#progress-filename").html(file.name);

    _upload(formData);
};

function _upload(formdata) {
    $.ajax({
        url: "/gindexer.php",
        type: 'POST',
        xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', function(event) {
                    var percent = (event.loaded / event.total) * 100;
                    $('#percent-counter').html(parseInt(percent) + "%");
                    $("#loading-bar").width(percent + "%");
                }, false);
            }
            return xhr;
        },
        success: function(data) {
            if (data == "error") {
                upload_error();
            } else {
                window.location.href = data;
            }
        },
        error: function() {
            upload_error();
        },
        data: formdata,
        cache: false,
        contentType: false,
        processData: false
    }, 'json');
}

function drop_handler(ev) {
    ev.preventDefault();
    if (!validate_fields()) {
        alert("Please fill out student information first (both fields)");
        return;
    }

    if (ev.dataTransfer.items.length == 0 && ev.dataTransfer.files.length == 0) {
        alert("No files detected. Make sure you are dropping from a valid location.");
        return;
    }

    console.log(ev.dataTransfer);
    formData = make_data_array();

    $("#progressbox").removeClass("hide");
    $("#fileUploadError").addClass("hide");

    if (ev.dataTransfer.items) {
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
                formData.append('file', file);
                document.getElementById("progress-filename").innerHTML += file.name + "<br>";
            }
        }
    } else {
        for (i = 0; i < ev.dataTransfer.files.length; i++) {
            var file = ev.dataTransfer.files[i];
            console.log('... file[' + i + '].name = ' + file.name);
            formData.append('file', file);
            document.getElementById("progress-filename").innerHTML += file.name + "<br>";
        }
    }
    _upload(formData);
}

function drag_handler(ev) {
    ev.preventDefault();
}