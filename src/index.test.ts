import { gs } from "./index.js";

const ret = await gs({
  args: ["--version"],
});

const log = new TextDecoder().decode(
  new Uint8Array(ret.outputStreams.map(({ charCode }) => charCode))
);
console.log(log);
