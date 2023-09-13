'use client'

import React from 'react';
import { Button, Form, InputNumber } from 'antd';
import Segment from './segment';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

/** 
 * @param {Object} props - The component's props.
 * @param {import('antd').FormInstance} props.form - The form instance to associate with the SubmitButton.
 * @returns {JSX.Element} - The rendered JSX element.
 * */
const SubmitButton = ({ form }) => {
    const [submittable, setSubmittable] = React.useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            },
        );
    }, [values]);

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable}>
            Submit
        </Button>
    );
};

const App = () => {
    const [form] = Form.useForm();


    const onFinish = (values) => {
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <div className='flex h-screen flex-col w-full p-5 overflow-hidden'>
            <section className='h-[40%] flex justify-center items-center w-full'>
                <div className='min-w-[50%]'>
                    <Form
                        {...layout}
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                    >
                        <Form.Item name="register number" label="Register Number" rules={[{
                            required: true, type: 'number', min: 100000, max: 300000, message: 'Invalid Register number'
                        }]}>

                            <InputNumber style={{ width: '100%' }} name="reg_no" />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <SubmitButton form={form} />
                            <Button htmlType="button" onClick={onReset} className='m-1'>
                                Reset
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
            <section className='w-full h-[60%]'>
                <div className='mx-auto w-full h-full'>
                    <Segment />
                </div>
            </section>
        </div >
    );
};

export default App;