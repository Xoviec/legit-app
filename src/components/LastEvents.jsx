import { MyAvatar } from "../shared/Avatar"

export const LastEvents = ({list}) =>{


    console.log(list)
    return(
        <aside>
            {/* <p className="ranking-title">
                Ranking Uzytkowników
            </p> */}
            {
                list?.map((user, i)=>(
                    <div className="ranking-card">
                        <MyAvatar user={list[i]}/>
                        <div className="card-right">
                            <p className="register-info">{user.nickname}</p>
                            <p className="register-time">{user.itemAmount} przedmiotów</p>
                        </div>

                    </div>
                ))
            }

        </aside>
    )
}