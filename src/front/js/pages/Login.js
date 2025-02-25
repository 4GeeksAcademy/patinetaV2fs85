import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Login = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [modal, setModal] = useState({ show: false, message: "", success: false });

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("⚠ Please enter a valid email!")
            .required("⚠ Email is required!"),
        password: Yup.string()
            .min(8, "⚠ Password must be at least 6 characters!")
            .required("⚠ Password is required!"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            const result = await actions.login(values.email, values.password);
            
            if (result.success) {
                setModal({ show: true, message: "Login exitoso. Redirigiendo...", success: true });
                setTimeout(() => navigate("/"), 2000);
            } else {
                setModal({ show: true, message: result.msg, success: false }); // 🔹 Muestra el mensaje del backend
            }
        },
    });

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-5 login-card">
                <h2 className="text-center mb-4">Log In</h2>
                <form onSubmit={formik.handleSubmit}>
                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                            placeholder="Your email"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="invalid-feedback">{formik.errors.email}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                            placeholder="Your password"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="invalid-feedback">{formik.errors.password}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        Log In
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Don't have an account? <Link to="/signup">Sign up here</Link>
                </p>
            </div>

            <Modal show={modal.show} onHide={() => setModal({ ...modal, show: false })} centered>
                <Modal.Body className={`text-center ${modal.success ? "text-success" : "text-danger"}`}>
                    {modal.message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModal({ ...modal, show: false })}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Login;
