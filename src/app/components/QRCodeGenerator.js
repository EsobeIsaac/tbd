import React from 'react';
import QRCode from 'qrcode.react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';

import { IoMdPrint, IoMdDownload  } from "react-icons/io";

const QRCodeGenerator = ({business_id}) => {
  const qrCodeRef = useRef();

  const handleDownloadPDF = () => {
    const qrcode = document.getElementById('qrcode');
    const pdf = new jsPDF();
    pdf.text('QR Code', 10, 10); 
    pdf.addImage(qrcode.toDataURL(), 'PNG', 15, 15, 180, 180);
    pdf.save('tbd_qrcode.pdf');
  };

  // Generate a random string or fetch some data to encode into the QR code
  const data = `${process.env.NEXT_PUBLIC_FRONTENDL}/businesses/${business_id}`; // Change this to your desired data

  return (
    <div className=''>
      <h1 className='text-lg font-semibold mb-5'>QR Code</h1>
      <QRCode value={data} ref={qrCodeRef} className='mx-auto' id='qrcode'/>
      <div className='flex space-x-4 mt-5 items-center w-fit mx-auto'>
        <button onClick={handleDownloadPDF} className='py-2 px-4 bg-gray-500 text-white flex items-center space-x-5'>Download <IoMdDownload className='ml-4'/></button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
