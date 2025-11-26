import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard.jsx';
import FlashcardForm from '../components/FlashcardForm.jsx';
import { useFlashcards } from '../context/FlashcardContext.jsx';

// component for viewing and studying a specific folder of flashcards
function Home() {
  const { folderId } = useParams();
  const { folders, addFlashcard, updateFlashcard, toggleFlashcardFlag, deleteFolder, renameFolder } = useFlashcards();
  const navigate = useNavigate();
  
  const [editingCardId, setEditingCardId] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');

  // find current folder or default to first if no id provided
  // falls back gracefully if folders are empty
  const currentFolder = folderId 
    ? folders.find(f => f.id === folderId) 
    : folders[0];

  // use useMemo to derive flashcards array to avoid unnecessary re-renders
  const flashcardsAll = React.useMemo(() => currentFolder?.flashcards || [], [currentFolder]);
  
  const [studyStarred, setStudyStarred] = useState(false);
  
  const flashcards = React.useMemo(() => studyStarred 
    ? flashcardsAll.filter(card => card.isFlagged)
    : flashcardsAll, [studyStarred, flashcardsAll]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // reset index and study mode when folder changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudyStarred(false);
  }, [folderId]);

  // reset index when switching study modes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [studyStarred]);

  // ensure index is valid when list changes (e.g. unstarring)
  useEffect(() => {
    if (currentIndex >= flashcards.length && flashcards.length > 0) {
      setCurrentIndex(Math.max(0, flashcards.length - 1));
    }
  }, [flashcards.length, currentIndex]);

  // safe access to current card to prevent runtime errors
  const currentCard = flashcards[currentIndex];

  // adds a new card to the current folder
  const handleAddFlashcard = (card) => {
    if (currentFolder) {
      addFlashcard(currentFolder.id, card);
    }
  };

  // updates an existing card
  const handleUpdateFlashcard = (card) => {
    if (currentFolder) {
      updateFlashcard(currentFolder.id, card);
      setEditingCardId(null);
    }
  };

  // toggles the flag status of the current card
  const handleToggleFlag = () => {
    if (currentFolder && currentCard) {
      toggleFlashcardFlag(currentFolder.id, currentCard.id);
    }
  };

  // handle renaming folder
  const handleRename = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      renameFolder(currentFolder.id, newName);
    }
    setIsRenaming(false);
  };

  const startRenaming = () => {
    setNewName(currentFolder.name);
    setIsRenaming(true);
  };

  // deletes the current folder and redirects to dashboard
  const handleDeleteFolder = () => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      deleteFolder(currentFolder.id);
      navigate('/');
    }
  };

  // navigates to the next card in the set
  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  // navigates to the previous card in the set
  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  // toggles the card flip state
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // render message if folder is not found (e.g. invalid url)
  if (!currentFolder) {
    return <div className="text-white text-xl mt-10">Folder not found. Please select a folder from the sidebar.</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* header section with title, delete button, and card count */}
      <div className="w-full flex justify-between items-end mb-8">
        <div className="flex items-center gap-4 w-full">
          {isRenaming ? (
            <form onSubmit={handleRename} className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-black text-3xl font-bold text-white px-2 py-1 rounded border border-gray-700 focus:outline-none"
                autoFocus
                onBlur={() => setIsRenaming(false)}
              />
              <button type="submit" className="text-green-500 hover:text-green-400 p-1">✓</button>
            </form>
          ) : (
            <h1 className="text-3xl font-bold text-gray-100 text-left">{currentFolder.name}</h1>
          )}
          
          <div className="flex items-center gap-2 ml-4">
            {!isRenaming && (
              <button 
                onClick={startRenaming}
                className="text-gray-500 hover:text-white transition-colors"
                title="Rename Folder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button 
              onClick={handleDeleteFolder}
              className="text-gray-500 hover:text-red-500 transition-colors"
              title="Delete Folder"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* main flashcard carousel display */}
      {flashcards.length > 0 && currentCard ? (
        <div className="w-full relative mb-8 max-w-2xl mx-auto">
          <Flashcard 
            key={`${currentFolder.id}-${currentCard.id}`}
            term={currentCard.term}
            definition={currentCard.definition}
            termImage={currentCard.termImage}
            definitionImage={currentCard.definitionImage}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />

          {/* navigation controls (prev/next) */}
          <div className="flex items-center justify-center mt-6 gap-6">
            <button 
              onClick={prevCard}
              disabled={currentIndex === 0}
              className={`p-4 rounded-full border border-gray-800 bg-gray-900 hover:bg-gray-800 transition-colors ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-sm'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* flag button */}
            <button
              onClick={handleToggleFlag}
              className={`p-4 rounded-full border border-gray-800 bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm ${currentCard.isFlagged ? 'text-yellow-400' : 'text-gray-400'}`}
              title={currentCard.isFlagged ? "Unflag card" : "Flag card"}
            >
              {currentCard.isFlagged ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}
            </button>

            {/* study starred toggle button (only visible if there are starred cards) */}
            {flashcardsAll.some(card => card.isFlagged) && (
              <button
                onClick={() => setStudyStarred(!studyStarred)}
                className={`px-6 py-4 rounded-full border transition-colors shadow-sm font-bold text-sm tracking-wide normal-case ${
                  studyStarred 
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
                }`}
                title={studyStarred ? 'Return to all cards' : 'Study starred only'}
              >
                Starred
              </button>
            )}

            <button 
              onClick={nextCard}
              disabled={currentIndex === flashcards.length - 1}
              className={`p-4 rounded-full border border-gray-800 bg-gray-900 hover:bg-gray-800 transition-colors ${currentIndex === flashcards.length - 1 ? 'opacity-50 cursor-not-allowed' : 'shadow-sm'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="text-center mt-4 font-medium text-gray-400">
            {currentIndex + 1} / {flashcards.length}
          </div>
        </div>
      ) : (
        // empty state placeholder
        <div className="w-full relative mb-8 max-w-2xl mx-auto h-96 bg-gray-900 rounded-lg flex flex-col items-center justify-center text-gray-500 border-b-4 border-gray-800">
          {studyStarred ? (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-40 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
               </svg>
               <p className="text-xl font-medium mb-2">No starred flashcards</p>
               <p className="text-base opacity-60">Flag some cards to study them here</p>
               <button 
                 onClick={() => setStudyStarred(false)}
                 className="mt-4 text-indigo-400 hover:text-indigo-300 underline"
               >
                 Return to all cards
               </button>
             </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-xl font-medium mb-2">This folder is empty</p>
              <p className="text-base opacity-60">Add a flashcard below to get started</p>
            </>
          )}
        </div>
      )}

      {/* hide form when studying starred only to avoid confusion */}
      {!studyStarred && <FlashcardForm onAddFlashcard={handleAddFlashcard} />}

      {/* list view of terms below (single column stack) */}
      <div className="w-full mt-12 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-gray-300 mb-4">Terms in this set ({flashcards.length})</h3>
        <div className="flex flex-col gap-4">
          {flashcards.map((card) => (
            <div key={card.id} className="w-full">
              {editingCardId === card.id ? (
                <FlashcardForm 
                  initialData={card}
                  onAddFlashcard={handleUpdateFlashcard}
                  onCancel={() => setEditingCardId(null)}
                />
              ) : (
                <div className="bg-gray-900 p-4 rounded shadow-sm border border-gray-800 relative group">
                  <button
                    onClick={() => setEditingCardId(card.id)}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit card"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-800 pb-2 sm:pb-0 pr-4 text-gray-300 font-medium">
                      {card.termImage && (
                        <img src={card.termImage} alt="Term" className="max-h-20 mb-2 rounded shadow-sm block" />
                      )}
                      {card.term}
                    </div>
                    <div className="w-full sm:w-2/3 text-gray-500 pl-0 sm:pl-4">
                      {card.definitionImage && (
                        <img src={card.definitionImage} alt="Definition" className="max-h-20 mb-2 rounded shadow-sm block" />
                      )}
                      {card.definition}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
