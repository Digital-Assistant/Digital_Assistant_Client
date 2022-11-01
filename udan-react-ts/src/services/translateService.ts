import { CONFIG } from "../config";

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string = "en"
): Promise<string> => {
  const {
    translate: { provider, apikey, apiurl },
  } = CONFIG.multilingual;

  let posturl = "";
  switch (provider) {
    case "google":
      posturl = `${apiurl}?key=${encodeURIComponent(
        apikey
      )}&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(
        text
      )}`;
      break;
  }
  const response = await fetch(posturl);
  const jsonData = await response.json();
  if (jsonData?.data?.translations?.length > 0) {
    return jsonData.data.translations[0].translatedText;
  }
  throw new Error("Failed to translate");
};
