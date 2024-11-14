export function triggerCsvDownloadFromResponse(response) {
	try {
		const { results, fileName } = response.data;
		const blob = new Blob([results], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName || 'materials.csv';

		document.body.appendChild(link);
		link.click();

		// Cleanup
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error('error triggering csv download', error);
	}
}
