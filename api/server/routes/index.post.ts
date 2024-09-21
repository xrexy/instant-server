import { MultiPartData } from "h3";
import { readPluginYml } from "~/utils/plugin-parser";

function isFileValid(file: MultiPartData) {
  if (!file.type || !file.filename) {
    return false;
  }

  return (
    ["application/java-archive"].includes(file.type) &&
    [".jar"].some((ext) => file.filename?.endsWith(ext))
  );
}

export default eventHandler(async (e) => {
  const formData = await readMultipartFormData(e);
  if (!formData) {
    throw createError({
      status: 400,
      message: "No form data",
    });
  }

  for (const entry of formData) {
    if (!isFileValid(entry)) {
      throw createError({
        status: 400,
        message: "Invalid file",
      });
    }

    return readPluginYml(entry.data);
  }
  return "Nothing happened :(";
});
