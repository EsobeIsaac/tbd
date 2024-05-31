'use client'
import React, {useEffect, useState} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UserAuth } from './context/AuthContext';
import Link from 'next/link';


function Business() {

  const params = useParams();
    
  const { user, googleSignIn, logOut } = UserAuth();
  const navigation = useRouter()

  const handleSignIn = async () => {
    try {
      await googleSignIn();
      if(user) {
        navigation.push('/profile')
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
        <section className={['business_banner min-h-[calc(100vh-40px)] flex p-4 justify-center items-center'].join(' ')}>
          <div className='text-center text-white max-w-[900px]'>
            <h2 className='text-[50px] font-semibold mb-5'>TBD Scheduling</h2>
            <p className='text-3xl mb-10'>Create an account and let your client schedule an appointment with you.</p>

            {
              user ? <Link className='bg-white text-blue-700  py-2 px-4 md:w-[200px] w-full rounded-md font-semibold' href="/profile">Profile</Link> : <button className='bg-white text-blue-700 py-2 md:w-[200px] w-full outline-none rounded-md font-semibold' onClick={handleSignIn}>Get Started</button>
            }
          </div>
        </section>
    </div>
  )
}

export default Business