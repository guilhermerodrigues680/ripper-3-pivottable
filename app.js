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

/**
 * Retorna o texto com a primeira letra em maisculo 
 * @param {String} str Texto qualquer
 */
function upperCaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const viewManager = {
  getStoredViews: function () {
    const pivotConfigStr = localStorage.getItem("pivotConfig");
    if(!pivotConfigStr) {
      return {}; // objeto vazio
    }
    return JSON.parse(pivotConfigStr)
  },

  saveView: function (name, pivotConfig) {
    const storedViews = this.getStoredViews();
    storedViews[name] = pivotConfig
    localStorage.setItem("pivotConfig", JSON.stringify(storedViews))
    console.debug("Visualizacao armazenada!", storedViews[name])
    return this.getStoredViews();
  },

  getStoredViewByName: function (name) {
    return this.getStoredViews()[name];
  },

  deleteStoredViewByName: function (name) {
    const storedViews = this.getStoredViews();
    delete storedViews[name]
    localStorage.setItem("pivotConfig", JSON.stringify(storedViews))
    console.debug("Visualizacao deletada!", storedViews[name])
    return true;
  },

  checkStoredViewsUpdate: function () {
    const pivotConfigStr = localStorage.getItem("pivotConfig");
    if(!pivotConfigStr) {
      return;
    }

    // Faz a compatibilidade com exportações anteriores
    const storedViewsDB = JSON.parse(pivotConfigStr);
    for (const value of Object.values(storedViewsDB)) {
      //delete some bulky default values
      delete value["rendererOptions"];
      delete value["localeStrings"];
    }
    localStorage.setItem("pivotConfig", JSON.stringify(storedViewsDB))
  },

  exportJsonStoredViews: function () {
    const storedViewsStr = localStorage.getItem("pivotConfig") || "{}"
    const blobx = new Blob([storedViewsStr], { type: 'application/json' });
    const elemx = window.document.createElement('a');
    elemx.target = "_blank"
    elemx.href = window.URL.createObjectURL(blobx);
    elemx.download = `views-${new Date().toISOString().replaceAll(/[:,.]/g, '-')}.json`;
    elemx.style.display = 'none';
    document.body.appendChild(elemx);
    elemx.click();
    document.body.removeChild(elemx);
  },

  importViews: async function (file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.name) {
        alert('Nenhum arquivo recebido')
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', event => {
        localStorage.setItem("pivotConfig", event.target.result)
        resolve(this.getStoredViews())
      });
      reader.readAsText(file);
    })
  }
}

// Checagem de idioma
// "pt" ou "en"
const locale = new URLSearchParams(window.location.search).get('lang');
if (!locale || locale.toLowerCase() !== "pt" && locale.toLowerCase() !== "en") {
  window.location.replace(`${location.protocol}//${location.host}${location.pathname}?lang=pt`)
}

// Global Vars
let pivotData;

// jquery
$(function(){
  const enRenderers = $.extend(
    $.pivotUtilities.renderers,
    $.pivotUtilities.plotly_renderers,
    $.pivotUtilities.c3_renderers,
    $.pivotUtilities.d3_renderers,
    $.pivotUtilities.export_renderers,
    $.pivotUtilities.app_renderers
  );
  
  const ptRenderers = $.extend(
    $.pivotUtilities.locales.pt.renderers,
    $.pivotUtilities.locales.pt.plotly_renderers,
    $.pivotUtilities.locales.pt.c3_renderers,
    $.pivotUtilities.locales.pt.d3_renderers,
    $.pivotUtilities.locales.pt.export_renderers,
    $.pivotUtilities.locales.pt.app_renderers
  );

  const renderers = locale === "pt" ? ptRenderers : enRenderers;

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
        pivotData = data;
        $("#pivottable-csv-output").pivotUI(data, { renderers: renderers }, true, locale);
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
    
  // Salvar e carregar visualizacoes
  $("#btn-salvar-visualizacao").on("click", function() {
    if (!pivotData) {
      alert('Nenhuma base de dados carregada')
      return;
    }

    const configObj = $("#pivottable-csv-output").data("pivotUIOptions");
    const configCopy = JSON.parse(JSON.stringify(configObj)); // Fast cloning with data loss

    //delete some values which will not serialize to JSON
    delete configCopy["aggregators"];
    delete configCopy["renderers"];
    //delete some bulky default values
    delete configCopy["rendererOptions"];
    delete configCopy["localeStrings"];

    const viewName = upperCaseFirstLetter($("#nome-visualizacao").val())
    const storedViewsUpdated = viewManager.saveView(viewName, configCopy)
    storedViewsControl(storedViewsUpdated)
    $("#nome-visualizacao").val(null)
  });
  
  $("#btn-carregar-visualizacao").on("click", function() {
    if (!pivotData) {
      alert('Nenhuma base de dados carregada')
      return;
    }

    const viewName = $("#stored-views").val()
    const viewPivotConfig = viewManager.getStoredViewByName(viewName);
    
    if (!viewPivotConfig) {
      alert('Nenhuma view encontrada')
      return;
    }

    viewPivotConfig.renderers = renderers
    $("#pivottable-csv-output").pivotUI(pivotData, viewPivotConfig, true);
    $("#stored-views").val(null)
  });

  $("#btn-deletar-visualizacao").on("click", () => {
    const viewName = $("#stored-views").val()
    const success = viewManager.deleteStoredViewByName(viewName);
    if(!success) {
      alert('Nada deletado!')
      return
    }
    storedViewsControl(viewManager.getStoredViews())
    $("#stored-views").val(null)
  })

  $("#btn-exportar-visualizacoes").on("click", () => viewManager.exportJsonStoredViews())
  
  $("#btn-importar-visualizacoes").bind("change", async event => {
    const storedViewsUpdated = await viewManager.importViews(event.target.files[0])
    console.debug(storedViewsUpdated)
    storedViewsControl(storedViewsUpdated)
  })

  /**
   * @param {Array} storedViews 
   */
  const storedViewsControl = function (storedViews) {
    const $dropdown = $("#stored-views");
    $dropdown.empty()
    for (const name of Object.keys(storedViews)) {
      $("#stored-views").append($("<option />").val(name).text(name));
    }
    $dropdown.val(null)
  }

  viewManager.checkStoredViewsUpdate()
  storedViewsControl(viewManager.getStoredViews())
});
