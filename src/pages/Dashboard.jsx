import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFlashcards } from '../context/FlashcardContext';

// dashboard component (home page)
// displays a grid of all available folders and allows creating/deleting them
function Dashboard() {
  const { folders, addFolder, deleteFolder } = useFlashcards();
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // creates a new folder and navigates to it
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    const newId = addFolder(newFolderName);
    setNewFolderName('');
    setIsCreating(false);
    navigate(`/folder/${newId}`);
  };

  // deletes a folder with confirmation
  const handleDelete = (e, id) => {
    e.preventDefault(); // prevent navigation
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this folder?')) {
      deleteFolder(id);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Your Library</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-6 rounded shadow-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Folder
        </button>
      </div>

      {/* form for creating a new folder, visible when iscreating is true */}
      {isCreating && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-gray-200 mb-4">Create New Folder</h2>
          <form onSubmit={handleCreateFolder} className="flex gap-4">
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name (e.g., Biology 101)"
              className="flex-grow bg-black text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:border-gray-500"
            />
            <button 
              type="submit" 
              className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-6 rounded transition-colors"
            >
              Create
            </button>
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors border border-gray-700"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* masonry grid layout for folders */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {folders.map(folder => (
          <Link 
            key={folder.id} 
            to={`/folder/${folder.id}`}
            className="block bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl p-6 transition-all hover:shadow-lg hover:border-gray-600 group relative break-inside-avoid mb-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">
                  {folder.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {folder.flashcards.length} {folder.flashcards.length === 1 ? 'term' : 'terms'}
                </p>
              </div>
              <button 
                onClick={(e) => handleDelete(e, folder.id)}
                className="text-gray-600 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete folder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* empty state when no folders exist */}
      {folders.length === 0 && !isCreating && (
        <div className="text-center py-20">
          <div className="inline-block p-4 rounded-full bg-gray-900 mb-4 border border-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No folders yet</h3>
          <p className="text-gray-500 mb-8">Create a folder to start adding flashcards.</p>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded transition-colors"
          >
            Create First Folder
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
