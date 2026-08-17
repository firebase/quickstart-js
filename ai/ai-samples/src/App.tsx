import { Link, Outlet, useLocation } from 'react-router-dom';
import TextGenerationView from './features/text-generation';
import ChatView from './features/chat';
import MultimodalView from './features/multimodal';
import StructuredOutputView from './features/structured-output';
import FunctionCallingView from './features/function-calling';
import ImageGenerationView from './features/image-generation';
import AutomaticFunctionCallingView from './features/automatic-function-calling';

const NAV_ITEMS = [
  { path: '/text-generation', label: 'Text Generation' },
  { path: '/chat', label: 'Chat' },
  { path: '/multimodal', label: 'Multimodal' },
  { path: '/structured-output', label: 'Structured Output' },
  { path: '/function-calling', label: 'Function Calling' },
  { path: '/automatic-function-calling', label: 'Automatic Function Calling' },
  { path: '/image-generation', label: 'Image Generation' },
  
];

export default function App() {
  const { pathname } = useLocation();
  const isolatedFeature = import.meta.env.VITE_ISOLATED_FEATURE;
  // If running an isolated script, bypass the shell entirely
  if (isolatedFeature) {
    switch (isolatedFeature) {
      case 'text-generation': return <TextGenerationView />;
      case 'chat': return <ChatView />;
      case 'multimodal': return <MultimodalView />;
      case 'structured-output': return <StructuredOutputView />;
      case 'function-calling': return <FunctionCallingView />;
      case 'automatic-function-calling': return <AutomaticFunctionCallingView />;
      case 'image-generation': return <ImageGenerationView />;
    }
  }

  // Otherwise, return the multi-feature app shell layout
  return (
    <div className="app-shell">
      <nav className="sidebar">
        <h1 className="sidebar-title">Firebase AI Samples</h1>
        <ul className="nav-list">
          {NAV_ITEMS.map(({ path, label }) => (
            <li key={path}>
              <Link 
                to={path} 
                className={`nav-link ${pathname === path ? 'nav-link-active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}