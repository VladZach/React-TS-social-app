import firebase from "firebase";
import React, { useContext, useState, useEffect, ReactChild } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext<null | Value>(null);

export function useAuth() {
  return useContext(AuthContext);
}

interface Props {
  children: ReactChild;
}

export interface Value {
  currentUser: firebase.User | null;
  signup: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  login: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
}

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<null | firebase.User>(null);
  //for initial loading of user
  const [loading, setLoading] = useState(true);

  function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  }
  //если я захочу использовать что-то кроме firebase, мне достаточно просто изменить эти методы
  //(ну и интерфейс, да)
  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  //надо ли всему этому присваивать типы явно?

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
