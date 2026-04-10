const { createClient } = require('@libsql/client');

const dbUrl = "libsql://atendia-devwizard-es.aws-eu-west-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU4MTI2MDEsImlkIjoiMDE5ZDc2NzQtNDgwMS03YjhiLWI0ZDctZmU2N2ZlOTNlOWQxIiwicmlkIjoiYzVjNjE1NTktYjJmYy00MmNhLWJmNDAtZjY0MWI0YmRkNjQ0In0.kVwEw5RoZWyUJTsRmKdDKeSgBkb02jRNavrqpF6as3IMa3TFWz4orIM_7HGvVBgNHfzi71w_xs892wUzpPh2AQ";

async function check() {
  const client = createClient({ url: dbUrl, authToken: authToken });

  const orgs = await client.execute("SELECT * FROM organizations");
  console.log('Organizations:', orgs.rows.length);
  orgs.rows.forEach(r => console.log(`- ${r.slug} (${r.id})`));

  const prods = await client.execute("SELECT * FROM products");
  console.log('Products:', prods.rows.length);
  
  const reviews = await client.execute("SELECT * FROM reviews");
  console.log('Reviews:', reviews.rows.length);
}

check().catch(console.error);
