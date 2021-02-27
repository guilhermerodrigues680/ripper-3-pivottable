<template>
  <!-- HTML -->
  <div id="app">
    <h3>Pivottable CSV</h3>

    <div>
      <div>
        <label>
          Selecionar CSV:
          <input type="file" @change="onFileChange" accept=".csv">
        </label>
      </div>
      <div>
        <div>Tamanho do arquivo: {{ totalBytesFile === null ? 'null' : formatBytes(totalBytesFile) }}</div>
        <div>Linhas geradas: {{ totalLinhasGeradas || 'null' }}</div>
        <div>Linhas carregadas: {{ pivotData.length }}</div>
      </div>
    </div>

    <div class="my-10">
      <button @click="carregarTodosDados">Carregar todos as linhas</button>
      <button @click="carregarSomenteAlgunsDados">Carregar somente algumas linhas</button>
    </div>

    <vue-pivottable-ui
      ref="vuePivotUI"
      :data="pivotData"
      :aggregatorName="aggregatorName"
      :rendererName="rendererName"
      :hiddenAttributes="hiddenAttributes"
      :disabledFromDragDrop="disabledFromDragDrop"
      :hiddenFromDragDrop="hiddenFromDragDrop"
      :rows="rows"
      :cols="cols"
      :vals="vals"
    >
    </vue-pivottable-ui>
  </div>
</template>

<script>
/* Javascript */
export default {
  name: 'App',

  components: {
    //
  },

  data: () => ({
    data: [],
    pivotData: [],
    aggregatorName: 'Count',
    rendererName: 'Table',
    rows: [],
    cols: [],
    vals: [],
    disabledFromDragDrop: [
      // 'RECEITA'
    ],
    hiddenFromDragDrop: [
      // 'BRT',
    ],
    hiddenAttributes: [
      // 'BRT',
      // 'DATA DE REFERENCIA PROCESSADA',
      // 'DATA PROCESSAMENTO RIPPER',
      // 'ID DA PERNA BILHETAGEM',
      // 'ID DA VIAGEM BILHETAGEM',
      // 'ID DO BRT',
      // 'ID DO USUÁRIO'
    ],
    totalBytesFile: null,
    totalLinhasGeradas: null
  }),

  mounted: function () {
    console.log(this)
  },

  methods: {
    onFileChange: function(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      
      if (!files.length) {
        return;
      }

      console.log(files)
      this.totalBytesFile = files[0].size
      this.totalLinhasGeradas = "Lendo..."
      
      this.$papa.parse(files[0], {
        complete: (parsed) => {
          console.log('CSV Parse ok!', parsed)    
          this.totalLinhasGeradas = parsed.data.length

          this.data = parsed.data.map((el, idx) => {
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
      })
    },

    carregarTodosDados: function() {
      // const aggregatorName = this.$refs.vuePivotUI.propsData.aggregatorName
      // const rendererName = this.$refs.vuePivotUI.propsData.rendererName
      console.info('Rodando visualizacao - INICIO')
      this.pivotData = this.data
      console.info('Rodando visualizacao - FIM')
    },

    carregarSomenteAlgunsDados: function () {
      this.pivotData = this.data.filter((el, idx) => idx < 1000)
    },

    formatBytes: function(bytes, decimals = 2) {
      // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  }

}
</script>

<style>
/* CSS */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}

.my-10 {
  margin-top: 40px;
  margin-bottom: 40px;
}
</style>
