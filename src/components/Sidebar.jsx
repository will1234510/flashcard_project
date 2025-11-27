import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFlashcards } from '../context/FlashcardContext';

// sidebar component displaying folder list and create button
// acts as the main navigation/taskbar on the left
function Sidebar() {
  const { folders, addFolder, deleteFolder } = useFlashcards();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const navigate = useNavigate();

  // handles the creation of a new folder from the sidebar input
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      setIsCreating(false);
      return;
    }
    addFolder(newFolderName);
    setNewFolderName('');
    setIsCreating(false);
    // navigate(`/folder/${newId}`); // auto-navigation removed
  };
//hi
  // handles folder deletion with confirmation
  const handleDelete = (e, id) => {
    e.preventDefault(); // prevent navigation
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this folder?')) {
      deleteFolder(id);
      navigate('/'); // redirect to home in case we were on that folder page
    }
  };

  return (
    <div className="w-64 bg-black text-gray-300 flex flex-col h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <NavLink to="/" className="text-sm font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors">
            Your Folders
          </NavLink>
          <button 
            onClick={() => setIsCreating(true)}
            className="text-gray-400 hover:text-white"
            title="Create Folder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* inline form to create a new folder */}
        {isCreating && (
          <form onSubmit={handleCreateFolder} className="mb-4">
            <input
              type="text"
              autoFocus
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => !newFolderName && setIsCreating(false)}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-600 text-sm focus:outline-none"
            />
          </form>
        )}

        {/* list of existing folders */}
        <ul className="space-y-1">
          {folders.map(folder => (
            <li key={folder.id} className="group relative">
              <NavLink
                to={`/folder/${folder.id}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white border border-gray-600'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="truncate">{folder.name}</span>
                </div>
                {/* delete button appears on hover */}
                <button
                  onClick={(e) => handleDelete(e, folder.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 p-1 transition-opacity"
                  title="Delete folder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
