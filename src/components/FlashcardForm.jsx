import React, { useState, useEffect } from 'react';

// form component for adding/editing flashcards
// allows entering text or pasting images for both term and definition
function FlashcardForm({ onAddFlashcard, initialData = null, onCancel = null }) {
  const [term, setTerm] = useState(initialData?.term || '');
  const [definition, setDefinition] = useState(initialData?.definition || '');
  const [termImage, setTermImage] = useState(initialData?.termImage || '');
  const [definitionImage, setDefinitionImage] = useState(initialData?.definitionImage || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTerm(initialData.term || '');
      setDefinition(initialData.definition || '');
      setTermImage(initialData.termImage || '');
      setDefinitionImage(initialData.definitionImage || '');
      setIsOpen(true);
    }
  }, [initialData]);

  // validates inputs and calls parent handler to add/update card
  const handleSubmit = (e) => {
    e.preventDefault();
    // allow submission if at least one field (term/def) has content or an image
    const hasTermContent = term.trim() || termImage;
    const hasDefinitionContent = definition.trim() || definitionImage;

    if (!hasTermContent || !hasDefinitionContent) return;

    onAddFlashcard({ 
      ...initialData, // keep existing id if editing
      term, 
      definition, 
      termImage, 
      definitionImage 
    });
    
    // reset form state only if not editing (or close if editing)
    if (initialData) {
        if(onCancel) onCancel();
    } else {
        setTerm('');
        setDefinition('');
        setTermImage('');
        setDefinitionImage('');
        setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  // show a simple button if the form is closed and not in edit mode
  if (!isOpen && !initialData) {
    return (
      <div className="flex justify-center w-full">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow-md transition-colors"
        >
          + Add Card
        </button>
      </div>
    );
  }

  // handles paste events to detect and process images from clipboard
  const handlePaste = (e, setFunction) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      // check if pasted item is an image
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        // convert image blob to base64 data url
        reader.onload = (event) => {
          setFunction(event.target.result);
        };
        reader.readAsDataURL(blob);
        break; 
      }
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-800 w-full max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-300">{initialData ? 'Edit flashcard' : 'Create new flashcard'}</h2>
        <button onClick={handleCancel} className="text-gray-500 hover:text-gray-300">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-500 text-xs font-bold uppercase mb-1" htmlFor="term">
              Term
            </label>
            {/* switch between input and image preview based on state */}
            {!termImage && (
              <input
                id="term"
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onPaste={(e) => handlePaste(e, setTermImage)}
                className="appearance-none block w-full bg-black text-gray-200 border-b-2 border-gray-700 py-2 px-4 leading-tight focus:outline-none focus:border-gray-500 focus:bg-black placeholder-gray-700 mb-2"
                placeholder="Enter term or paste image"
                autoFocus
                autoComplete="off"
              />
            )}
            {termImage && (
              <div className="mt-2 relative mb-4">
                <img src={termImage} alt="Term Preview" className="max-h-40 rounded border border-gray-800 block w-full object-contain" />
                <button 
                  type="button"
                  onClick={() => setTermImage('')}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-gray-500 text-xs font-bold uppercase mb-1" htmlFor="definition">
              Definition
            </label>
            {!definitionImage && (
              <input
                id="definition"
                type="text"
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                onPaste={(e) => handlePaste(e, setDefinitionImage)}
                className="appearance-none block w-full bg-black text-gray-200 border-b-2 border-gray-700 py-2 px-4 leading-tight focus:outline-none focus:border-gray-500 focus:bg-black placeholder-gray-700 mb-2"
                placeholder="Enter definition or paste image"
                autoComplete="off"
              />
            )}
            {definitionImage && (
              <div className="mt-2 relative mb-4">
                <img src={definitionImage} alt="Definition Preview" className="max-h-40 rounded border border-gray-800 block w-full object-contain" />
                <button 
                  type="button"
                  onClick={() => setDefinitionImage('')}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          {initialData && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            {initialData ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FlashcardForm;
