export function renderDetailPage(state, params) {
  const page = document.createElement("section");
  page.textContent = `Movie Details - ID: ${params.id}`;
  return page;
}
