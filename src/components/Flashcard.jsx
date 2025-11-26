import React from 'react';

// displays a single flashcard with 3d flip animation
// supports text and optional images on both front and back
function Flashcard({ term, definition, termImage, definitionImage, isFlipped, onFlip }) {
  return (
    <div
      className="perspective-1000 w-full h-96 cursor-pointer max-w-2xl mx-auto relative group"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* front side of the card (term) */}
        <div className="absolute w-full h-full bg-gray-900 shadow-sm rounded-lg flex flex-col items-center justify-center p-10 backface-hidden border-b-4 border-gray-800 hover:border-gray-600 transition-all">
          {termImage ? (
            <>
              <img src={termImage} alt="Term" className="max-h-60 max-w-full rounded shadow-sm object-contain" />
              {term && <h3 className="text-2xl font-normal text-gray-200 select-none mt-4">{term}</h3>}
            </>
          ) : (
            <h3 className="text-3xl font-normal text-gray-200 select-none">{term}</h3>
          )}
        </div>

        {/* back side of the card (definition) */}
        {/* rotated 180 degrees so it's hidden initially */}
        <div className="absolute w-full h-full bg-gray-900 shadow-sm rounded-lg flex flex-col items-center justify-center p-10 backface-hidden rotate-y-180 border-b-4 border-gray-800">
          {definitionImage ? (
            <>
              <img src={definitionImage} alt="Definition" className="max-h-60 max-w-full rounded shadow-sm object-contain" />
              {definition && <p className="text-xl text-gray-400 select-none mt-4">{definition}</p>}
            </>
          ) : (
            <p className="text-2xl text-gray-400 select-none">{definition}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
