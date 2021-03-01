/**
 * @param {File} file Arquivo CSV
 */
const parseAndPivot = function(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.name) {
      alert('Nenhum arquivo recebido')
      reject('Nenhum arquivo recebido')
      return;
    }
    
    Papa.parse(file, {
      skipEmptyLines: true,
      error: function(e) {
        alert(e)
        reject(e)
      },
      complete: function(parsed){
        handsonTableLoad(parsed.data)
        console.log(parsed)
        resolve(true)
      }
    });
  })
};


function handsonTableLoad(data) {
  var container = document.getElementById('example');
  var hot = new Handsontable(container, {
    data: data.slice(1),
    colHeaders: data[0],
    rowHeaders: true,
    // colHeaders: true,
    filters: true,
    dropdownMenu: true,
    licenseKey: 'non-commercial-and-evaluation'
  });
  hot.updateSettings({
    cells: (/*row, col*/) => ({ readOnly: true })
  });
  console.log('hot', hot)
}


$(function () {
  $("#container-csv-chooser").hide();
  if(!window.pivotData) {
    $("#container-csv-chooser").show();
    $("#csv-chooser").on("change", async (event) => {
      swal("Aguarde. O navegador pode ficar lento durante o carregamento.", {
        title: "Carregando CSV...",
        closeOnClickOutside: false,
        closeOnEsc: false,
        icon: "info",
      })
      console.log('inicio')
      await parseAndPivot(event.target.files[0]);
      console.log('fim')
      swal.close()
    });
  } else {
    swal("Aguarde. O navegador pode ficar lento durante o carregamento.", {
      title: "Carregando CSV...",
      closeOnClickOutside: false,
      closeOnEsc: false,
      button: false,
      icon: "info",
      timer: 3000,
    }).then(() => {
      handsonTableLoad(window.pivotData)
    })
  }
})
