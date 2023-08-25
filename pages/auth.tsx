import Input from "@/components/input"

import axios from "axios";

import { useCallback, useState } from "react";

import { getSession, signIn } from 'next-auth/react';
import { useRouter } from "next/router";

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Auth = () => {

  const router = useRouter(); // next, pages router hook

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [variant, setVariant] = useState('login'); //variant toggle entre login y register

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []);

  const login = useCallback(async () => {
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/' // a donde me redirecciona
      });

      router.push('/'); // me manda a path root
    } catch (error) {
      console.log(error);
    }
  }, [email, password, router]); // funcion para hacer login, hago dependency array para el callback

  const register = useCallback(async () => {
    try {
      await axios.post('/api/auth/register', {
        // el men no necesitaba coloar el /api, yo si, no se porque
        email,
        name,
        password
      }); // registro

      login(); //luego de register, hago login
    } catch (error) {
      console.log(error); //error en register
    }
  }, [email, name, password, login]); //funcion para hacer register, hago dependency array para el callback

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav>

        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === 'login' ? 'Sign in' : 'Register'}
              {/* muestro texto para login o para register */}
            </h2>

            <div className="flex flex-col gap-4">
              {variant === 'register' && (
                <Input
                  id="name"
                  type="text"
                  label="Username"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              )}

              {/* muestro o no el username si estoy o no registrado */}

              <Input
                id="email"
                type="email"
                label="Email address or phone number"
                value={email} //muetro state
                onChange={(e: any) => setEmail(e.target.value)} //meto en el state el valor escrito en input
              />
              <Input
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
            </div>

            <button onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
              {variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            {/* texto cambia segun el toggle, al igual el la función que llamo en el onclick */}

            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              <div onClick={() => signIn('google', { callbackUrl: '/' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <FcGoogle size={32} />
              </div>
              <div onClick={() => signIn('github', { callbackUrl: '/' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <FaGithub size={32} />
              </div>
            </div>

            {/* UI para auth con google o github*/}

            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}

              <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
              .
              {/* clickeando el span toggle entre lgoin y register */}
            </p>

          </div>
        </div>
      </div>



    </div>
  )
}

export default Auth
