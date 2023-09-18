/* eslint-disable react/prop-types */
import { useLogin } from "../persons/custom-hooks";

export const LoginForm = ({ notifyError, setToken }) => {
  const { inputs, handleChange, handleSubmit } = useLogin({
    notifyError,
    setToken,
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username{" "}
          <input
            name="username"
            value={inputs.username}
            onChange={handleChange}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
