import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import TextGeneration from './features/text-generation';
import Chat from './features/chat';
import Multimodal from './features/multimodal';
import StructuredOutput from './features/structured-output';
import FunctionCalling from './features/function-calling';
import ImageGeneration from './features/image-generation';
import AutomaticFunctionCalling from './features/automatic-function-calling';
import VideoAnalysis from './features/video-analysis';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/text-generation" replace /> },
      { path: 'text-generation', element: <TextGeneration /> },
      { path: 'chat', element: <Chat /> },
      { path: 'multimodal', element: <Multimodal /> },
      { path: 'structured-output', element: <StructuredOutput /> },
      { path: 'function-calling', element: <FunctionCalling /> },
      { path: 'automatic-function-calling', element: <AutomaticFunctionCalling /> },
      { path: 'image-generation', element: <ImageGeneration /> },
      { path: 'video-analysis', element: <VideoAnalysis /> },
    ],
  },

]);

const isolatedFeature = import.meta.env.VITE_ISOLATED_FEATURE;

const renderContent = () => {
  if (isolatedFeature) {
    switch (isolatedFeature) {
      case 'text-generation':
        return <TextGeneration />;
      case 'chat':
        return <Chat />;
      case 'multimodal':
        return <Multimodal />;
      case 'structured-output':
        return <StructuredOutput />;
      case 'function-calling':
        return <FunctionCalling />;
      case 'image-generation':
        return <ImageGeneration />;
      case 'automatic-function-calling':
        return <AutomaticFunctionCalling />;
      case 'video-anaylsis':
        return <VideoAnalysis />;
      default:
        return <RouterProvider router={router} />;
    }
  }

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {renderContent()}
  </React.StrictMode>
);