import React from 'react'
import { Input } from "antd";

export type Props = {
  value: string,
  refs?: any,
  size?: 'small' | 'middle' | 'large'
}

export default function InputComponent(props: Props) {
  const {value, refs, size} = props
  return (
    <Input
      value={value}
      ref={refs}
      size={size || "large"}
    />
  )
}
