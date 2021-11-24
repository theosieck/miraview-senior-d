// in house components
import Home from "./Components/Home/Home";
import Manage from "./Components/Manage/Manage";
import Nav from "./Components/Nav";
import LoginNav from "./Components/LoginNav";
// external components
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from "./Components/Login";
import SingleClientData from "./Components/SingleClientData/SingleClientData";

function App() {
  return (
    <Router>
      <Switch>  {/* renders only the first path that matches, rather than any path that matches (in theory redundant with exact) */}
      <div>
        <Route exact path='/' component={LoginContainer} />
        <Route path={["/home","/manage","/population","/settings", "/client-data"]} component={DefaultContainer}/>
      </div>
      </Switch>
    </Router>
  );
}

const LoginContainer = () => (
  <div>
    <LoginNav/>
    <Route exact path='/' component={Login} />
  </div>
)

const DefaultContainer =() => (
  <div>
    <Nav/>
    <Route exact path='/home' component={Home} />
    <Route exact path='/manage' component={Manage} />
    <Route exact path='/client-data' component={SingleClientData} />
  </div>
)

export default App;
