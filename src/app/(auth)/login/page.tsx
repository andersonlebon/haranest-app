import React, { Suspense } from 'react';
import { login } from "../actions";
import LoginForm from "@/components/auth/login";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm login={login} />
    </Suspense>
  );
}
