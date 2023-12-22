import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import { Footer } from './components/Footer';

const App = () => {
  return (
    <>
      <div className='bg-white dark:bg-black'> 
        <Header />
        <ToastContainer />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default App