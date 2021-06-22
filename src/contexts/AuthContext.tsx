import { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firebase } from '../services/firebase';

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
  }
  
  type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthContextProviderProps = {
      children: ReactNode
  }

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if(user) {
            const { displayName, photoURL, uid} =  user;
    
            if (!displayName || !photoURL ) {
              throw new Error('Mising information from Google account');
            }
    
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL,
            })
          }
        })
    
        return () => {
          unsubscribe();
        }
      }, [])
    
      const [user, setUser] = useState<User>();
    
      const signInWithGoogle = async () => {
    
        const provider = new firebase.auth.GoogleAuthProvider();
    
        const result = await auth.signInWithPopup(provider);
    
        if(result.user) {
          const { displayName, photoURL, uid} =  result.user;
    
          if (!displayName || !photoURL ) {
            throw new Error('Mising information from Google account');
          }
    
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
          })
        }
        
      }
      
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}