// parse for "number" "unit" "ingredient"
function getQuantity(line){
	// console.log(line);
	var ln = line.split(' ');
	//extract the number from the beginning of the string and convert it to a number
	var numb = parseInt(ln[0]);
	var numbString = numb.toString();
	// check if there are units in ln[0], or if it is really just a number
	var units = ""
	var ingredient = ""
	if (numbString !== ln[0]) {
		console.log(line);
		var digits = numbString.length;
		units = ln[0].slice(digits, ln[0].length);
		ingredient = ln[1]
	} 
	else {
		units = ln[1];
		ingredient = ln[2];
	}
	return [numbString, units, ingredient];

}