function parseDates(yyyymmdd) {
	if (!yyyymmdd || yyyymmdd.length !== 8) return null;
	return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(
		6,
		8
	)}`;
}

console.log(parseDates("20220101"));
