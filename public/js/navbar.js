$(document).ready(function(){
    $("#contacts-bt").on("click", function(e) {
        e.preventDefault()
        window.scrollTo(0, document.body.scrollHeight)
    })
})