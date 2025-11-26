import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFlashcards } from '../context/FlashcardContext';

// dashboard component (home page)
// displays a grid of all available folders and allows creating/deleting them
function Dashboard() {
  const { folders, addFolder, deleteFolder, renameFolder } = useFlashcards();
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingFolderId, setEditingCardId] = useState(null);
  const [editName, setEditName] = useState('');

  // creates a new folder and navigates to it
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    addFolder(newFolderName);
    setNewFolderName('');
    setIsCreating(false);
  };

  const startEditing = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingCardId(folder.id);
    setEditName(folder.name);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editName.trim()) {
      renameFolder(editingFolderId, editName);
    }
    setEditingCardId(null);
  };

  const cancelEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingCardId(null);
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

      {/* grid layout for folders (2 columns default, responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map(folder => (
          <Link 
            key={folder.id} 
            to={`/folder/${folder.id}`}
            className="block bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl p-6 transition-all hover:shadow-lg hover:border-gray-600 group relative"
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex-grow mr-4">
                {editingFolderId === folder.id ? (
                  <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-black text-white px-2 py-1 rounded border border-gray-700 w-full"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={saveEdit} className="text-green-500 hover:text-green-400 p-1">✓</button>
                    <button onClick={cancelEdit} className="text-red-500 hover:text-red-400 p-1">✕</button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors truncate">
                      {folder.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                      <span>{folder.flashcards.length} {folder.flashcards.length === 1 ? 'term' : 'terms'}</span>
                      {folder.flashcards.filter(card => card.isFlagged).length > 0 && (
                        <span className="flex items-center text-yellow-500/80">
                          <span className="mr-1">•</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {folder.flashcards.filter(card => card.isFlagged).length} starred
                        </span>
                      )}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => startEditing(e, folder)}
                  className="text-gray-600 hover:text-white p-2 mr-1"
                  title="Rename folder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => handleDelete(e, folder.id)}
                  className="text-gray-600 hover:text-red-400 p-2"
                  title="Delete folder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
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
