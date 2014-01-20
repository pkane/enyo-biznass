/** Utils **/

var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

Date.prototype.getDayofWeek = function() {
	return daysOfWeek[this.getDay()];
}

var monthsInYear = ["January ", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

Date.prototype.getMonthOfYear = function() {
	return monthsInYear[this.getMonth()];
}

