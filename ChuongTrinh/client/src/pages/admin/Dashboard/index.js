import Title from '../../../components/Title';
import Style from './Dashboard.module.scss';
import classNames from 'classnames/bind';
import { TbReportMoney } from 'react-icons/tb';
import { BsCartCheck, BsBoxSeam } from 'react-icons/bs';
import { HiUserGroup } from 'react-icons/hi';
import BarChart from '../../../components/BarChart';
import { useEffect, useState } from 'react';
import request from '../../../utils/request';

const cx = classNames.bind(Style);
function Dashboard() {
    const [dashboard, setDashboard] = useState({});

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    useEffect(() => {
        request.get('/dashboard').then((res) => {
            setDashboard(res.data.result);
        });
    }, []);
    function shortenName(name, maxLength = 20) {
        return name.length > maxLength ? name.substring(0, maxLength - 3) + '...' : name;
    }
    const data1 = {
        labels: dashboard?.productLowest?.map((product) => product?.name?.length>10 ?shortenName(product?.name):product?.name) || [],
        datasets: [
            {
                label: 'Số lượng đã bán',
                data: dashboard?.productLowest?.map((product) => product?.buyturn) || [],
                backgroundColor: 'rgb(144,96,177)',
            },
            {
                label: 'Số lượng còn',
                data: dashboard?.productLowest?.map((product) => product?.quantity) || [],
                backgroundColor: 'rgb(96,142,237)',
            },
        ],
    }; const data2 = {
        labels: dashboard?.productHighest?.map((product) => product?.name?.length>10 ?shortenName(product?.name):product?.name) || [],
        datasets: [
            {
                label: 'Số lượng đã bán',
                data: dashboard?.productHighest?.map((product) => product?.buyturn) || [],
                backgroundColor: 'rgb(144,96,177)',
            },
            {
                label: 'Số lượng còn',
                data: dashboard?.productHighest?.map((product) => product?.quantity) || [],
                backgroundColor: 'rgb(96,142,237)',
            },
        ],
    };

    return (
        <div className={cx("dashboard")}>
            <Title name="Thống kê cửa hàng" />

            <div className="content">
                <div className={cx('content')}>
                    <div className={cx('header')}>
                        <div className={cx('order', 'item')}>
                            <div className={cx('icon')}>
                                <BsCartCheck size={28} />
                            </div>
                            <div className={cx('info')}>
                                <p>Tổng số đơn hàng</p>
                                <p>{dashboard.totalOrder}</p>
                            </div>
                        </div>
                        <div className={cx('revenue', 'item')}>
                            {' '}
                            <div className={cx('icon')}>
                                <TbReportMoney size={28} />
                            </div>
                            <div className={cx('info')}>
                                <p>Tổng số doanh thu</p>
                                <p>{formatCurrency(dashboard.revenue)}</p>
                            </div>
                        </div>
                        <div className={cx('product', 'item')}>
                            {' '}
                            <div className={cx('icon')}>
                                <BsBoxSeam size={28} />
                            </div>
                            <div className={cx('info')}>
                                <p>Sản phẩm đang bán</p>
                                <p>{dashboard.totalProduct}</p>
                            </div>
                        </div>
                        <div className={cx('user', 'item')}>
                            <div className={cx('icon')}>
                                <HiUserGroup size={28} />
                            </div>
                            <div className={cx('info')}>
                                <p>Tổng số người dùng </p>
                                <p>{dashboard.totalUser}</p>
                            </div>
                        </div>
                    </div>

                    <div className={cx('chart')}>
                        <Title name="Sản phẩm bán chạy" />
                        <BarChart data={data2}/>
                    </div>
                    <div className={cx('chart')}>
                        <Title name="Sản phẩm bán chậm" />
                        <BarChart data={data1}/>
                    </div>
                    <div className={"pe-5"}><br/></div><div className={"pe-5"}><br/></div>
                    <div>demo</div>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;
