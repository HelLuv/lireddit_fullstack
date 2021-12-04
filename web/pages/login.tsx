import * as React from 'react';
import {
  Box,
  Button,
} from '@chakra-ui/react'
import {Form, Formik} from 'formik';
import Wrapper from "./components/Wrapper";
import InputField from "./components/InputField";
import {useUser_LoginMutation, useUser_RegisterMutation} from "../utils/generated/graphql";
import toErrorMap from "../utils/services/toErrorMap";
import {useRouter} from "next/router";


interface LoginProps {
}


const Login: React.FC<LoginProps> = ({}) => {
  const [{data, error, stale}, login] = useUser_LoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant={'small'}>
      <Formik initialValues={{username: '', password: ''}} onSubmit={async (values, {setErrors}) => {
        const response = await login({...values});
        if (response.data?.userLogin.errors) {
          setErrors(toErrorMap(response.data.userLogin.errors))
        } else if (response.data?.userLogin.user) {
          await router.push('/');
        }
        return login({...values})
      }}>
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
            <Button type={"submit"} mt={4} isLoading={isSubmitting} colorScheme={'teal'}>Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
};

export default React.memo(Login);
