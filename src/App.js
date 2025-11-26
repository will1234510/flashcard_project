import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FolderView from './pages/FolderView.jsx';
import { FlashcardProvider } from './context/FlashcardContext.jsx';

// main app component that sets up routing and context provider
// wraps everything in flashcardprovider to share state
// uses browserrouter for navigation handling
function App() {
  return (
    <FlashcardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="folder/:folderId" element={<FolderView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FlashcardProvider>
  );
}

export default App;
