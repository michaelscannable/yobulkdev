const db = require('../../../lib/db');

async function organization(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        const { orgName, workspaceName, collaborators } = req.body;

        let newOrg = {
          orgName : orgName,
          workspaces: JSON.stringify([
            {
              workspaceName: workspaceName,
              collaborators: collaborators
            }
          ])
        }
        const result = await db('organizations').insert(newOrg);
        res.status(201).send(result)
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'failed to load data' });
      }
      break;
    default:
      res.status(405).json({ error: 'method not allowed' });
      break;
  }
}

export default organization;