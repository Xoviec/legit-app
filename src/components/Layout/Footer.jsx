import instagram from '../../instagram.svg'
import logo from '../../Legited logo.svg'


export const Footer = () =>{


    return(
        <footer className="footer">

            <a className='logo' href="/main">
                <img src={logo} alt="" />
            </a>

      
            <div className="info">
                <a href="/privacy">Polityka prywatności</a>
                <a href="/terms">Regulamin</a>
                <a className='instagram-logo' href="https://instagram.com/legited.app" target="_blank">
                <img src={instagram} alt="" />
            </a>
                {/* <div className="copyright">
                © <span id="currentYear"></span> Legited. All rights reserved.
            </div> */}
            </div>
          
      </footer>
    )
}