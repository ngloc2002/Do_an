//Local
import CartItem from '../../../components/CartItem';
import empty from '../../../assets/icon/emptyorder.png';
import Style from './Cart.scss';
import Loading from '../../../components/Loading';
//React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { MDBBtn } from 'mdb-react-ui-kit';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { FaChevronRight } from 'react-icons/fa';
//Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notify from '../../../components/Toast';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { cartChange, getCartProduct } from '../../../redux/actions/headerAction';
//Other
import classNames from 'classnames/bind';
import request from '../../../utils/request';

const cx = classNames.bind(Style);

function Cart() {
    localStorage.getItem('cart') ?? localStorage.setItem('cart', JSON.stringify([]));
    const [product, setProduct] = useState('');
    const [preload, setPreload] = useState(true);

    useEffect(() => {
        const getProductDetail = async () => {
            const res = await request.get(`/products`, {
                params: {
                   limit: '100',
                },
            });
            setProduct(res.data.products);
            setPreload(false);
        };
        getProductDetail();
    }, []);
    const [render, setRender] = useState(true);

    let products = useSelector((state) => state.headerState.cartProducts);
    const cartQuantity = useSelector((state) => state.headerState.cartQuantity);
    const user = useSelector((state) => state.headerState.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const listCartProduct = JSON.parse(localStorage.getItem('cart'));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const deleteProduct = async (id) => {
        const _listCartProduct = listCartProduct.filter((product) => {
            return product.id !== id;
        });
        await dispatch(getCartProduct(_listCartProduct.map((product) => product.id)));
        localStorage.setItem('cart', JSON.stringify(_listCartProduct));
        dispatch(cartChange());
    };

    const increaseQty = (id) => {
        let quantity = listCartProduct.filter((item) => {
            return item.id === id;
        })[0].quantity;
        quantity++;

        let product = listCartProduct.filter((product) => {
            return product.id === id;
        });

        let [_product] = product;
        _product.quantity = quantity;

        const index = listCartProduct.indexOf(...product);
        if (index !== -1) {
            listCartProduct[index] = _product;
        }
        localStorage.setItem('cart', JSON.stringify(listCartProduct));
        setRender(!render);
    };

    const decreaseQty = (id) => {
        let quantity = listCartProduct.filter((item) => {
            return item.id === id;
        })[0].quantity;
        quantity--;
        if (quantity === 0) {
            deleteProduct(id);
            return;
        }

        let product = listCartProduct.filter((product) => {
            return product.id === id;
        });

        let [_product] = product;
        _product.quantity = quantity;

        const index = listCartProduct.indexOf(...product);
        if (index !== -1) {
            listCartProduct[index] = _product;
        }
        localStorage.setItem('cart', JSON.stringify(listCartProduct));
        setRender(!render);
    };

    useEffect(() => {
        const getProduct = async () => {
            await dispatch(getCartProduct(listCartProduct.map((product) => product.id)));
            setPreload(false);
        };
        getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartQuantity]);

    const TotalPrice =
        listCartProduct.length > 0
            ? products.reduce((total, product) => {
                let _quantity = listCartProduct.filter((item) => {
                    return item.id === product.id;
                })[0].quantity;

                return total + product.price * _quantity;
            }, 0)
            : 0;
    const handlePayment = async () => {
        if (products.length === 0) {
            notify('warning', 'Đơn hàng đang trống !');
            return;
        }
        const getUserID = await request.get('/user/detail', {
            params: {
                email: user.email,
            },
        });
        const userID = getUserID.data.user.id;

        const order = {
            user_id: userID,
            status: 0,
            total: TotalPrice,
        };

        const check=()=>{
            let check = true;
            listCartProduct.forEach((productId) => {
            const item = product.filter((item) => item.id === productId.id)[0];
            if (item.quantity < productId.quantity) {
                notify('error', `Sản phẩm ${item.name} không đủ số lượng !`);
                check= false;
            }
            });
            return check;
        }
        console.log('👉 check: ', check());
        if (!check()) return;
        await request.post('/order/add', order).then((res) => {
            listCartProduct.forEach((detail) => {
                const orderDetail = {
                    order_id: res.data.result.id,
                    product_id: detail.id,
                    price: products.filter((item) => item.id === detail.id)[0].price * detail.quantity,
                    quantity: detail.quantity,
                };
                request.post('/orderDetail/add', orderDetail);
            });
            notify(res.data.type, res.data.message);
        });

        localStorage.setItem('cart', JSON.stringify([]));
        dispatch(cartChange());

        setTimeout(() => {
            navigate('/order');
        }, 3000);
    };
    return (
        <>
            {preload && <Loading />}
            <div className="container page-content">
                <section className={cx('section-content padding-y')}>
                    <div className={cx('container cart')}>
                        <div className={cx('row')}>
                            <h4>Giỏ hàng ({products.length}) </h4>
                            <main className={cx('main')}>
                                {products.length > 0 ? (
                                    <>
                                        {' '}
                                        {products.map((product, index) => {
                                            return (
                                                <CartItem
                                                    data={product}
                                                    key={index}
                                                    quantity={
                                                        listCartProduct.length > 0 &&
                                                        listCartProduct.filter((item) => {
                                                            return item.id === product.id;
                                                        })[0].quantity
                                                    }
                                                    deleteProduct={() => {
                                                        deleteProduct(product.id);
                                                    }}
                                                    increaseQty={() => {
                                                        increaseQty(product.id);
                                                    }}
                                                    decreaseQty={() => {
                                                        decreaseQty(product.id);
                                                    }}
                                                />
                                            );
                                        })}
                                    </>
                                ) : (
                                    <div className={cx('empty-cart')}>
                                        <img src={empty} alt="empty" />
                                        <h5>Giỏ hàng đang trống</h5>
                                    </div>
                                )}

                                <div className={cx('alert alert-success mt-3')}>
                                    <span className={cx('icontext')}>
                                        <i className={cx('icon text-success fa fa-truck')}></i> Giao nhanh miễn phí
                                        trong vòng 2-4 ngày
                                    </span>
                                </div>
                            </main>
                            <aside className={cx('aside')}>
                                <div className={cx('card  mb-3')}>
                                    <div className={cx('body')}>
                                        <label className="cart-label">
                                            <HiOutlineShoppingCart size={22} />
                                            Đơn hàng
                                        </label>
                                        <div className={cx('dlist-align')}>
                                            <p>Tổng cộng:</p>
                                            <dd className={cx('text-right h6')}>
                                                <div>
                                                    <NumericFormat
                                                        value={TotalPrice}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={' VNĐ'}
                                                    />
                                                </div>
                                            </dd>
                                        </div>
                                        <select className="form-select" aria-label="Default select example">
                                            <option selected>COD</option>
                                            <option disabled={true} value="1">Bank</option>
                                        </select>
                                        <hr></hr>
                                        <MDBBtn className={cx('w-100 cart-btn')} onClick={handlePayment}>
                                            <span style={{ marginRight: '12px' }}>Đặt hàng</span>
                                            <FaChevronRight />
                                        </MDBBtn>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
                <ToastContainer className={cx('custom-Toast')} />
            </div>
        </>
    );
}

export default Cart;
