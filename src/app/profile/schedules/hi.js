"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner/Spinner";
import Image from "next/image";
import axios from "axios";
import { createRouteLoader } from "next/dist/client/route-loader";

const Schedule = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [bookedDate, setBookedDate] = useState([]);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  useEffect(()=>{
    const getSchedules = async()=>{

        // Business Calendar
        const getCalendar = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/calendar/events?business_id=gfHeoDYKeybGPeM2jJQE8c42JOB3`);

        const books = getCalendar.data.result.filter((item)=>{
            // item.attendees.forEach(attendee => {
            //     if(attendee.email == item.creator.email) {
            //         return {
            //             id: item.id,
            //             status: item.status,
            //             creator: attendee,
            //             attendees: item.attendees,
            //             start: start,
            //             end: end,

            //         }
            //     }
            // })
            console.log(getCalendar.data.result)
            return item.summary.indexOf(process.env.NEXT_PUBLIC_BOOKING_DESCRIPTION) !== -1;
        })
        
        setBookedDate(await books);

        setLoading(false)
      }
      getSchedules()
}, [])

console.log(bookedDate)

  return (
    <div className="p-4">
      {loading ? (
        <Spinner />
      ) : (
        <>
            <h2>Hello</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {
                    bookedDate[0] && bookedDate.map((item, index)=>{
                        return <div className="">
                            
                        </div>
                    })
                }
            </div>
        </>

        
      )}
    </div>
  );
};

export default Schedule;
