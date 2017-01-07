var Utils = {};

Utils.dateToStr = function(date,type){
	if(date instanceof Date){
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		month = month <10 ? "0"+month : month;
		var day = date.getDate();
		day = day <10 ? "0"+day : day;
		var hour = date.getHours();
		hour = hour <10 ? "0"+hour : hour;
		var minute = date.getMinutes();
		minute = minute <10 ? "0"+minute : minute;
		var second = date.getSeconds();
		second = second <10 ? "0"+second : second;
		type = type||"";
		switch(type.toUpperCase()){
			case "Y-M-D":
				return `${year}-${month}-${day}`;
			case "Y-M-D H:M":
				return `${year}-${month}-${day} ${hour}:${minute}`;
			case "Y-M-D H:M:S":
				return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
			default:
				return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		}
	}
}

module.exports = Utils;