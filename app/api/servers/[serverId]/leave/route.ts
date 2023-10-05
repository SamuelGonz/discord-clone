import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

type Params = {
   params: {
      serverId: string;
   };
};

export async function PATCH(req: Request, { params }: Params) {
   try {
      const profile = await currentProfile();
      if (!profile) return new NextResponse("Unauthroized", { status: 401 });
      if (!params.serverId) return new NextResponse("ServerId Missing", { status: 400 });

      const server = await db.server.update({
         where: {
            id: params.serverId,
            profileId: {
               not: profile.id,
            },
            members: {
               some: {
                  profileId: profile.id,
               },
            },
         },
         data: {
            members: {
               deleteMany: {
                  profileId: profile.id,
               },
            },
         },
      });

      return NextResponse.json(server);
   } catch (error) {
      console.log("[SERVERID_LEAVE_PATCH] => ", error);
      return new NextResponse("Internal error server", { status: 500 });
   }
}
