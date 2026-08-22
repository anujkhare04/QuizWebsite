import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from "react-redux";
import store from "./src/store/store";
import { BrowserRouter } from "react-router-dom";
import { Pcontext } from "./src/context/context";

if (import.meta.env.PROD) {
  console.log = () => { };
  console.debug = () => { };
  console.info = () => { };
  console.warn = () => { };
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <Pcontext>
          <App />
        </Pcontext>
      </Provider>
    </StrictMode>
  </BrowserRouter>
)
