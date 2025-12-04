"use client"
import React, { Suspense } from 'react';
import LoginForm from "@/components/auth/login";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
