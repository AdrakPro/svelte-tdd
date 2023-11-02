const createFormDataFromObject = (o) => {
  const formData = new FormData();
  Object.keys(o).forEach((key) =>
    formData.append(key, o[key])
  );

  return formData;
};

export const createFormDataRequest = (o) => ({
  formData: () =>
    new Promise((resolve) =>
      resolve(createFormDataFromObject(o))
    )
});
