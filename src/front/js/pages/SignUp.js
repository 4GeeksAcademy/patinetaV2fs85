import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Context } from "../store/appContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/loginform.css";

const SignUp = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "⚠ Name should contain only letters!")
      .required("⚠ Name is required!"),
    email: Yup.string()
      .email("⚠ Please enter a valid email!")
      .required("⚠ Email is required!"),
    password: Yup.string()
      .min(6, "⚠ Password must be at least 6 characters!")
      .required("⚠ Password is required!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "⚠ Passwords do not match!")
      .required("⚠ Confirm Password is required!"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const success = await actions.signup(values.name, values.email, values.password);
      if (success) navigate("/login");
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-5 signup-card">
        <h2 className="text-center mb-4">Create an Account</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Your name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="text-danger mt-1">{formik.errors.name}</p>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-danger mt-1">{formik.errors.email}</p>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Your password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-danger mt-1">{formik.errors.password}</p>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm your password"
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="text-danger mt-1">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Sign Up
          </button>

          <button type="button" className="btn btn-outline-secondary w-100 mb-3" onClick={() => navigate("/login")}>
            You already have an account? Log In
          </button>

          <button type="button" className="btn btn-outline-dark w-100" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
