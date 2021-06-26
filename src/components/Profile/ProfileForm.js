import classes from './ProfileForm.module.css';
import {useRef, useContext} from "react"
import AuthContext from '../../store/auth-context';
import {useHistory} from "react-router-dom"

const ProfileForm = () => {

  const history = useHistory()

  const newPasswordInputRef = useRef()
  
  const authContext = useContext(AuthContext)

  const submitHandler = (event) => {
    event.preventDefault()

    const enteredNewPassword = newPasswordInputRef.current.value

    fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCJwvYjj7fkdp29yESYX5IVqe55ULR8T3k",
    {
      method: "POST",
      body: JSON.stringify({
        idToken: authContext.token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        "Content-type": "application/json"
      }
    }).then(response => {
      //Se alterou a senha com sucesso
      if (response.ok) {
        return response.json().then(data => {
          alert("Senha alterada com sucesso!")
          //Enviar usuário para a página principal
          history.replace("/")
        })
      } 
      //Se der erro na alteração da senha
      else {
        return response.json().then(data => {
          alert(data.error.message)
        })
      }
    })
  }


  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordInputRef} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
