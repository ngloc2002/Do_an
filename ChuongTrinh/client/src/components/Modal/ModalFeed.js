//MDB5
import {
    MDBBtn,
    MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle, MDBTextArea,
} from 'mdb-react-ui-kit';
//CKEditor
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//React
import { useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate, useSearchParams } from 'react-router-dom';
//Toastify
import notify from '../Toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Firestore
//Local
import './Modal.scss';
//Redux
import { useDispatch } from 'react-redux';
import { addFeed } from '../../redux/actions/feedAction';

function ModalFeed({ modalAdd, setModalAdd, modalUpdate, setModalUpdate, toggleShow, modalType, idArticle }) {
    const [name, setName] = useState('');
    const [embedCode, setEmbedCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const inputField = useRef();
    const pageParam = searchParams.get('page');

    let dispatch = useDispatch();

    const resetInputModal = () => {
        setName('');
        setEmbedCode('');
    };


    const handleSubmit = async () => {
        setLoading(true);
        if (!name) {
            setLoading(false);
            notify('warning', 'Vui lòng nhập đủ các giá trị');
            return;
        }

        const data = {
            name,
            embedCode,
        };

        const res = await dispatch(addFeed(data, pageParam));

        notify(res.type, res.message);
        setLoading(false);
        setModalAdd(!modalAdd);
        resetInputModal();
        inputField.current.value = null;
    };

    return (
        <MDBModal
            show={modalAdd || modalUpdate}
            setShow={modalType === 'Add' ? setModalAdd : setModalUpdate}
            tabIndex="-1"
        >
            <MDBModalDialog
                style={{
                    margin: '4rem auto',
                }}
            >
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>{modalType === 'Add' ? 'Thêm feed' : ''}</MDBModalTitle>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput
                            placeholder="Nhập tên feed"
                            label="Tên feed"
                            type="text"
                            value={name}
                            name="name"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />

                        <p style={{ marginTop: '20px' }}>Embed code</p>
                        <MDBTextArea
                            placeholder="Embed code"
                            label="Embed code"
                            type="textArea"
                            value={embedCode}
                            name="embedCode"
                            onChange={(e) => {
                                setEmbedCode(e.target.value);
                            }}

                        />

                    </MDBModalBody>

                    <MDBModalFooter>
                        <MDBBtn
                            color="danger"
                            onClick={() => {
                                toggleShow(modalType);
                            }}
                        >
                            Hủy
                        </MDBBtn>

                        <MDBBtn onClick={handleSubmit} color="success" disabled={loading}>
                            <div style={{ minWidth: '60px' }}>
                                {loading ? <AiOutlineLoading3Quarters className="loading" /> : 'Thêm mới'}
                            </div>
                        </MDBBtn>

                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
            {(modalAdd || modalUpdate) && <ToastContainer />}
        </MDBModal>
    );
}

export default ModalFeed;
