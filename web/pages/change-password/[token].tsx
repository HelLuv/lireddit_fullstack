import * as React from 'react';
import {NextPage} from "next";
import {withUrqlClient} from "next-urql";
import createUrqlClient from "../../utils/services/createUrqlClient";
import {Form, Formik} from "formik";
import toErrorMap from "../../utils/services/toErrorMap";
import InputField from "../components/InputField";
import {Alert, AlertIcon, Box, Button, Link} from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import {useRouter} from "next/router";
import {useChangePasswordMutation} from '../../utils/generated/graphql';
import NextLink from "next/link";

const ChangePassword: NextPage<{ token: string }> = ({token}) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = React.useState('');

  return (
    <Wrapper variant={'small'}>
      <Formik
        initialValues={{newPassword: ""}}
        onSubmit={async (values, {setErrors}) => {
          console.log(values);
          const response = await changePassword({newPassword: values.newPassword, token});
          console.log("Response => ", response);
          if (response.data?.changePassword.errors) {
            setErrors(toErrorMap(response.data.changePassword.errors));
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            await router.push("/login");
          }
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <Box mt={4}>
              <InputField name="newPassword" placeholder="New Password" label="New Password" type="password"/>
            </Box>
            {
              tokenError ?
                <Alert mt={2} status='error'>
                  <AlertIcon/>
                  {tokenError}
                  <NextLink href="/forgot-password">
                    <Link ml="auto">Go forgot it again</Link>
                  </NextLink>
                </Alert>
                :
                null
            }
            <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Update Password</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
};

ChangePassword.getInitialProps = ({query}) => {
  return {
    token: query.token as string,
  };
};


export default withUrqlClient(createUrqlClient)(ChangePassword)