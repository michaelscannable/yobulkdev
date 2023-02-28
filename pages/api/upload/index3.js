import { Transform, pipeline } from 'stream';
import db from '../../../lib/db';
import Papa from 'papaparse';
import * as fs from 'fs';


const transform = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    const formattedData = {
      column1: chunk?.property1,
      column2: chunk?.property2,
    };
    callback(null, formattedData);
  }
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    const file = req.file;
    return res.status(200).json({ message: 'Data inserted successfully', file });
    const templates = db('templates')
      .select('*')
      .where({ id: req.headers.template_id });

    const stream = templates.stream();
    const readStream = fs.createReadStream(file.path);
    const csvStream = Papa.parse(Papa.NODE_STREAM_INPUT, { header: true });

    pipeline(
      readStream,
      csvStream,
      transform,
      stream,
      err => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log('Data inserted successfully');
          res.status(200).json({ message: 'Data inserted successfully' });
        }
      }
    );
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
