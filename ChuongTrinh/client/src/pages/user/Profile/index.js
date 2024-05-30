import './Profile.scss';
//React
import { useState } from 'react';
import { MDBBtn, MDBInput, MDBValidationItem } from 'mdb-react-ui-kit';
//Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Redux
import { useSelector } from 'react-redux';
//Other
import LogoWeb from '../../../assets/img/logoWeb.png';
import request from '../../../utils/request';
import notify from '../../../components/Toast';


function Profile() {

    const HandleSave = async () => {
        const data = {
            name: name||user?.name||'',
            address: address||user?.address||'',
            phone: phone||user?.phone||'',
            email: email||user?.email||'',
            password: password||user?.password||'',
        };
        const res = await request.put('/user/edit/' + user?.email, data);
        if (res.status === 200) {
            notify('success', res.message || 'Cập nhật thông tin thành công !');
            return {
                type: 'success',
                message: res.message,
            };
        } else {
            notify('error', res.message || 'Cập nhật thông tin thất bại !');
            return {
                type: 'error',
                message: res.message,
            };
        }
    }
    const user = useSelector((state) => state.headerState.user);
    const [email, setEmail] = useState(user?.email);
    const [password, setPassword] = useState(user?.password);
    const [name, setName] = useState(user?.name);
    const [address, setAddress] = useState(user?.address);
    const [phone, setPhone] = useState(user?.phone);
    console.log('👉 check: ', user)
    console.log('👉 check email: ', user?.email)
    return (
        <div className="container-fluid form-login">
            <div className="container">
                <section className="vh-100">
                    <div className="container-fluid h-custom">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-md-9 col-lg-6 col-xl-5">
                                <img src={LogoWeb} className="img-fluid" alt="logo"></img>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                                <div className="divider d-flex align-items-center my-4">
                                    <p className="text-center fw-500 mx-3 mb-0">Thông tin cá nhân</p>
                                </div>
                                <MDBValidationItem className="col-md-12 mb-4">
                                    <MDBInput
                                        onChange={(e) => setName(e.target.value)}
                                        value={name||user?.name||''}
                                        placeholder="Ex: Nguyen Van A"
                                        label="Họ tên"
                                        className="form-control-lg"
                                    />
                                </MDBValidationItem>
                                <MDBValidationItem className="col-md-12 mb-4">
                                    <MDBInput
                                        onChange={(e) => setAddress(e.target.value)}
                                        value={address||user?.address||''}
                                        placeholder="Ex: Ha noi"
                                        label="Địa chỉ"
                                        className="form-control-lg"
                                    />
                                </MDBValidationItem>
                                <MDBValidationItem className="col-md-12 mb-4">
                                    <MDBInput
                                        onChange={(e) => setPhone(e.target.value)}
                                        value={phone||user?.phone||''}
                                        placeholder="Ex: 0988-383-232"
                                        label="Số điện thoại"
                                        className="form-control-lg"
                                    />
                                </MDBValidationItem>

                                <MDBValidationItem className="col-md-12 mb-4">
                                    <MDBInput
                                        disabled={true}
                                        value={email||user?.email||''}
                                        label="Email"
                                        className="form-control-lg"
                                    />
                                </MDBValidationItem>

                                <MDBValidationItem className="col-md-12 mb-4">
                                    <MDBInput
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password||user?.password||''}
                                        placeholder="Nhập mật khẩu mới của bạn"
                                        label="Mật khẩu mới"
                                        type="password"
                                        className="form-control-lg"
                                    />
                                </MDBValidationItem>

                                <div className="text-center text-lg-start mt-4 pt-2">
                                    <MDBBtn
                                    className="btn-lg"
                                    onClick={() => {
                                        HandleSave();
                                    }}>
                                        Save
                                    </MDBBtn>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Profile;
