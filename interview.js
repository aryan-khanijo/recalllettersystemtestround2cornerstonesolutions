const csvparser = require('csv-parser');
const fsp = require('fs').promises;
const fs = require('fs');
const { Client } = require('pg');
const format = require('pg-format');

const client = new Client({
	user: 'root',
	host: 'localhost',
	port: 5432,
	database: 'test2',
	password: 'root'
});

const saveToDB = async (res) => {
	await client.connect();
	console.log(res.length)
	const query = format("INSERT INTO RESULTS (epoch,time,lat,long,alt,alt_x,alt_y,alt_z,alt_w,depth,heading,sonar_underside,water_density,salinity,LEL,OXY,H2S,CO,NH3,VOC,temp,chainage,movement_tag,run_tag,blk_tag,sonar_tag,kongsberg_tag,tech_comment,scanResult,duration) values %L",res);
	try {
	    await client.query(query);
	}
	catch (error){
		console.log(error);
	}
}


const processCSV = async () => {
	const videoDuration = JSON.parse(await fsp.readFile('./video_duration.json','utf-8'));
	const res = [];
	const dbData = [];
	const csvPath = './2023_07_21__00_31_49_4k.csv'
	fs.createReadStream(csvPath)
	.pipe(csvparser())
	.on('data', (row) => res.push(row))
	.on('end', async () => {
		let chainageVal = res[0]['chainage'];
		const keys = Object.keys(res[0]);
		for (const row of res) {
			const fileName = row.time.replace('__','T').replace(/_/g,'')+'.mp4';
			const data = videoDuration[fileName];
			const newRow = [];
			keys.map((key) => newRow.push(row[key]));
			if (!data) {
				newRow.push('No Video Found');
				newRow.push('-');
			}
			else {
				newRow.push('Video Found');
				newRow.push(data);
			}
			if (row.chainage >= chainageVal) {
				chainageVal = row.chainage + 250;
				dbData.push(newRow)
			}
		}
		// console.log(dbData)
		await saveToDB(dbData);
	})
}

processCSV();