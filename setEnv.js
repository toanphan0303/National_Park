const env = process.env.NODE_ENV;
if (env === 'production') {
  console.log(`GOOGLE_MAP_API:AIzaSyDO1OZrmzTeZd8kTN-GDb-TY5KaiH2kdOQ`);
} else {
  console.log(`GOOGLE_MAP_API:AIzaSyAtq_KH_eCQQTNCT1NttBIBJBir_4LOciI`);
}
