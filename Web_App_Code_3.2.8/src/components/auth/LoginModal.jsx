'use client'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import img from '../../assets/Images/Login.jpg'
import Image from "next/image";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from './ForgotPasswordForm'
import { BiUserCircle } from 'react-icons/bi'
import PhoneLogin from './PhoneLogin'
import { placeholderImage } from '@/utils/helpers'
import { useSelector } from 'react-redux'
import { checkIsLoginModalOpen } from '../store/reducers/helperReducer'
import { settingsSelector } from '../store/reducers/settingsReducer';
import { themeSelector } from '../store/reducers/CheckThemeReducer';
import { translate } from '@/utils/translation';

export default function LoginModal({ onClose = () => { } }) {

  const [mainModal, setMainModal] = useState(false);
  const [loginModal, setLoginModal] = useState(true)
  const [registerModal, setRegisterModal] = useState(false)
  const [phoneLogin, setPhoneLogin] = useState(false)
  const [forgotPassModal, setForgotPassModal] = useState(false)

  const [islogout, setIsLogout] = useState(false);

  const isLoginModalOpen = useSelector(checkIsLoginModalOpen);

  const darkThemeMode = useSelector(themeSelector);
  const settingsData = useSelector(settingsSelector);

  const darkLogo = settingsData?.data?.web_setting?.dark_header_logo
  const lightLogo = settingsData?.data?.web_setting?.light_header_logo

  const handleOpenLoginModal = () => {
    onClose()
    setLoginModal(true)
    setRegisterModal(false)
    setForgotPassModal(false)
    setPhoneLogin(false)
  }

  useEffect(() => {
    if (isLoginModalOpen) {
      setMainModal(true)
    }
  }, [isLoginModalOpen])


  return (
    <Dialog open={mainModal} onOpenChange={setMainModal}>
      <DialogTrigger asChild>
        <button aria-label="Login" className='commonBtn flexCenter gap-2 loginModalTriggerBtn' onClick={handleOpenLoginModal}><BiUserCircle size={23} />{translate('loginLbl')}</button>
      </DialogTrigger>

      <DialogContent className="loginModal bodyBgColor p-0 overflow-hidden">
        {/* the dialog title is added just for the removing console warning */}
        <DialogTitle className='hidden'></DialogTitle>
        <DialogDescription className='hidden'>Sign in to your Deeprab Media account.</DialogDescription>
        <div className="loginModalGrid grid grid-cols-1 lg:grid-cols-2">

          {/* Left Image Section */}
          <div className="loginModalVisual hidden lg:block relative after:content-[''] overflow-hidden after:absolute after:top-0 after:left-0 after:h-full after:w-full after:bg-[#0003]">
            <Image src={darkLogo || '/storage/logos/deeprab-logo-dark.svg'} height={0} width={0} alt="Deeprab Media" className="h-[50px] w-auto max-w-[180px] object-contain absolute top-8 left-8 z-[1]" onError={placeholderImage} loading='lazy' />
            <Image src={img} height={0} width={0} alt="login-img" className="h-full w-full object-cover commonRadius" onError={placeholderImage} loading='lazy' />
          </div>
          {
            loginModal &&
            <LoginForm setRegisterModal={setRegisterModal} setPhoneLogin={setPhoneLogin} setLoginModal={setLoginModal} setForgotPassModal={setForgotPassModal} setIsLogout={setIsLogout}
              setMainModal={setMainModal} />
          }

          {
            registerModal &&
            <RegisterForm setLoginModal={setLoginModal} setRegisterModal={setRegisterModal} />
          }

          {
            forgotPassModal &&
            <ForgotPasswordForm setForgotPassModal={setForgotPassModal} setLoginModal={setLoginModal} />
          }

          {
            phoneLogin &&
            <PhoneLogin setMainModal={setMainModal} mainModal={mainModal} />
          }

        </div>


      </DialogContent >
    </Dialog >
  );
}
