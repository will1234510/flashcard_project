import React, { createContext, useState, useContext, useEffect } from 'react';

// create a context to share state globally across components
const FlashcardContext = createContext();

// custom hook to easily access the flashcard context values
// usage: const { folders, addFolder } = useFlashcards();
export const useFlashcards = () => useContext(FlashcardContext);

// provider component that wraps the app and manages state
export const FlashcardProvider = ({ children }) => {
  // load folders from localstorage or initialize with a default test folder
  // state: array of folder objects, each containing an id, name, and array of flashcards
  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem('flashcard_folders_v1');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'test-folder',
        name: 'Test',
        flashcards: []
      }
    ];
  });

  // save folders to localstorage whenever the state changes to persist data
  useEffect(() => {
    localStorage.setItem('flashcard_folders_v1', JSON.stringify(folders));
  }, [folders]);

  // creates a new folder with a unique id
  // returns: string id of the newly created folder
  const addFolder = (name) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      flashcards: []
    };
    setFolders([...folders, newFolder]);
    return newFolder.id;
  };

  // adds a new flashcard to a specific folder
  const addFlashcard = (folderId, card) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          flashcards: [...folder.flashcards, { ...card, id: Date.now() }]
        };
      }
      return folder;
    }));
  };

  // removes a folder and all its contents by id
  const deleteFolder = (folderId) => {
    setFolders(folders.filter(f => f.id !== folderId));
  };

  return (
    <FlashcardContext.Provider value={{ folders, addFolder, addFlashcard, deleteFolder }}>
      {children}
    </FlashcardContext.Provider>
  );
};
