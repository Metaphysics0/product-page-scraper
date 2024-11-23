export function triggerDownload({
	fileContents,
	filename,
	contentType = 'text/csv'
}: {
	fileContents: string;
	filename: string;
	contentType?: string;
}) {
	const blob = new Blob([fileContents], { type: contentType });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}
