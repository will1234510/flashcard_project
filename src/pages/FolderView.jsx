import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard.jsx';
import FlashcardForm from '../components/FlashcardForm.jsx';
import { useFlashcards } from '../context/FlashcardContext.jsx';

// component for viewing and studying a specific folder of flashcards
function Home() {
  const { folderId } = useParams();
  const { folders, addFlashcard, deleteFolder } = useFlashcards();
  const navigate = useNavigate();
  
  // find current folder or default to first if no id provided
  // falls back gracefully if folders are empty
  const currentFolder = folderId 
    ? folders.find(f => f.id === folderId) 
    : folders[0];

  const flashcards = currentFolder?.flashcards || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // reset index when folder changes to start from the first card
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [folderId]);

  // adds a new card to the current folder
  const handleAddFlashcard = (card) => {
    if (currentFolder) {
      addFlashcard(currentFolder.id, card);
    }
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
    <>
      {/* header section with title, delete button, and card count */}
      <div className="w-full flex justify-between items-end mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-100 w-full text-left">{currentFolder.name}</h1>
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
        <span className="text-gray-400 text-sm whitespace-nowrap">{flashcards.length} cards</span>
      </div>

      {/* main flashcard carousel display */}
      {flashcards.length > 0 ? (
        <div className="w-full relative mb-8">
          <Flashcard 
            key={`${currentFolder.id}-${currentIndex}`}
            term={flashcards[currentIndex].term}
            definition={flashcards[currentIndex].definition}
            termImage={flashcards[currentIndex].termImage}
            definitionImage={flashcards[currentIndex].definitionImage}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />

          {/* navigation controls (prev/next) */}
          <div className="flex items-center justify-center mt-6 gap-8">
            <button 
              onClick={prevCard}
              disabled={currentIndex === 0}
              className={`p-4 rounded-full border border-gray-800 bg-gray-900 hover:bg-gray-800 transition-colors ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-sm'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-medium text-gray-400 min-w-[60px] text-center">
              {currentIndex + 1} / {flashcards.length}
            </span>

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
        </div>
      ) : (
        // empty state placeholder
        <div className="w-full relative mb-8 max-w-2xl mx-auto h-96 bg-gray-900 rounded-lg flex flex-col items-center justify-center text-gray-500 border-b-4 border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-xl font-medium mb-2">This folder is empty</p>
          <p className="text-base opacity-60">Add a flashcard below to get started</p>
        </div>
      )}

      <FlashcardForm onAddFlashcard={handleAddFlashcard} />

      {/* list view of terms below (masonry layout) */}
      <div className="w-full mt-12">
        <h3 className="text-xl font-bold text-gray-300 mb-4">Terms in this set ({flashcards.length})</h3>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {flashcards.map((card) => (
            <div key={card.id} className="bg-gray-900 p-4 rounded shadow-sm border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 break-inside-avoid mb-4">
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
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
