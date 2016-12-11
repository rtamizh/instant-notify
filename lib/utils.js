
exports.isset = function (obj, key) {
	console.log(obj[key]);
	if (obj[key] != undefined) {
		return obj[key];
	}
	return null;
}
