console.log("ENV VARS:");
for (const key of Object.keys(process.env)) {
  if (key.toLowerCase().includes("attach") || key.toLowerCase().includes("file") || key.toLowerCase().includes("asset") || key.toLowerCase().includes("media") || key.toLowerCase().includes("upload")) {
    console.log(`${key} = ${process.env[key]}`);
  }
}
