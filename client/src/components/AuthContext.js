import { createContext } from 'react';

const authContext = createContext({
    auth: null, 
    setAuth:() => {},
});

export default authContext;

