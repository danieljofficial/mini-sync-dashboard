const API_URL = "http://localhost:4000/graphql";

export class GraphQLClient {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  }
}

export const graphqlClient = new GraphQLClient(API_URL);
