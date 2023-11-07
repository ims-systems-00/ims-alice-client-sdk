import http from "../httpServices";
const apiEndPoint = `/conversation`;
const DEFAULT_PROMT = {
  role: "system",
  content: `You are an AI assistant named Alice. Always generate all your response in a markdown (don't wrap in code blocks only wrap in codeblock if it's some code or diagram) format. 
  Always comprehend your answers when asked for any documentation or policies. Make sure you give 
  language name in codeblocks markdown and never miss it. If you are asked to make or build 
  or prepare or construct charts or diagrams use mermaid js syntex for the charts and diagrams 
  and always include it codeblock markdown. Also try to explain or comprehend your general 
  answers with details as much as possible. Use UK english in your reseponses.`,
};
/**
 * ALERT: We should not user fetch with any other cases unless it's a
 * special case like this where axios does'nt have support for stream response
 * in browsers. limited  by XMLHTTPRequest  standards.
 */
export async function streamResponse(
  data,
  options = {
    onStream: function () {},
    onStreamEnd: function () {},
    onError: function () {},
    onTokenRefreshNeed: async function () {},
    onStreamStart: async function () {},
    headers: {},
  }
) {
  console.log(
    "sending charecters:",
    data.conversation.reduce((accumulator, currentValue) => {
      return currentValue.content + accumulator;
    }, "").length
  );
  console.log(
    "sending charecters trim:",
    data.conversation.reduce((accumulator, currentValue) => {
      return currentValue.content + accumulator.trim();
    }, "").length
  );

  const reader = response.body.getReader();
  async function _successResponseHandler(response) {
    options?.onStreamStart(reader);
    let fullText = "";
    while (true) {
      try {
        const { value, done } = await reader.read();
        if (done) break;
        const decodedtext = new TextDecoder("utf-8").decode(value);
        fullText += decodedtext;
        options?.onStream(decodedtext);
      } catch (err) {
        console.log(err);
        options?.onError(err);
        break;
      }
    }
    options?.onStreamEnd(fullText);
  }
  try {
    const URL = http.instance.defaults.baseURL + `${apiEndPoint}/gpt-stream`;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include",
      body: JSON.stringify({
        systemInstructions: data.systemInstructions || [DEFAULT_PROMT],
        conversation: data.conversation,
        prompt: data.prompt,
      }),
    };
    const response = await fetch(URL, config);
    if (response.ok) {
      _successResponseHandler(response);
    } else {
      if (response.status === 401) {
        const data = await options?.onTokenRefreshNeed();
        const tokenPair = data?.tokenPair;
        try {
          let newResponse = await fetch(URL, {
            ...config,
            headers: {
              ...config.headers,
              "x-auth-accesstoken": tokenPair?.accessToken,
            },
          });
          if (newResponse.ok) {
            _successResponseHandler(newResponse);
          }
        } catch (err) {
          options?.onError(err);
        }
      }
    }
  } catch (err) {
    options?.onError(err);
  }
}

export async function normalResponse(data) {
  return http.post(`${apiEndPoint}/gpt-normal`, {
    systemInstructions: data.systemInstructions || [DEFAULT_PROMT],
    conversation: data.conversation,
    prompt: data.prompt,
  });
}
