
exports.isset = function (obj, key) {
	if (obj[key] != undefined) {
		return obj[key];
	}
	return null;
}
