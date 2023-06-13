import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import {WebSocketProvider} from "./contexts/WebSocketContext";
import {BrowserRouter} from 'react-router-dom';
import {AvatarsContextProvider} from "./contexts/AvatarCacheContext";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <WebSocketProvider>
        <AvatarsContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AvatarsContextProvider>
    </WebSocketProvider>
)
