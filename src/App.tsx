import React from 'react';
import './App.css';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import { AuthProvider } from './contexts/auth/AuthProvider';
import MyRoutes from './components/MyRoutes';

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <AuthProvider>
        {/*<Routes>
          <Route path='/*' element={<Sistema />} />
          </Routes>*/}
        <MyRoutes />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
