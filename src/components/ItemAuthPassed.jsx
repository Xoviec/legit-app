export const ItemAuthPassed = ({data, authDate}) => {


    const getDate = () =>{
        
        const a = new Date(authDate * 1);
        const months = ['Sty','Lut','Mrz','Kw','Maj','Cz','Lip','Sier','Wrz','Paź','Lis','Gr'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();
        const hour = a.getHours().toString().padStart(2, '0');
        const min = a.getMinutes().toString().padStart(2, '0');
        const sec = a.getSeconds().toString().padStart(2, '0');
        const time = date + '\xa0' + month + '\xa0' + year + '\xa0' + hour + ':' + min + ':' + sec ;
        return time;

    }

    return(
        <div className="item-auth-passed">
            <div className="verified-card">
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
                        <p className="verified-item-owner">Właściel: <span className="verified-item-owner-nickname">{data?.nickname}</span></p>
                        <p className='verified-item-registered'>Zarejestrowane <span className='register-date'>{data?.legited_at.slice(0, 10).split('-').reverse().join('.')}</span></p>
                    </div>
    
                </div>
            </div>

      
    
        </div>
    )
}