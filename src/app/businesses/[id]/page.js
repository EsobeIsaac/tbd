'use client'
import Spinner from '@/app/components/Spinner/Spinner'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import Image from 'next/image'


import BookingCalendar from '@/app/components/BookingCalendar';

// Icons
import { FaFacebook, FaSquareXTwitter, FaSquareInstagram } from "react-icons/fa6";
import classes from './Business.module.css'
import { useParams } from 'next/navigation'


function Business({id}) {

  const params = useParams();

    const [loading, setLoading] = useState(true);

    const [businessInfo, setBusinessInfo] = useState({})
    const [bookedDate, setBookedDate] = useState([])

    const [bookingPlaced, setBookingPlaced] = useState(false);

    const booked = (call) => {
      setBookingPlaced(call)
    }
   
    useEffect(()=>{
        const getBusiness = async()=>{
            const getBusiness = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/business/profile?business_uid=${params.id}`);

            console.log(getBusiness.data.result)
            setBusinessInfo(getBusiness.data.result);

            // Business Calendar
            const getCalendar = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/calendar/events?business_id=${params.id}`);

            if(getCalendar.data.result) {
              await getCalendar.data.result[0] && getCalendar.data.result.forEach(item => {
                setBookedDate((prevState)=>([...prevState, {
                  start: item.start.dateTime,
                  end: item.end.dateTime
                }]))
              });
            }



            setLoading(false)
          }
        getBusiness()
    }, [bookingPlaced])
    
    

  return (
    <div>
      { businessInfo.business_name
      ? (
        <>
          <section className={[classes.business_banner, 'min-h-[calc(100vh-50px)] flex justify-center items-center'].join(' ')}>
            <div className='text-center text-white'>
            <div className="relative w-[200px] h-[200px] rounded-full mx-auto mb-5">
              <Image src={businessInfo.photoURL} alt="user image" sizes="100%" fill
              style={{
                objectFit: 'contain',
              }} className="rounded-full"/>
            </div>
            <h2 className='text-[50px] font-semibold mb-5'>{businessInfo.business_name}</h2>
            <p className='text-3xl mb-5'>{businessInfo.description}</p>
            <div className='socials flex w-fit mx-auto space-x-5 text-[40px]'>
              <FaFacebook/>
              <FaSquareXTwitter/>
              <FaSquareInstagram/>
            </div>
            </div>
          </section>

          <section className='book py-20 px-[3%]'>
            <div className='bookings'>
              <BookingCalendar 
                bookedSlots={bookedDate}
                booked={booked}
              />
            {/* <form className="form" onSubmit={(e)=>{}}>
            <div className="mt-10">
              <legend className="mb-5 text-xl">Business Details</legend>
              <div className="grid grid-cols-2 space-x-5 mb-5">
                <div className="col-span-1">
                  <label htmlFor="business_name">Business Name:</label>
                  <input name="business_name" id="business_name" placeholder="Name of your business" className="py-2 px-4 w-[100%] outline-none border border-gray-300"/>
                </div>
                <div className="col-span-1">
                  <label htmlFor="business_phone_number">Business Name:</label>
                  <input name="business_phone_number" id="business_phone_number" placeholder="Business Phone Number" className="py-2 px-4 w-[100%] outline-none border border-gray-300"/>
                </div>
              </div>
              <div className="">
                  <label htmlFor="business_description">Business Description:</label>
                  <textarea name="business_description" id="business_description" placeholder="Business Description" className="py-2 px-4 w-[100%] outline-none border border-gray-300" rows={5}/>
              </div>
            </div>


            <div className="mt-10">
              <legend className="mb-5 text-xl">Business Bank Details</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 space-y-5 md:space-y-0 md:space-x-5 mb-5">
                <div className="col-span-1">
                  <label htmlFor="business_bank_name">Bank Name:</label>
                  <input name="business_bank_name" id="business_bank_name" placeholder="Your Business Bank Name" className="py-2 px-4 w-[100%] outline-none border border-gray-300"/>
                </div>
                <div className="col-span-1">
                  <label htmlFor="business_bank_account_number">Bank Account Number:</label>
                  <input name="business_bank_account_number" id="business_bank_account_number" placeholder="Business Bank Account Number" className="py-2 px-4 w-[100%] outline-none border border-gray-300"/>
                </div>
                <div className="col-span-1">
                    <label htmlFor="business_bank_account_name">Bank Account Name:</label>
                    <input name="business_bank_account_name" id="business_bank_account_name" placeholder="Business Bank Account Name" className="py-2 px-4 w-[100%] outline-none border border-gray-300" />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <legend className="mb-5 text-xl">Business Social Media Handles</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 space-y-5 md:space-y-0 md:space-x-5 mb-5">
                <div className="col-span-1">
                  <label htmlFor="business_facebook_link">Facebook Link:</label>
                  <input name="business_facebook_link" id="business_facebook_link" placeholder="Facebook Link" className="py-2 px-4 w-[100%] outline-none border border-gray-300"/>
                </div>
                <div className="col-span-1">
                  <label htmlFor="business_instagram_link">Instagram Link:</label>
                  <input name="business_instagram_link" id="business_instagram_link" placeholder="Instagram Link" className="py-2 px-4 w-[100%] outline-none border border-gray-300"/>
                </div>
                <div className="col-span-1">
                  <label htmlFor="business_twitter_link">Twitter Link:</label>
                  <input name="business_twitter_link" id="business_twitter_link" placeholder="Twitter Link" className="py-2 px-4 w-[100%] outline-none border border-gray-300"/>
                </div>
              </div>
            </div>
            <button>Submit</button>
          </form> */}
            </div>
          </section>
        </>

        
      ) : null}
    </div>
  )
}

export default Business