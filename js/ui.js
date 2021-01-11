function autoExpandElement(element) {
    element.css("height", "inherit");
    
    // Get the computed styles for the element
	var computed = window.getComputedStyle(element[0]);

	// Calculate the height
	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + element[0].scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    
    //Set the height
    element.height(height);
}

$(document).on("input", "textarea", function() {
    autoExpandElement($(this));
})