"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    alert(error ? error.message : "Signup success");
  };

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    alert(error ? error.message : "Login success");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    alert("Logged out");
  };

  return (
    <div className="p-6 space-y-3">
      <input
        className="border p-2 w-full"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signup}>Sign up</button>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
