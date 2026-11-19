import pkg from 'file-saver';
import JSZip from 'jszip';
const { saveAs } = pkg;

const uniqueName = (name: string, used: Set<string>): string => {
	const dot = name.lastIndexOf('.');
	const base = dot > 0 ? name.slice(0, dot) : name;
	const ext = dot > 0 ? name.slice(dot) : '';

	let candidate = name;
	let n = 1;
	while (used.has(candidate.toLowerCase())) {
		candidate = `${base}-${n++}${ext}`;
	}
	used.add(candidate.toLowerCase());
	return candidate;
};

export const downloadFiles = async (files: (File | null)[], zipName = 'converted-files.zip'): Promise<void> => {
	const valid = files.filter((file): file is File => file !== null);

	if (valid.length === 0) throw new Error('No converted files to download.');

	if (valid.length === 1) {
		saveAs(valid[0], valid[0].name);
		return;
	}

	const zip = new JSZip();
	const used = new Set<string>();
	for (const file of valid) zip.file(uniqueName(file.name, used), file);

	const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
	saveAs(blob, zipName);
};
