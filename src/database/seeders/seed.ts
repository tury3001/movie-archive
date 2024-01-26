import { Seeder } from "./Seeder";

export const seed = async () => {
  const seeder = new Seeder();
  await seeder.seedAll();
}

seed();
