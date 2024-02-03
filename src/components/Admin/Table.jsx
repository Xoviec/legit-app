export const Table = ({
    title,
    columns,
    items

}) =>{

    return(
        <table>
            <thead >
                <tr className="table-row">
                    {
                        columns.map((column)=>(
                            <td>{column}</td>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    items?.map((row)=>(
                        <tr className="table-row">
                            {
                                columns.map((column)=>(
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
