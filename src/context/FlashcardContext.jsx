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

  // creates a new folder with a unique id and 3 default flashcards
  // returns: string id of the newly created folder
  const addFolder = (name) => {
    const defaultCards = [
      { id: Date.now(), term: 'Term 1', definition: 'Definition 1', termImage: '', definitionImage: '', isFlagged: false },
      { id: Date.now() + 1, term: 'Term 2', definition: 'Definition 2', termImage: '', definitionImage: '', isFlagged: false },
      { id: Date.now() + 2, term: 'Term 3', definition: 'Definition 3', termImage: '', definitionImage: '', isFlagged: false }
    ];

    const newFolder = {
      id: Date.now().toString(),
      name,
      flashcards: defaultCards
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
          flashcards: [...folder.flashcards, { ...card, id: Date.now(), isFlagged: false }]
        };
      }
      return folder;
    }));
  };

  // updates an existing flashcard in a specific folder
  const updateFlashcard = (folderId, updatedCard) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          flashcards: folder.flashcards.map(card => 
            card.id === updatedCard.id ? updatedCard : card
          )
        };
      }
      return folder;
    }));
  };

  // renames a folder
  const renameFolder = (folderId, newName) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, name: newName };
      }
      return folder;
    }));
  };

  // toggles the flagged status of a flashcard
  const toggleFlashcardFlag = (folderId, cardId) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          flashcards: folder.flashcards.map(card => 
            card.id === cardId ? { ...card, isFlagged: !card.isFlagged } : card
          )
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
    <FlashcardContext.Provider value={{ folders, addFolder, addFlashcard, updateFlashcard, renameFolder, toggleFlashcardFlag, deleteFolder }}>
      {children}
    </FlashcardContext.Provider>
  );
};
