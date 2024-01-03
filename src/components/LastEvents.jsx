import { MyAvatar } from "../shared/Avatar"
import { Link } from 'react-router-dom';

export const LastEvents = ({list}) =>{


    return(
        <aside>

            {
                list &&

                list.map((user, i)=>(
                    <div className="ranking-card">
                        <MyAvatar user={list[i]}/>
                        <div className="card-right">
                        <Link to={`/Users/${user.nickname}`}>
                            <p className="register-info">{user?.nickname}</p>
                        </Link>
                            <p className="register-time">{user?.itemAmount} przedmiotów</p>
                        </div>

                    </div>
                ))
            }

        </aside>
    )
}