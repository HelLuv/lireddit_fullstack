import * as React from 'react';
import {FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";
import {useField} from "formik";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

const InputField: React.FC<InputFieldProps> = ({label, size: _, ...props}) => {
  const [field, {error, touched}] = useField(props);
  return (
    <FormControl isInvalid={!!error && touched} isRequired={props.required}>
      <FormLabel htmlFor={props.name}>{label}</FormLabel>
      <Input
        {...field}
        {...props}
        values={field.value}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
};

export default React.memo(InputField);