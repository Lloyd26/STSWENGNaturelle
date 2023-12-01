$(document).ready(function(){
    $("#settings-btn").on("click", function(e){
        $.get("/admin/getuser", {}, function(response){
            $("#input-edit-username").val(response.username)
        })
    })
})