import React from 'react'
import { Input } from "antd";

export type Props = {
  value: string,
  refs?: any,
  size?: 'small' | 'middle' | 'large'
}

export default function InputPassword(props: Props) {
  const {value, refs, size} = props
  return (
    <Input.Password
      value={value}
      ref={refs}
      size={size || "large"}
    />
  )
}
