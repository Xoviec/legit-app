import './Table.css'

export const Table = (props) =>{

    console.log(props.items)

    if(props.pagination){
        props.pagination('ch8i')
    }

    return(
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
                        <tr className="table-row">
                            {
                                props?.columns?.map((column)=>(
                                        <td>
                                            {row[column]} 
                                        </td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
