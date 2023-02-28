const testOrganization = {
  orgName: 'YoBulk',
  workspaces: JSON.stringify([
    {
      workspaceId:  '1',
      workspaceName: 'YoBulk Workspace',
      collaborators: ['test@yobulk.dev'],
    },
  ]),
};
const testTemplates = [
  {
    name: 'YoBulk',
    schema: {
      id: '1',
      validators: JSON.stringify([
        {
          name: 'first_name',
          valFunc:
            '(x) => {\r\n let regex = new RegExp("([a-z][a-zA-Z]*)");\r\n return regex.test(x);\r\n }',
        },
      ]),
      schema: JSON.stringify({
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
          first_name: {
            type: 'string',
            format: 'first_name',
          },
          email: {
            type: 'string',
            format: 'email',
            minLength: 1,
          },
          date: {
            type: 'string',
            format: 'custom-date-time',
            minLength: 1,
          },
          status: {
            type: 'string',
            format: 'custom-boolean',
          },
        },
        required: ['id', 'first_name', 'email', 'date', 'status'],
        errorMessage: {
          properties: {
            first_name: 'Only string(With character A-Z) type is accepted.',
            id: 'Only valid integer format type is accepted',
            email: 'Only Valid email ID format is accepted',
            date: 'Only valid date format is accepted',
            status: 'Only boolean is accepted',
          },
        },
      }),
      template_name: 'YoBulk',
      columns: JSON.stringify([
        {
          key: 'cle7cfex70000jsgq1wircymy',
          label: 'id',
          data_type: 'integer',
          is_required: true,
        },
        {
          key: 'cle7cfex80001jsgq6mi75ijn',
          label: 'first_name',
          data_type: 'string',
          is_required: true,
        },
        {
          key: 'cle7cfex80002jsgq178ifwz6',
          label: 'email',
          data_type: 'string',
          is_required: true,
        },
        {
          key: 'cle7cfex90003jsgq7vqn5e9r',
          label: 'date',
          data_type: 'string',
          is_required: true,
        },
        {
          key: 'cle7cfex90004jsgqd7vi8rbf',
          label: 'status',
          data_type: 'string',
          is_required: true,
        },
      ]),
    },
  },
];

const testImporters = {
  YoBulk: {
    name: 'YoBulk',
    templateId: '',
    organizationId: '',
    workspaceId: '63c563a8408a18f66f9123b7',
    templateName: 'YoBulk'
  }
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('organizations').del();
  await knex('templates').del();
  await knex('importers').del();

  // create organization
  const organization = await knex('organizations').insert(testOrganization);
  const organizationId = organization[0];

  // create templates
  for (const item of testTemplates) {
    const template = await knex('templates').insert(item.schema);

    // update templateId in testImporters
    testImporters[item.schema.template_name].templateId = template[0];
    testImporters[item.schema.template_name].organizationId = organizationId;

    // create importer
    await knex('importers').insert(testImporters[item.name]);
  }



  // await knex('importers').insert(testImporters);
};



