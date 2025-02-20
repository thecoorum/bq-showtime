import { Suspense } from "react";

import { LoginForm } from "./form";

const LoginPage = () => (
  <Suspense>
    <LoginForm />
  </Suspense>
);

export default LoginPage;
