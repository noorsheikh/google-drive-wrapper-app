import { useContext } from "react";
import { AuthContext } from "../context";

const Login = () => {
  const { login } = useContext(AuthContext);

  return (
    <div className="container mx-auto place-items-center py-32 text-center">
      <button
        className="px-4 py-2 border rounded-sm flex flex-row gap-2 items-center"
        onClick={() => login()}
      >
        <img
          src="https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B"
          height={20}
          width={20}
        />
        <p>Sign in with Google</p>
      </button>
    </div>
  );
};

export default Login;
