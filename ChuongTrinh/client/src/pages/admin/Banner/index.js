//Local
import Title from '../../../components/Title';
import notify from '../../../components/Toast';
import ModalDiscount from '../../../components/Modal/ModalDiscount';
import { useNavigateSearch } from '../../../CustomHook';
//React
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSearchParams } from 'react-router-dom';
import { MDBBadge, MDBInput, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
//Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { deleteDiscount, getDiscounts, searchDiscount } from '../../../redux/actions/discountAction';
//Icon
import { ImSearch } from 'react-icons/im';
import { AiFillCloseCircle, AiFillEye, AiFillDelete } from 'react-icons/ai';
//Tippy
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function Banner() {
    const [modalAdd, setModalAdd] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [discountID, setDiscountID] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchResult, setSearchResult] = useState('');
    const [currentPage, setCurrentPage] = useState(''); // Reset paginate
    const [searchCount, setSearchCount] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [render, setRender] = useState(false);

    let dispatch = useDispatch();
    let navigate = useNavigateSearch();

    const name = searchParams.get('name');
    const page = searchParams.get('page');

    useEffect(() => {
        if (name) {
            const getSearchResult = async () => {
                const res = await dispatch(searchDiscount(name, page));

                setSearchCount(res.availableDiscount);
                setSearchResult(res.result);

                setCurrentPage(parseInt(page) - 1);
            };
            getSearchResult();
        } else {
            setSearchResult('');
            setSearchText('');
            dispatch(getDiscounts(page));
            setCurrentPage(parseInt(page) - 1 > 0 ? parseInt(page) - 1 : 0); //Vì lần đầu page = null, null - 1 = -1
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, page, render]);

    let dataRender;
    let pageSize = 4;

    const discounts = useSelector((state) => state.discountState.discounts);
    const totalDiscount = useSelector((state) => state.discountState.totalDiscount);
    let pageCount;

    if (searchResult) {
        pageCount = Math.ceil(searchCount / pageSize);
    } else {
        pageCount = Math.ceil(totalDiscount / pageSize);
    }

    const toggleShow = (typeModal) => {
        switch (typeModal) {
            case 'Add':
                setModalAdd(!modalAdd);
                break;
            case 'Update':
                setModalUpdate(!modalUpdate);
                break;
            default:
                return;
        }
    };

    const handleDelete = (id) => {
        setTimeout(async () => {
            if (window.confirm('Bạn có muốn xóa khuyến mãi này ?')) {
                const res = await dispatch(deleteDiscount(id, page));
                setRender(!render);
                notify(res.type, res.message);
            }
        }, 500);
    };

    const handleSearch = async () => {
        if (!searchText) {
            return;
        }
        navigate('/admin/banner', { name: searchText, page: 1 });
    };

    const handleValueSearch = (e) => {
        const value = e.target.value;
        if (value.startsWith(' ')) {
            return;
        }
        setSearchText(value);
    };

    const handlePageClick = async (e) => {
        const currentPage = e.selected + 1; // +1 vì e.selected lấy từ 0
        if (searchResult) {
            navigate('/admin/banner', { name: name, page: currentPage || 1 });
        } else {
            navigate('/admin/banner', { page: currentPage });
        }
    };

    const formatDate = (date) => {
        var d = new Date(date),
            hour = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            year = d.getFullYear();
        return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
    };

    if (searchResult) {
        dataRender = searchResult;
    } else {
        dataRender = discounts;
    }

    return (
        <div>
            <Title name="Danh sách khuyến mãi" />
            <div className="action">
                <MDBInput
                    placeholder="Nhập tên banner ..."
                    label="Tìm kiếm"
                    type="text"
                    value={searchText}
                    onChange={(e) => {
                        handleValueSearch(e);
                    }}
                >
                    {searchText && (
                        <AiFillCloseCircle
                            size={24}
                            style={{ marginRight: '8px', color: 'rgb(169 167 167)', cursor: 'pointer' }}
                            onClick={() => {
                                setSearchText('');
                            }}
                        />
                    )}
                    <MDBBtn onClick={handleSearch} style={{ padding: '10px 16px', display: 'flex' }}>
                        <ImSearch size={16} />
                    </MDBBtn>
                </MDBInput>

                <MDBBtn
                    rounded
                    onClick={() => {
                        toggleShow('Add');
                    }}
                >
                    Thêm khuyến mãi
                </MDBBtn>
            </div>
            <div className="content">
                <MDBTable align="middle">
                    <MDBTableHead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Tên khuyến mãi</th>
                            <th scope="col">Ảnh khuyến mãi</th>
                            <th scope="col">Ngày tạo</th>
                            <th scope="col">Ngày cập nhật</th>
                            <th scope="col" style={{ textAlign: 'center' }}>
                                Hành động
                            </th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {dataRender.length < 1 ? (
                            <tr className="text-center">
                                <td colSpan="7">
                                    <div style={{ padding: '12px 0' }}>Không tìm thấy dữ liệu tương ứng</div>
                                </td>
                            </tr>
                        ) : (
                            dataRender.map((discount) => {
                                return (
                                    <tr key={discount.id}>
                                        <td>{discount.id}</td>
                                        <td style={{ maxWidth: '285px' }}>
                                            <div className="d-flex align-items-center">
                                                <p className="fw-500 mb-1">{discount.name}</p>
                                            </div>
                                        </td>
                                        <td style={{ height: '75px' }}>
                                            <img src={discount.image} alt="product" style={{ width: '100px' }} />
                                        </td>
                                        <td>{formatDate(discount.createdAt)}</td>
                                        <td>{formatDate(discount.updatedAt)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="d-flex justify-content-center">
                                                <Tippy content="Chi tiết" placement="top">
                                                    <div>
                                                        <MDBBtn
                                                            color="link"
                                                            rounded
                                                            size="sm"
                                                            onClick={() => {
                                                                toggleShow('Update');
                                                                setDiscountID(discount.id);
                                                            }}
                                                        >
                                                            <AiFillEye size={20} color="rgb(110 108 108)" />
                                                        </MDBBtn>
                                                    </div>
                                                </Tippy>
                                                <Tippy content="Xóa" placement="top">
                                                    <div>
                                                        <MDBBtn
                                                            color="link"
                                                            rounded
                                                            size="sm"
                                                            onClick={() => {
                                                                handleDelete(discount.id);
                                                            }}
                                                        >
                                                            <AiFillDelete size={20} color="rgb(110 108 108)" />
                                                        </MDBBtn>
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </MDBTableBody>
                </MDBTable>
            </div>
            <ReactPaginate
                className="pagination justify-content-center"
                nextLabel="Sau >"
                forcePage={currentPage}
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel="< Trước"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />
            <ModalDiscount
                idDiscount={discountID}
                modalType={modalUpdate ? 'Update' : 'Add'}
                modalAdd={modalAdd}
                setModalAdd={setModalAdd}
                modalUpdate={modalUpdate}
                setModalUpdate={setModalUpdate}
                toggleShow={toggleShow}
            />
            <ToastContainer />
        </div>
    );
}

export default Banner;
