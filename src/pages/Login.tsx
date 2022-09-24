import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../app";
import { useAuthState } from "react-firebase-hooks/auth";

const WholeContainer = styled.div`
  height: 10em;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FormContainer = styled.div`
  margin: 0;
`;
const LoginTitle = styled.h3`
  font-weight: bold;
`;
const Message = styled.span`
  color: #f00;
`;
const FormBlock = styled.div`
  margin-bottom: 1em;
`;

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const login = (data: FormData) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        navigate("/list");
      })
      .catch(() => {
        setValue("email", "");
        setValue("password", "");
        setIsLoginFailed(true);
      });
  };
  const logout = () => {
    signOut(auth);
  };
  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error.toString()}</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }
  return (
    <WholeContainer>
      <FormContainer>
        <LoginTitle>ログイン</LoginTitle>
        {isLoginFailed && <Message>ログインに失敗しました。</Message>}
        <form onSubmit={handleSubmit(login)}>
          <FormBlock>
            <div>
              <input
                placeholder="email"
                {...register("email", { required: true })}
              />
              {errors.email && <Message>required</Message>}
            </div>
            <div>
              <input
                type="password"
                placeholder="password"
                {...register("password", { required: true })}
              />
              {errors.password && <Message>required</Message>}
            </div>
          </FormBlock>
          <input type="submit" />
        </form>
      </FormContainer>
    </WholeContainer>
  );
}
