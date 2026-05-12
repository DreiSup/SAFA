import './index.css'
import {Routes, Route, Outlet} from "react-router-dom"
import Sidebar from './components/SideBar';
import NotFound from './pages/NotFound';
import ShadcnCopy from './shadcnCopy';
import Chart from './pages/Chart';
import BitcoinRealTime from './pages/BitcoinRealTime';
import SP500RealTime from './pages/SP500RealTime';
import Test from './pages/Test';
import Markets from './pages/Markets';
import Report from './pages/Report';
import { AudioProvider } from './context/AudioContext';
import Colors from './pages/Colors';
import Home from './pages/Home';
import Micro from './pages/Micro';

function AppLayout() {
  return(
    <AudioProvider>
      <div style={{ display: 'flex', height: '100vh', background: 'var(--s-bg)', overflow: 'hidden' }}>
        <Sidebar />
        <main className='flex-1 flex flex-col min-w-0 dark overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </AudioProvider>
  )
}

function App() {
  return (
      <main className="flex-1 flex flex-col min-h-screen min-w-0 dark">
        <Routes>
          <Route element={<AppLayout />}>
            <Route path='/' element={<Home/>}/>
            <Route path='/micro' element={<Micro/>}/>
            <Route path='/chart' element={<Chart/>}/>
            <Route path='/chart/btc' element={<BitcoinRealTime/>}/>
            <Route path='/chart/sp500' element={<SP500RealTime/>}/>
            <Route path='/shadcn' element={<ShadcnCopy/>}/>
            <Route path='/test' element={<Test/>}/>
            <Route path='/markets' element={<Markets/>}/>
            <Route path='/report' element={<Report/>}/>

            <Route path='/colors' element={<Colors/>}/>
          </Route>

          <Route path='/*' element={<NotFound/>}/>
        </Routes>
      </main>
  );
}

export default App;