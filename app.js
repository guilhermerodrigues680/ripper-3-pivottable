import { formatBytes, upperCaseFirstLetter } from "./app-pivottable/util.js";
import { viewManager } from "./app-pivottable/viewManager.js";
import { convertCSVRipperToNumber } from "./app-pivottable/csv-ripper.js";


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


  $("#btn-csv-viewer").on('click', () => {
    const csvViewerWindow = window.open("csv-viewer/index.html");
    csvViewerWindow.pivotData = pivotData;
  })
});
