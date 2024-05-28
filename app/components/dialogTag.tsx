import { Button, ConfigProviderProps } from "antd";

type SizeType = ConfigProviderProps['componentSize'];
type ButtonType = 'primary' | 'dashed' | 'link' | 'text' | 'default' | undefined;

const ButtonCustom = ({
  icon,
  text,
  sizes,
  type,
  className,
  //Event
  onClick
}: Readonly<{
  icon?: React.ReactNode;
  text: string;
  sizes?: SizeType;
  type?: ButtonType;
  className?: string;
  onClick?: any;
}>) => {

  const handleClick = () => {

  }

  return (
    <Button
      className={className}
      type={type ? type : 'primary'}
      icon={icon}
      size={sizes ? sizes : 'large'}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

export default ButtonCustom;
