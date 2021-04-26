import React, {useRef} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import SettingsBar from './components/SettingsBar';
import Toolbar from './components/Toolbar';
import Canavas from './components/Canvas';
import './styles/app.scss';


function App() {
  const lineRef = useRef();
  const strokeColorRef = useRef();
  const fillColorRef = useRef();
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route path="/:id">
            <Toolbar />
            <SettingsBar lineRef={lineRef} strokeColorRef={strokeColorRef} fillColorRef={fillColorRef} />
            <Canavas lineRef={lineRef} strokeColorRef={strokeColorRef} fillColorRef={fillColorRef} />
          </Route>
          <Redirect to={`f${(+new Date()).toString(16)}`} />
        </Switch>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
