import React from 'react';
import { OfferProvider } from './Components/OfferContext/OfferContext.js'
import OfferHeader from './Components/OfferHeader/OfferHeader'
import './App.css';

function App() {
  return (
      <OfferProvider>
        <OfferHeader/>
      </OfferProvider>
  );
}

export default App;
