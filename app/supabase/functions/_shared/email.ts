// SEC-06: productor de correos transaccionales.
//
// Las Edge Functions no envían correo directamente: dejan el mensaje en
// `public.email_outbox` para que el procesador autorizado lo envíe y registre
// el resultado. Así el enlace mágico no queda en un chat ni en la respuesta
// de la función.

import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { HttpError } from "./http.ts";

export interface GuardianInviteEmail {
  toEmail: string;
  guardianName: string;
  studentName: string;
  studentCode: string;
  magicLink: string;
  resend: boolean;
}

/**
 * Encola la invitación del tutor. Devuelve el id del outbox para poder
 * auditarlo; nunca incluye el enlace en la respuesta HTTP.
 */
export async function queueGuardianInvite(
  admin: SupabaseClient,
  input: GuardianInviteEmail,
): Promise<string> {
  const { data, error } = await admin
    .from("email_outbox")
    .insert({
      to_email: input.toEmail,
      template: "guardian_invite",
      payload: {
        guardian_name: input.guardianName,
        student_name: input.studentName,
        student_code: input.studentCode,
        magic_link: input.magicLink,
        resend: input.resend,
      },
      status: "pending",
      attempts: 0,
      scheduled_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new HttpError(500, "No se pudo encolar el correo de invitación");
  }

  return data.id as string;
}
