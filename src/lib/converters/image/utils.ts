export type Options = {
	format: 'jpeg' | 'png' | 'webp';
	bgColor?: string;
	targetBytes?: number;
};

const FORMATS: Record<Options['format'], { mimeType: string; ext: string; quality?: number }> = {
	jpeg: { mimeType: 'image/jpeg', ext: 'jpg', quality: 0.9 },
	png: { mimeType: 'image/png', ext: 'png' },
	webp: { mimeType: 'image/webp', ext: 'webp', quality: 0.82 }
};

const MAX_SIDE = 32767;
const MAX_PIXELS = 268_435_456; // 16384 × 16384

const MIN_QUALITY = 0.6;
const SEARCH_STEPS = 6;
const MAX_SHRINKS = 10;

export const convertCanvas = async (file: File, options: Options): Promise<File> => {
	const { mimeType, ext, quality } = FORMATS[options.format];
	const target = options.targetBytes;
	const bitmap = await createImageBitmap(file);

	const encode = (scale: number, q?: number): Promise<Blob> => {
		const w = Math.max(1, Math.floor(bitmap.width * scale));
		const h = Math.max(1, Math.floor(bitmap.height * scale));

		const canvas = new OffscreenCanvas(w, h);
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Canvas 2D context is not available.');

		if (options.format === 'jpeg') {
			ctx.fillStyle = options.bgColor ?? '#ffffff';
			ctx.fillRect(0, 0, w, h);
		}
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(bitmap, 0, 0, w, h);

		return canvas.convertToBlob({ type: mimeType, quality: q });
	};

	const fitToTarget = async (scale: number): Promise<Blob> => {
		if (quality === undefined) return encode(scale);

		const top = await encode(scale, quality);
		if (top.size <= target!) return top;

		let lo = MIN_QUALITY;
		let hi = quality;
		let best: Blob | undefined;
		let last = top;

		for (let i = 0; i < SEARCH_STEPS; i++) {
			const mid = (lo + hi) / 2;
			last = await encode(scale, mid);
			if (last.size <= target!) {
				best = last;
				lo = mid;
			} else {
				hi = mid;
			}
		}
		return best ?? last;
	};

	let blob: Blob;

	try {
		let scale = Math.min(
			1,
			MAX_SIDE / bitmap.width,
			MAX_SIDE / bitmap.height,
			Math.sqrt(MAX_PIXELS / (bitmap.width * bitmap.height))
		);

		if (!target) {
			blob = await encode(scale, quality);
		} else {
			blob = await fitToTarget(scale);

			for (let i = 0; blob.size > target; i++) {
				if (i === MAX_SHRINKS) throw new Error('Could not reach the target file size.');
				scale *= Math.sqrt(target / blob.size) * 0.97;
				blob = await fitToTarget(scale);
			}
		}
	} finally {
		bitmap.close();
	}

	if (blob.type !== mimeType) {
		throw new Error(`This browser can't encode ${options.format}.`);
	}

	const dot = file.name.lastIndexOf('.');
	const baseName = dot > 0 ? file.name.slice(0, dot) : file.name;

	return new File([blob], `${baseName}.${ext}`, { type: mimeType });
};
