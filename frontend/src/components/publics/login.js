import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Roles from './Roles';
import styles from '../publics/login.module.css';
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notValid, setNotValid] = useState(false);
  const [validationKey, setValidationKey] = useState(0);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("isAuth");
    if (isAuth && isAuth !== null) {
      const user = JSON.parse(localStorage.getItem("user"));
      Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_URL}/login`, { email: email, password: password }).then((response) => {
      if (response.status === 200) {
        const user = response.data;
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuth", true);
        Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
      } else {
        setNotValid(true);
        setValidationKey(prevKey => prevKey + 1);
      }
    }).catch(() => {
    });
  };

  return <div className={styles.page_container}>
    <div className={styles.container}>

    <div className={styles.logo}></div>

    <div className={styles.container_div}>
      <form className={styles.form} onSubmit={handleSubmit}>

        <div>
          <input type="email" placeholder='אימייל' autoComplete="email" className={styles.input_email} onChange={(e) => { setEmail(e.target.value) }} />
        </div>

        <div className={styles.password_div}>
          <div className={styles.input_container}>
            <input id='password' autoComplete="current-password" type={show ? "password" : "text"} placeholder='סיסמה' className={styles.input} onChange={(e) => { setPassword(e.target.value) }} />
            {password.length > 0 ? (
              show ? (
                <BiSolidShow
                  className={styles.show_password}
                  onClick={(e) => setShow(!show)}
                ></BiSolidShow>
              ) : (
                <BiSolidHide
                  className={styles.show_password}
                  onClick={(e) => setShow(!show)}
                ></BiSolidHide>
              )
            ) : null}
          </div>
        </div>

        {
          notValid ? <p key={validationKey} className={styles.validation_p}>שם משתמש או סיסמא שגויים</p> : null
        }

        <button className={styles.btn} type="submit">התחברות</button>
        
        <div className={styles.register_div}>
          <label className={styles.register_label}>להרשמה</label>
          <button className={styles.register_btn} onClick={() => navigate('/register')}>לחצו כאן</button>
        </div>
        

        <div className={styles.blueBack}></div>

      </form>
    </div>

    </div>
  </div>
    
};

export default Login;
