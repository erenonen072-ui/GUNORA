
import sql from "./db.js";


function json(data, status = 200) {

  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );

}


export default async function handler(req) {

  try {

    const url =
      new URL(req.url);

    const category =
      url.searchParams.get("category");

    const search =
      url.searchParams.get("search");


    let news;


    if (category) {

      news = await sql`
        SELECT
          id,
          title,
          slug,
          summary,
          image,
          category,
          author,
          featured,
          breaking,
          views,
          created_at
        FROM news

        WHERE
          published = true
          AND category = ${category}

        ORDER BY
          created_at DESC
      `;

    }

    else if (search) {

      const searchText =
        `%${search}%`;

      news = await sql`
        SELECT
          id,
          title,
          slug,
          summary,
          image,
          category,
          author,
          featured,
          breaking,
          views,
          created_at
        FROM news

        WHERE
          published = true

          AND (
            title ILIKE ${searchText}
            OR summary ILIKE ${searchText}
            OR content ILIKE ${searchText}
          )

        ORDER BY
          created_at DESC
      `;

    }

    else {

      news = await sql`
        SELECT
          id,
          title,
          slug,
          summary,
          image,
          category,
          author,
          featured,
          breaking,
          views,
          created_at
        FROM news

        WHERE published = true

        ORDER BY
          created_at DESC
      `;

    }


    return json(news);

  }

  catch (error) {

    console.error(error);

    return json(
      {
        error:
          "Haberler alınırken bir hata oluştu."
      },
      500
    );

  }

}
