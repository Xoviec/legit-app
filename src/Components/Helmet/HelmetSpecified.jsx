import { Helmet } from 'react-helmet';

export const HelmetSpecified = ({nickname, desc}) =>{

    return(

       <Helmet>
            <title>{nickname}</title>
            <meta name="description" content={desc} />
            <meta name="keywords" content="react, meta tags, seo, streetwear,yeezy,nike,adidas,jordan,jordan low,low,dunk,dunk low,y2k,supreme,legit,legited,lc,LC,legit,legitcheck,NFC" />
            <meta name="author" content={nickname} />
            <meta property="og:title" content={nickname} />
            <meta property="og:image" content="../../assets/monogram.svg" />
            <meta property="og:url" content={`https://legited.app/Users/${nickname}`} />
            <meta property="og:description" content={desc} />
            <meta property='og:site_name' content='Legited'/>
            <meta property='profile:username' content={nickname}/>
            <meta name="twitter:title" content={nickname} />
            <meta name="twitter:description" content={desc}/>
            <meta name="twitter:image" content="../../assets/monogram.svg" />
            <meta name="twitter:card" content="summary_large_image" />
       </Helmet>
    )
}