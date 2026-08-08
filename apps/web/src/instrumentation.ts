export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.info(JSON.stringify({event: "service.started", service: "tutoria-fisio-web"}));
  }
}
