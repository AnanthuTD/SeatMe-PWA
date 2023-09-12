'use client'

import React from 'react';
import { Button, Form, InputNumber } from 'antd';
import Tab from './tabs';

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
                form.getFieldValue('reg_no') > 100000 && form.getFieldValue('reg_no') < 300000 ?
                    setSubmittable(true) : setSubmittable(false);
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
        <div className='flex h-screen justify-around items-center flex-col'>
            <section className='min-w-[50%]'>
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="register number" label="Register Number" rules={[{
                        required: true, type: 'number', validator: (rule, value) => { if (value < 100000 || value > 300000) return Promise.reject(`Invalid Register number`) }
                    }]} className='ml-2'>
                        <InputNumber  style={{width:'100%'}} name="reg_no" />
                    </Form.Item>

                    <Form.Item {...tailLayout}>

                        <SubmitButton form={form} />
                        <Button htmlType="button" onClick={onReset} className='m-1'>
                            Reset
                        </Button>

                    </Form.Item>
                </Form>
            </section>
            <section className='w-full'>
                <div className='mx-auto w-fit'>
                    <Tab/>
                </div>
            </section>
        </div >
    );
};

export default App;