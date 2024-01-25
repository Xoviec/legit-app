import { useSearchParams } from "react-router-dom";
import gone from '../410.svg'
import unauthorized from '../401.svg'
import notFound from '../404.svg'
import badRequest from '../400.svg'


export const AuthFailed = (props) =>{

    const [searchParams] = useSearchParams();

    const error = searchParams.get("error")


    console.log(error)

    return(
        <div className="central-page">
            <div className="not-found">
                {
                    error === '410' ?
                    <>
                       <img src={gone} alt="gone" />
                        <h2>
                        Link wygasł. Zeskanuj tag NFC ponownie.
                        </h2>
                    </>
                    :
                    error === '401' ? 
                    <>
                        <img src={unauthorized} alt="401 unauthorized" />
                        <h2>
                        Nieprawidłowy klucz.
                        </h2>
                    </>
                    :
                    <>
                        <img src={badRequest} alt="400 bad request" />
                        <h2>
                        Nieprawidłowe zapytanie.
                        </h2>
                    </>
                }
        
           
            </div>
        </div>
    )
}
