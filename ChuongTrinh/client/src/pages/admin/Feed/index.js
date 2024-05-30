import Title from '../../../components/Title';
import React, { useEffect, useState } from 'react';
import request from '../../../utils/request';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigateSearch } from '../../../CustomHook';
import notify from '../../../components/Toast';
import {
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalFooter,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
} from 'mdb-react-ui-kit';
import { AiFillDelete, AiFillEye } from 'react-icons/ai';
import Tippy from '@tippyjs/react';
import ReactPaginate from 'react-paginate';
import { ToastContainer } from 'react-toastify';
import { InstagramEmbed } from 'react-social-media-embed';
import './Feed.scss';
import ModalFeed from '../../../components/Modal/ModalFeed';
import { deleteFeeds } from '../../../redux/actions/feedAction';

function Feed() {
    const [feed, setFeed] = useState({});

    const [modalAdd, setModalAdd] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [showModal, setShowModel] = useState(false);
    const [feedToShow, setFeedToShow] = useState(null);
    const [searchResult, setSearchResult] = useState('');
    const [currentPage, setCurrentPage] = useState('');
    const [searchCount, setSearchCount] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [render, setRender] = useState(false);
    let dispatch = useDispatch();
    let navigate = useNavigateSearch();
    const name = searchParams.get('name');
    const page = searchParams.get('page');

    let pageSize = 4;

    const totalCategoy = useSelector((state) => state.articleState.totalFeed);
    let pageCount;

    if (searchResult) {
        pageCount = Math.ceil(searchCount / pageSize);
    } else {
        pageCount = Math.ceil(totalCategoy / pageSize);
    }

    const toggleShow = (typeModal) => {
        switch (typeModal) {
            case 'Add':
                setModalAdd(!modalAdd);
                break;
            default:
                return;
        }
    };

    const handleDelete = (id) => {
        setTimeout(async () => {
            if (window.confirm('Bạn có muốn xóa feed này ?')) {
                const res = await dispatch(deleteFeeds(id, page));
                setRender(true);
                notify(res.type, res.message);
            }
        }, 500);
    };

    const handlePageClick = async (e) => {
        const currentPage = e.selected + 1;
        if (searchResult) {
            navigate('/admin/feed', { name: name, page: currentPage || 1 });
        } else {
            navigate('/admin/feed', { page: currentPage });
        }
    };
    const getLink=(code='')=>{
        const regex = /data-instgrm-permalink="([^"]*)"/;
        const match = code.match(regex);
        return match ? match[1] : 'https://www.instagram.com/p/CUbHfhpswxt/';
    }
    useEffect(() => {
        request.get('/feed').then((res) => {
            setFeed(res.data);
        });
    }, [render, modalAdd]);
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
        return (
            <div id='feed_table'>
                <Title name="Danh sách feed" />
                <div className="action">
                    <MDBBtn
                        rounded
                        onClick={() => {
                            toggleShow('Add');
                        }}
                    >
                        Thêm feed
                    </MDBBtn>
                </div>
                <div className="content">
                    <MDBTable >
                        <MDBTableHead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Feed embed</th>
                                <th scope="col">
                                   Name
                                </th>
                                <th scope="col">Ngày tạo</th>
                                <th scope="col" style={{ textAlign: 'center' }}>
                                    Hành động
                                </th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {feed?.data?.length < 1 ? (
                                <tr className="text-center">
                                    <td colSpan="7">
                                        <div style={{ padding: '12px 0' }}>Không tìm thấy dữ liệu tương ứng</div>
                                    </td>
                                </tr>
                            ) : (
                                feed?.data?.map((feed) => {
                                    return (
                                        <tr key={feed.id}>
                                            <td>{feed.id}</td>
                                            <td>
                                                <div id={"custom_feed"} style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <InstagramEmbed captioned={false} url={getLink(feed?.embedCode)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                <p className="fw-500 mb-1">{feed.name}</p>
                                                </div>
                                            </td>

                                            <td>{formatDate(feed.createdAt)}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div className="d-flex justify-content-center">
                                                    <Tippy content="Chi tiết" placement="top">
                                                        <div>
                                                            <MDBBtn
                                                                color="link"
                                                                rounded
                                                                size="sm"
                                                                onClick={() => {
                                                                    setShowModel(true);
                                                                    setFeedToShow(feed);
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
                                                                    handleDelete(feed.id);
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
                <MDBModal
                    show={showModal}
                    tabIndex="-1"
                >
                    <MDBModalDialog
                        style={{
                            margin: '4rem auto',
                        }}
                    >
                        <MDBModalContent>
                            <MDBModalBody>
                                <div style={{ display: 'flex', justifyContent:'center'}}>
                                    <InstagramEmbed url={getLink(feedToShow?.embedCode)} />
                                </div>
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn
                                    onClick={() => {
                                        setShowModel(false);
                                    }}
                                >
                                    Close
                                </MDBBtn>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                    {(modalAdd || modalUpdate) && <ToastContainer />}
                </MDBModal>
                <ModalFeed
                    idArticle={1}
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

export default Feed;
