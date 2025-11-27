export const handler = async (event) => {
  // Handle OPTIONS for CORS preflight
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: null,
    };
  }
  // console.log("Received POST body:", event.body);

  // Parse the incoming GraphQL request
  if (!event.body) {
    console.error("Missing body in request");
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing body in request" }),
    };
  }

  let body;
  //test

  // console.log("Sharp version:", sharp.versions);
  // console.log("Platform:", process.platform, process.arch);
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch (err) {
    console.error("Error parsing JSON body:", err);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }
  const { query, variables } = body;
  const rootValue = {
    ...resolvers.Query,
    ...resolvers.Mutation,
  };
  try {
    const result = await graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("GraphQL execution error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
