/**
 * Converte bytes para texto legivel
 * @param {Number} bytes Total de bytes
 * @param {Number} decimals Total de casas decimais
 */
function formatBytes (bytes, decimals = 2) {
  // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Retorna o texto com a primeira letra em maisculo 
 * @param {String} str Texto qualquer
 */
function upperCaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export { formatBytes, upperCaseFirstLetter }
