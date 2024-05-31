"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner/Spinner";
import Image from "next/image";
import axios from "axios";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { useParams } from "next/navigation";

const Profile = () => {

  const params = useParams();
  
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [reqSend, setReqSend] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(()=>{
    if(errMsg !== null) {
      setTimeout(()=>{
        setErrMsg(null)
      }, 4000)
    }
  }, [errMsg])

  const [businessInfo, setBusinessInfo] = useState({
    business_bank_account_name: " ",
    business_bank_account_number: " ",
    business_bank_name: " ",
    business_description: " ",
    business_facebook_link: " ",
    business_instagram_link: " ",
    business_name: " ",
    business_phone_number: " ",
    business_twitter_link: " ",
  })

  const [updated, setUpdated] = useState(false)

  useEffect(()=>{
    const getBusinessInfo = async() => {
      if(user) {
        const getBusiness = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/business/profile?business_uid=${user.uid}`);
        console.log(getBusiness)
        getBusiness.data.result && setBusinessInfo(getBusiness.data.result);
      }
    }
    getBusinessInfo();
  }, [user, updated])

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const updateBusinessInfo = async(e) => {
    e.preventDefault()
    setReqSend(true)
    const formData = new FormData(e.target);
    const data = {...user}

    for (const [key, value] of formData) {
      data[key] = value;
    }
    console.log(data)
    try{
      if(!businessInfo.uid) {
        const sendRequest = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/business/profile`, data, {withCredentials: true});
        setUpdated((prevState)=>!prevState)
        console.log(sendRequest)
      } else{
        const token = `Bearer  ${localStorage.getItem("token")}`
        const headers = {
          'Authorization': token,
          'Content-Type': 'application/json'
        };
        console.log(token)
        const sendRequest = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/business/profile`, data, { 
          headers,
          withCredentials: true // Set withCredentials to true
        })
        setUpdated((prevState)=>!prevState)
        setErrMsg("Successfully Updated Your Business Info")
        console.log(sendRequest)
      }
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
    <div className="p-4 max-w-[900px] mx-auto">
      {loading ? (
        <Spinner />
      ) : user ? (
        <>
          <div className="w-fit text-center mx-auto backdrop:bg-gray-300 shadow-xl p-5 rounded-md">
            <div className="relative w-[100px] h-[100px] rounded-full mx-auto">
              <Image src={user.photoURL} alt="user image" sizes="100%" fill
              style={{
                objectFit: 'contain',
              }} className="rounded-full"/>
            </div>
            <h5>{user.displayName}</h5>
            <h5>{user.email}</h5>
          </div>

          <form className="form" onSubmit={(e)=>updateBusinessInfo(e)}>
            <div className="mt-10">
              <legend className="mb-5 text-xl">Business Details</legend>
              <div className="grid grid-cols-2 space-x-5 mb-5">
                <div className="col-span-1">
                  <label htmlFor="business_name">Business Name:</label>
                  <input name="business_name" id="business_name" placeholder="Name of your business" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_name: e.target.value}))} value={businessInfo.business_name} />
                </div>
                <div className="col-span-1">
                  <label htmlFor="business_phone_number">Business Phone:</label>
                  <input name="business_phone_number" id="business_phone_number" placeholder="Business Phone Number" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_phone_number: e.target.value}))} value={businessInfo.business_phone_number}/>
                </div>
              </div>
              <div className="">
                  <label htmlFor="business_description">Business Description:</label>
                  <textarea name="business_description" id="business_description" placeholder="Business Description" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_description: e.target.value}))} value={businessInfo.business_description} rows={5}/>
              </div>
            </div>


            <div className="mt-10">
              <legend className="mb-5 text-xl">Business Bank Details</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 space-y-5 md:space-y-0 md:space-x-5 mb-5">
                <div className="col-span-1">
                  <label htmlFor="business_bank_name">Bank Name:</label>
                  <input name="business_bank_name" id="business_bank_name" placeholder="Your Business Bank Name" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_bank_name: e.target.value}))} value={businessInfo.business_bank_name}/>
                </div>
                <div className="col-span-1">
                  <label htmlFor="business_bank_account_number">Bank Account Number:</label>
                  <input name="business_bank_account_number" id="business_bank_account_number" placeholder="Business Bank Account Number" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_bank_account_number: e.target.value}))} value={businessInfo.business_bank_account_number}/>
                </div>
                <div className="col-span-1">
                    <label htmlFor="business_bank_account_name">Bank Account Name:</label>
                    <input name="business_bank_account_name" id="business_bank_account_name" placeholder="Business Bank Account Name" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_bank_account_name: e.target.value}))} value={businessInfo.business_bank_account_name} />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <legend className="mb-5 text-xl">Business Social Media Handles</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 space-y-5 md:space-y-0 md:space-x-5 mb-5">
                <div className="col-span-1">
                  <label htmlFor="business_facebook_link">Facebook Link:</label>
                  <input name="business_facebook_link" id="business_facebook_link" placeholder="Facebook Link" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_facebook_link: e.target.value}))} value={businessInfo.business_facebook_link}/>
                </div>
                <div className="col-span-1">
                  <label htmlFor="business_instagram_link">Instagram Link:</label>
                  <input name="business_instagram_link" id="business_instagram_link" placeholder="Instagram Link" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_instagram_link: e.target.value}))} value={businessInfo.business_instagram_link}/>
                </div>
                <div className="col-span-1">
                  <label htmlFor="business_twitter_link">Twitter Link:</label>
                  <input name="business_twitter_link" id="business_twitter_link" placeholder="Twitter Link" className="py-2 px-4 w-[100%] outline-none border border-gray-300" onChange={(e)=>setBusinessInfo((prevState)=>({...prevState, business_twitter_link: e.target.value}))} value={businessInfo.business_twitter_link}/>
                </div>
              </div>
            </div>
            {
              reqSend === true ? <p className="text-center">Sending...</p> : <button className="bg-blue-900 text-white w-[100%] py-2 px-5">Submit</button>
            }
            <p className="text-md">{errMsg}</p>
          </form>

              {
                businessInfo.uid ? <div className="py-10 text-center shadow-2xl rounded-md mt-20">
                  <QRCodeGenerator business_id={businessInfo.uid}/>
                </div> : null
              }
          
        </>

        
      ) : (
        <p>You must be logged in to view this page - protected route.</p>
      )}
    </div>
  );
};

export default Profile;
