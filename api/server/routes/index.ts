import { $ } from "bun";

export default eventHandler(async () => {
  const o1 = await $`ls`.text();
  const o2 = await $`ls minecraft`.text();
  const o21 = await $`cat ./minecraft/test.txt`.text();
  await Bun.write("./minecraft/test.txt", Date.now().toString());
  const o3 = await $`ls minecraft`.text();
  return [o1, o2, o21, o3];
});
