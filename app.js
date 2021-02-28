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

$(function(){
  const renderers = $.extend(
    $.pivotUtilities.renderers,
    $.pivotUtilities.plotly_renderers,
    $.pivotUtilities.c3_renderers,
    $.pivotUtilities.d3_renderers,
    $.pivotUtilities.export_renderers
  );

  /**
   * @param {File} file Arquivo CSV
   */
  const parseAndPivot = function(file) {
    if (!file || !file.name) {
      alert('Nenhum arquivo recebido')
      return;
    }

    $("#csv-file-name").text(file.name)
    $("#pivottable-csv-output").empty()
    $("#total-bytes-file").text(formatBytes(file.size))
    $('#total-linhas-geradas').text("(processando...)")
    $('#total-linhas-carregadas').text(0)
    
    Papa.parse(file, {
      skipEmptyLines: true,
      error: function(e) {
        alert(e)
      },
      complete: function(parsed){
        $('#total-linhas-geradas').text(parsed.data.length)
        $('#total-linhas-carregadas').text(parsed.data.length)
        const data = convertCSVRipperToNumber(parsed.data);
        $("#pivottable-csv-output").pivotUI(data, { renderers: renderers }, true);
      }
    });
  };

  $("#csv-chooser").bind("change", function(event) {
    parseAndPivot(event.target.files[0]);
  });

  const dragging = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.originalEvent.dataTransfer.dropEffect = 'copy';
    $("body").addClass("greyborder");
  };

  const endDrag = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.originalEvent.dataTransfer.dropEffect = 'copy';
    $("body").removeClass("greyborder");
  };

  const dropped = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $("body").removeClass("greyborder");
    $("#csv-chooser").prop("value", "")
    parseAndPivot(evt.originalEvent.dataTransfer.files[0]);
  };

  $("html")
    .on("dragover", dragging)
    .on("dragend", endDrag)
    .on("dragexit", endDrag)
    .on("dragleave", endDrag)
    .on("drop", dropped);  
});
