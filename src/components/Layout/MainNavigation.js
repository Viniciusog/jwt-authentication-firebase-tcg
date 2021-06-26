import { Link } from 'react-router-dom';
import { useContext } from "react"
import classes from './MainNavigation.module.css';
import AuthContext from '../../store/auth-context';

const MainNavigation = () => {

  //Seremos atualizados todas as vezes que as propriedades do context mudarem
  const authContext = useContext(AuthContext);

  const isLoggedIn = authContext.isLoggedIn

  //Iremos deslogar o usuário
  const logoutHandler = () => {
    authContext.logout()
    //AQUI IRÍAMOS UTILIZAR HISTORY PARA MANDAR O USUÁRIO DE VOLTA PARA A TELA DE LOGIN,
    //PORÉM PODEMOS UTILIZAR PROTECTED URLS PARA REALIZAR ESSA FUNÇão
  }

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (<li>
            <Link to='/auth'>Login</Link>
          </li>)}

          {isLoggedIn && (<li>
            <Link to='/profile'>Profile</Link>
          </li>
          )}

          {isLoggedIn &&
            (<li>
              <button onClick={logoutHandler}>Logout</button>
            </li>)
          }

        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
