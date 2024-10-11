export function formatDateToUTC(date) {
	const utcDate = new Date(date);
	return utcDate.toISOString();
}
