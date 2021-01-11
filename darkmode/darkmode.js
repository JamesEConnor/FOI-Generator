function applyBackgroundTheme(darkmode) {
    if(darkmode == null || darkmode == undefined)
        darkmode = false;
    
    //Apply darkmode attribute
    document.documentElement.setAttribute("darkmode", darkmode.toString());
    document.getElementById("darkmode-switcher").setAttribute("darkmode", darkmode.toString());
    
    //Set cookie
    localStorage.setItem("darkmode", darkmode.toString());
}


//Create the switcher
var moonIcon = document.createElement("div");
moonIcon.id = "darkmode-switcher";
document.body.appendChild(moonIcon);

moonIcon.addEventListener("click", function() {
    applyBackgroundTheme(localStorage.getItem("darkmode") == "false");
})

//Load the cookie
applyBackgroundTheme(localStorage.getItem("darkmode"));