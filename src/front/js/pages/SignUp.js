import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Context } from "../store/appContext";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SignUp = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, message: "", success: false });

  const validationSchema = Yup.object({
    name: Yup.string().matches(/^[a-zA-Z\s]+$/, "⚠ Name should contain only letters!").required("⚠ Name is required!"),
    email: Yup.string().email("⚠ Please enter a valid email!").required("⚠ Email is required!"),
    password: Yup.string().min(6, "⚠ Password must be at least 6 characters!").required("⚠ Password is required!"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "⚠ Passwords do not match!").required("⚠ Confirm Password is required!"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      const success = await actions.signup(values.name, values.email, values.password);
      if (success) {
        setModal({ show: true, message: "Cuenta creada exitosamente. Redirigiendo...", success: true });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setModal({ show: true, message: "Error al crear la cuenta. Inténtalo de nuevo.", success: false });
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-5 signup-card">
        <h2 className="text-center mb-4">Create an Account</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" placeholder="Your name" {...formik.getFieldProps("name")} />
            {formik.touched.name && formik.errors.name && <p className="text-danger mt-1">{formik.errors.name}</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" placeholder="Your email" {...formik.getFieldProps("email")} />
            {formik.touched.email && formik.errors.email && <p className="text-danger mt-1">{formik.errors.email}</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" placeholder="Your password" {...formik.getFieldProps("password")} />
            {formik.touched.password && formik.errors.password && <p className="text-danger mt-1">{formik.errors.password}</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm your password" {...formik.getFieldProps("confirmPassword")} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-danger mt-1">{formik.errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={formik.isSubmitting || !formik.isValid}>
            Sign Up
          </button>
        </form>

        <div className="text-center">
          <p className="mb-0">Already have an account?</p>
          <button className="btn btn-link text-primary" onClick={() => navigate("/login")}>Log In</button>
        </div>
      </div>

      <Modal show={modal.show} onHide={() => setModal({ ...modal, show: false })} centered>
        <Modal.Body className={`text-center ${modal.success ? "text-success" : "text-danger"}`}>
          {modal.message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal({ ...modal, show: false })}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUp;
