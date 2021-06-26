import { useRef, useState, useContext } from 'react';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const authContext = useContext(AuthContext)

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const email = emailInputRef.current.value
    const password = passwordInputRef.current.value

    if (isLogin) {
      setIsLoading(true)
      fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCJwvYjj7fkdp29yESYX5IVqe55ULR8T3k",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          setIsLoading(false)
          //Se der certo o login
          if (res.ok) {
            //Passa de json para objeto javascript
            return res.json().then(data => {
             //Atualizar o context auth
             authContext.login(data.idToken)
            })
          } 
          //Se der errado o login, a mensagem está no corpo da resposta
          else {
            return res.json().then(data => {
              alert(data.error.message)
            })
          }
        })

    } else {
      //signup
      setIsLoading(true)
      fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCJwvYjj7fkdp29yESYX5IVqe55ULR8T3k",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
          
        }).then(res => {
          setIsLoading(false)
          //Se der certo o cadastro
          if (res.ok) {
            //Passa de json para objeto javascript
            return res.json().then(data => {
              //Cadastrado com sucesso 
              //(obs: o firebase retorna idToken tanto para cadastro com sucesso quanto para login com sucesso)
              authContext.login(data.idToken)
            })
          }
          //Se tiver dado erro, o firebase irá retornar uma mensagem de erro no corpo da resposta
          //No momento, apenas estamos imprimindo no console
          else {
            //promisse
            return res.json().then(data => {
              //optional: show modal error
              //console.log(data)
              alert(data.error.message)
              //console.log(data.error.message)
            })
          }
        })
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      {isLoading && <p>Loading...</p>}
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input ref={emailInputRef} type='email' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input ref={passwordInputRef} type='password' id='password' required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
