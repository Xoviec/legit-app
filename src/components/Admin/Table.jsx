import './Table.css'

export const Table = (props) =>{



    // console.log(props?.items)
     

    // props?.items?.sort(function(a, b) {
    //   var keyA = (a.name),
    //     keyB = (b.name);
    //   // Compare the 2 dates
    //   if (keyA < keyB) return -1;
    //   if (keyA > keyB) return 1;
    //   return 0;
    // });
    
    // console.log(props?.items);


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
