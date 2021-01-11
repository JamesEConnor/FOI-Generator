var laws;

$.ajax({
    url: "https://raw.githubusercontent.com/JamesEConnor/FOI-Generator/main/request-options/settings.json",
    success: function(data) {
        var json = JSON.parse(data);
        
        laws = json["laws"];
        
        for(var law in laws) {            
            $("select[name=law]").append($("<option value='" + laws[law]["shortLaw"] + "'></option>"));
        }
        
        changeLawLabels();
    }
})

//Modify the length of the law names based on the screen width.
function changeLawLabels() {
    var width = $(window).width();
    
    for(var law in laws) {
        if(width < 350)
            $("option[value='" + laws[law]["shortLaw"] + "']").text(laws[law]["shortLaw"]);
        else
            $("option[value='" + laws[law]["shortLaw"] + "']").text(laws[law]["law"]);
    }
}

$(window).resize(changeLawLabels);