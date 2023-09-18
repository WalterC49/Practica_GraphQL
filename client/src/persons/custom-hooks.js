/* eslint-disable react-hooks/exhaustive-deps */
import {
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { ALL_PERSONS, FIND_PERSON } from "./graphql-queries";
import { useEffect, useState } from "react";
import { CREATE_PERSON, EDIT_NUMBER, LOGIN } from "./graphql-mutations";
import { PERSON_ADDED } from "./graphql-subscriptions";

export const usePersons = () => {
  const result = useQuery(ALL_PERSONS);
  return result;
};

export const useFindPerson = () => {
  // useLazyQuery [0] function to call the query
  // useLazyQuery [1] the results
  const [getPerson, result] = useLazyQuery(FIND_PERSON);
  const [person, setPerson] = useState(null);

  const showPerson = (name) => {
    getPerson({
      variables: {
        nameToSearch: name,
      },
    });
  };

  useEffect(() => {
    if (result.data) {
      setPerson(result.data.findPerson);
    }
  }, [result]);

  const clearPerson = () => {
    setPerson(null);
  };

  return { person, showPerson, clearPerson };
};

export const useCreatePerson = ({ notifyError }) => {
  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
  });

  const [createPerson] = useMutation(CREATE_PERSON, {
    /* refetchQueries: [{ query: ALL_PERSONS }], */
    onError: (error) => {
      notifyError(error.graphQLErrors[0].message);
    },
    // manually updating cache
    /* update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_PERSONS });
      store.writeQuery({
        query: ALL_PERSONS,
        data: {
          ...dataInStore,
          allPersons: [...dataInStore.allPersons, response.data.addPerson],
        },
      });
    }, */
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputs.phone) delete inputs.phone;
    createPerson({
      variables: {
        ...inputs,
      },
    });

    setInputs({
      name: "",
      phone: "",
      street: "",
      city: "",
    });
  };

  return { inputs, handleChange, handleSubmit };
};

export const useChangeNumber = () => {
  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
  });

  const [editNumber] = useMutation(EDIT_NUMBER);
  // para que graphql actualice el estado que se muestres en la UI
  // hay que devolverle el id, y los atributos que quieres ver cambiados

  const handleSubmit = (e) => {
    e.preventDefault();

    editNumber({
      variables: {
        ...inputs,
      },
    });
    setInputs({
      name: "",
      phone: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  return { inputs, handleChange, handleSubmit };
};

export const useLogin = ({ notifyError, setToken }) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => notifyError(error.graphQLErrors[0].message),
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
    }
  }, [result.data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login({
      variables: {
        ...inputs,
      },
    });

    setInputs({
      username: "",
      password: "",
    });
  };

  return { inputs, handleChange, handleSubmit };
};

export const useUser = () => {
  const client = useApolloClient();
  const [token, setToken] = useState(
    () => !!localStorage.getItem("user-token")
  );

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };
  return { token, setToken, logout };
};

export const useSubscriptions = () => {
  const updateCache = (cache, query, addedPerson) => {
    const uniqByName = (a) => {
      let seen = new Set();
      return a.filter((item) => {
        let k = item.name;
        return seen.has(k) ? false : seen.add(k);
      });
    };

    cache.updateQuery(query, ({ allPersons }) => {
      return {
        allPersons: uniqByName(allPersons.concat(addedPerson)),
      };
    });
  };

  useSubscription(PERSON_ADDED, {
    onData: ({ data, client }) => {
      const addedPerson = data.data.personAdded;

      updateCache(client.cache, { query: ALL_PERSONS }, addedPerson);
    },
  });
};

export const useErrorMessage = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 10000);
  };

  return { notify, errorMessage };
};
