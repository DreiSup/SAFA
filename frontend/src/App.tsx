import './index.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ShadcnCopy from './shadcnCopy';
import Chart from './pages/Chart';

function App() {

  return (
    <main className="flex-1 flex flex-col min-h-screen min-w-0 dark">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chart' element={<Chart/>}/>
        <Route path='/shadcn' element={<ShadcnCopy/>}/>

        <Route path='/*' element={<NotFound/>}/>
      </Routes>
    </main>
  );
}

export default App;