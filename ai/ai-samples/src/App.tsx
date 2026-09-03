import { Link, Outlet, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/text-generation', label: 'Text Generation' },
  { path: '/chat', label: 'Chat' },
  { path: '/multimodal', label: 'Multimodal' },
  { path: '/structured-output', label: 'Structured Output' },
  { path: '/function-calling', label: 'Function Calling' },
  { path: '/automatic-function-calling', label: 'Automatic Function Calling' },
  { path: '/image-generation', label: 'Image Generation' },
  { path: '/grounding-with-google-search', label: 'Grounding with Google Search' },
];

export default function App() {
  const { pathname } = useLocation();

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