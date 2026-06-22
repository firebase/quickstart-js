import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';

import TextGeneration from './features/text-generation';
import Chat from './features/chat';
import Multimodal from './features/multimodal';
import StructuredOutput from './features/structured-output';
import FunctionCalling from './features/function-calling';
import ImageGeneration from './features/image-generation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'text-generation',
        element: <TextGeneration />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'multimodal',
        element: <Multimodal />,
      },
      {
        path: 'structured-output',
        element: <StructuredOutput />,
      },
      {
        path: 'function-calling',
        element: <FunctionCalling />,
      },
      {
        path: 'image-generation',
        element: <ImageGeneration />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);