import './Table.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export const Table = (props) =>{

    console.log(props)


    return(
        <>
        
        <table>
            <thead >
                <tr className="table-row">
                    {
                        props?.columns?.map((column)=>(
                            <td>{column}</td>
                        )) 
                    
                    }
                </tr>
            </thead>
            <tbody>
                {
                    props?.items?.map((row)=>(
                        <>
                        <tr className="table-row">
                            {
                                props?.columns?.map((column)=>(
                                        <td>
                                            {row[column]} 
                                        </td>
                                ))
                            }
                        </tr>
                            {
                                row?.owners_history?.length > 1 && 
                                row.owners_history.slice(0, -1).map((user)=>(
                                    <tr>Poprzedni własciciel: {user.ownerID} od {user.registerDate}</tr>
                                ))
                            }
                        </>
                    ))
                    ||
                    Array.from(Array(20).keys()).map((num)=>(
                        <tr className="table-row">
                        {
                            Array.from(Array(props?.columns.length).keys()).map((num)=>(
                                    <td>
                                        <Skeleton width={180}/>
                                    </td>
                            ))
                     
                        }
                    </tr>
                    ))
                }
                    {
                        props.pagination && 

                        <tr className="pagination-buttons">
                            <p>Strona {props?.currentPage} z {props?.maxPage}</p>
                            <button onClick={(()=>props.pagination(-1))}>{`<-`}</button>
                            <button onClick={(()=>props.pagination(1))}>{`->`}</button>
                        </tr>

                    }
            </tbody>
        </table>
        
        </>
    )
}
