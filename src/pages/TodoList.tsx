import React from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Todo, todoConverter } from "../models/Todo";
import { auth, db } from "../app";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useCollectionData } from "react-firebase-hooks/firestore";

const TodoInput = styled.input`
  width: 90%;
`;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "400px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement(document.getElementById("root") as HTMLElement);

export default function TodoList() {
  const [todos, dataLoading, dataError] = useCollectionData<Todo>(
    collection(db, "todos").withConverter(todoConverter)
  );
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Todo>();
  const openModal = () => {
    setOpen(true);
    setValue("name", "");
    setValue("description", "");
    setValue("date", new Date());
    setValue("images", []);
  };
  const closeModal = () => {
    setOpen(false);
  };
  const addTodo = async (data: Todo) => {
    setOpen(false);
    const ref = doc(collection(db, "todos")).withConverter(todoConverter);
    await setDoc(ref, data);
  };
  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (dataLoading) {
    return (
      <div>
        <p>Initialising Data...</p>
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
  if (dataError) {
    return (
      <div>
        <p>Error: {dataError.toString()}</p>
      </div>
    );
  }
  if (!user) {
    // 未ログイン時はログイン画面へ遷移する
    navigate("/");
  }
  const todoTrs =
    todos === undefined
      ? []
      : todos?.map((todo, index) => {
          return (
            <tr key={index}>
              <td>{todo.name}</td>
              <td>{todo.date.toISOString()}</td>
              <td>{todo.description}</td>
            </tr>
          );
        });
  return (
    <div>
      {todoTrs.length === 0 ? (
        <span>登録なし</span>
      ) : (
        <table>
          <thead>
            <tr>
              <th>名前</th>
              <th>日付</th>
              <th>説明</th>
            </tr>
          </thead>
          <tbody>{todoTrs}</tbody>
        </table>
      )}
      <button type="button" onClick={openModal}>
        NEW Todo
      </button>
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form onSubmit={handleSubmit(addTodo)}>
          <div>
            <div>
              <TodoInput
                placeholder="name"
                {...register("name", { required: true })}
              />
              {errors.name && <span>required</span>}
            </div>
            <div>
              <TodoInput
                placeholder="description"
                {...register("description")}
              />
            </div>
            <div>
              <TodoInput
                type="datetime-local"
                {...register("date", {
                  valueAsDate: true,
                })}
              />
            </div>
            <div>
              <TodoInput
                type="hidden"
                {...register("images", {
                  setValueAs: () => [],
                })}
              />
            </div>
          </div>
          <input type="submit" />
        </form>
      </Modal>
    </div>
  );
}
