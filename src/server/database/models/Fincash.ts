export interface IFincash {
    // Dados de abertura do caixa
    id: number,
    opener: string
    value: number,              // valor em DINHEIRO com que o caixa foi aberto
    obs?: string | null,
    diferenceLastFincash?: number | null,   // diferença entre o valor de abertura do caixa atual e o valor de fechamento do caixa anterior

    
    // Dados de fechamento do caixa
    isFinished: boolean,
    finalValue?: number | null, // valor em DINHEIRO que o caixa fechou
    finalDate?: Date | null,
    totalValue?: number | null, // soma de todas as vendas registradas no caixa (sem controle de quanto foi em DINHEIRO ou CARTÃO)


    // Dados calculados ao registrar cardValue
    cardValue?: number | null,  // valor em CARTÃO (adicionado apos o fechamento)
    invoicing?: number | null,  // faturamento total real ((finalValue - value) + total_cashOutflow + cardValue) somando os valores em DINHEIRO e CARTÃO incluindo os fluxos de saída de caixa
    break?: number | null,      // diferença entre o valor total das vendas registradas (totalValue) e o valor real arrecadado (invoicing) = (invoicing - totalValue)
    profit?: number | null,


    // Dados de controle de registro
    created_at: Date,
    updated_at: Date,
    deleted_at?: Date,
}