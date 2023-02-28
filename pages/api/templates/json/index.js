import { schemaToColumn } from '../../../../lib/validation_util/schemaColumn';
import { schemaGenerator } from '../../../../lib/validation_util/yovalidator';
const db = require('../../../../lib/db');

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      //some code...
      res.status(200).json({});
      break;

    case 'POST':
      try {
        let { schema, templateName } = req.body;
        if (!schema || !templateName || templateName.length === 0) {
          res.status(400).json({ error: 'Bad Request' });
          break;
        }
        let template = schemaGenerator({ clonedSchema: JSON.parse(schema) });
        template['template_name'] = templateName;
        template['columns'] = JSON.stringify(schemaToColumn({ schema: JSON.parse(schema) }));
        template['validators'] = JSON.stringify(template['validators']);
        let result = await db('templates').insert(template);
        res.status(201).json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to create data' });
      }

      break;

    case 'PATCH':
      //some code...
      res.status(200).json({});
      break;

    default:
      res.status(405).end(`${req.method} Not Allowed`);
      break;
  }
}

export default handler;
