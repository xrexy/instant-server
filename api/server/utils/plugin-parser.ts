import { type } from "arktype";
import { load } from "js-yaml";
import { Open } from "unzipper";

import { StatusResponse } from "~/types/response";

type PluginYml = {
  name: string;
  version: string;
  softdepend: string[];
  depend: string[];
  author: string;
};

// TODO add stricter validation
const pluginYmlValidator = type({
  name: "3 <= string.alphanumeric < 32",
  version: "string.semver",
  "softdepend?": "string[]",
  "depend?": "string[]",
  author: "string",
});

export async function readPluginYml(
  file: Buffer
): Promise<StatusResponse<PluginYml>> {
  const unzippedJar = await Open.buffer(file);
  const pluginYml = unzippedJar.files.find((x) => x.path === "plugin.yml");
  if (!pluginYml) {
    return {
      status: "error",
      message: "File has no plugin.yml",
    };
  }

  const pluginYmlJson = await load((await pluginYml.buffer()).toString());
  const parsed = pluginYmlValidator(pluginYmlJson);
  if (parsed instanceof type.errors) {
    return {
      status: "error",
      message: parsed.message,
    };
  }

  const { name, version, softdepend, depend, author } = parsed;

  return {
    status: "success",
    data: {
      name,
      version,
      author,

      softdepend: softdepend || [],
      depend: depend || [],
    },
  };
}
