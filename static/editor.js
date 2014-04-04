$(function(){
    var editor = ace.edit("editor");

    var accountId;
    var service;

    $("#save-button").click(function() {
        if (accountId) {
            saveFile();
        }
    });

    Kloudless.authenticator(
        $("#save-button"),
        {'app_id': appId},
        function(err, result){
            if (err) {
                $("#save-status").text("An error occured! " + err)
                return;
            }
            accountId = result.id;
            service = result.service;
            Kloudless.stop($("#save-button"));
            saveFile();
        });

    function saveFile() {
        $("#save-status").text("Saving...")

        var file_data = editor.getValue();
        var jqXHR = $.post(
            "/",
            {'account': accountId,
             'file_data': file_data})
            .done(function(data, textStatus, jqXHR) {
                $("#save-status").text("Saved!")
                    .delay(5000).text(saveText());
            })
            .fail(function() {
                $("#save-status").text("An error occured.")
                    .delay(5000).text(saveText());
            });
    }
    
    function saveText() {
        "Cloud storage account connected."
    }
});
