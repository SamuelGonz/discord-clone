import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";

interface Props {
   params: {
      memberId: string;
      serverId: string;
   };
}

const MemberIdPage = async ({ params }: Props) => {
   const profile = await currentProfile();
   if (!profile) return redirectToSignIn();

   const currentMember = await db.member.findFirst({
      where: { serverId: params.serverId, profileId: profile.id },
      include: { profile: true },
   });
   if (!currentMember) return redirect("/");

   const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
   if (!conversation) return redirect(`/servers/${params.serverId}`);

   const { memberOne, memberTwo } = conversation;
   const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

   return <div>MemberIdPage</div>;
};

export default MemberIdPage;
