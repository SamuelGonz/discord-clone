"use client";

import { Fragment } from "react";
import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";

import { ChatItem } from "./chat-item";

import { Loader2, ServerCrash } from "lucide-react";

const DATE_FORMAT = "d MMM yyy, HH:MM";

type MessageWithMemberWithProfile = Message & {
   member: Member & {
      profile: Profile;
   };
};

interface Props {
   name: string;
   member: Member;
   chatId: string;
   apiUrl: string;
   socketUrl: string;
   socketQuery: Record<string, string>;
   paramKey: "channelId" | "conversationId";
   paramValue: string;
   type: "channel" | "conversation";
}

export const ChatMessages = ({
   apiUrl,
   chatId,
   member,
   name,
   paramKey,
   paramValue,
   socketQuery,
   socketUrl,
   type,
}: Props) => {
   const queryKey = `chat:${chatId}`;
   const addKey = `chat:${chatId}:messages`;
   const updateKey = `chat:${chatId}:messages:update`;

   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
   });

   useChatSocket({ queryKey, addKey, updateKey });

   if (status === "loading") {
      return (
         <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
         </div>
      );
   }

   if (status === "error") {
      return (
         <div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Somehting went wrong!</p>
         </div>
      );
   }

   return (
      <div className="flex-1 flex flex-col py-4 overflow-y-auto ">
         <div className="flex-1" />
         <ChatWelcome type={type} name={name} />
         <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group, i) => (
               <Fragment key={i}>
                  {group.items.map((message: MessageWithMemberWithProfile) => (
                     <ChatItem
                        content={message.content}
                        currentMember={member}
                        deleted={message.deleted}
                        fileUrl={message.fileUrl}
                        id={message.id}
                        isUpdated={message.updatedAt !== message.createdAt}
                        member={message.member}
                        socketQuery={socketQuery}
                        socketUrl={socketUrl}
                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                        key={message.id}
                     />
                  ))}
               </Fragment>
            ))}
         </div>
      </div>
   );
};
