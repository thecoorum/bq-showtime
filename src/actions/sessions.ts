"use server";

import { diff } from "radash";
import { subMinutes } from "date-fns";

import { createClient } from "@/lib/supabase/server";
import { getUpcomingFriday } from "@/lib/utils";

import type { Tables } from "@/database.types";
import type { UpcomingSessionFormSchema } from "@/app/schema";
import type { NewSessionFormSchema } from "@/app/sessions/new/schema";

export interface SessionResponse extends Tables<"sessions"> {
  author: {
    name: string | null;
  };
  participants: {
    name: string | null;
    department: {
      name: string | null;
    } | null;
  }[];
}

export interface UpcomingSessionResponse extends Tables<"sessions"> {
  participants: Tables<"participants">[];
}

export interface CreateSessionResponse {
  id: string;
}

export interface UpdateSessionResponse {
  id: string;
}

export const getSession = async (id: string): Promise<SessionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const sessionReq = supabase
    .from("sessions")
    .select("*, author:users!sessions_author_id_fkey(name)")
    .eq("id", id)
    .single();
  const participantsReq = supabase
    .from("participants")
    .select("...users(name, department:departments(name))")
    .eq("session_id", id)
    .order("position", { ascending: true });

  const [session, participants] = await Promise.all([
    sessionReq,
    participantsReq,
  ]);

  if (session.error || participants.error) {
    throw new Error(
      [session.error?.message, participants.error?.message]
        .filter(Boolean)
        .join(", "),
    );
  }

  return { ...session.data, participants: participants.data };
};

export const getUpcomingSession =
  async (): Promise<UpcomingSessionResponse | null> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const session = await supabase
      .from("sessions")
      .select()
      .gte("starts_at", subMinutes(new Date(), 30).toISOString())
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (session.error) {
      throw new Error(session.error.message);
    }

    if (!session.data) return null;

    const participants = await supabase
      .from("participants")
      .select()
      .eq("session_id", session.data.id);

    if (participants.error) {
      throw new Error(participants.error.message);
    }

    return { ...session.data, participants: participants.data };
  };

export const createSession = async (
  data: NewSessionFormSchema,
): Promise<CreateSessionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profile = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (profile.error) {
    throw new Error(profile.error.message);
  }

  const session = await supabase
    .from("sessions")
    .insert({
      author_id: profile.data.id,
      starts_at: getUpcomingFriday(),
    })
    .select("id")
    .single();

  if (session.error) {
    throw new Error(session.error.message);
  }

  const participants = await supabase.from("participants").insert(
    data.participants.map((id, index) => ({
      user_id: id,
      session_id: session.data.id,
      position: index + 1,
    })),
  );

  if (participants.error) {
    throw new Error(participants.error.message);
  }

  return {
    id: session.data.id,
  };
};

export const updateSession = async (
  id: string,
  data: UpcomingSessionFormSchema,
): Promise<UpdateSessionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profile = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (profile.error) {
    throw new Error(profile.error.message);
  }

  const remoteParticipants = await supabase
    .from("participants")
    .select("user_id")
    .eq("session_id", id);

  if (remoteParticipants.error) {
    throw new Error(remoteParticipants.error.message);
  }

  const deletedParticipants = diff(
    remoteParticipants.data.map((participant) => participant.user_id),
    data.participants,
  );

  if (deletedParticipants.length) {
    const { error } = await supabase
      .from("participants")
      .delete()
      .in("user_id", deletedParticipants);

    if (error) {
      throw new Error(error.message);
    }
  }

  const participantsData = data.participants.map((participant, index) => ({
    session_id: id,
    user_id: participant,
    position: index + 1,
  }));

  const sessionReq = supabase
    .from("sessions")
    .update({
      author_id: profile.data.id,
    })
    .eq("id", id)
    .select("id")
    .single();
  const upsertParticipantsReq = supabase
    .from("participants")
    .upsert(participantsData);

  const [session, participants] = await Promise.all([
    sessionReq,
    upsertParticipantsReq,
  ]);

  if (session.error || participants.error) {
    throw new Error(
      [session.error?.message, participants.error?.message]
        .filter(Boolean)
        .join(", "),
    );
  }

  return { id: session.data.id };
};
