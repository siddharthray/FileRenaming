const fs = require('fs');
let textFile = '';
let mp4 = [];
let srt = [];
let isRenamingString = false;

function renameFile(fileNames, type) {
	fileNames.forEach((name, index) => {
		const fileName = name.replace(/[^\w\s]/gi, '');
		const array = type === 'mp4' ? mp4 : srt;
		fs.rename(
			array[index],
			`${index + 1} ${fileName}` + `.${type}`,
			function (err, data) {
				if (err) {
					console.log('error occured while renaming', {
						error: err,
						video: array[index],
						text: fileName,
					});
				}
			}
		);
	});
}
function readAndReplaceFileName() {
	let videosNames;
	fs.readdirSync(__dirname).forEach((file) => {
		if (file.endsWith('.txt')) {
			textFile = file;
		}
		if (file.endsWith('.mp4')) mp4.push(file);
		if (file.endsWith('.srt')) srt.push(file);
	});
	fs.readFile(textFile, 'utf-8', function (err, data) {
		if (err) {
			console.log('error occured while reading', err);
		}
		videosNames = data.replace(/(\r)/gm, '');
		videosNames = videosNames.split('\n');
		if (srt.length === mp4.length) isRenamingString = true;
		renameFile(videosNames, 'mp4');
		if (isRenamingString) {
			renameFile(videosNames, 'srt');
		} else {
			console.log(
				`subtitle file name could not change because of missing subtile for one more videos`
			);
		}
	});
}
readAndReplaceFileName();
