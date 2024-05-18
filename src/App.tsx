import React from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Time from './pages/Time';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/time" element={<Time />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
