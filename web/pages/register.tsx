import * as React from 'react';
import {
  Box,
  Button,
} from '@chakra-ui/react'
import {Form, Formik} from 'formik';
import Wrapper from "./components/Wrapper";
import InputField from "./components/InputField";
import {useMutation} from "urql";


interface RegisterProps {
}

const USER_REGISTER_MUTATION = `
  mutation USER_REGISTER($username: String!, $password: String!){
    userRegister(input: {username: $username, password: $password}){
      user {
        id
        username
      }   
      errors{
        field
        message
      }
    }
  }
`

const Register: React.FC<RegisterProps> = ({}) => {
  const [{data, error, stale}, register] = useMutation(USER_REGISTER_MUTATION)
  return (
    <Wrapper variant={'small'}>
      <Formik initialValues={{username: 'admin', password: 'admin'}} onSubmit={values => {
        console.log(values);
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
