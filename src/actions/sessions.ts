"use server";

import { createClient } from "@/lib/supabase/server";
import { getUpcomingFriday } from "@/lib/utils";

import type { Tables } from "@/database.types";
import { UpcomingSessionFormSchema } from "@/app/home";

export interface SessionResponse extends Tables<"sessions"> {
  participants: Tables<"participants">[];
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

  const sessionReq = supabase.from("sessions").select().eq("id", id).single();
  const participantsReq = supabase
    .from("participants")
    .select()
    .eq("session_id", id);

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
      .gte("starts_at", new Date().toISOString())
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

export const createSession = async (data): Promise<CreateSessionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const session = await supabase
    .from("sessions")
    .insert({
      author_id: user.id,
      starts_at: getUpcomingFriday(new Date()),
    })
    .select("id")
    .single();

  if (session.error) {
    throw new Error(session.error.message);
  }

  const participants = await supabase.from("participants").insert([]);

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
) => {
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

  const sessionReq = supabase
    .from("sessions")
    .update({
      author_id: profile.data.id,
    })
    .eq("id", id)
    .select("id")
    .single();
  const participantsReq = supabase.from("participants").upsert(
    data.participants.map((participant, index) => ({
      session_id: id,
      user_id: participant,
      position: index + 1,
    })),
  );

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

  return { id: session.data.id };
};
