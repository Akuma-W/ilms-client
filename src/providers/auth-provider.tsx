"use client";

import { userService } from "@/services/user.service";
import { User } from "@/types/user.type";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  setUser: () => {},
  fetchUser: async () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await userService.getProfile();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false);
    };

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
