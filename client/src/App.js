import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import SettingsBar from './components/SettingsBar';
import Toolbar from './components/Toolbar';
import Canavas from './components/Canvas';
import './styles/app.scss';


function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route path="/:id">
            <Toolbar />
            <SettingsBar />
            <Canavas />
          </Route>
          <Redirect to={`f${(+new Date()).toString(16)}`} />
        </Switch>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
