// in house components
import Home from "./Components/Home/Home";
import Manage from "./Components/Manage/Manage";
import Nav from "./Components/Nav";
// external components
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Nav/>
      <Switch>  {/* renders only the first path that matches, rather than any path that matches (in theory redundant with exact) */}
        <Route exact path='/home' component={Home} />
        <Route exact path='/manage' component={Manage} />
        <Redirect exact from='/' to='/home' />
      </Switch>
    </Router>
  );
}

export default App;
