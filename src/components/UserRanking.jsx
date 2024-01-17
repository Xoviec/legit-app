import { MyAvatar } from "../shared/Avatar"
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Autoplay} from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/autoplay';
export const UserRanking = ({list}) =>{


    return(
        <aside>
            <Swiper
                autoplay={true}
                modules={[Autoplay]}
                autoplay={{delay: 3000}}
                breakpoints={{
                    300: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                        direction: 'horizontal',
                    },
                    600: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                        direction: 'horizontal',
                    },
                    811: {
                    slidesPerView: 7,
                    spaceBetween: 10,
                    direction: 'vertical'
                    },
                }}
                direction="horizontal"
            >

                {

                    list?.map((user, i)=>(

                        <SwiperSlide key={user.id}>
                            <div className={`ranking-card card-${i+1}`}>
                                <MyAvatar user={list[i]}/>
                                <div className="card-right">
                                <Link to={`/Users/${user.nickname}`}>
                                {/* <a href={`/Users/${user.nickname}`}> */}
                                    <p className="register-info">{user?.nickname}</p>
                                {/* </a> */}
                                </Link>
                                    <p className="register-time">{user?.itemAmount} przedmiotów</p>
                                </div>

                            </div>
                        </SwiperSlide>
                    ))
                    ||
                    null
                }
            </Swiper>
            
        </aside>
    )
}