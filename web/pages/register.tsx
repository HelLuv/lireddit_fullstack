import * as React from 'react';
import {
  Box,
  Button,
} from '@chakra-ui/react'
import {Form, Formik} from 'formik';
import Wrapper from "./components/Wrapper";
import InputField from "./components/InputField";
import {useUser_RegisterMutation} from "../utils/generated/graphql";
import toErrorMap from "../utils/services/toErrorMap";
import {useRouter} from "next/router";


interface RegisterProps {
}


const Register: React.FC<RegisterProps> = ({}) => {
  const [{data, error, stale}, register] = useUser_RegisterMutation();
  const router = useRouter();

  return (
    <Wrapper variant={'small'}>
      <Formik initialValues={{username: '', password: ''}} onSubmit={async (values, {setErrors}) => {
        const response = await register({...values});
        if (response.data?.userRegister.errors) {
          setErrors(toErrorMap(response.data.userRegister.errors))
        } else if (response.data?.userRegister.user) {
          await router.push('/');
        }
        return register({...values})
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
            <Button type={"submit"} mt={4} isLoading={isSubmitting} colorScheme={'teal'}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
};

export default React.memo(Register);
