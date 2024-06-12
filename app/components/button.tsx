import { Button, ConfigProviderProps } from "antd";
import { Key } from "react";

type SizeType = ConfigProviderProps['componentSize'];
type ButtonType = 'primary' | 'dashed' | 'link' | 'text' | 'default' | undefined;

const ButtonCustom = ({
  icon,
  text,
  sizes,
  type,
  className,
  btnKey,
  isDisabled,
  isLoading,
  //Event
  evClick
}: Readonly<{
  icon?: React.ReactNode;
  text: string;
  sizes?: SizeType;
  type?: ButtonType;
  className?: string;
  btnKey?: Key;
  isDisabled?: boolean;
  isLoading?: boolean;
  evClick?: any;
}>) => {
  return (
    <Button
      className={className}
      type={type ? type : 'primary'}
      icon={icon}
      size={sizes ? sizes : 'large'}
      onClick={() => evClick()}
      disabled={isDisabled}
      key={btnKey}
      loading={isLoading}
    >
      {text}
    </Button>
  );
}

export default ButtonCustom;
