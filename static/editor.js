$(function(){
    var editor = ace.edit("editor");

    var result;

    $("#save-button").click(function() {
        if (result && result.account && result.account.id) {
            saveFile();
        }
    });

    Kloudless.authenticator(
        $("#save-button"),
        {
            'client_id': appId,
            'scope': 'all.storage',
        },
        function(res){
            result = res;
            if (result.error) {
                $("#save-status").text("An error occured: " + result.error);
                return;
            }
            Kloudless.stop($("#save-button"));
            saveFile();
        });

    function saveFile() {
        $("#save-status").text("Saving...")

        var file_data = editor.getValue();
        var jqXHR = $.post(
            "/",
            {
                'account': result.account.id,
                'token': result.access_token,
                'file_data': file_data
            }).done(function(data, textStatus, jqXHR) {
                $("#save-status").text(
                    "Saved to " + result.account.service + " account '" +
                        result.account.account + "'!")
                    .delay(5000).text(saveText());
            }).fail(function() {
                $("#save-status").text("An error occured.")
                    .delay(5000).text(saveText());
            });
    }
    
    function saveText() {
        "Cloud storage account connected."
    }
});
