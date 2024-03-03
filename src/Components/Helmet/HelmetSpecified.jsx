import { Helmet } from 'react-helmet';

export const HelmetSpecified = ({nickname, desc}) =>{

    return(

       <Helmet>
            <title>{nickname}</title>
            <meta name={desc} content="Uwierzytelnianie oraz permanentny legit check na Twoje sneakersy za pomocą tagów NFC" />
            <meta name="keywords" content="react, meta tags, seo, streetwear,yeezy,nike,adidas,jordan,jordan low,low,dunk,dunk low,y2k,supreme,legit,legited,lc,LC,legit,legitcheck,NFC" />
            <meta name="author" content={nickname} />
            <meta property="og:title" content="Legited" />
            <meta property="og:image" content="../../assets/monogram.svg" />
            <meta property="og:url" content="https://legited.app" />
            <meta name="twitter:title" content="Legited" />
            <meta name="twitter:description" content="Uwierzytelnianie oraz permanentny legit check na Twoje sneakersy za pomocą tagów NFC" />
            <meta name="twitter:image" content="../../assets/monogram.svg" />
            <meta name="twitter:card" content="summary_large_image" />
       </Helmet>
    )
}