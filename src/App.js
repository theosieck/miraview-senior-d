// in house components
import Home from "./Components/Home/Home";
import Manage from "./Components/Manage/Manage";
// external components
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>  {/* renders only the first path that matches, rather than any path that matches (in theory redundant with exact) */}
        <Route exact path='/home' component={Home} />
        <Route exact path='/manage' component={Manage} />
      </Switch>
    </Router>
  );
}

export default App;
