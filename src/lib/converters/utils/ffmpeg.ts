import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const loadFFmpeg = async () => {
	try {
		const ffmpeg = new FFmpeg();
		const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm';

		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
		});

		return ffmpeg;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const convertFFmpeg = async () => {};
