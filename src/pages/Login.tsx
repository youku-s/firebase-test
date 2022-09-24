import { useForm } from "react-hook-form";
import styled from "styled-components";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { firebaseConfig } from "../config";
import { useNavigate } from "react-router-dom";

const WholeContainer = styled.div `
  height: 10em;
  display: flex;
  align-items: center;
  justify-content: center;
`
const FormContainer = styled.div `
  margin: 0;
`
const LoginTitle = styled.h3 `
  font-weight: bold;
`
const Message = styled.span `
  color: #F00;
`
const FormBlock = styled.div `
  margin-bottom: 1em;
`

type FormData = {
  email: string
  password: string
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function Login() {
  const [isLoginFailed, setIsLoginFailed] = useState(false)
  const navigate = useNavigate()
  const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const onSubmit = async (data: FormData) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then((credential) => {
      navigate("/list");
    }).catch((error) => {
      // some error handling
      setValue("email", "")
      setValue("password", "")
      setIsLoginFailed(true)
    })
  }

  return (
    <WholeContainer>
      <FormContainer>
        <LoginTitle>ログイン</LoginTitle>
        {isLoginFailed && <Message>ログインに失敗しました。</Message>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormBlock>
            <div>
              <input placeholder="email" {...register("email", { required: true })} />
              {errors.email && <Message>required</Message>}
            </div>
            <div>
              <input type="password" placeholder="password" {...register("password", { required: true })} />
              {errors.password && <Message>required</Message>}
            </div>
          </FormBlock>
          <input type="submit" />
        </form>
      </FormContainer>
    </WholeContainer>
  )
}
