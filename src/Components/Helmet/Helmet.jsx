import { Helmet } from 'react-helmet';

export const HelmetProvider = () =>{

    return(

       <Helmet>
        <title>Legited</title>
        <meta name="description" content="Uwierzytelnianie oraz permanentny legit check na Twoje sneakersy za pomocą tagów NFC" />
        <meta name="keywords" content="react, meta tags, seo, streetwear,yeezy,nike,adidas,jordan,jordan low,low,dunk,dunk low,y2k,supreme,legit,legited,lc,LC,legit,legitcheck,NFC, legitedapp, legited.app, legited app, legit app, legit" />
        <meta name="author" content="Legited" />
        <meta property="og:title" content="Legited" />
        <meta property="og:description" content="Uwierzytelnianie oraz permanentny legit check na Twoje sneakersy za pomocą tagów NFC" />
        <meta property="og:image" content="../../assets/monogram.svg" />
        <meta property="og:url" content="https://legited.app" />
        <meta property='og:site_name' content='Legited'/>
        <meta name="twitter:title" content="Legited" />
        <meta name="twitter:description" content="Uwierzytelnianie oraz permanentny legit check na Twoje sneakersy za pomocą tagów NFC" />
        <meta name="twitter:image" content="../../assets/monogram.svg" />
        <meta name="twitter:card" content="summary_large_image" />
       </Helmet>
    )
}