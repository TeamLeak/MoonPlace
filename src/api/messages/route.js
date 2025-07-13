async function handler({ method, orderId, content, isAdmin }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (method === "POST") {
    if (!content) {
      return { error: "Message content is required" };
    }

    const message = await sql`
      INSERT INTO messages (
        order_id,
        user_id,
        is_admin,
        content
      )
      VALUES (
        ${orderId || null},
        ${session.user.id},
        ${isAdmin || false},
        ${content}
      )
      RETURNING *
    `;

    return { message: message[0] };
  }

  if (method === "GET") {
    if (orderId) {
      const messages = await sql`
        SELECT * FROM messages 
        WHERE order_id = ${orderId}
        ORDER BY created_at ASC
      `;
      return { messages };
    }

    const messages = await sql`
      SELECT * FROM messages 
      WHERE user_id = ${session.user.id}
      AND order_id IS NULL
      ORDER BY created_at ASC
    `;
    return { messages };
  }

  return { error: "Method not allowed" };
}
export async function POST(request) {
  return handler(await request.json());
}