import './Table.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import * as Accordion from '@radix-ui/react-accordion';


export const Table = (props) =>{

    console.log(props)


    return(
        <>
        <Accordion.Root collapsible>
        <table>
            <thead >
                <tr className="table-row">
                    {
                        props?.columns?.map((column, columnIndex)=>(
                            <th key={columnIndex}>{column}</th>
                        )) 
                    
                    }
                </tr>
            </thead>
            <tbody>
                
                {
                    props?.items?.map((row, i)=>(

                        <Accordion.Item key={row.id} value={i} className='hmm' asChild>

                            <>

                            <Accordion.Trigger asChild>
                                <tr className="table-row">
                                    {
                                        props?.columns?.map((column, columnIndex)=>(
                                                <td key={columnIndex}>
                                                    {row[column]} 
                                                </td>
                                        ))
                                    }

                                </tr>
                            </Accordion.Trigger>
                                {
                                    row?.owners_history?.length > 1 && 
                                    row.owners_history.slice(0, -1).map((user)=>(

                                        <Accordion.Content className='accordion-content'  key={user.registerDate} asChild>
                                            <tr >
                                                <td>{user.ownerID}</td>
                                                <td>{user.registerDate}</td>
                                                {/* Poprzedni własciciel: {user.ownerID} od {user.registerDate} */}
                                            </tr>
                                        </Accordion.Content>

                                    ))
                                }

                            </>

                    </Accordion.Item>

                    ))
                    ||
                    Array.from(Array(20).keys()).map((num, skeletonIndex)=>(
                        <tr className="table-row" key={skeletonIndex}>
                        {
                            Array.from(Array(props?.columns.length).keys()).map((num, skeletonIndex)=>(
                                    <td key={skeletonIndex}>
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
                            <td>
                                <p>Strona {props?.currentPage} z {props?.maxPage}</p>
                                <button onClick={(()=>props.pagination(-1))}>{`<-`}</button>
                                <button onClick={(()=>props.pagination(1))}>{`->`}</button>
                            </td>

                        </tr>

                    }
            </tbody>
        </table>
        </Accordion.Root>
        </>
    )
}
