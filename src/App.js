import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
  } from 'react-router-dom';
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import ToDo from './components/ToDo';

registerLocale('uk', uk);

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<Navigate to="todo/home" />} />
                <Route path="todo/*" exac element={<ToDo />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;