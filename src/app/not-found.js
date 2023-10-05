import React from 'react';
import { Button, Result } from 'antd';
import Link from 'next/link';
const App = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    // extra={}
  />
);
export default App;