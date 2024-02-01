import { useLocation } from 'react-router-dom';
import { ItemDialog } from '../Dialog/ItemDialog';



export const DisplayItemCard = ({item, notify, tradeError}) =>{

    const location = useLocation();


    return(
            <div className='item' key={item.id}>
                {
                    location.pathname === '/main' &&

                    <div className="item-hover-button">
                        <ItemDialog notify={notify} tradeError={tradeError} item={item}/>
                    </div>
                }
        
                <div className="image">
                    <img src={item.image} alt="" />
                </div>
                <p className='item-name'>{item.name}</p> 
                <p className='item-registered'>Zarejestrowane <span className='register-date'>{item.legited_at.slice(0, 10).split('-').reverse().join('.')}</span></p>
            </div>
        )
}