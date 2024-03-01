
import './WaitingForVerify.css'
import mailed from '../../assets/mailed.svg'


export const WaitingForVerify = () =>{

    return(
        <div className="login-page">
            <div className="verify-container">
                <img src={mailed} alt="mail icon" />
                <h1>Zweryfikuj swój email</h1>
                <p>Na adres <span className='email-address'> &#123;addres&#125;</span> został przesłany link weryfikacyjny w celu dokończenia rejestracji. Logowanie będzie możliwe po jego otwarciu. </p>
            </div>
        </div>
    )

}