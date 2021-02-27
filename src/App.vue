<template>
  <!-- HTML -->
  <div id="app">
    <h3>Pivottable Demo</h3>

    <div>
      <label>
        <input type="file" @change="onFileChange">
      </label>
    </div>

    <h3>Montagem de visualização: Somente 999 linhas do CSV</h3>
    <vue-pivottable-ui
      ref="vuePivotUI"
      :data="pivotData"
      :aggregatorName="aggregatorName"
      :rendererName="rendererName"
      :hiddenAttributes="['RECEITA', 'BRT', 'DATA DE REFERENCIA PROCESSADA', 'DATA PROCESSAMENTO RIPPER', 'ID DA PERNA BILHETAGEM', 'ID DA VIAGEM BILHETAGEM', 'ID DO BRT', 'ID DO USUÁRIO']"
      :rows="rows"
      :cols="cols"
      :vals="vals"
    >
    </vue-pivottable-ui>

    <div>
      <button @click="rodarVisualizacao">Rodar visualização</button>
    </div>

    <h3>Visualização real</h3>
    <vue-pivottable
      ref="vuePivotStatic"
      :data="pivotDataStatic"
      :aggregatorName="aggregatorName2"
      :rendererName="rendererName2"
      :hiddenAttributes="['RECEITA', 'BRT', 'DATA DE REFERENCIA PROCESSADA', 'DATA PROCESSAMENTO RIPPER', 'ID DA PERNA BILHETAGEM', 'ID DA VIAGEM BILHETAGEM', 'ID DO BRT', 'ID DO USUÁRIO']"
      :rows="rows2"
      :cols="cols2"
      :vals="vals2"
    >
    </vue-pivottable>
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
    pivotData: [],
    pivotDataStatic: [],
    aggregatorName: 'Sum',
    rendererName: 'Table',
    rows: ['Payer Gender'],
    cols: ['Party Size'],
    vals: ['Total Bill'],
    aggregatorName2: 'Sum',
    rendererName2: 'Table',
    rows2: [],
    cols2: [],
    vals2: [],
    disabledFromDragDrop: ['Party Size', 'Payer Gender'],
    hiddenFromDragDrop: ['Total Bill']
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

      this.$papa.parse(files[0], {
        complete: (parsed) => {
          console.log('ok!', parsed.data, parsed.errors, parsed.meta)
          console.log(this)

          this.pivotDataStatic = parsed.data.map((el, idx) => {
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

          this.pivotData = this.pivotDataStatic.filter((el, idx) => idx < 1000)
        }
      })
    },
    rodarVisualizacao: function() {
      console.info('Rodando visualizacao - INICIO')
      this.rows2 = [...this.rows]
      this.cols2 = [...this.cols]
      this.vals2 = [...this.vals]
      // this.aggregatorName2 = this.aggregatorName
      // this.rendererName2 = this.rendererName
      this.aggregatorName2 = this.$refs.vuePivotUI.propsData.aggregatorName
      this.rendererName2 = this.$refs.vuePivotUI.propsData.rendererName
      console.info('Rodando visualizacao - FIM')
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
</style>
