import Style from './Feed.module.scss';
import SkeletonLoading from '../ProductItem/SkeletonLoading';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import request from '../../utils/request';
import classNames from 'classnames/bind';
import CustomButton from './CustomButton';
import { InstagramEmbed } from 'react-social-media-embed';

const cx = classNames.bind(Style);

function Feed({ title }) {
    const [feed, setFeed] = useState([]);
    useEffect(() => {
        request.get('/feed').then((res) => {
            setFeed(res.data?.data);
        });
    }, []);
    const getLink=(code='')=>{
        const regex = /data-instgrm-permalink="([^"]*)"/;
        const match = code.match(regex);
        return match ? match[1] : 'https://www.instagram.com/p/CUbHfhpswxt/';
    }
    const renderFeed = () => {
        return !feed?.length ?
            Array.from(Array(10)).map((item) => <SkeletonLoading width="95%" />)
            :
                feed?.map((item) =>
                <div id={'custom_feed'} style={{padding: '0 10px'}}>
                    <InstagramEmbed captioned={false} url={getLink(item?.embedCode)} />
                </div>);
    };
    return (
        <div
            style={{
                position: 'relative',
                marginTop: '16px',
            }}
        >
            <Carousel
                additionalTransfrom={0}
                arrows
                autoPlaySpeed={3000}
                centerMode={false}
                className={cx('carousel')}
                containerClass="container"
                customLeftArrow={<CustomButton type="left" />}
                customRightArrow={<CustomButton type="right" />}
                dotListClass=""
                draggable
                focusOnSelect={false}
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                pauseOnHover
                autoPlay
                infinite
                renderArrowsWhenDisabled={false}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                partialVisible={false}
                responsive={{
                    desktop: {
                        breakpoint: {
                            max: 3000,
                            min: 1200,
                        },
                        items: 3,
                        partialVisibilityGutter: 15,
                    },
                    tablet: {
                        breakpoint: {
                            max: 1199,
                            min: 992,
                        },
                        items: 3,
                        partialVisibilityGutter: 30,
                    },
                    tabletSM: {
                        breakpoint: {
                            max: 989,
                            min: 767,
                        },
                        items: 2,
                        partialVisibilityGutter: 30,
                    },
                    mobile: {
                        breakpoint: {
                            max: 767,
                            min: 0,
                        },
                        items: 2,
                        partialVisibilityGutter: 30,
                    },
                }}
                rewind={false}
                rewindWithAnimation={false}
                rtl={false}
                shouldResetAutoplay={true}
                showDots={false}
                sliderClass=""
                slidesToSlide={1}
                swipeable
            >
                {renderFeed()}
            </Carousel>
        </div>
    );
}

export default Feed;
