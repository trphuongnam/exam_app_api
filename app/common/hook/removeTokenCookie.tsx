import { useEffect } from "react";
import { useCookies } from "next-client-cookies";
import { useDispatch } from 'react-redux';
import { loginAction } from "@/app/stores/action/login";
import { useRouter } from "next/navigation";

const RemoveTokenCookieHook = () => {
  const cookie = useCookies();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    cookie.remove('token');
    dispatch(loginAction(false));
    router.push('/login');
  }, [])
}

export default RemoveTokenCookieHook;
