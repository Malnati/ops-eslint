import { getUserData } from "./user-service";
import { processPayment } from "./payment";
import { connectDb } from "./database";

const db = connectDb("admin", "admin123");

async function main() {
  const user = await getUserData(1);
  console.log(user);

  // Bug: floating point comparison
  const price = 0.1 + 0.2;
  if (price == 0.3) {
    console.log("match");
  }

  // Bug: always-true condition
  const x = 5;
  if (x >= 0 || x < 0) {
    console.log("always true");
  }

  await processPayment(user, 100);
}

main();
