import { toast } from 'svelte-sonner';

export function allUnderMB(files: File[], MB: number = 100): boolean {
	if (!files.every((file) => file.size < MB * 1e6)) {
		toast.error(`Each uploaded file must be under ${MB}MB`);
		return false;
	}
	return true;
}

export function allSupportedType(files: File[], types: string[]): boolean {
	if (!files.every((file) => types.includes(file.type.split('/')[0]))) {
		toast.error('Uploaded files have unsupported file types');
		return false;
	}
	return true;
}

export function allSameType(files: File[]): boolean {
	if (files.length === 0) return true;
	const baseType = files[0].type.split('/')[0];
	if (!files.every((file) => file.type.split('/')[0] === baseType)) {
		toast.error('All uploaded files must share the same file type');
		return false;
	}
	return true;
}
