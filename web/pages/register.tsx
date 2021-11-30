import * as React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
  Button,
} from '@chakra-ui/react'
import {Form, Formik, Field, FormikProps} from 'formik';
import Wrapper from "./components/Wrapper";
import InputField from "./components/InputField";


interface RegisterProps {

}

const Register: React.FC<RegisterProps> = ({}) => {
  const validateName = (value: string) => {
    let error;
    if (!value) {
      error = 'Name is required';
    } else if (value.toLowerCase() !== 'naruto') {
      error = "Jeez! You're not a fan 😱";
    }
    return error;
  }
  return (
    <Wrapper variant={'small'}>
      <Formik initialValues={{username: 'admin', password: 'admin'}} onSubmit={values => console.log(values)}>
        {({isSubmitting}) => (
          <Form>
            <InputField
              name={'username'}
              placeholder={'Enter your username'}
              label={'Username'}
              required={true}
            />
            <Box mt={4}>
              <InputField
                name={'password'}
                placeholder={'Enter your password'}
                label={'Password'}
                type={'password'}
                required={true}
              />
            </Box>
            <Button type={"submit"} mt={4} isLoading={isSubmitting} colorScheme={'teal'}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
};

export default React.memo(Register);
