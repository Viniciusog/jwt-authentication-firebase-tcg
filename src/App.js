import { Switch, Route, Redirect } from 'react-router-dom';
import { useContext } from "react"

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthProvider from "./store/auth-context"

function App() {

  const authContext = useContext(AuthProvider)
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        {
          <Route path='/auth'>
            {!authContext.isLoggedIn && <AuthPage />}
            {authContext.isLoggedIn && <Redirect to="/"/>}
            
          </Route>
        }

        <Route path='/profile'>
          {authContext.isLoggedIn && <UserProfile />}
          {!authContext.isLoggedIn && <Redirect to='/auth' />}
        </Route>

        {/* Se eu tentar acessar qualquer outra página que não estiver sendo rastreada pelos Routes, iremos 
        redirecionar para '/' */}
        <Route path='*'>
          <Redirect to="/"/>
        </Route>

      </Switch>
    </Layout>
  );
}

export default App;
