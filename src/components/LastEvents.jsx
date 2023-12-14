export const LastEvents = ({list}) =>{


    console.log(list)
    return(
        <aside>
            <p className="ranking-title">
                Ranking Uzytkowników
            </p>
            {
                list?.map((user)=>(
                    <div className="ranking-card">
                        <p className="register-info">{user.userNickname}</p>
                        <p className="register-time">{user.itemAmount} przedmiotów</p>
                    </div>
                ))
            }

        </aside>
    )
}