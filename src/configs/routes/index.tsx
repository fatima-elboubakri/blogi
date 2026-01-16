

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootContainer from '../../features/RootContainer';
import PostsPage from '../../pages/Post';
const HomePage = lazy(() => import('../../pages/Home'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RootContainer>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post" element={<PostsPage />} />
          </Routes>
        </BrowserRouter>
      </RootContainer>
    </Suspense>
  );
}
