import clientPromise from '../../../lib/mongodb';
import generateSchema from '../../../lib/template-engine';

const db = require('../../../lib/db');
let ObjectId = require('mongodb').ObjectId;

async function fetchTemplateRecords2(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DATABASE_NAME | 'yobulk');
  switch (req.method) {
    case 'GET':
      let query = {};
      if (req.headers.template_id) {
        query = { _id: ObjectId(req.headers.template_id) };
        try {
          let result = await db.collection('templates').findOne(query);
          res.send(result);
        } catch (err) {
          console.error(err.message);
        }
      } else {
        try {
          let result = await db.collection('templates').find({}).toArray();
          res.send(result);
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ error: 'failed to load data' });
        }
      }
      break;
    case 'POST':
      try {
        let templateBody = req.body;
        if (templateBody.baseTemplateId) {
          let baseTemplate = await db
            .collection('templates')
            .findOne({ _id: ObjectId(templateBody.baseTemplateId) });
          let columnLabels = templateBody.columns.map((el) => el.label);
          let baseTemplateSchema = baseTemplate.schema;
          let requiredCols = baseTemplateSchema.required?.filter((el) =>
            columnLabels.includes(el),
          );
          baseTemplateSchema.required = requiredCols;
          templateBody.schema = baseTemplateSchema;
          templateBody.validators = baseTemplate.validators;
        } else {
          let generatedSchema = generateSchema(templateBody.columns);
          templateBody.schema = generatedSchema;
        }
        templateBody.created_date = new Date();
        let result = await db.collection('templates').insertOne(templateBody);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to create data' });
      }
      break;
    case 'PUT':
      try {
        let columnsData = req.body.columns;
        let data = req.body;
        let generatedSchemaUpdate = generateSchema(columnsData);
        data.schema = generatedSchemaUpdate;
        let result = await db
          .collection('templates')
          .updateOne(
            { _id: ObjectId(req.query.template_id) },
            { $set: data },
            { upsert: false },
          );
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to put data' });
      }
      break;
    case 'DELETE':
      try {
        let result = await db
          .collection('templates')
          .deleteOne({ _id: ObjectId(req.query.template_id) });
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to delete data' });
      }
      break;
  }
}

async function fetchTemplateRecords(req, res) {
  switch (req.method) {
    case 'GET':
      let query = {};
      if (req.headers.template_id) {
        query = { id: req.headers.template_id };
        try {
          let result = await db('templates').where(query).first();
          res.send(result);
        } catch (err) {
          console.error(err.message);
        }
      } else {
        try {
          let result = await db('templates').select('*');
          res.send(result);
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ error: 'failed to load data' });
        }
      }
      break;
    case 'POST':
      try {
        let templateBody = req.body;
        let baseTemplateSchema = {};
        if (templateBody.baseTemplateId) {
          let baseTemplate = await db('templates')
            .select('*')
            .where({ id: templateBody.baseTemplateId })
            .first();


          let columnLabels = templateBody.columns.map((el) => el.label);
          baseTemplateSchema = baseTemplate.schema;

          baseTemplateSchema.required = JSON.stringify(baseTemplateSchema.required?.filter((el) =>
            columnLabels.includes(el),
          ));

          templateBody.schema = JSON.stringify(baseTemplateSchema);
          templateBody.validators = JSON.stringify(baseTemplate.validators);
          templateBody.columns = JSON.stringify(templateBody.columns);

        } else {
         templateBody.schema = JSON.stringify(generateSchema(templateBody.columns));
        }

        let result = await db('templates').insert(templateBody);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to create data' });
      }
      break;
    case 'PUT':
      try {
        let columnsData = req.body.columns;
        let data = req.body;
        let generatedSchemaUpdate = generateSchema(columnsData);
        data.schema = generatedSchemaUpdate;
        let result = await db
          .collection('templates')
          .updateOne(
            { _id: ObjectId(req.query.template_id) },
            { $set: data },
            { upsert: false },
          );
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to put data' });
      }
      break;
    case 'DELETE':
      try {
        let result = await db
          .collection('templates')
          .deleteOne({ _id: ObjectId(req.query.template_id) });
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to delete data' });
      }
      break;
  }
}

export default fetchTemplateRecords;