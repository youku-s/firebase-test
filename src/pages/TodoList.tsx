import { getAuth } from "firebase/auth";

const auth = getAuth()

export default function TodoList() {
  const isSignIn = auth.currentUser ? true : false
  return (
    <div>
      {isSignIn && <span>ログイン中です：{auth.currentUser?.uid}</span>}
      {!isSignIn && <span>未ログイン</span>}
    </div>
  )
}