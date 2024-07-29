import './App.scss';

import ReactPlayground from './components/ReactPlayGround';
import { PlaygroundProvider } from './contexts/PlaygroundContext';

function App() {
  return (
    <PlaygroundProvider>
      <ReactPlayground />
    </PlaygroundProvider>
  );
}

export default App;
