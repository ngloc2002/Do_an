//Local
import Carousel from '../../../components/Carousel';
import BrandCarousel from '../../../components/BrandCarousel/BrandCarousel';
import banner from '../../../assets/img/banner4.webp';
import ship from '../../../assets/img/ship.webp';
import './Home.scss';
import ProductCarousel from '../../../components/ProductCarousel/ProductCarousel';
import SkeletonLoading from '../../../components/ProductItem/SkeletonLoading';
import { useEffect, useState } from 'react';
import request from '../../../utils/request';
import { useNavigateSearch } from '../../../CustomHook';
import { MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog } from 'mdb-react-ui-kit';
import CategorySkeleton from './CategorySkeleton';
import ArticleItem from '../../../components/ArticleItem';
import { HiChevronDoubleRight } from 'react-icons/hi';
import Feed from '../../../components/Feed/Feed';

function Home() {
    let showFirstNotification;
    if (localStorage.getItem('notified')) {
        showFirstNotification = false;
    } else {
        localStorage.setItem('notified', true);
        showFirstNotification = true;
    }
    const [categories, setCategories] = useState([]);
    const [news, setNews] = useState([]);
    const [preload, setPreload] = useState(true);
    const [loading, setLoading] = useState(true);
    const [basicModal, setBasicModal] = useState(showFirstNotification);
    const navigate = useNavigateSearch();

    useEffect(() => {
        request
            .get('/categories', {
                params: {
                    getAll: 'true',
                },
            })
            .then((res) => {
                setCategories(res.data.categories);
                setPreload(false);
            });
    }, []);
    useEffect(() => {
        request
            .get('/articles', {
                params: {
                    limit: 6,
                },
            })
            .then((res) => {
                setNews(res.data.articles);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const renderCategories = () => {
        if (categories.length > 0 && !preload) {
            return categories.map((category, index) => {
                return (
                    <div className="col" key={'category-item' + index}>
                        <div
                            className="category-item"
                            onClick={() => {
                                navigate('/search/category', {
                                    type: category.name,
                                });
                            }}
                        >
                            <div className="category-image">
                                <img src={category.image} alt="categoryimage" width={60} height={60} />
                            </div>
                            <div className="category-title">{category.name}</div>
                        </div>
                    </div>
                );
            });
        }
        if (categories.length === 0) {
            if (preload) {
                return Array.from(Array(10)).map((item) => <CategorySkeleton />);
            } else {
                return <div className="w-100 mt-5 text-center">Có lỗi sảy ra vui lòng thử lại sau!</div>;
            }
        }
    };
    const renderArticles = () => {
        if (news.length > 0 && !loading) {
            return news.map((article, index) => {
                return (
                    <div className="col-lg-4 col-md-6 mt-4" key={'ArticleItem' + index}>
                        <ArticleItem data={article} />
                    </div>
                );
            });
        }
        if (news.length === 0) {
            if (loading) {
                return Array.from(Array(6)).map((item) => (
                    <div className="col-lg-4 col-md-6 mt-4">
                        <SkeletonLoading />
                    </div>
                ));
            } else {
                return <div className="w-100 mt-5 text-center">No article was found. Please try again</div>;
            }
        }
    };
    return (
        <>
            <div className="container page-content">
                <div className="row">
                    <div className="col col-lg-12 col-xl-9 ">
                        <Carousel />
                    </div>
                    <div className="col col-xl-3 d-none d-sm-none d-md-none d-lg-none d-xl-block">
                        <div className="policy-list">
                            <div className="policy-item">
                                <p>Bảo hành tận tâm</p>
                                <span>WOW luôn cam kết sẽ hỗ trợ khách hàng mọi vấn đề.</span>
                            </div>
                            <div className="policy-item">
                                <p>Miễn phí vận chuyển</p>
                                <span>100% đơn hàng đều được miễn phí vận chuyển khi thanh toán trước.</span>
                            </div>
                            <div className="policy-item">
                                <p>Đổi trả 1-1 hoặc hoàn tiền</p>
                                <span>Nếu phát sinh lỗi hoặc sản phẩm chưa đáp ứng được nhu cầu.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <img
                    src={ship}
                    alt="banner"
                    className="banner"
                    onClick={() => {
                        navigate('/notification');
                    }}
                />
                <Feed />
                <h5 style={{ fontWeight: '700', marginBottom: '0', marginTop: '8px' }}>Thương hiệu nổi bật</h5>
                <BrandCarousel />
                <ProductCarousel key={'ProductCarousel_Laptop'} title="Laptop" />
                <ProductCarousel key={'ProductCarousel_Tablet'} title="Máy tính bảng" />

                <div className="category-home">
                    <h5 style={{ fontWeight: '700', marginBottom: 0 }}>Tất cả danh mục</h5>
                    <div className="row row-cols-3 row-cols-md-5 row-cols-lg-5">{renderCategories()}</div>
                </div>
                <div className={'home-title'}>
                    <h5>Tin công nghệ</h5>
                    <div
                        onClick={() => {
                            navigate('/articles');
                        }}
                    >
                        Xem thêm
                        <HiChevronDoubleRight />
                    </div>
                </div>
                <div className="row">{renderArticles()}</div>

                <img src={banner} alt="banner" className="banner" style={{ marginTop: '12px' }} />
            </div>
        </>
    );
}

export default Home;
