import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Persons } from "./components/Persons";
import { PersonForm } from "./components/PersonForm";
import {
  useErrorMessage,
  usePersons,
  useSubscriptions,
  useUser,
} from "./persons/custom-hooks";
import { Notify } from "./components/Notify";
import { PhoneForm } from "./components/PhoneForm";
import { LoginForm } from "./components/LoginForm";

function App() {
  // 1st query loading true, no data
  // 2nd query loading false, data or error
  const { data, loading, error } = usePersons();
  const { errorMessage, notify } = useErrorMessage();
  const { token, setToken, logout } = useUser();
  useSubscriptions();

  if (error) return <span style="color:red">{error}</span>;

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>GraphQL + React</h1>
          <Persons persons={data.allPersons} />
        </>
      )}
      <Notify errorMessage={errorMessage} />
      {token ? (
        <button onClick={logout}>Cerrar Sesión</button>
      ) : (
        <LoginForm notify={notify} setToken={setToken} />
      )}
      <PersonForm notify={notify} />
      <PhoneForm />
    </>
  );
}

export default App;
