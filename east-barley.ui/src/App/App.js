import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import firebase from 'firebase/app';
import './App.scss';
import AgeVerificationModal from '../components/shared/AgeVerificationModal/AgeVerificationModal';
import Auth from '../components/pages/Auth/Auth';
import Beers from '../components/pages/AllBeers/AllBeers';
import Books from '../components/pages/AllBooks/AllBooks';
import Cart from '../components/pages/Cart/Cart';
import Home from '../components/pages/Homepage/Home';
import Profile from '../components/pages/Profile/Profile';
import Whiskeys from '../components/pages/AllWhiskeys/AllWhiskeys';
import firebaseApp from '../helpers/data/connection';
import MyNavBar from '../components/shared/MyNavBar/MyNavBar';

const Over21Route = ({ component: Component, verified, ...rest }) => {
  const routeChecker = (props) => (verified === true ? <Component {...props} {...rest}/> : <Redirect exact to={{ pathname: '/', state: { from: props.location } }} />);
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};
const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === true ? <Component {...props} {...rest}/> : <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />);
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};

firebaseApp();

class App extends React.Component {
  state = {
    authed: false,
    over21: false,
    ageVerificationComplete: false,
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  setOver21 = () => {
    this.setState({ over21: true });
  };

  setAgeVerified = () => {
    this.setState({ ageVerificationComplete: true });
  };

  render() {
    const { authed, over21, ageVerificationComplete } = this.state;

    return (
    <div className="App">
      <Router>
      <MyNavBar authed={authed} verified={over21} />
      <AgeVerificationModal hasVerified={ageVerificationComplete} verified={over21} setOver21={this.setOver21} setAgeVerified={this.setAgeVerified} />
        <Switch>
            <Route path="/" exact component={() => <Home verified={over21} authed={authed} />} />
            <Route path="/auth" exact component={() => <Auth verified={over21} authed={authed} />} />
            <PrivateRoute path="/profile" exact component={() => <Profile verified={over21} authed={authed} />} authed={authed} />
            <Over21Route path="/whiskey" exact component={() => <Whiskeys verified={over21} authed={authed} />} verified={over21} />
            <Over21Route path="/beer" exact component={() => <Beers verified={over21} authed={authed} />} verified={over21} />
            <Route path="/books" exact component={() => <Books verified={over21} authed={authed} />} />
            <PrivateRoute path="/cart" exact component={() => <Cart verified={over21} authed={authed} />} authed={authed} />
        </Switch>
      </Router>
    </div>
    );
  }
}

export default App;
