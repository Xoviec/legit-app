import { Link } from 'react-router-dom';


export const MainNotLogged = ()=>{

    return(
        <div className="welcomer">
            <h1>Witaj!</h1>
            <p> 

            <Link to='/register'>

                <span>Dołącz </span>  
                
            </Link>

                aby wykorzystać wszystkie funkcje!</p>
        </div>
    )
}