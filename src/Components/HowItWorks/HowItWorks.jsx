
import logo from '../../assets/logo-legited.png'
import './HowItWorks.css'
import { StepCard } from './StepCard'
import verify from '../../assets/verify-icon.svg'
import montage from '../../assets/montage.svg'
import assign from '../../assets/assign.svg'




export const HowItWorks = () =>{

   
  

    return(
        <div className="how-it-works-page">
            <h1>Jak to działa?</h1>
            <div className="steps-container">
                <StepCard number={1} title={'Weryfikacja'} desc={'Otrzymany przez nas przedmiot podlega weryfikacji autentyczności.'} icon={verify}/>
                <StepCard number={2} title={'Montaż'} desc={'Do pomyślnie zweryfikowanego przedmiotu zostaje zamontowany tag NFC umożliwiający jego weryfiikacje.'} icon={montage}/>
                <StepCard number={3} title={'Rejestracja'} desc={'Gotowy przedmiot oraz tag NFC zostają przypisane do Twojego konta. Możesz nimi zarządzać na stronie.'} icon={assign}/>
            </div>
            {/* <h2>Co dalej?</h2> */}
    
        </div>
    )
}