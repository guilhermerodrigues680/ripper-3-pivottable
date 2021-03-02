const aggMap = {
  'agg1': {
    aggType: 'Count',
    arguments: ['LINHA CODIFICAÇÃO'],
    name: 'Count(LINHA CODIFICAÇÃO)',
    varName :'a',
    renderEnhancement : 'barchart'
  },
  'agg2': {
    aggType: 'Average',
    arguments: ['RECEITA'],
    name: 'Avg(History)',
    varName :'b',
    hidden : false,
    renderEnhancement : 'none'
  },
  'agg3': {
    aggType: 'Sum',
    arguments: ['RECEITA'],
    name: 'Sum(RECEITA)',
    varName :'c',
    hidden : false,
    renderEnhancement : 'heatmap'
  },
  'agg4': {
    aggType: 'Sum over Sum',
    arguments: ["RECEITA", "TARIFA LINHA"],
    name: 'Sum over Sum (RECEITA over TARIFA LINHA)',
    varName :'d',
    hidden : false,
    renderEnhancement : 'none'
  }
};

const derivedAggregations = [
  {
    name : 'Avg GPA',
    description : 'sum Maths marks / avg Math marks',
    expression : 'variables.b*100/variables.c',
    renderEnhancement : 'barchart',
    barchartColor : '#fa983a',
    formatterOptions : {
      digitsAfterDecimal: 1,
      scaler: 1,
      suffix: "%"
    }
  },
  {
    name : 'Success Score',
    description : 'Count of English Marks / Avg. of Maths Marks',
    expression : 'variables.a/variables.b',
    renderEnhancement : 'heatmap'
  }
];

const aggMapParticipacao = {
  'agg1': {
    aggType: 'Count',
    arguments: ['SEQUÊNCIA DE UTILIZAÇÃO'],
    name: 'Count(SEQUÊNCIA DE UTILIZAÇÃO)',
    varName :'a',
    renderEnhancement : 'none'
  },
  'agg2': {
    aggType: 'Count as Fraction of Total',
    arguments: ['Count as Fraction of Total'],
    name: 'Count as Fraction of Total(SEQUÊNCIA DE UTILIZAÇÃO)',
    varName :'b',
    hidden : false,
    renderEnhancement : 'none'
  },
}

const derivedAggregationsParticipacao = [
  // {
  //   name : 'Avg GPA',
  //   description : 'sum Maths marks / avg Math marks',
  //   expression : 'variables.b*100/variables.c',
  //   renderEnhancement : 'barchart',
  //   barchartColor : '#fa983a',
  //   formatterOptions : {
  //     digitsAfterDecimal: 1,
  //     scaler: 1,
  //     suffix: "%"
  //   }
  // },
  {
    name : 'Receita recebida',
    description : 'Fraction of Total * Receita Terminal',
    expression : 'variables.b * 1000',
    renderEnhancement : 'heatmap'
  }
];

function derivedAggregationsParticipacaoCalc(receita) {
  return [
    {
      name : 'Receita recebida',
      description : 'Fraction of Total * Receita Terminal',
      expression : `variables.b * ${receita}`,
      renderEnhancement : 'heatmap'
    }
  ]
}

export {
  aggMap,
  derivedAggregations,
  aggMapParticipacao,
  //derivedAggregationsParticipacao
  derivedAggregationsParticipacaoCalc
}