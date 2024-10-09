"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormZod = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.date(),
});

const CreateInvoiceSchema = FormZod.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const { customerId, status, amount } = CreateInvoiceSchema.parse({ ...data });

  const amountInCents = amount * 100;

  const date = new Date().toISOString().split("T")[0];

  await sql`insert into invoices (customer_id, amount, status, date)
	values (${customerId}, ${amountInCents}, ${status}, ${date})`;

  // Dado que Next almacena los datos en caché para asegurar la velocidad de carga de navegación del usuario,
  // debemos notificar a Next de que el contenido de la página ha cambiado.
  // Esto se hace mediante la función revalidatePath, que se encarga de buscar todas las rutas que pueden ser
  // recargadas y notificar a Next de que deben ser recargadas. Borrando la caché de la página actual y recargandola
  // hará que Next vuelva a buscar los datos de la base de datos y los actualice.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
