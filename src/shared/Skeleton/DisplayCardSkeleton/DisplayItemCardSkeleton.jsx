import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export const DisplayItemCardSkeleton = ({num}) =>{

    return(
        <div className='item item-skeleton' key={num}>
            <div className="image">
            <Skeleton width={200} height={100}  />
            </div>
            <p className='item-name'>
            <Skeleton width={180}/>
            </p> 
            <p className='item-registered'>
            <Skeleton width={240}/>
            </p>
        </div>
    )
}