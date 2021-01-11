//Download and set the template text
function downloadTemplate(url, values) {
    $.ajax({
        url: url,
        success: function(data) {
            var result = insertIntoTemplate(JSON.parse(data)["text"], values);
            
            $("#result textarea").text(result);
        }
    })
}

//Interpret the template to insert the proper values.
function insertIntoTemplate(template, values) {
    //New lines
    template = template.replace("\\n", "\n");
    
    console.log(values);
    
    //Loop through each value and replace the specific syntax
    for(var value in values) {        
        //Replace variable values
        template = template.replace(new RegExp("\\${" + value + "}", "gm"), values[value]);
        
        //Replace conditional values
        template = template.replace(new RegExp("\\^{" + value + "," + values[value] + "}", "gm"), "").replace(new RegExp("\\^{end," + value + "," +  values[value]+ "}", "gm"), "");
        
        if(values[value] != "" && values[value] != undefined) {
            template = template.replace(new RegExp("&{" + value + "}", "gm"), "").replace(new RegExp("&{end," + value + "}", "gm"), "");
        }
        
        console.log("\\^{" + value + ",.+?}[\\s\\S]+?\\^{end," + value +",.+?}");
        template = template.replace(new RegExp("\\^{" + value + ",.+?}[\\s\\S]+?\\^{end," + value +",.+?}", "gm"), "");
    }
    
    template = template.replace(/&{.+?}[\s\S]+?&{end,.+?}/gm, "");
    
    template = template.replace(/\${.+?}/gm, "");
    
    return template;
}