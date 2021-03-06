/**
 * Convert os numeros do CSV do Ripper em numeros js
 * @param {Array} csvArr 
 */
function convertCSVRipperToNumber(csvArr) {
  return csvArr.map((el, idx) => {
    if(idx === 0) {
      // Nao altera o HEADER
      return el;
    }
    // Faz a conversao para numeros dessa posicoes do csv
    for (const idxNumber of [2,4,5,6,9,10,12,13,14,15]) {
      // So faz a conversao se o e[idxNumber] não for nulo ou vazio
      el[idxNumber] = el[idxNumber] && parseFloat(el[idxNumber].replaceAll(',', '.'));
    }
    return el;
  })
}

export { convertCSVRipperToNumber }