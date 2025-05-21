import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import styles from "./LoginModal.module.scss";
import { loginUser } from "../../../services/authService";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();


  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      navigate("/teachers"); 
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>Log In</h2>
        <p className={styles.subtitle}>
          Welcome back! Please enter your credentials to access your account and continue your search for a teacher.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

          <input type="email" placeholder="Email" {...register("email")} className={styles.input} />

          {errors.password && <p className={styles.error}>{errors.password.message}</p>}

          <input type="password" placeholder="Password" {...register("password")} className={styles.input} />

          <button type="submit" className={styles.button}>Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
