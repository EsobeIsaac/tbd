// components/BookingCalendar.js
'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingCalendar = ({ bookedSlots, booked }) => {
  const params = useParams()
  // console.log(params)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [reqSend, setReqSend] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(()=>{
    if(errMsg !== null) {
      setTimeout(()=>{
        setErrMsg(null)
      }, 4000)
    }
  }, [errMsg])

  const [formDetails, setFormDetails] = useState({
    name: ' ',
    email: ' ',
    phone: ' ',
    summary: ' '
  })

  const isSlotBooked = (date, startDate) => {
    let formatedtartDate = startDate ? new Date(startDate) : null;

    for (const slot of bookedSlots) {
      const startTime = new Date(slot.start);
      const endTime = new Date(slot.end);
      if ((date >= startTime && date < endTime) || ( formatedtartDate !== null && date < formatedtartDate)) {
        return true;
      }
    }

    if ((formatedtartDate !== null && date < formatedtartDate)) {
      return true;
    }
    
    return false;
  };


  const convertToISOWithTimezone = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const offsetHours = String(Math.abs(Math.floor(offset / 60))).padStart(2, '0');
    const offsetMinutes = String(Math.abs(offset % 60)).padStart(2, '0');
    const offsetSign = offset > 0 ? '-' : '+';
    const isoString = date.toISOString().replace('Z', '').split('.')[0];
    // console.log(isoString)
    return `${isoString}${offsetSign}${offsetHours}:${offsetMinutes}`;
  };


  const bookBusiness = async(e) => {
    e.preventDefault();
    setReqSend(true)

    // const dataObj = {
    //   summary: formDetails.summary,
    //   description: "uniform",
    //   attendees: [
    //     {
    //       email: formDetails.email,
    //       displayName: formDetails.name,
    //       comment: `Phone Number: ${formDetails.phone}`
    //     }
    //   ],
    //   start: {
    //     datetime: convertToISOWithTimezone(startDate),
    //     timeZone: 'Africa/Lagos'
    //   },
    //   end: {
    //     datetime: convertToISOWithTimezone(endDate),
    //     timeZone: 'Africa/Lagos'
    //   }
    // }


    const mockData = {summary:`${process.env.NEXT_PUBLIC_BOOKING_DESCRIPTION} - ${formDetails.summary}`,description:process.env.NEXT_PUBLIC_BOOKING_DESCRIPTION,attendees:[{email:formDetails.email,displayName:formDetails.name,comment:`Phone Number: ${formDetails.phone}`}],start:{dateTime: convertToISOWithTimezone(startDate),
    timeZone: "Africa/Lagos"},end:{dateTime: convertToISOWithTimezone(endDate),
    timeZone: "Africa/Lagos"}}

    // const data = {summary:"Reduced object-oriented challenge",description:"reciprocal",attendees:[{email:"Liliana.Walsh@hotmail.com",displayName:"Corey Muller",comment:"Phone Number: 917-773-0112"}],start:{dateTime: "2024-05-23T19:00:00+01:00",
    // timeZone: "Africa/Lagos"},end:{dateTime: "2024-05-24T19:30:00+01:00",
    // timeZone: "Africa/Lagos"}}

    //attendee is the email of the user trying to book

    //attendee is the email of the user trying to book

    try{
      console.log('sendRequest')
      const sendRequest = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/calendar/events?business_id=${params.id}`, mockData, {withCredentials: true});
      console.log(sendRequest)
      booked(true)
      setErrMsg("Your Booking was Successful")
    } catch(err) {
      if(err.response) {
        setErrMsg(err.response.data.message)
      } else{
        setErrMsg("An errror occured")
      }
      console.log(err)
    } finally {
      setReqSend(false)
    }
  }

  return (
    <div>
      <h2 className='text-3xl text-center'>Booking Calendar</h2>

      <form onSubmit={(e)=>bookBusiness(e)}>
        <section className='grid grid-cols-1 md:grid-cols-3'>
          <div className='md:col-span-2 py-10 md:px-10'>
              <label htmlFor='name'>Name:</label>
              <input type='text' value={formDetails.name} name='name' id='name' className='w-full border border-gray-300 py-2 px-5' onChange={(e)=>setFormDetails((prevState)=>({...prevState, name: e.target.value}))}/><br/><br/>
              
              <label htmlFor='email'>Email:</label>
              <input type='email' value={formDetails.email} name='email' id='email' className='w-full border border-gray-300 py-2 px-5' onChange={(e)=>setFormDetails((prevState)=>({...prevState, email: e.target.value}))}/><br/><br/>

              <label htmlFor='phone'>Phone:</label>
              <input type='text' value={formDetails.phone} name='phone' id='phone' className='w-full border border-gray-300 py-2 px-5' onChange={(e)=>setFormDetails((prevState)=>({...prevState, phone: e.target.value}))}/><br/><br/>

              <label htmlFor='summary'>Summary:</label>
              <textarea name='summary' value={formDetails.summary} id='summary' className='w-full border border-gray-300 py-2 px-5' rows={5} onChange={(e)=>setFormDetails((prevState)=>({...prevState, summary: e.target.value}))}/>
            
          </div>

          <div className='md:col-span-1'>
            <div className='my-5'>
              <h3 className='text-2xl'>Start Date:</h3>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                filterTime={(time) => {
                  const startDateTime = new Date(startDate);
                  startDateTime.setHours(time.getHours());
                  startDateTime.setMinutes(time.getMinutes());
                  return !isSlotBooked(startDateTime);
                }}
                minDate={new Date()}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                inline
              />
            </div>

            <div className='my-5'>
              <h3 className='text-2xl'>End Date:</h3>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                filterTime={(time) => {
                  const endDateTime = new Date(endDate);
                  endDateTime.setHours(time.getHours());
                  endDateTime.setMinutes(time.getMinutes());
                  return !isSlotBooked(endDateTime, startDate);
                }}
                minDate={new Date()}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                inline
              />
            </div>
          </div>

          <div className='md:col-span-3'>
          {
              reqSend === true ? <p className="text-center">Sending...</p> : <button className='bg-blue-500 text-white py-2 px-5 w-full'>Book Now</button>
            }
            <p className="text-md text-center">{errMsg}</p>   
          </div>
        </section>
      </form>
    </div>
  );
};

export default BookingCalendar;
