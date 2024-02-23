import notFound from '../../assets/404.svg'

export const NotFound = () =>{

    return(
        <div className="not-found">
        
            <img src={notFound} alt="404 not found" />
            <h2>
                Nie znaleziono strony której szukasz
            </h2>
        </div>
    )
}