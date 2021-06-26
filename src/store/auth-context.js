import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
})

//Receberemos a data de expiração (timestamp) 
const calculateRemainingTime = (expirationTime) => {
    //Pegamos o tempo atual
    const currentTime = new Date().getTime()

    //Pegamos a data de expiração ajustada (Por padrão o firebase retorna uma string)
    const adjExpirationTime = new Date(expirationTime).getTime()

    //O tempo restante então é: data de expiração - data de agora (Tudo em milissegundos)
    const remainingDuration = adjExpirationTime - currentTime

    return remainingDuration
}

//Toda vez que recarregarmos a url, o nosso contador timeout será zerado. Para isso, temos que pegar
//o expirationTime do localStorage e calcular novamente quanto tempo falta para o token expirar.
const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem("token")
    const storedExpirationDate = localStorage.getItem("expirationTime")

    //Se não estivermos logado e acessarmos a página, então storedExpirationDate será null

    const remainingDuration = calculateRemainingTime(storedExpirationDate)

    /*No caso de não estarmos logado, o storedExpirationTime nem existirá. Portanto, na hora de calcular o tempo
    restante, o resultado será negativo (0 - tempo atual = número negativo)
    */


    //Se faltar apenas um minuto ou menos para o token expirar, então retornaremos 'null', além de deletar
    //o token e a data de expiração do token, do localStorage
    if (remainingDuration <= 60000) {
        localStorage.removeItem("token")
        localStorage.removeItem("expirationTime")
        return null
    }
    //Se regarregarmos a URL e faltar mais do que 1 minuto para o token expirar, então retornaremos
    //o token e o tempo que falta para o token expirar
    return {
        token: storedToken,
        duration: remainingDuration
    }
}

//obs: linha do pensamento começa pelo login..

export const AuthContextProvider = (props) => {
    //Sempre que carregarmos a página, verificaremos se o token já foi expirado ou não, e qual o seu valor.
    //Se não estivermos logado, o token nem irá existir.
    const tokenData = retrieveStoredToken()

    let initialToken 
    if (tokenData) {
        initialToken = tokenData.token
    }

    //Se falta menos de 1 minuto para nosso token expirar, então ele virá para nós como 'null'
    //Se não, colocaremos o valor do token
    const [token, setToken] = useState(initialToken)
    
    //Se tivermos o token, então userIsLoggedIn será 'true'
    const userIsLoggedIn = !!token

    //Usamos logoutHandler dentro do useEffect. Por isso, precisamos colocar useCallback para que o nosso
    //logoutHandler não seja recarregado sempre que o nosso componente for renderizado
    const logoutHandler = useCallback (() => {
        //Ao deslogar, iremos remover o token do localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("expirationTime")
        setToken(null)

        if (logoutTimer) {
            clearTimeout(logoutTimer) //logoutTimer não é adicionado como dependência do useCallback pois 
            //está fora do escopo do componente
        }
    }, [])

    //Receberemos o token e o timestamp em que esse token expira
    const loginHandler = (token, expirationTime) => {
        //Ao logar, iremos guardar o token e a data de expiração no localStorage
        localStorage.setItem("token", token)
        localStorage.setItem("expirationTime", expirationTime)
        setToken(token)

        const remainingTime = calculateRemainingTime(expirationTime)
        

        //Agora podemos setar um 'temporizador' que ficará executando durante o tempo restante.
        //Quando acabar o tempo restante, chamará a função de logout automaticamente (callback)
        logoutTimer = setTimeout(logoutHandler, remainingTime)
    }

    //Sempre que carregarmos a página, geraremos um contador com o tempo que falta para o nosso token expirar
    useEffect(() => {
        //Se o tempo de duração do token for maior que 1 minuto, então tokenData não será nulo
        if (tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration)
        }
    }, [tokenData, logoutHandler])

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
    
}

export default AuthContext;