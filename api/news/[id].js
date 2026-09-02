
import sql from "../db.js";


function json(data, status = 200) {

  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        "Content-Type": "application/json"
      }
    }
  );

}


export default async function handler(req) {

  try {

    const url =
      new URL(req.url);

    const parts =
      url.pathname.split("/");

    const id =
      Number(parts[parts.length - 1]);


    if (!Number.isInteger(id)) {

      return json(
        {
          error: "Geçersiz haber ID."
        },
        400
      );

    }


    if (req.method === "GET") {

      const result =
        await sql`
          SELECT *
          FROM news

          WHERE
            id = ${id}
            AND published = true

          LIMIT 1
        `;


      if (!result.length) {

        return json(
          {
            error: "Haber bulunamadı."
          },
          404
        );

      }


      await sql`
        UPDATE news

        SET views = views + 1

        WHERE id = ${id}
      `;


      result[0].views =
        Number(result[0].views || 0) + 1;


      return json(result[0]);

    }


    return json(
      {
        error: "Method desteklenmiyor."
      },
      405
    );

  }

  catch (error) {

    console.error(error);

    return json(
      {
        error:
          "Sunucu hatası."
      },
      500
    );

  }

}

