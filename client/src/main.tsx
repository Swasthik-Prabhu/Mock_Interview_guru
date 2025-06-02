// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import './index.css';
// import { AuthProvider } from './context/AuthContext';
// import AppRoutes from './router/AppRoutes';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>
// );

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './router/AppRoutes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
