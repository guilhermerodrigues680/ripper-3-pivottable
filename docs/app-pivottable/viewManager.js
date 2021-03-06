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

export { viewManager }