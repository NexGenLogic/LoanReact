import axios from 'axios';

export async function callApiWithButtonControl({
  buttonRef,
  loadingText,
  originalText,
  apiUrl,
  formData,
  beforeApi = () => { },
  successCallback = () => { },
  failureCallback = () => { },
  apiComplete = () => { }
}) {
  const button = buttonRef?.value;

  if (!button) return console.warn("Button ref not found");

  const prevText = button.innerText;
  button.innerText = loadingText;
  button.disabled = true;

  try {
    beforeApi();
    const response = await axios.post(apiUrl, formData);
    successCallback(response);
  } catch (error) {
    failureCallback(error);
  } finally {
    button.innerText = originalText || prevText;
    button.disabled = false;
    apiComplete();
  }
}
