import db from '../../../lib/db';

async function importer(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        let { importerId } = req.query;
        let result = await db('importers')
          .select('*')
          .where({ id: importerId})
          .first();
        res.status(200).send(result);
      } catch (err) {
        console.error('ok', err.message);
        res.status(500).json({ error: 'failed to load data' });
      }
      break;
    default:
      res.status(405).json({ error: 'method not allowed' });
      break;
  }
}

export default importer;