import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../../../context';
import { useRouter } from 'next/router';
import {
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import addColumnButton from './addColumnButton';
import handleEdit from './handleEdit';
import Link from 'next/link';

const AdminComponent = ({ templateId, type }) => {
  let [isOpen, setIsOpen] = useState(false);
  const [templateData, setTemplateData] = useState({});
  const router = useRouter();
  const { dispatch } = useContext(Context);

  useEffect(() => {
    const headers = {
      template_id: templateId,
    };
    if (type === 'view') {
      axios
        .get('/api/templates', { headers })
        .then((res) => {
          setTemplateData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [templateId]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleTemplateName = (e) => {
    setTemplateData((prev) => {
      return { ...prev, template_name: e.target.value };
    });
  };

  const saveTemplate = () => {
    axios
      .post('/api/templates', templateData)
      .then((result) => {
        router.push({ pathname: '/templates' }, undefined, {
          shallow: true,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (col) => {
    setTemplateData((prev) => {
      return {
        ...prev,
        columns: prev.columns.filter((el) => el.key !== col.key),
      };
    });
  };

  const handleOpenEditModal = ({
    isOpen,
    setIsOpen,
    closeModal,
    setTemplateData,
    columnData,
  }) => {
    dispatch({ type: 'SET_CUR_TEMPLATE_EDIT', payload: true });
    dispatch({ type: 'SET_CUR_TEMPLATE_EDIT_COLUMN', payload: columnData });
    handleEdit({
      isOpen,
      setIsOpen,
      closeModal,
      setTemplateData,
      columnData,
    });
  };

  return (
    <div className="p-4">
      <div className="flex align-middle justify-between ">
        <div className="flex align-middle items-center gap-2 ">
          <Link href="/templates">
            <ArrowLeftIcon className="h-5 cursor-pointer" />
          </Link>

          <h1 className="text-2xl font-bold text-gray-500">
            {templateData &&
              `${
                templateData.template_name
                  ? templateData.template_name
                  : 'Name your'
              } template`}
          </h1>
        </div>
        {type === 'create' && (
          <button
            type="button"
            onClick={saveTemplate}
            className="flex bg-white border-2 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 focus:outline-none font-medium rounded-md gap-1 text-sm px-6 py-2 text-center mb-2"
          >
            <ArrowDownTrayIcon className="h-4 mr-1" /> Save Template
          </button>
        )}
      </div>

      <div className="mt-4 border-2 border-[#64B6EB] rounded-md p-4 flex flex-col align-middle">
        {type === 'view' && (
          <div className="flex">
            <div className="flex flex-col w-5/12">
              <h2 className="text-lg font-bold text-gray-500">Key</h2>
              <p className="text-gray-400">
                The unique key used to identify this Template
              </p>
            </div>
            <div className="ml-10 flex flex-col justify-center w-72">
              <div className="mb-2">
                <span className="text-blue-500">{templateData._id}</span>
              </div>
            </div>
          </div>
        )}

        <div className={`flex ${type === 'view' && 'mt-4'}`}>
          <div className="flex flex-col w-5/12">
            <h2 className="text-lg font-bold text-gray-500">Name</h2>
            <p className="text-gray-400">Name of the template</p>
          </div>
          <div className="ml-10 flex flex-col justify-center w-72">
            <div className="mb-2">
              {type === 'view' && templateData ? (
                <span> {templateData.template_name}</span>
              ) : (
                <input
                  type="text"
                  id="default-input"
                  className={`border border-gray-300 text-gray-400  text-sm rounded-lg
                   focus:ring-blue-500 focus:border-blue-500 block w-[400px] 
                   p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  value={templateData.template_name}
                  disabled={type === 'view'}
                  onChange={(e) => handleTemplateName(e)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/*       <div className="p-4">{JSON.stringify(templateData)}</div>
       */}
      {type === 'create' &&
        addColumnButton({ openModal, isOpen, closeModal, setTemplateData })}

      <div className="overflow-x-auto relative mt-3">
        <table className="w-full text-sm text-gray-500 dark:text-gray-400 table">
          <thead className="text-xs text-gray-500 uppercase dark:bg-gray-700 dark:text-gray-400 h-10 bg-blue-50">
            <tr>
              {/*  <th scope="col" className="py-3">
                Column Key
              </th> */}
              <th scope="col" className="py-3">
                Column name
              </th>
              <th scope="col" className="py-3">
                Format
              </th>

              <th scope="col" className="py-3 ">
                Example
              </th>
              <th scope="col" className="py-3">
                <span>Required</span>
              </th>
              {type === 'create' && (
                <th scope="col" className="py-3">
                  <span>Action</span>
                </th>
              )}
            </tr>
          </thead>
          {templateData.columns ? (
            templateData.columns.map((col, idx) => (
              <tr key={idx} className="h-10 text-center">
                {/*   <td className="w-8">{col.key}</td> */}
                <td>{col.label}</td>
                <td>{col.data_type}</td>
                <td>{col.example}</td>
                <td>{col.is_required ? col.is_required.toString() : ''}</td>
                {type === 'create' && (
                  <td className="flex justify-center">
                    <PencilIcon
                      className="h-4 cursor-pointer mr-2 mt-1"
                      onClick={() =>
                        handleOpenEditModal({
                          isOpen,
                          setIsOpen,
                          closeModal,
                          setTemplateData,
                          columnData: col,
                        })
                      }
                    />
                    <TrashIcon
                      className=" h-5 cursor-pointer text-red-400"
                      onClick={() => handleDelete(col)}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <></>
          )}
        </table>
      </div>
    </div>
  );
};

export default AdminComponent;
