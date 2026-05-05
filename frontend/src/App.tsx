import './index.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ShadcnCopy from './shadcnCopy';
import Chart from './pages/Chart';
import BitcoinRealTime from './pages/BitcoinRealTime';
import SP500RealTime from './pages/SP500RealTime';
import Test from './pages/Test';
import UserHome from './pages/UserHome';
import Markets from './pages/Markets';

function App() {

  return (
    <main className="flex-1 flex flex-col min-h-screen min-w-0 dark">
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/' element={<UserHome/>}/>
        <Route path='/chart' element={<Chart/>}/>
        <Route path='/chart/btc' element={<BitcoinRealTime/>}/>
        <Route path='/chart/sp500' element={<SP500RealTime/>}/>
        <Route path='/shadcn' element={<ShadcnCopy/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/markets' element={<Markets/>}/>

        <Route path='/*' element={<NotFound/>}/>
      </Routes>
    </main>
  );
}

export default App;