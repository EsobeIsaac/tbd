import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar.readonly")
    signInWithPopup(auth, provider).then((result) => {
      setAccessToken(result._tokenResponse.oauthAccessToken);
    });;
  };

  const logOut = () => {
    signOut(auth);
    setAccessToken(null)
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(currentUser)
      if(currentUser.uid) {
        console.log(currentUser)
        const getToken = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/business/token`, {...currentUser});
        localStorage.setItem("token", getToken.data.result)
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, accessToken, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
