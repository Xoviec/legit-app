export const ItemAuthPassed = ({data, authDate}) => {


    const getDate = () =>{
        
        var a = new Date(authDate * 1);
        var months = ['Sty','Lut','Mrz','Kw','Maj','Cz','Lip','Sier','Wrz','Paź','Lis','Gr'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;

    }

    return(
        <div className="item-auth-passed">
            <h1>Zweryfikowano pomyślnie!</h1>
            <div className="auth-data">
                <p>Data weryfikacji: {getDate()}</p>
                <p className="verified-item-id">ID: {data?.id}</p>
            </div>
            <div className="auth-item">
                <div className="image">
                    <img src={data?.image} alt="verified item" />
                </div>
                <div className="auth-item-info">
                    <p className="verified-item-name">{data?.name}</p>
                    <p className="verified-item-sku">{data?.sku}</p>
                    <p className='verified-item-registered'>Zarejestrowane <span className='register-date'>{data?.legited_at.slice(0, 10).split('-').reverse().join('.')}</span></p>
                </div>
 
            </div>
      
    
        </div>
    )
}