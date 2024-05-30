import classNames from 'classnames/bind';
import Style from './Order.module.scss';
import { HiChevronDoubleRight } from 'react-icons/hi';
import { BiTimeFive } from 'react-icons/bi';
import { BsCheck2All, BsTruck } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import request from '../../../utils/request';
import { useNavigateSearch } from '../../../CustomHook';
import {
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalHeader,
    MDBModalTitle,
} from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import Loading from '../../../components/Loading';
import { Margin, usePDF, Options } from "react-to-pdf";

const cx = classNames.bind(Style);
const Order = () => {
    const [orders, setOrders] = useState([]);
    const [basicModal, setBasicModal] = useState(false);
    const [details, setDetails] = useState([]);
    const [preload, setPreload] = useState(true);

    const navigateSearch = useNavigateSearch();
    const user = useSelector((state) => state.headerState.user);
    const { toPDF, targetRef } = usePDF({
        method: "save",
        filename: "hoa_don_chi_tiet.pdf",
        page: { margin: Margin.MEDIUM },
    });
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    const formatDateCare = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear() + 2;

        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const toggleShow = () => setBasicModal(!basicModal);
    const getOrders = async () => {
        const getUserID = await request.get('/user/detail', {
            params: {
                email: user?.email,
            },
        });
        const userID = getUserID.data.user.id;
        const getOrders = await request.get('/order/search', {
            params: {
                user_id: userID,
            },
        });
        setOrders(getOrders.data.result);
        setPreload(false);
    };
    useEffect(() => {
        getOrders();
    }, [user]);

    const handleSeeDetail = async (orderID) => {
        const getOrderDetail = await request.get('/orderDetail/search', {
            params: {
                order_id: orderID,
            },
        });
        setDetails(getOrderDetail.data.result);
        toggleShow();
    };
    return (
        <>
            {preload && <Loading />}
            <div className="container">
                <div className={cx('content')}>
                    {orders?.length > 0 ? (
                        <>
                            <h4>Đơn hàng của tôi</h4>
                            {orders?.map((order) => {
                                return (
                                    <div className={cx('item')} key={order?.id}>
                                        <div className={cx('header')}>
                                            <div>
                                                <div className={cx('name')}>Đơn hàng #{order?.id}</div>
                                                <div className={cx('date')}>
                                                    Ngày đặt: {formatDate(order?.createdAt)}
                                                </div>
                                            </div>
                                            <div
                                                className={cx('status', {
                                                    handling: order?.status === 0,
                                                    handled: order?.status === 1,
                                                    shipping: order?.status === 2,
                                                })}
                                            >
                                                <span>
                                                    {order?.status === 0 && (
                                                        <>
                                                            <BiTimeFive size={18} />
                                                            Đang xử lí
                                                        </>
                                                    )}
                                                    {order?.status === 1 && (
                                                        <>
                                                            <BsCheck2All size={18} />
                                                            Đã xác nhận
                                                        </>
                                                    )}
                                                    {order?.status === 2 && (
                                                        <>
                                                            <BsTruck size={18} />
                                                            Đang giao hàng
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={cx('container')}>
                                            <div className={cx('image')}>
                                                <img src={order?.order_display?.Product?.image} alt="productt" />
                                            </div>
                                            <div className={cx('product')}>
                                                <div>
                                                    <p className={cx('product-name')}>
                                                        {order?.order_display?.Product.name}
                                                    </p>
                                                    <p className={cx('product-quantity')}>
                                                        Số lượng: {order?.order_display.quantity} x{' '}
                                                        {formatCurrency(order?.order_display?.Product.price)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className={cx('detail')}
                                                        onClick={() => {
                                                            handleSeeDetail(order?.id);
                                                        }}
                                                    >
                                                        Xem chi tiết <HiChevronDoubleRight />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <div className="fw-500">Bạn chưa có đơn hàng nào</div>
                    )}
                </div>
                <>
                    <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
                        <MDBModalDialog>
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>
                                        Chi tiết đơn hàng #{details[0] && details[0]?.order?.id}
                                    </MDBModalTitle>
                                </MDBModalHeader>
                                <MDBModalBody className={cx('body')}>
                                    <div ref={targetRef}>
                                        {details?.map((detail) => (
                                            <div
                                                style={{ cursor: 'pointer' }}
                                                className={cx('container')}
                                                onClick={() => {
                                                    navigateSearch('/detail', {
                                                        name: detail?.Product?.name,
                                                    });
                                                }}
                                            >
                                                <div className={cx('image')}>
                                                    <img src={detail?.Product?.image} alt="productt" />
                                                </div>
                                                <div className={cx('product')}>
                                                    <div>
                                                        <p className={cx('product-name')}>{detail?.Product?.name}</p>
                                                        <p className={cx('product-quantity')}>
                                                            Số lượng: {detail?.quantity} x{' '}
                                                            {formatCurrency(detail?.Product?.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className={cx('info')}>
                                            <div>
                                                Người nhận:<span>{user?.name}</span>
                                            </div>
                                            <div>
                                                Email đặt hàng:<span>{user?.email}</span>
                                            </div>
                                            <div>
                                                Số điện thoại:<span>{user?.phone}</span>
                                            </div>
                                            <div>
                                                Địa chỉ:<span>{user?.address}</span>
                                            </div>
                                            <div>
                                                Ngày đặt:{' '}
                                                <span>{details[0] && formatDate(details[0].Order.createdAt)}</span>
                                            </div>
                                            <div>
                                                Phương thức vận chuyển:<span>Ship COD</span>
                                            </div>
                                            <div className={"note-info"}>
                                                Thời hạn bảo hành:{' '}
                                                <span>{details[0] && formatDateCare(details[0].Order.updatedAt)}</span>
                                            </div>
                                            <div>
                                                <strong>Tổng tiền:</strong>
                                                <strong>{details[0] && formatCurrency(details[0].Order.total)} </strong>
                                            </div>
                                            <hr/>
                                        </div>
                                    </div>
                                    <div>
                                        <MDBBtn onClick={toPDF}>In hóa đơn</MDBBtn>
                                    </div>
                                </MDBModalBody>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                </>
            </div>
        </>
    );
};
export default Order;
