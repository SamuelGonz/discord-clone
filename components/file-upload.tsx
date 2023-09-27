"use client";

import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import { X } from "lucide-react";
import "@uploadthing/react/styles.css";

interface Props {
   endpoint: "messageFile" | "serverImage";
   value: string;
   onChange: (url?: string) => void;
}

export const FileUpload: React.FC<Props> = ({ endpoint, onChange, value }) => {
   const fileType = value?.split(".").pop();

   if (value && fileType !== "pdf") {
      return (
         <div className="relative h-20 w-20">
            <Image fill src={value} alt="Upload" className="rounded-full" />

            <button
               onClick={() => onChange("")}
               className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
               type="button"
            >
               <X className="h-4 w-4" />
            </button>
         </div>
      );
   }

   return (
      <UploadDropzone
         endpoint={endpoint}
         onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
         }}
         onUploadError={(error: Error) => {
            console.log(error);
         }}
      />
   );
};