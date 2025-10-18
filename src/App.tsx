import { BrowserRouter } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppProvider from './hooks';
import AppRouter from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
        <AppRouter />
      </AppProvider>
    </BrowserRouter>
  );
}
