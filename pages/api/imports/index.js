import clientPromise from '../../../lib/mongodb';
import db from '../../../lib/db';
let ObjectId = require('mongodb').ObjectId;

async function fetchTemplateRecords2(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DATABASE_NAME | 'yobulk');
  switch (req.method) {
    case 'GET':
      try {
        let results = await db
          .collection('templates')
          .find({ template_name: { $exists: false } })
          .toArray();
        for (const item of results) {
          const recordsCount = await db
            .collection(item.collection_name)
            .countDocuments({});
          const validData = await db
            .collection(item.collection_name)
            .find({ 'validationData.0': { $exists: false } })
            .count();
          let importerDetails = await db
            .collection('importers')
            .findOne({templateId: item.baseTemplateId})
          item.importerId = importerDetails?._id
          item.orgId = importerDetails?.organizationId
          item.rows = validData;
          item.status = (recordsCount === validData) ? 'Complete' : 'Incomplete'; 
        }
        res.send(results);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'failed to load data' });
      }
      break;
  }
}

async function fetchTemplateRecords(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        let results = await db('templates')
          .select('*');
        res.send(results);
        for (const item of results) {
          const recordsCount = await db
            .collection(item.collection_name)
            .countDocuments({});
          const validData = await db
            .collection(item.collection_name)
            .find({ 'validationData.0': { $exists: false } })
            .count();
          let importerDetails = await db
            .collection('importers')
            .findOne({templateId: item.baseTemplateId})
          item.importerId = importerDetails?._id
          item.orgId = importerDetails?.organizationId
          item.rows = validData;
          item.status = (recordsCount === validData) ? 'Complete' : 'Incomplete';
        }
        res.send(results);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'failed to load data' });
      }
      break;
  }
}

export default fetchTemplateRecords;