//Obtain a GET parameter from the URL
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}


//Prevent enter key from submitting form
$(document).ready(function() {
    $(window).keydown(function(event){
    if(event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
    });
});





//Get the law code
var shortLaw = findGetParameter("law").toLowerCase();

//The url to download the template from.
var templateURL;

$.ajax({
    url: "https://raw.githubusercontent.com/JamesEConnor/FOI-Generator/main/request-options/general.json",
    success: function(data) {
        var json = JSON.parse(data);
        
        $("h1.title").text(json["laws"][shortLaw]["name"]);
        $("h2.government").text(json["laws"][shortLaw]["government"]);
        templateURL = json["laws"][shortLaw]["templateFile"]
        
        for(var option in json["options"])
            createSetting(json["options"][option]);
    }
})

function createSetting(json) {
    //Insert label
    var label = $("<label for='" + json["name"] + "'>" + json["label"] + "</label>");
    label
    
    //Set required on label
    if(json["required"] == true)
        label.attr("required", "");
    
    //Insert label
    label.insertBefore($(".generate-button"));
    
    
    
    //Differentiate between inputs/textareas and select elements
    if(json["type"] == "text" || json["type"] == "number" || json["type"] == "textarea") {
        //Create the element
        var input;
        
        if(json["type"] == "textarea")
            input = $("<textarea name='" + json["name"] + "' type='" + json["type"] + "' placeholder='" + json["placeholder"] + "' class='" + json["classList"] + "'></textarea>");
        else
            input = $("<input name='" + json["name"] + "' type='" + json["type"] + "' placeholder='" + json["placeholder"] + "' class='" + json["classList"] + "'>");
                
        input.on("change blur", function() {
            
            //The element to insert errors after.
            var errorInsert = $(this).parent("div.fee").length > 0 ? $(this).parent("div.fee") : $(this);
            
            //Make sure its a required question
            if(json["required"] == true) {
                if($(this).val() == "" || $(this).val() == undefined) {
                    //If there are no error objects already
                    if($(".required-error.error[for='" + json["name"] + "']").length <= 0) {
                        //Create an error object
                        $("<p class='error required-error' for='" + json["name"] + "'>This question is required.</p>").insertAfter(errorInsert);
                    }
                } else {
                    //Remove any validation error objects
                    $(".required-error.error[for='" + json["name"] + "']").remove();
                }
            }
            
            //Make sure validation exists
            if(json["validation"] != undefined) {
                var regex = new RegExp(json["validation"]);

                //Test regex
                if(!regex.test($(this).val())) {
                    //If there are no error objects already
                    if($(".validation-error.error[for='" + json["name"] + "']").length <= 0) {
                        //Create an error object
                        $("<p class='error validation-error' for='" + json["name"] + "'>" + json["validationError"] + "</p>").insertAfter(errorInsert);
                    }
                } else {
                    //Remove any validation error objects
                    $(".validation-error.error[for='" + json["name"] + "']").remove();
                }
            }
            
            //Make sure length exists
            if(json["length"] != undefined) {
                //Test length
                if(($(this).val().length <= 0 && json["required"]) || $(this).val().length > json["length"]) {
                    //If there are no error objects already
                    if($(".length-error.error[for='" + json["name"] + "']").length <= 0) {
                        //Create an error object
                        $("<p class='error length-error' for='" + json["name"] + "'>" + json["lengthError"] + "</p>").insertAfter(errorInsert);
                    }
                } else {
                    //Remove any validation error objects
                    $(".length-error.error[for='" + json["name"] + "']").remove();
                }
            }
        });
        
        //Required or not
        if(json["required"] == true)
            input.attr("required", "");
        
        //Insert        
        if(json["classList"].split(" ").includes("fee")) {
            var div = $("<div class='fee'></div>");
            div.append(input);
            div.insertBefore($(".generate-button"));
            
            $("<span class='fee fee-start'>$</span>").insertBefore(input);
            $("<span class='fee fee-end'>.00</span>").insertAfter(input);
        } else {
            input.insertBefore($(".generate-button"));
        }
            
    } else if(json["type"] == "select") {
        //Create the element
        var select = $("<select name='" + json["name"] + "' class='" + json["classList"] + "'></select>");
        
        for(var option in json["select"]) {
            select.append($("<option>" + json["select"][option] + "</option>"));
        }
        
        //Required or not
        if(json["required"] == true)
            select.attr("required", "");
        
        select.insertBefore($(".generate-button"))
    }
}

//Ensure the form has completely valid input
function validateForm() {
    $("form input").each(function() {
        //The element to insert errors after.
        var errorInsert = $(this).parent("div.fee").length > 0 ? $(this).parent("div.fee") : $(this); 
        
        //Call to change to run any validation or length checks
        $(this).change();
    });
    
    
    if($("form .error").length > 0)
        return false;
    
    return true;
}



$(".generate-button").click(function() {
    if(!validateForm())
        return;
    
    //Set the text to say processing
    $("#result textarea").text("Processing...");
    
    //Fade in the overlay
    $("#result").parent().fadeIn("fast");
    
    var values = {};
    $("form input, form textarea").each(function(n, el) {
        values[$(el).attr("name")] = $(el).val();
    });
    $("form select").each(function(n, el) {
        values[$(el).attr("name")] = $(el).val().toLowerCase();
    });
    
    downloadTemplate(templateURL, values);
});

$("#result button.copy").click(function() {
    $("#result textarea").select();
    
    document.execCommand("copy");

    //Briefly display a message
    $(this).text("Copied!");
    $(this).css("background-color", "green");
    
    setTimeout(function() {
        $("#result button.copy").text("Copy to Clipboard");
        $("#result button.copy").css("background-color", "");
        $("#result textarea").blur();
    }, 1000);
});

//Close the overlay
$("#result button.return").click(function() {
    $(this).parentsUntil(".overlay").parent(".overlay").fadeOut("fast");
})