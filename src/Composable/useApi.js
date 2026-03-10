// Composable/useApi.js

import axios from "axios";

export async function fetchData(url) {

  try {

    const response = await axios.get(url);

    return {
      data: response.data,
      error: null
    };

  } catch (error) {

    return {
      data: [],
      error: error.message
    };

  }

}