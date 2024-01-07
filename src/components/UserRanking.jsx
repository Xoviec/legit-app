import { MyAvatar } from "../shared/Avatar"
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Autoplay} from 'swiper/modules'

// Import Swiper styles
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
                    // width: 640,
                        slidesPerView: 1,
                        spaceBetween: 10,
                        direction: 'horizontal',
                    },
                    600: {
                        // width: 768,
                        slidesPerView: 2,
                        spaceBetween: 10,
                        direction: 'horizontal',
                    },
                    811: {
                    // height: auto,
                    slidesPerView: 7,
                    spaceBetween: 10,
                    direction: 'vertical'
                    },
                }}
                direction="horizontal"

            
            
            // onSlideChange={() => console.log('slide change')}
            // onSwiper={(swiper) => console.log(swiper)}
            >

                {
                    list &&

                    list.map((user, i)=>(

                        <SwiperSlide>
                            <div className={`ranking-card card-${i+1}`}>
                                <MyAvatar user={list[i]}/>
                                <div className="card-right">
                                <Link to={`/Users/${user.nickname}`}>
                                    <p className="register-info">{user?.nickname}</p>
                                </Link>
                                    <p className="register-time">{user?.itemAmount} przedmiotów</p>
                                </div>

                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            
        </aside>
    )
}